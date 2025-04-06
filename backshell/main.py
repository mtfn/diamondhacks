from flask import Flask, request, jsonify
import os
from session import Session
import docker


client = docker.DockerClient(base_url='unix://var/run/docker.sock', timeout=10)
app = Flask(__name__)

# {user_id: [session]}
sessions = {}

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
        if 'challenge_set_id' not in request.json:
            return jsonify({'error': 'challenge_set_id is required'}), 400

        # check path ../challenges/<challenge_set_id>/files exists
        if not os.path.exists('../challenges/' + str(request.json['challenge_set_id']) + '/files'):
            return jsonify({'error': 'Challenge set does not exist'}), 400

        sessions[user_id] = Session(client, request.json['challenge_set_id'])
    
    return jsonify({'message': 'Session created'}), 201

@app.route('/sessions/<user_id>', methods=['GET'])
def get_session(user_id):
   
    if user_id not in sessions:
        return jsonify({'message': 'No active session'}), 404
    else:
        return jsonify(sessions[user_id].log)

@app.route('/sessions/<user_id>', methods=['PUT'])
def exec_session(user_id):
    
    if user_id not in sessions:
        return jsonify({'message': 'No active session'}), 404
    else:
        if 'command' not in request.json:
            return jsonify({'error': 'Command is required'}), 400
        
        command = request.json['command']
        sessions[user_id].exec(command)
    
    return jsonify(sessions[user_id].log), 200

@app.route('/sessions/<user_id>', methods=['DELETE'])
def delete_session(user_id):
    
    if user_id not in sessions:
        return jsonify({'message': 'No active session'}), 404
    else:
        sessions[user_id].stop()
        del sessions[user_id]
    
    return jsonify({'message': 'Session deleted'}), 200


if __name__ == '__main__':
    app.run(debug=True)