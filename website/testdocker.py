import subprocess
import time
import os
import uuid

with open("save_output.txt", 'a') as file:
    file.write("")

path_to_host = os.path.abspath("save_output.txt")

# FROM python:3.9-slim
for i in range(5):
    unique_id = str(uuid.uuid4())

    code = "class Solution:\n\tdef isPalindrome(self, s: str) -> str:\n\t\treturn len(s)"
    input = "adas"*(i+1)
    output = "False"

    output_file = "save_output.txt"
    script_arguments = [unique_id, code, input, output]
    docker_command = ['docker', 'run', '--rm', '-v', f'{path_to_host}:/app/text.txt', "my-python-app", 'python', './execute_runner.py'] + script_arguments

    # Run the Docker command
    t0 = time.time()
    process = subprocess.Popen(docker_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    # Check the return code of the process
    if process.returncode != 0:
        print(f"Error running Docker command: {stderr.decode('utf-8')}")
    else:
        print(stdout.decode('utf-8'))
    t1 = time.time()
    print("Time passed for this container:", t1 - t0)

