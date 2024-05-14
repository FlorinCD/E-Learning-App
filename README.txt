About parsing the data to the container:
The testcases have to be parsed in a string which would have every testcase separated by "\n", example: "[1,2,3,4,5]|[2,3,5,3]|[4,2,1]" or : "[[1,2,3],[3,2,1]]|[[4,2,3],[6,3,1]]"
For input case where you have multiple parameters, every parameter is separated by "%, example: "[1,2,3]%24%[21, 22]"
In the database at testcases table, for input_type, every parameter type will be separated by "%", example: "bool%int%list"
There will be only 1 output!


To do:
can I use this template at every problem without needing of creating new html,css,js files for every problem?
check this !!
trebuie sa pun constraints la timp si memorie sa pice in caz ca e prea mult in database pentru fiecare problema si apoi sa fac check
si sa pic in case ca e mai putin, sa modific in imagine la script memory_complexity: sa fie doar numarul eventual adaug inca un element
memory_type = mb, time_type = seconds.

Rezolvare la faza cu trimisul datelor din post pentru get. Fac un tabel pentru users_last_submission unde stochez datele din post request
si apoi la get le iau din baza de date si pun acolo. JOB DONE.

Cum fac sa opresc containerul dupa un anumit timp? Eventual sa-i pun limit de memorie. - cred ca am rezolvat cu chestia implementata
cu alarm si exit, mai trebuie memory

Daca solutia pica la timp sau memorie nu mi arata la ce caz.. sa rezolv asta?

In front end la success problem la chart daca e 100% top percent nu apare pe grafic ca mna e pana la 96...

open_ai_key = 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


============================================================================
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
                        t_input, t_output, t_input_type, t_output_type, count_testcases = "", "", "", "", 0
                        passed_cases = '0'
                        query_input = Testcases.query.filter_by(id_problem=current_problem.id)
                        for element in query_input:
                            t_input += element.input + '\n'
                            t_output += element.output + '\n'
                            t_input_type += element.input_type + '\n'
                            t_output_type += element.output_type + '\n'
                            count_testcases += 1
                        #print(t_input)
                        #print(t_output)
                        #print(t_input_type)
                        #print(t_output_type)
                        try:
                            run_container(unique_id, code, t_input, t_output, t_input_type, t_output_type, path_to_host, "submit")
                        except Exception as e:
                            # Handle other exceptions
                            logging.error("An error occurred: %s", e)
                        # ================================================================================================
                        # submit, run all the test cases from db
                        print(data)
                        try:
                            content = get_data_from_json(path_to_host, unique_id)
                            print(content)
                            if int(content["count_passed_cases"]) == count_testcases:
                                print("True")
                                answer = "success"
                                template_route = "/problems/success"
                            else:
                                print("False")
                                answer = "fail"
                                template_route = "/problems/fail"

                            if time_complexity_limit_exceeded(content["time_complexity"]):
                                answer = "fail"
                                template_route = "/problems/fail"
                                content["running_error"] = "Time complexity exceeded!"
                            elif memory_usage_limit_exceeded(content["memory_complexity"]):
                                answer = "fail"
                                template_route = "/problems/fail"
                                content["running_error"] = "Memory usage exceeded!"

                            content["run"] = answer
                            content["template"] = template_route
                            content["id"] = unique_id

                            # get the current submission id to the current session
                            session["submission_id"] = unique_id

                            add_submission_to_db(unique_id, content)
                            # return response to client
                            return jsonify(content)

                        except Exception as error:
                            """
                            This means that the container has stopped due to alarm of time complexity or something else!
                            """
                            print(f'{error} at trying to run the container')
                            # get the current submission id to the current session
                            session["submission_id"] = unique_id
                            new_content = {"id": unique_id, "count_passed_cases": '0', "time_complexity": '0',
                                       "memory_complexity": '0', "run": "fail", "template": "/problems/fail",
                                        "running_error": "Time limit or memory usage exceeded!",
                                       "failed_case": {"input": "", "expected_output": "", "client_output": ""}}
                            add_submission_to_db(unique_id, new_content)
                            return jsonify(new_content)
============================================================================
Given an array of positive integers <nums> and a integer <target>, return <True> if the number is present in the array. Otherwise return <False>. The time complexity must be O(log n).

class Solution:\n\tdef longestIncreasingSub(self, nums: list[int], target: int) -> bool:\n\t\t

De vazut si sters pentru unele chestii transformers comentate vechi din execute_runner.py. si delete comments.


class Solution:
    def longestIncreasingSub(self, nums: list[int]) -> int:
        dp = [1] * len(nums)
        for i in range(1, len(nums)):
            for j in range(i):
                if nums[i] > nums[j]:
                    dp[i] = max(dp[i], dp[j] + 1)
        return max(dp)

# To solve this problem, we can use dynamic programming.
# We create a dp array to store the length of the longest increasing subsequence ending at each index.
# We iterate through the array and for each element, we compare it with all previous elements to find the longest increasing subsequence ending at that index.
# Finally, we return the maximum value in the dp array, which represents the length of the longest increasing subsequence of elements.


class Solution:\n\tdef isPalindrome(self, s: str) -> bool:\n\t\treturn s == s[::-1]

Sa fac animatie pentru butoane pentru loading si sa fiu atent cum concateneaza AI-ul codul la functie

Aparent e destul de greu sa fac incat sa prind testcase-ul din container la care pica pentru
ca eu folosesc singalarm pentru unix systems si vad ca nu mi prinde acel testcase...
ma complic cred pentru ce mi se cere si n are rost..

