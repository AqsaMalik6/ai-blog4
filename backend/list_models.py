import requests
import os
from dotenv import load_dotenv
import json

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

base_url = "https://generativelanguage.googleapis.com/v1beta/models"

print(f"Checking models for API Key: {api_key[:10]}...")

try:
    response = requests.get(f"{base_url}?key={api_key}")
    data = response.json()
    
    if "models" in data:
        print("Available models:")
        for model in data["models"]:
            # Filter for generation models
            if "generateContent" in model.get("supportedGenerationMethods", []):
                print(f"- {model['name']}")
    else:
        print("Error fetching models:", json.dumps(data, indent=2))

except Exception as e:
    print(f"Request Error: {e}")
