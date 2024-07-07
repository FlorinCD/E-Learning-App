import argparse
import inspect
import importlib.util
import time
import tracemalloc
import json
import sys
import io
import signal
import ast

"""
This script is executed isolated in the container with the given arguments and writes back to the save_output.txt
execution_time is in milliseconds
memory_usage is in MB 
"""


def handler(signum, frame):
    print("Time limit exceeded. Exiting...")
    exit()


def write_to_json(curr_result: dict):
    # Open the JSON file in read mode to load existing data
    with open("ouput_data.json", "r") as json_file:
        # Load existing data from the file
        existing_data = json.load(json_file)

    existing_data.append(curr_result)

    with open("ouput_data.json", "w", encoding='utf-8') as json_file:
        # Write the updated data back to the file
        json.dump(existing_data, json_file, ensure_ascii=False, indent=4)


# Set the signal handler for SIGALRM
signal.signal(signal.SIGALRM, handler)


# Set the maximum execution time in seconds
# For every testcase the maximum limit of time is 1 second and it repeats.
TIME_LIMIT_SECONDS = 1


# parse the string with the code
parser = argparse.ArgumentParser(description='Get data from db')
parser.add_argument('id', type=str)
parser.add_argument('code', type=str)
parser.add_argument('input', type=str)
parser.add_argument('output', type=str)
parser.add_argument('input_type', type=str)
parser.add_argument('output_type', type=str)
parser.add_argument('run_type', type=str)
parser.add_argument('method_name', type=str)
args = parser.parse_args()

# simulating the running code
print(f"Running container {args.id}")

class_code = args.code
# Write the class definition to a Python file
with open("my_class.py", "w") as f:
    f.write(class_code)

# for submit cases - all the cases to run
first_method_name, answer, running_error, stdout_output = "", "", "", ""
failed_testcase = {"input": "", "expected_output": "", "client_output": ""}
count_passed_cases, final_time, memory_mb, final_memory = 0, 0, 0, 0  # count of passed testcases and final time for submission
input_case, expected_output_case, client_output_case = "", "", ""

# for run cases - 2 cases to run
testcase_output = ""  # 10 means the first has passed and the second didn't || 1 -> Passed 0 -> Failed
count_cases, case1, case2 = 0, "", ""

# Import the module dynamically
try:
    spec = importlib.util.spec_from_file_location("my_module", "my_class.py")
    my_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(my_module)

    # get the first method without knowing its name for general purpose
    for name, value in inspect.getmembers(my_module.Solution()):
        # Check if the attribute is a method and not a dunder method (like __init__)
        if inspect.ismethod(value) and name == args.method_name:
            first_method_name = name
            print("THE METHOD NAME is: ", first_method_name)
            break
except Exception as e:
    my_module = None
    running_error = str(e)

if args.run_type == "submit":
    if first_method_name and my_module:
        # Call the first method dynamically
        first_method = getattr(my_module.Solution(), first_method_name)
        """
        Here I have to handle the input and output.. transform it if it's different
        """
        t_inputs = args.input.strip().split('\n')
        t_outputs = args.output.strip().split('\n')
        t_input_type = args.input_type.strip().split('\n')
        t_output_type = args.output_type.strip().split('\n')
        number_of_cases = len(t_inputs)
        #print("Current:", t_inputs, t_outputs, t_input_type, t_output_type)

        # go through each testcase
        for i in range(len(t_inputs)):
            # current testcase
            # splits the input arguments to separate them by %
            current_testcase_input = t_inputs[i].split('%')
            current_testcase_input_type = t_input_type[i].split('%')
            transformed_inputs = []  # store the transformed parameters from raw string to python variables

            for j in range(len(current_testcase_input)):
                try:
                    transformed_inputs.append(ast.literal_eval(current_testcase_input[j]))
                except Exception as err:
                    transformed_inputs.append(current_testcase_input[j])

            # there will be only 1 output
            try:
                transformed_output = ast.literal_eval(t_outputs[i])
            except Exception as err:
                transformed_output = t_outputs[i]

            # calculate the time passed and the memory used
            tracemalloc.start()
            t0 = time.time()
            try:
                signal.alarm(TIME_LIMIT_SECONDS)
                answer = first_method(*transformed_inputs)  # answer to the code sent by the user for the current testcase
            except Exception as e:
                running_error = str(e)
            finally:
                # Cancel the alarm
                signal.alarm(0)
            t1 = time.time()
            memory_stats = tracemalloc.get_traced_memory()
            memory_mb = memory_stats[1] / (1024 * 1024)  # memory used
            final_memory = max(final_memory, memory_mb)
            final_time = max(final_time, t1-t0)
            print("Answer type:", type(answer), answer)

            # check if the answer call to the current function is the desired output
            if answer == transformed_output:
                count_passed_cases += 1
            else:
                failed_testcase = {"input": t_inputs[i], "expected_output": t_outputs[i], "client_output": str(answer)}
                print("The solution failed for this testcase:", t_inputs[i], t_outputs[i])
                break
        final_time *= 1000  # convert it to milliseconds
    else:
        print("No methods found in the class or the code is not well written.")

    """Write to the file the id of the submit, number of testcases passed, time_passed, stderr"""
    final_time = str(final_time)
    memory_mb = str(final_memory)
    count_passed_cases = str(count_passed_cases)
    result = {"id": args.id, "content": {"count_passed_cases": count_passed_cases, "time_complexity": final_time, "memory_complexity": memory_mb, "failed_case": failed_testcase, "type_running": "submit", "running_error": running_error}}
    write_to_json(result)
    print(f"Ended running of container {args.id}")

