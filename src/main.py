from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from langchain.tools import tool
from src.prompts.brain import BRAIN_PROMPT
from src.prompts.playbook import PLAYBOOK_PROMPT
import os

def send_email(to: str, subject: str, body: str):
    """Send an email"""
    email = {
        "to": to,
        "subject": subject,
        "body": body
    }
    # ... email sending logic

    return f"Email sent to {to}"

brain = ChatOpenAI(
    model="nvidia/nemotron-3-super-120b-a12b:free",
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
)
playbook_model = ChatOpenAI(
    model="minimax/minimax-m2.5:free",
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
)

playbook_agent = create_agent(
    playbook_model,
    system_prompt=PLAYBOOK_PROMPT,
)

@tool("playbook", description="Ansible playbook authoring agent. Call this tool when the user asks to write, generate, create, or modify an Ansible playbook, role, task block, handler, Jinja2 template, or variable file. Returns deployable YAML.")
def call_playbook_agent(query: str):
    result = playbook_agent.invoke({"messages": [{"role": "user", "content": query}]})
    return result["messages"][-1].content

agent = create_agent(
    brain,
    tools=[call_playbook_agent],
    system_prompt=BRAIN_PROMPT,
)