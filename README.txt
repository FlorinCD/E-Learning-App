This is a full stack application. The platform is meant to combine all kind of ways to explain and understand data structures and algorithms.
There are 3 software modules:
- algorithm visualization;
- representation of data structures;
- problem solving;
- AI assitance;

Frontend technologies: HTML, CSS, Javascript, Bootstrap, jQuery, CodeMirror;
Backend technologies: Python, Flask, MySQL, Docker;

About parsing the data to the container:
The testcases have to be parsed in a string which would have every testcase separated by "\n", example: "[1,2,3,4,5]|[2,3,5,3]|[4,2,1]" or : "[[1,2,3],[3,2,1]]|[[4,2,3],[6,3,1]]"
For input case where you have multiple parameters, every parameter is separated by "%, example: "[1,2,3]%24%[21, 22]"
In the database at testcases table, for input_type, every parameter type will be separated by "%", example: "bool%int%list"
There will be only 1 output.


More data will be written over time.

Template for introducing problems:
#insert into e_learning.problems values(1, "Check palindrom", 70, "", "Easy", "http://127.0.0.1:5000/problems/check_palindrome", "A string is called <palindrome> if the <inversed> string is equal with the <original> one. Given a string <palindrome> return <True> if it's a palindrome or return <False> otherwise.", "check_palindrome", "", "check_palindrome");
- the endpoints have to match: "http://127.0.0.1:5000/problems/check_palindrome" - "check_palindrome"
- for highlighting some word use <highlighted_word> such as: A string is called <palindrome> if the ..


A string is called <palindrome> if the <inversed> string is equal with the <original> one. Given a string <palindrome> return <True> if it's a palindrome or return <False> otherwise.


code="class Solution:
	def check_palindrome(self, palindrome: str) -> bool:





