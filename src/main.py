from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from prompts.brain import BRAIN_PROMPT
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

agent = create_agent(
    brain,
    tools=[send_email],
    system_prompt=BRAIN_PROMPT,
)