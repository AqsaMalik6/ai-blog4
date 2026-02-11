"""
OpenAI Agents SDK Implementation with Gemini Backend
Professional agent architecture with runners, handoffs, and pipelines
"""
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum
from backend.services.gemini_adapter import get_gemini_adapter


class AgentRole(Enum):
    """Agent roles for different tasks"""
    RESEARCHER = "researcher"
    WRITER = "writer"
    EDITOR = "editor"
    COORDINATOR = "coordinator"


@dataclass
class AgentMessage:
    """Message structure for agent communication"""
    role: str
    content: str
    metadata: Optional[Dict[str, Any]] = None


class Agent:
    """
    Base Agent class compatible with OpenAI Agents SDK pattern
    Uses Gemini API as the underlying model
    """
    
    def __init__(
        self,
        name: str,
        instructions: str,
        role: AgentRole = AgentRole.COORDINATOR,
        temperature: float = 0.7,
        max_tokens: int = 2048
    ):
        self.name = name
        self.instructions = instructions
        self.role = role
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.gemini = get_gemini_adapter()
        self.conversation_history: List[AgentMessage] = []
        
        print(f"🤖 Agent '{name}' ({role.value}) initialized")
    
    def add_message(self, role: str, content: str, metadata: Optional[Dict] = None):
        """Add message to conversation history"""
        self.conversation_history.append(
            AgentMessage(role=role, content=content, metadata=metadata)
        )
    
    def get_messages_for_api(self) -> List[Dict[str, str]]:
        """Convert conversation history to API format"""
        messages = [
            {"role": "system", "content": self.instructions}
        ]
        
        for msg in self.conversation_history:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })
        
        return messages
    
    def run(self, user_input: str) -> str:
        """
        Run agent with user input (sync)
        Compatible with OpenAI Agents SDK pattern
        """
        # Add user input to history
        self.add_message("user", user_input)
        
        # Get messages
        messages = self.get_messages_for_api()
        
        # Call Gemini via adapter
        response = self.gemini.create_completion(
            messages=messages,
            temperature=self.temperature,
            max_tokens=self.max_tokens
        )
        
        # Extract response content
        assistant_message = response["choices"][0]["message"]["content"]
        
        # Add to history
        self.add_message("assistant", assistant_message)
        
        return assistant_message
    
    async def run_async(self, user_input: str) -> str:
        """Async version of run"""
        self.add_message("user", user_input)
        messages = self.get_messages_for_api()
        
        response = await self.gemini.create_completion_async(
            messages=messages,
            temperature=self.temperature,
            max_tokens=self.max_tokens
        )
        
        assistant_message = response["choices"][0]["message"]["content"]
        self.add_message("assistant", assistant_message)
        
        return assistant_message
    
    def reset(self):
        """Reset conversation history"""
        self.conversation_history = []


class Runner:
    """
    Runner class for executing agents
    Compatible with OpenAI Agents SDK pattern: Runner.run_sync()
    """
    
    @staticmethod
    def run_sync(agent: Agent, user_input: str) -> 'RunResult':
        """
        Synchronous agent execution
        Pattern: result = Runner.run_sync(agent, "prompt")
        """
        print(f"🏃 Running agent '{agent.name}' synchronously...")
        output = agent.run(user_input)
        return RunResult(
            agent_name=agent.name,
            final_output=output,
            conversation_history=agent.conversation_history
        )
    
    @staticmethod
    async def run_async(agent: Agent, user_input: str) -> 'RunResult':
        """
        Asynchronous agent execution
        Pattern: result = await Runner.run_async(agent, "prompt")
        """
        print(f"🏃 Running agent '{agent.name}' asynchronously...")
        output = await agent.run_async(user_input)
        return RunResult(
            agent_name=agent.name,
            final_output=output,
            conversation_history=agent.conversation_history
        )


@dataclass
class RunResult:
    """Result from agent execution"""
    agent_name: str
    final_output: str
    conversation_history: List[AgentMessage]
    
    def __str__(self):
        return self.final_output


class AgentPipeline:
    """
    Pipeline for sequential agent execution with handoffs
    Allows complex workflows with multiple specialized agents
    """
    
    def __init__(self, name: str):
        self.name = name
        self.agents: List[Agent] = []
        self.handoff_rules: Dict[str, str] = {}
        
        print(f"🔄 Pipeline '{name}' created")
    
    def add_agent(self, agent: Agent):
        """Add agent to pipeline"""
        self.agents.append(agent)
        print(f"➕ Agent '{agent.name}' added to pipeline")
    
    def add_handoff(self, from_agent: str, to_agent: str, condition: str = "always"):
        """Define handoff rule between agents"""
        self.handoff_rules[from_agent] = to_agent
        print(f"🔀 Handoff rule: {from_agent} → {to_agent} ({condition})")
    
    async def run_pipeline(self, initial_input: str) -> Dict[str, Any]:
        """
        Execute entire pipeline with agent handoffs
        """
        print(f"\n🚀 Starting pipeline '{self.name}'...")
        results = {}
        current_input = initial_input
        
        for i, agent in enumerate(self.agents):
            print(f"\n📍 Step {i+1}/{len(self.agents)}: Agent '{agent.name}'")
            
            # Run current agent
            result = await Runner.run_async(agent, current_input)
            results[agent.name] = result.final_output
            
            # Use output as input for next agent (handoff)
            current_input = result.final_output
            
            print(f"✅ Agent '{agent.name}' completed")
        
        print(f"\n🎉 Pipeline '{self.name}' completed!")
        
        return {
            "pipeline_name": self.name,
            "final_output": current_input,
            "agent_outputs": results
        }


# Example usage demonstration
if __name__ == "__main__":
    # Create an agent
    agent = Agent(
        name="Assistant",
        instructions="You are a helpful assistant specialized in writing.",
        role=AgentRole.WRITER
    )
    
    # Run agent using Runner (OpenAI Agents SDK pattern)
    result = Runner.run_sync(agent, "Write a haiku about recursion in programming.")
    
    print(f"\n{result.final_output}")
    # Expected output format:
    # Code within the code,
    # Functions calling themselves,
    # Infinite loop's dance.