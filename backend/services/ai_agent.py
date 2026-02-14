import os
from dotenv import load_dotenv
from datetime import datetime
from agents import Agent, Runner, function_tool, OpenAIChatCompletionsModel, set_tracing_disabled
from openai import AsyncOpenAI
from openai.resources.chat import AsyncChat, AsyncCompletions
from typing import Any, Mapping, List, Dict
from backend.services.search_service import WebSearchService
from backend.services.image_service import ImageService

load_dotenv(override=True)

# Configure environment for Gemini's OpenAI Compatibility
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"

os.environ["OPENAI_API_KEY"] = GEMINI_API_KEY or ""
os.environ["OPENAI_BASE_URL"] = GEMINI_BASE_URL

# Disable tracing as it requires a real OpenAI key
set_tracing_disabled(True)

# Global variables for the current request
current_image_url = None

class GeminiSanitizedCompletions(AsyncCompletions):
    """
    Wrapper for chat.completions to filter out params Gemini doesn't support yet.
    """
    def __init__(self, client: AsyncOpenAI):
        super().__init__(client)
        self._raw_create = super().create

    async def create(self, *args, **kwargs) -> Any:
        # Remove unsupported parameters that cause 404/400 errors in Gemini
        kwargs.pop("store", None)
        kwargs.pop("stream_options", None) 
        kwargs.pop("parallel_tool_calls", None) # Gemini handles tools, but sometimes strict parallel mode fails
        
        # Ensure model mapping is correct if needed, but SDK usually handles it
        return await self._raw_create(*args, **kwargs)

class GeminiSanitizedClient(AsyncOpenAI):
    """
    Custom OpenAI Client that injects the sanitizer.
    """
    @property
    def chat(self) -> AsyncChat:
        chat_resource = super().chat
        # Monkey-patch the completions resource instance
        chat_resource.completions = GeminiSanitizedCompletions(self)
        return chat_resource

class GeminiAgent:
    """
    Refactored Agent using REAL OpenAI Agents SDK with Gemini Compatibility.
    Now supports both Blog Generation and Image Generation.
    """
    def __init__(self):
        current_time = datetime.now().strftime("%A, %B %d, %Y")
        
        # Ensure fresh API Key from environment
        load_dotenv(override=True)
        api_key = os.getenv("GEMINI_API_KEY")
        
        # 1. Initialize Custom Client
        self.client = GeminiSanitizedClient(
            api_key=api_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )

        # 2. Define the Model using SDK's Class but with our Client
        print(f"Initializing GeminiAgent with model: gemini-2.0-flash")
        self.model = OpenAIChatCompletionsModel(
            model="gemini-2.0-flash",
            openai_client=self.client
        )
        
        # 3. Define the Agent (Real SDK Class)
        self.blog_agent = Agent(
            name="AI-Agent",
            instructions=f"""You are a professional AI Assistant specializing in Blogs and Image Generation.
Today's Date: {current_time}.

Workflow:
1. Determine if the user wants an image or a blog post.
2. If requesting an IMAGE:
   - Use 'image_tool' with a detailed prompt.
   - Reply with a brief confirmation (e.g., "Generated your image of [description]").
3. If requesting a BLOG:
   - Use 'search_tool' for research.
   - Write a high-quality blog post.
   - ALWAYS call 'image_tool' at the end to generate one featured image.
   - Return ONLY the blog content.
4. For general talk, be polite and helpful in the user's language.
""",
            tools=[function_tool(self.search_tool), function_tool(self.image_tool)],
            model=self.model
        )

    async def search_tool(self, topic: str) -> str:
        """
        Perform deep web research on a blog topic. 
        """
        search_service = WebSearchService()
        results = await search_service.multi_search(topic)
        if not results:
            return "No search results found."
        return "\n\n".join([f"Source: {r['title']}\n{r['snippet']}" for r in results])

    async def image_tool(self, prompt: str) -> str:
        """
        Generate a high-quality AI image.
        """
        global current_image_url
        img_service = ImageService()
        url = await img_service.generate_image(prompt)
        current_image_url = url
        return f"[Image Generated: {prompt}]"

    async def process_topic(self, topic: str) -> Dict[str, Any]:
        global current_image_url
        current_image_url = None # Clear for new request
        
        # Simple backoff retry loop for the main agent run
        max_retries = 3
        for attempt in range(max_retries):
            try:
                # 4. Use the REAL Runner (Guaranteed SDK usage)
                result = await Runner.run(self.blog_agent, topic)
                
                raw_content = result.final_output

                # 5. Polish with Gemini
                polished_content = await self.polish_with_gemini(raw_content)

                return {
                    "blog_content": polished_content,
                    "image_url": current_image_url
                }
            except Exception as e:
                error_str = str(e)
                if "429" in error_str and attempt < max_retries - 1:
                    print(f"Rate limit hit (429). Retrying in {(attempt + 1) * 2} seconds...")
                    import asyncio
                    await asyncio.sleep((attempt + 1) * 2)
                    continue
                
                print(f"Agent Execution Error: {error_str}")
                return {
                    "blog_content": f"System Error: {error_str}", 
                    "image_url": None
                }

    async def polish_with_gemini(self, content: str) -> str:
        """
        Uses Gemini to polish and refine the blog post generated by the SDK.
        """
        # If the content is too short (less than 150 words), it's probably a greeting or clarification, don't polish it as a blog.
        if len(content.split()) < 150:
            return content

        polish_prompt = (
            "You are a professional blog editor. Please polish and refine the following blog post. "
            "Improve the flow, grammar, and professional tone while keeping the core information intact. "
            "CRITICAL: Return ONLY the polished blog post as plain text or markdown. "
            "DO NOT include any introductory sentences, meta-talk, options, or explanations. "
            "Just the final polished content.\n\n"
            f"{content}"
        )
        
        # Retry loop for polishing
        max_retries = 3
        for attempt in range(max_retries):
            try:
                # Use the same client for polishing
                response = await self.client.chat.completions.create(
                    model="gemini-2.0-flash", 
                    messages=[{"role": "user", "content": polish_prompt}]
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                error_str = str(e)
                if "429" in error_str and attempt < max_retries - 1:
                    print(f"Polishing rate limit (429). Retrying in {(attempt + 1) * 2} seconds...")
                    import asyncio
                    await asyncio.sleep((attempt + 1) * 2)
                    continue
                print(f"Polishing Error: {e}")
                return content # Fallback to raw content if polishing fails
    
    async def _generate_with_fallback(self, prompt: str) -> str:
        result = await Runner.run(self.blog_agent, prompt)
        return result.final_output
