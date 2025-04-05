from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/run', methods=['POST'])
def run_command():
    try:
        data = request.get_json()
        command = data.get('command')

        if not command:
            return jsonify({'error': 'No command provided'}), 400

        result = subprocess.run(command, shell=True, text=True, capture_output=True)

        return jsonify({
            'stdout': result.stdout,
            'stderr': result.stderr,
            'returncode': result.returncode
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)