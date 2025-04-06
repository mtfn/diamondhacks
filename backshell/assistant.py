import ai_better
class Assistant:
    def __init__(self, gemini_client):
        self.chat = ai_better.init(gemini_client)
        self.chat_history = []

    def interact(self, message):
        response = ai_better.message(self.chat, message)

        text = response.candidates[0].content.parts[0].text

        self.chat_history.append({'user': 'user', 'message': message})
        self.chat_history.append({'user': 'assistant', 'message': text})
    
    def interact_log_response_only(self, message):
        response = ai_better.message(self.chat, message)
        text = response.candidates[0].content.parts[0].text
        self.chat_history.append({'user': 'assistant', 'message': text })