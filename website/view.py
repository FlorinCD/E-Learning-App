import base64
import concurrent
from . import db
from flask import Blueprint, render_template, request, jsonify, redirect, url_for, session
from flask_login import login_required, current_user
from .models import Problems, Testcases, Code_Language, Submissions
from .models import SolvedProblems, Users
from .utilities import (run_process, get_data_from_json, add_submission_to_db,
                        get_content_current_submission, delete_submission, calculate_percent_run_time,
                        time_complexity_limit_exceeded, memory_usage_limit_exceeded, submit_container,
                        submit_container_2_cases)
from .openAI_api import get_AI_solution, get_AI_hint
import os
import logging
import json

# Configure logging settings
logging.basicConfig(filename='example.log', level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')

views = Blueprint("views", __name__)


@views.route("/home")
def home():
    return render_template("home.html", user=current_user)


@views.route("/problems")
@login_required
def problems():
    problem_status = {}  # problem id: yes/no (if solved)
    problems_db = Problems.query.filter_by().all()
    for problem in problems_db:
        solved = SolvedProblems.query.filter_by(id_user=current_user.id, id_problem=problem.id).all()
        # check if the user has solved at least once this problem
        for element in solved:
            if element.solved == "Yes":
                problem_status[problem.id] = "solved"
                break
    return render_template("solveProblems.html", name=current_user.username, user=current_user, problems=problems_db, problem_status=problem_status)


@views.route("/problems/success", methods=['GET', 'POST'])
@login_required
def problem_success():
    top_percent, run_time, memory_usage = "100", "Unkown", "Unkown"
    if request.method == 'GET':
        # get the id for the current submission
        submission_id = session["submission_id"]
        content = get_content_current_submission(submission_id)

        # delete the submission content from db
        # delete_submission(submission_id)
        # if sub is not deleted the page can be reloaded
        # the sub will remain in the database

        run_time = content["run_time"].split('.')[0]
        memory_usage = content["memory_usage"].split('.')[0]
        try:
            top_percent = calculate_percent_run_time(int(content["limit_run_time"]), int(float(content["run_time"])))
        except Exception as err:
            print(f'{err} from ProblemSuccess route!')

    return render_template("problemSuccess.html", user=current_user, run_time=run_time,
                           memory_usage=memory_usage, top_percent=top_percent)


@views.route("/problems/fail", methods=['GET', 'POST'])
@login_required
def problem_fail():
    error = True
    submission_error, expected_output_case, client_output_case, input_case = "", "", "", ""
    if request.method == 'GET':
        try:
            # get the id for the current submission
            submission_id = session["submission_id"]
            content = get_content_current_submission(submission_id)

            # delete the submission content from db
            # delete_submission(submission_id)
            # if sub is not deleted the page can be reloaded
            # the sub will remain in the database

            print("This is the content:", content)
            submission_error = content["submission_error"]
            input_case = content["input_case"]
            expected_output_case = content["expected_output_case"]
            client_output_case = content["client_output_case"]

            if not submission_error:
                error = False
        except Exception as err:
            print(f"{err}")
    return render_template("problemFail.html", user=current_user, error=error, submission_error=submission_error
                           , input_case=input_case.replace('%', ' '), expected_output_case=expected_output_case,
                           client_output_case=client_output_case)


@views.route("/problems/check_palindrome", methods=['GET'], )
@views.route("/problems/longest_increasing_subsequence", methods=['GET'], )
@views.route("/problems/find_the_element", methods=['GET'], )
@login_required
def problem_get():
    # get the endpoint name of the problem to use it to receive the data about it
    endpoint_name = request.path.split('/')[-1]

    query_problem = Problems.query.filter_by(endpoint_name=endpoint_name)
    current_problem = query_problem.first()

    statement = current_problem.statement
    final_statement = ""
    for i in range(len(statement)):
        if statement[i] == '<':
            final_statement += '<span class="specialTextStatement">'
        elif statement[i] == '>':
            final_statement += '</span>'
        else:
            final_statement += statement[i]

    # we also assume there are at least 2 testcases for current problem in the database
    testcases = Testcases.query.filter_by(id_problem=current_problem.id)
    testcases_dict = {"input0": testcases[0].input.replace('%', ', '), "output0": testcases[0].output,
                      "explanation0": testcases[0].explanation, "input1": testcases[1].input.replace('%', ', '),
                      "output1": testcases[1].output, "explanation1": testcases[1].explanation}
    #print(testcases_dict)
    if request.method == "GET":
        for key, value in request.headers:
            if key == "Code-Language":
                if value == "python":
                    prob = Problems.query.filter_by(endpoint_name=endpoint_name).first()
                    response_data = {"code": prob.python_code}
                    return jsonify(response_data)
    return render_template("problemTemplate.html", user=current_user, current_problem=current_problem, statement=final_statement, example_dict=testcases_dict)


@views.route("/problems/check_palindrome", methods=['POST'], )
@views.route("/problems/longest_increasing_subsequence", methods=['POST'], )
@views.route("/problems/find_the_element", methods=['POST'], )
@login_required
def problem_post():
    # get the endpoint name of the problem to use it to receive the data about it
    endpoint_name = request.path.split('/')[-1]

    query_problem = Problems.query.filter_by(endpoint_name=endpoint_name)
    current_problem = query_problem.first()

    statement = current_problem.statement
    final_statement = ""
    for i in range(len(statement)):
        if statement[i] == '<':
            final_statement += '<span class="specialTextStatement">'
        elif statement[i] == '>':
            final_statement += '</span>'
        else:
            final_statement += statement[i]

    # we also assume there are at least 2 testcases for current problem in the database
    testcases = Testcases.query.filter_by(id_problem=current_problem.id)
    testcases_dict = {"input0": testcases[0].input, "output0": testcases[0].output,
                      "explanation0": testcases[0].explanation, "input1": testcases[1].input,
                      "output1": testcases[1].output, "explanation1": testcases[1].explanation}

    if request.method == 'POST':
        print("From post method")
        # get data from request if it's not empty
        data = request.data.decode('utf-8')
        #print(request.headers)
        if data:
            for key, value in request.headers:
                if key == "Button":
                    if value == "run":
                        return submit_container_2_cases(data, current_problem.id)
                    elif value == "submit":
                        return submit_container(data, current_problem.id, current_user.id)

                elif key == "Code-Language":
                    print("The language is:", value)
                elif key == "Ai":
                    if value == "Solution":
                        return get_AI_solution(statement, data)
                    elif value == "Hint":
                        return get_AI_hint(statement, data)
    return render_template("problemTemplate.html", user=current_user, current_problem=current_problem, statement=final_statement, example_dict=testcases_dict)


@views.route("/profile")
@login_required
def profile():
    points, score = {"Easy": 3, "Medium": 5, "Hard": 7}, 0
    been, filtered_problems, problems_category = set(), [], {"Easy": 0, "Medium": 0, "Hard": 0}
    user_to_write = Users.query.filter_by(id=current_user.id).first()

    # filter from all solved problems just one for each problems
    # in solved_problems there are all the solved problems aka more solutions for each problem
    # filter the problems
    solved_problems = SolvedProblems.query.filter_by(id_user=current_user.id).all()
    for element in solved_problems:
        if element.id_problem not in been:
            been.add(element.id_problem)
            filtered_problems.append(element)

    # get the total score
    for element in filtered_problems:
        current_problem = Problems.query.filter_by(id=element.id_problem).first()
        difficulty = current_problem.difficulty

        score += points[difficulty]
        problems_category[difficulty] += 1

    # write to db the points
    user_to_write.points = score
    db.session.commit()

    all_users, rank = Users.query.filter_by().all(), 0
    all_users.sort(key=lambda x: x.points, reverse=True)
    for i, element in enumerate(all_users):
        if element.id == current_user.id:
            rank = i + 1
            user_to_write.current_rank = rank
            db.session.commit()
            break

    # get all the problems on categories and make the difference of what is not solved yet
    all_problems = Problems.query.filter_by().all()
    problems_all_category = {"Easy": 0, "Medium": 0, "Hard": 0}

    for element in all_problems:
        problems_all_category[element.difficulty] += 1

    problems_all_category["Easy"] -= problems_category["Easy"]
    problems_all_category["Medium"] -= problems_category["Medium"]
    problems_all_category["Hard"] -= problems_category["Hard"]

    if request.method == 'GET':
        for key, value in request.headers:
            if key == "Problems":
                d = {"EasySolved": problems_category["Easy"], "MediumSolved": problems_category["Medium"], "HardSolved": problems_category["Hard"],
                     "EasyUnsolved": problems_all_category["Easy"], "MediumUnsolved": problems_all_category["Medium"], "HardUnsolved": problems_all_category["Hard"]}
                return jsonify(d)
    return render_template("userProfile.html", name=current_user.username, user=current_user, score=score, problems_category=problems_category, problems_unsolved=problems_all_category)


@views.route("/about")
def about():
    return render_template("about.html", name=current_user.username, user=current_user)


@views.route("/contact", methods=['GET', 'POST'])
@login_required
def contact():
    if request.method == "POST":
        data = request.get_json()
        return jsonify({"message": "Data received successfully"})
    return render_template("contact.html", name=current_user.username, user=current_user)


@views.route("/tutorial")
def tutorial():
    return render_template("tutorial.html", name=current_user.username, user=current_user)


@views.route("/data-structures")
def data_structures():
    return render_template("dataStructures.html", user=current_user)


@views.route("/data-structures/arrays")
def arrays():
    return render_template("arrays.html", user=current_user)


@views.route("/data-structures/linkedList")
def linkedList():
    return render_template("linkedList.html", user=current_user)


@views.route("/data-structures/hashmap")
def hashmap():
    return render_template("hashmap.html", user=current_user)


@views.route("/data-structures/set")
def sets():
    return render_template("set.html", user=current_user)


@views.route("/data-structures/queue")
def queue():
    return render_template("queue.html", user=current_user)


@views.route("/data-structures/stack")
def stack():
    return render_template("stack.html", user=current_user)


@views.route("/algorithms")
def algorithms():
    return render_template("algorithms.html", user=current_user)


@views.route("/algorithms/bfs")
def bfs():
    return render_template("bfs.html", user=current_user)


@views.route("/algorithms/dfs")
def dfs():
    return render_template("dfs.html", user=current_user)


@views.route("/algorithms/dijkstra")
def dijkstra():
    return render_template("dijkstra.html", user=current_user)


@views.route("/algorithms/astar")
def astar():
    return render_template("astar.html", user=current_user)


@views.route("/algorithms/binarySearch")
def binarySearch():
    return render_template("binarySearch.html", user=current_user)


@views.route("/algorithms/insertionSort")
def insertionSort():
    return render_template("insertionSort.html", user=current_user)


@views.route("/algorithms/quickSort")
def quickSort():
    return render_template("quickSort.html", user=current_user)


@views.route("/algorithms/mergeSort")
def mergeSort():
    return render_template("mergeSort.html", user=current_user)