elif args.run_type == "run":
    if first_method_name and my_module:
        # Call the first method dynamically
        first_method = getattr(my_module.Solution(), first_method_name)
        """
        Here I have to handle the input and output.. transform it if it's different
        """
        t_inputs = args.input.strip().split('\n')
        t_outputs = args.output.strip().split('\n')
        t_input_type = args.input_type.strip().split('\n')
        t_output_type = args.output_type.strip().split('\n')
        number_of_cases = len(t_inputs)
        # print("Current:", t_inputs, t_outputs, t_input_type, t_output_type)

        # go through each testcase
        for i in range(len(t_inputs)):
            # current testcase
            current_testcase_input = t_inputs[i].split('%')
            current_testcase_input_type = t_input_type[i].split('%')
            transformed_inputs = []  # store the transformed parameters from raw string to python variables

            for j in range(len(current_testcase_input)):
                try:
                    transformed_inputs.append(ast.literal_eval(current_testcase_input[j]))
                    print("WE GOT TRANSFORMED CORECTLY !!!!! ", "="*70)
                except Exception as err:
                    print(err, current_testcase_input[j])
                    transformed_inputs.append(current_testcase_input[j])

            # there will be only 1 output
            try:
                transformed_output = ast.literal_eval(t_outputs[i])
            except Exception as err:
                transformed_output = t_outputs[i]

            # calculate the time passed and the memory used
            tracemalloc.start()
            t0 = time.time()
            try:
                # Redirect stdout to a StringIO object
                stdout_redirect = io.StringIO()
                sys.stdout = stdout_redirect

                # Call the function
                answer = first_method(
                    *transformed_inputs)  # answer to the code sent by the user for the current testcase

                # Get the stdout output from the StringIO object
                stdout_output += "    " + stdout_redirect.getvalue()

                # Reset stdout to its original value
                sys.stdout = sys.__stdout__
            except Exception as e:
                running_error = str(e)
            t1 = time.time()
            memory_stats = tracemalloc.get_traced_memory()
            memory_mb = memory_stats[1] / (1024 * 1024)  # memory used
            final_memory = max(final_memory, memory_mb)
            final_time = max(final_time, t1 - t0)
            print("Answer type:", type(answer), answer)

            final_time = max(final_time, t1 - t0)
            print("Answer type:", type(answer), answer)
            if answer == transformed_output:
                testcase_output += '1'
            else:
                testcase_output += '0'

            if count_cases == 0:
                case1 = answer
            else:
                case2 = answer

            count_cases += 1

        final_time *= 1000  # convert it to milliseconds
    else:
        print("No methods found in the class or the code is not well written.")
        testcase_output = "00"
        case1, case2 = "Unkown", "Unkown"

    """Write to the file the id of the submit, number of testcases passed, time_passed, stderr"""
    final_time = f'Execution time is {final_time} ms'
    memory_mb = f'Memory usage is {final_memory} MB'
    count_passed_cases = str(count_passed_cases)
    result = {"id": args.id, "content": {"count_passed_cases": count_passed_cases, "time_complexity": final_time, "memory_complexity": memory_mb, "failed_case": failed_testcase, "type_running": "run", "case1_output": str(case1), "case2_output": str(case2), "first_case": testcase_output[0], "second_case": testcase_output[1], "running_error": running_error, "stdout_output": stdout_output}}

    write_to_json(result)

print(f"Ended running of container {args.id}")



