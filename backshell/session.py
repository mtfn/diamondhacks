import dock
import os
class Session():
    def __init__(self, docker_client, challenge_set_id):
        self.container = dock.new_runner(docker_client)
        self.log = []
        self.wd = '/home/appuser'

        dock.runner_put(self.container, '../challenges/' + str(challenge_set_id) + '/files')
    
    def exec(self, command):
        stdout, stderr = dock.runner_exec(self.container, command, workdir=self.wd)

        stderr = stderr.decode() if stderr else ''
        stdout = stdout.decode() if stdout else ''

        self.log.append({'cmd': command, 'stdout': stdout, 'stderr': stderr})

        if(command.startswith('cd ') and not stderr):
            self.wd = os.path.join(self.wd, command.split(' ')[1])

        return (stdout, stderr)

    def stop(self):
        dock.runner_stop(self.container)    
        return self.log




        