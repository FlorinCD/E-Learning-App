import subprocess
import time
import json
import os
from . import db
from .models import Submissions, Testcases, SolvedProblems, Problems
from flask import session, jsonify


# runs the container with the proper configuration
def run_process(unique_id: str, code: str, testcases_input: str, testcases_output: str, testcases_input_type: str, testcases_output_type: str, path_to_host: str, run_type: str, method_name: str):
    script_arguments = [unique_id, code, testcases_input, testcases_output, testcases_input_type, testcases_output_type, run_type, method_name]
    docker_command = ['docker', 'run', '--rm', '-v', f'{path_to_host}:/app/ouput_data.json', "--memory=10m",
                      "my-python-app", 'python', './execute_runner.py'] + script_arguments

    # Run the Docker command
    t0 = time.time()
    process = subprocess.Popen(docker_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    # Check the return code of the process
    if process.returncode != 0:
        print(f"Error running Docker command: {stderr.decode('utf-8')}")
    else:
        print("=============================================")
        print(stdout.decode('utf-8'))
        print("=============================================")
    t1 = time.time()
    print("Time passed for this container:", t1 - t0)


# returns content for that specific id and also deletes it after reading
def get_data_from_json(path: str, job_id: str) -> dict:

    content = {}
    # website/output_data.json
    # Open the JSON file in read mode to load existing data
    with open(path, "r") as json_file:
        # Load existing data from the file
        existing_data = json.load(json_file)

    # Append the new dictionary to the existing data
    for element in existing_data:
        if element["id"] == job_id:
            content = element["content"]
            existing_data.remove(element)
            break

    with open(path, "w", encoding='utf-8') as json_file:
        # Write the updated data back to the file
        json.dump(existing_data, json_file, ensure_ascii=False, indent=4)

    return content


# creates a new row for submissions table
def add_submission_to_db(submission_id, content):
    # calculate the top percent || for python the limit for run time is 5000 milliseconds | for memory usage is 10MB
    try:
        top_percent = 0
        run_time = content["time_complexity"]
        memory_usage = content["memory_complexity"]
        submission_error = content["running_error"]
        input_case = content["failed_case"]["input"]
        expected_output_case = content["failed_case"]["expected_output"]
        client_output_case = content["failed_case"]["client_output"]
        limit_run_time, limit_memory_usage = 1000, 10  # milliseconds, MB

        new_submission = Submissions(unique_id_submission=submission_id, run_time=run_time, memory_usage=memory_usage,
                               top_percent=top_percent, submission_error=submission_error, input_case=input_case,
                               expected_output_case=expected_output_case, client_output_case=client_output_case,
                               limit_run_time=limit_run_time, limit_memory_usage=limit_memory_usage)
        db.session.add(new_submission)
        db.session.commit()
    except Exception as err:
        print(f'{err} from add_submission_to_db!')


# returns the data for current submission from db
def get_content_current_submission(submission_id):
    content = {}
    submission = Submissions.query.filter_by(unique_id_submission=submission_id).first()
    content["submission_id"] = submission_id
    content["run_time"] = submission.run_time
    content["memory_usage"] = submission.memory_usage
    content["top_percent"] = submission.top_percent
    content["submission_error"] = submission.submission_error
    content["input_case"] = submission.input_case
    content["expected_output_case"] = submission.expected_output_case
    content["client_output_case"] = submission.client_output_case
    content["limit_run_time"] = submission.limit_run_time
    content["limit_memory_usage"] = submission.limit_memory_usage
    return content


# delete the row from db for specific table
def delete_submission(submission_id):
    delete_q = Submissions.__table__.delete().where(Submissions.unique_id_submission == submission_id)
    db.session.execute(delete_q)
    db.session.commit()


def calculate_percent_run_time(limit_run_time, run_time):
    percent = run_time * 100 / limit_run_time
    return str(percent).split('.')[0]


def time_complexity_limit_exceeded(running_time):
    if float(running_time) > 1000:
        return True
    return False


def memory_usage_limit_exceeded(memory_usage):
    if float(memory_usage) > 10:
        return True
    return False


def submit_container(data, current_problem_id, current_user_id):
    # ================================================================================================
    # Test docker
    import uuid

    if not os.path.exists("website/output_data.json"):
        with open("website/output_data.json", "w", encoding='utf-8') as json_file:
            # Write the updated data back to the file
            json.dump([], json_file, ensure_ascii=False, indent=4)

    path_to_host = os.path.abspath("website/output_data.json")
    unique_id = str(uuid.uuid4())
    code = data
    t_input, t_output, t_input_type, t_output_type, count_testcases, running_error = "", "", "", "", 0, "Something went wrong!"
    passed_cases = '0'
    query_input = Testcases.query.filter_by(id_problem=current_problem_id)
    for element in query_input:
        t_input += element.input + '\n'
        t_output += element.output + '\n'
        t_input_type += element.input_type + '\n'
        t_output_type += element.output_type + '\n'
        count_testcases += 1
    # print(t_input)
    # print(t_output)
    # print(t_input_type)
    # print(t_output_type)

    # get the name of the method which will be used to send the solution from db
    current_problem = Problems.query.filter_by(id=current_problem_id).first()
    method_name = current_problem.method_name

    try:
        run_process(unique_id, code, t_input, t_output, t_input_type, t_output_type, path_to_host, "submit", method_name)
    except Exception as e:
        # Handle other exceptions
        print("An error occurred:", e)
    # ================================================================================================
    # submit, run all the test cases from db
    print(data)
    try:
        content = get_data_from_json(path_to_host, unique_id)
        print(content)
        if int(content["count_passed_cases"]) == count_testcases:
            print("Has passed all the testcases")
            answer = "success"
            template_route = "/problems/success"
        else:
            print("Didn't passed all the testcases!")
            answer = "fail"
            template_route = "/problems/fail"

        content["run"] = answer
        content["template"] = template_route
        content["id"] = unique_id

        # get the current submission id to the current session
        session["submission_id"] = unique_id

        # check if solution is successful
        if answer == "success":
            mark_as_solved_problem(current_user_id, current_problem_id, code)

        add_submission_to_db(unique_id, content)
        # return response to client
        return jsonify(content)

    except Exception as err:
        """
        This means that the container has stopped due to alarm of time complexity or something else!
        """
        running_error = "Time complexity or memory usage exceeded!"
        print(f'{err} at trying to run the container')
        # get the current submission id to the current session
        session["submission_id"] = unique_id
        new_content = {"id": unique_id, "count_passed_cases": '0', "time_complexity": '0',
                       "memory_complexity": '0', "run": "fail", "template": "/problems/fail",
                       "running_error": running_error,
                       "failed_case": {"input": "", "expected_output": "", "client_output": ""}}
        add_submission_to_db(unique_id, new_content)
        return jsonify(new_content)


def submit_container_2_cases(data, current_problem_id):
    # run for only 2 cases from the webpage - query the first 2/3 cases from db

    import uuid

    if not os.path.exists("website/output_data.json"):
        with open("website/output_data.json", "w", encoding='utf-8') as json_file:
            # Write the updated data back to the file
            json.dump([], json_file, ensure_ascii=False, indent=4)

    path_to_host = os.path.abspath("website/output_data.json")
    unique_id = str(uuid.uuid4())
    code = data
    t_input, t_output, t_input_type, t_output_type, count_testcases, running_error = "", "", "", "", 0, "Something went wrong!"
    query_input = Testcases.query.filter_by(id_problem=current_problem_id)
    for element in query_input:
        t_input += element.input + '\n'
        t_output += element.output + '\n'
        t_input_type += element.input_type + '\n'
        t_output_type += element.output_type + '\n'
        count_testcases += 1
        if count_testcases == 2:
            break
    # print(t_input)
    # print(t_output)
    # print(t_input_type)
    # print(t_output_type)

    # get the name of the method which will be used to send the solution from db
    current_problem = Problems.query.filter_by(id=current_problem_id).first()
    method_name = current_problem.method_name

    try:
        run_process(unique_id, code, t_input, t_output, t_input_type, t_output_type, path_to_host, "run", method_name)
    except Exception as e:
        # Handle other exceptions
        print("An error occurred:", e)
    # ================================================================================================
    # submit, run all the test cases from db
    print(data)

    # Testcases.query.filter_by(id_problem=self.id_problem)
    try:
        content = get_data_from_json(path_to_host, unique_id)
        running_error = content["running_error"]

        if content["first_case"] == '1' and content["second_case"] == '1':
            answer = "success"
        else:
            answer = "fail"
        content["run"] = answer
        return jsonify(content)
    except Exception as err:
        print(f'{err} at trying to run the container')
        # get the current submission id to the current session
        running_error = "Unkown error for the first 2 cases.."
        new_content = {"id": unique_id, "count_passed_cases": '0', "time_complexity": '0',
                       "memory_complexity": '0', "run": "fail", "template": "/problems/fail",
                       "running_error": running_error,
                       "first_case": '0', "second_case": '0',
                       "failed_case": {"input": "", "expected_output": "", "client_output": ""}}
        #add_submission_to_db(unique_id, new_content)
        return jsonify(new_content)


# adds solution to the database and mark it as solved
def mark_as_solved_problem(current_user_id, current_problem_id, code):
    new_solved_problem = SolvedProblems(id_user=current_user_id, id_problem=current_problem_id, solution=code, solved="Yes")
    db.session.add(new_solved_problem)
    db.session.commit()
