from google import genai
from google.genai import types

api_key = 'GEMINI_API_KEY'
with open('./api_key.txt', 'r') as f:
    api_key = f.read().strip()

client = genai.Client(api_key=api_key)

system_prompt = ''
with open("./systemprompt.txt", "r") as f:
    system_prompt = f.read()

# Set temperature to 0.8 here:
chat_config = generate_content_config = types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=genai.types.Schema(
            type = genai.types.Type.OBJECT,
            required = ["feedback"],
            properties = {
                "emoji": genai.types.Schema(
                    type = genai.types.Type.STRING,
                ),
                "feedback": genai.types.Schema(
                    type = genai.types.Type.STRING,
                ),
            },
        ),
        system_instruction=[
            types.Part.from_text(text="""You are now a linux bash shell tutor. You will be a good tutor and provide constructive feedback to the student. I will poll you every 5 commands with the shell history of the user. It is then your job to provide feedback to the user. The task the user is trying to accomplish is \"cd into / and list the home directory recursively\". The student loves little quips here and there. The student especially loves positive reinforcement. However, if the student makes a mistake, they would like to be told. DO NOT tell the student how exactly to fix their mis step. However, since you have access to their history, you can tell them \"oh you were on the right track 2 commands ago\" for instance or something similar. Never be rude or condescending to the student. That demoralizes them.  You can tell them to use the man page. Also tell them how to find their appropriate problem in the man page using find. You can do this ONLY when they are stuck and explicitly ask for a hint. Keep your responses short. Do not exceed ~200 characters. I will give you both the stdin and stdout of every command the student types in the format 
```
stdin: <text> 
stdout: <text>
```
Analyze the context of each one carefully. You do not need to include any of this data in the output as the user already has this context from their screen."""),
        ],
    
    )

def init():
    # Pass the config object instead of an empty list
    chat = client.chats.create(model="gemini-2.0-flash", config=chat_config)
    return chat

def message(chat, message):
    response = chat.send_message(message, chat_config)
    return response



# response = chat.send_message('''cd /''', chat_config)
# print(response.text)

# response = chat.send_message('''ls -r /home
# gram''', chat_config)
# print(response.text)

# for message in chat.get_history():
#     print(f'role - {message.role}', end=": ")
#     print(message.parts[0].text)
