"""
Gemini API Adapter for OpenAI Agents SDK
This adapter allows using Gemini API with OpenAI Agent architecture
"""
import os
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class GeminiModelAdapter:
    """
    Adapter to make Gemini API compatible with OpenAI Agents SDK
    This allows agents to use Gemini while maintaining OpenAI Agent architecture
    """
    
    def __init__(self, model_name: str = "gemini-pro"):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("❌ GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel(model_name)
        self.model_name = model_name
        print(f"✅ Gemini Model '{model_name}' initialized successfully")
    
    def create_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Create a completion using Gemini API
        Compatible with OpenAI's chat completion format
        """
        try:
            # Convert OpenAI format messages to Gemini prompt
            prompt = self._convert_messages_to_prompt(messages)
            
            # Generate content
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=temperature,
                    max_output_tokens=max_tokens or 2048,
                )
            )
            
            # Return in OpenAI-like format
            return {
                "id": "gemini-completion",
                "object": "chat.completion",
                "model": self.model_name,
                "choices": [
                    {
                        "index": 0,
                        "message": {
                            "role": "assistant",
                            "content": response.text
                        },
                        "finish_reason": "stop"
                    }
                ]
            }
        except Exception as e:
            print(f"❌ Gemini API Error: {str(e)}")
            raise
    
    async def create_completion_async(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> Dict[str, Any]:
        """Async version of create_completion"""
        # Note: google-generativeai doesn't have native async, 
        # but we wrap it for compatibility
        return self.create_completion(messages, temperature, max_tokens)
    
    def _convert_messages_to_prompt(self, messages: List[Dict[str, str]]) -> str:
        """
        Convert OpenAI format messages to a single Gemini prompt
        """
        prompt_parts = []
        
        for message in messages:
            role = message.get("role", "user")
            content = message.get("content", "")
            
            if role == "system":
                prompt_parts.append(f"System Instructions: {content}\n")
            elif role == "user":
                prompt_parts.append(f"User: {content}\n")
            elif role == "assistant":
                prompt_parts.append(f"Assistant: {content}\n")
        
        return "\n".join(prompt_parts)


# Global adapter instance
_gemini_adapter: Optional[GeminiModelAdapter] = None

def get_gemini_adapter() -> GeminiModelAdapter:
    """Get or create global Gemini adapter instance"""
    global _gemini_adapter
    if _gemini_adapter is None:
        _gemini_adapter = GeminiModelAdapter()
    return _gemini_adapter