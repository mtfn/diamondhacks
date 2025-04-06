import docker
import tarfile
import io
import os

def new_runner(client):
    return client.containers.run('runner', detach=True, tty=True, user='appuser')

def runner_exec(container, command, user='appuser', workdir='/home/appuser'):
    return container.exec_run('bash -c "' + command + '"', demux=True, workdir=workdir)[1]

def tar_directory_to_bytes(directory_path):
    byte_stream = io.BytesIO()
    
    with tarfile.open(fileobj=byte_stream, mode='w') as tar:
        for root, _, files in os.walk(directory_path):
            for file in files:
                full_path = os.path.join(root, file)
                arcname = os.path.relpath(full_path, start=directory_path)
                tar.add(full_path, arcname=arcname)
    
    # Reset the buffer's position to the beginning
    byte_stream.seek(0)
    return byte_stream

def runner_put(container, local_path):
    tar_bytes = tar_directory_to_bytes(local_path)
    container.put_archive('/home/appuser', tar_bytes)

def runner_stop(container):
    container.stop()
