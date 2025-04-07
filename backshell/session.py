import dock
import os
from difflib import SequenceMatcher

class Session():
    def __init__(self, docker_client, challenge_set_id):
        self.container = dock.new_runner(docker_client)
        self.log = []
        self.wd = '/home/appuser'

        self.solution = ''
        with open('challenges/' + str(challenge_set_id) + '.txt', 'r') as f:
            self.solution = f.read()
        f.close()

        dock.runner_exec(self.container, '/a ' + str(challenge_set_id), user='root', workdir=self.wd)
        #dock.runner_put(self.container, '../challenges/' + str(challenge_set_id) + '/files')
    
    def exec(self, command):
        stdout, stderr = dock.runner_exec(self.container, command, workdir=self.wd)

        stderr = stderr.decode() if stderr else ''
        stdout = stdout.decode() if stdout else ''

        self.log.append({'cmd': command, 'stdout': stdout, 'stderr': stderr})

        if(command.startswith('cd ') and not stderr):
            self.wd = os.path.join(self.wd, command.split(' ')[1])

        return (stdout, stderr)
    
    def correct(self):
        if not self.log or len(self.log) == 0:
            return False
        
        stdout = self.log[-1]['stdout']
        return bool(SequenceMatcher(None, stdout, self.solution).ratio() > 0.8) 

    def stop(self):
        dock.runner_stop(self.container)    
        return self.log




        
