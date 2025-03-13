import requests

url = "https://my-llama2-chatbot.hf.space/chat"  # HF Spaces API
data = {"prompt": "Tell me a joke"}

response = requests.post(url, json=data)
print(response.json()["response"])
