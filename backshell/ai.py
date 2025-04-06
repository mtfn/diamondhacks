from google import genai

api_key='GEMINI_API_KEY'
with open('./api_key.txt', 'r') as f:
    api_key = f.read().strip()

client = genai.Client(api_key=api_key)

system_prompt = ''
with open("./systemprompt.txt", "r") as f:
    system_prompt = f.read()

chat_config = genai.types.GenerateContentConfig(system_instruction=system_prompt)

chat = client.chats.create(model="gemini-2.0-flash", config=[])

response = chat.send_message('''cd /''', chat_config)
print(response.text)
response = chat.send_message('''ls -r /home
gram''', chat_config)

print(response.text)

for message in chat.get_history():
    print(f'role - {message.role}',end=": ")
    print(message.parts[0].text)
