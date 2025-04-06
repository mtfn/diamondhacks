from flask import Flask, request, jsonify
from session import Session
import docker
from ai_better import get_client
from assistant import Assistant
import json
from threading import Thread

client = docker.DockerClient(base_url='unix://var/run/docker.sock', timeout=10)
gemini_client = get_client()

app = Flask(__name__)

# {user_id: [session]}
sessions = {}
chats = {}

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'https://clash.cmov.dev'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.route('/sessions/<user_id>', methods=['POST'])
def create_session(user_id):  

    if user_id in sessions:
        return jsonify({'error': 'Session already exists'}), 400
    else:
        # get challenge_set_id from request
        #if 'challenge_set_id' not in request.json:
        #    return jsonify({'error': 'challenge_set_id is required'}), 400

        # check path ../challenges/<challenge_set_id>/files exists
        #if not os.path.exists('../challenges/' + str(request.json['challenge_set_id']) + '/files'):
        #    return jsonify({'error': 'Challenge set does not exist'}), 400

        sessions[user_id] = Session(client, request.json['challenge_set_id'])
        chats[user_id] = Assistant(gemini_client)
    
    return jsonify({'message': 'Session created'}), 201

@app.route('/sessions/<user_id>', methods=['GET'])
def get_session(user_id):
   
    if user_id not in sessions:
        return jsonify({'message': 'No active session'}), 404
    else: 
        return jsonify(
                    {'log': sessions[user_id].log,
                        'correct': sessions[user_id].correct(),
                    }
                ), 200

@app.route('/sessions/<user_id>', methods=['PUT'])
def exec_session(user_id):
    
    if user_id not in sessions:
        return jsonify({'message': 'No active session'}), 404
    else:
        if 'command' not in request.json:
            return jsonify({'error': 'Command is required'}), 400
        
        command = request.json['command']
        stdout, _ = sessions[user_id].exec(command)


        # every 5th command, send most recent 5 commands to assistant
        if len(sessions[user_id].log) % 5 == 0 and len(sessions[user_id].log) >= 5:
            ctx = '```'
            for x in sessions[user_id].log[-5:]:
                stdout, stderr = x['stdout'], x['stderr']
                ctx += f'stdout: {stdout}\nstderr: {stderr}\n'
            ctx += '```'

            # run following as thread
            #chats[user_id].interact_log_response_only(ctx)

            thread = Thread(target=chats[user_id].interact_log_response_only, args=(ctx,))
            thread.start()


        # check if stdout resembles solution difflib
        return jsonify(
            {'log': sessions[user_id].log,
                'correct': sessions[user_id].correct(),
            }
        ), 200
    

@app.route('/sessions/<user_id>', methods=['DELETE'])
def delete_session(user_id):
    
    if user_id not in sessions:
        return jsonify({'message': 'No active session'}), 404
    else:
        sessions[user_id].stop()
        del sessions[user_id]
        del chats[user_id]
    
    return jsonify({'message': 'Session deleted'}), 200

@app.route('/assistant/<user_id>', methods=['POST'])
def interact(user_id):
    if user_id not in sessions:
        return jsonify({'message': 'No active session'}), 404
    else:
        if 'message' not in request.json:
            return jsonify({'error': 'Message is required'}), 400
        
        message = request.json['message']
        chats[user_id].interact(message)
        return jsonify(chats[user_id].chat_history), 200

@app.route('/assistant/<user_id>', methods=['GET'])
def get_interaction(user_id):
    if user_id not in sessions:
        return jsonify({'message': 'No active session'}), 404
    else:
        return jsonify(chats[user_id].chat_history), 200

@app.route('/challenges', methods=['GET'])
def get_challenges():
    with open('../challenges/challenges.json', 'r') as f:
        challenges = f.read()
    f.close()
    challenges = json.loads(challenges)
    return jsonify(challenges), 200

if __name__ == '__main__':
    app.run(debug=True)