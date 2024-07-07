from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey


class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    date_created = db.Column(db.DateTime(timezone=True), default=func.now())
    solved_problems = db.Column(db.Integer)
    submitted_problems = db.Column(db.Integer)
    accuracy = db.Column(db.Float)
    days_submitted = db.Column(db.Integer)
    current_rank = db.Column(db.Integer)
    time_last_submit = db.Column(db.DateTime)
    points = db.Column(db.Integer)  # points are given like this: 3 for easy, 5 for medium, 7 for hard


"""
The statement of the problems and the code comes from Problems table
'<' will result in: '<span class="specialTextStatement">' and '>' in: '</span>' 
I use this to render correctly my html to apply the styles needed
"""


class Problems(db.Model):
    __tablename__ = 'problems'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=False)
    acceptance = db.Column(db.Float)
    solution = db.Column(db.String(150))
    difficulty = db.Column(db.String(150))
    problem_link = db.Column(db.String(150))
    statement = db.Column(db.String(500))
    endpoint_name = db.Column(db.String(255))
    python_code = db.Column(db.String(255))
    method_name = db.Column(db.String(255))
    testcase = relationship('Testcases', backref='problem')  # first argument is the name of the class
    code_lang = relationship('Code_Language', backref='problem')


"""
The first 2/3 testcases from Testcases table of each problem id will contain examples to be shown in the left side of
the interface on frontend
"""


class Testcases(db.Model):
    __tablename__ = 'testcases'

    id = db.Column(db.Integer, primary_key=True)
    input = db.Column(db.Text(100000), unique=False)
    output = db.Column(db.Text(100000), unique=False)
    id_problem = db.Column(db.Integer, ForeignKey('problems.id'))
    explanation = db.Column(db.Text(1000))
    output_type = db.Column(db.Text(100))
    input_type = db.Column(db.Text(255))


class SolvedProblems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_user = db.Column(db.Integer)
    id_problem = db.Column(db.Integer)
    solution = db.Column(db.Text(500))  # the solution to that specific problem solved by that user
    solved = db.Column(db.Text(10))  # marks if the current solution has solved the problem - Yes/No


# delete this in the future - It is not used anymore
class Code_Language(db.Model):

    __tablename__ = "code_language"
    id = db.Column(db.Integer, primary_key=True)
    chosen_language = db.Column(db.Text(255))
    id_problem = db.Column(db.Integer, ForeignKey('problems.id'))
    language_code = db.Column(db.Text(255))


"""
Submissions table is used to store the submission from the user. It will store every necessary data to be then displayed
in success or fail template.
Example: time_complexity, memory_usage..
One submission is created after running the container then is deleted when the javascript code sends get request
to get to the success/fail template after the information is gathered from the database in put in html using jinja
"""


class Submissions(db.Model):

    __table__name = "submissions"
    id = db.Column(db.Integer, primary_key=True)
    unique_id_submission = db.Column(db.Text(50))
    run_time = db.Column(db.Text(100))
    memory_usage = db.Column(db.Text(100))
    top_percent = db.Column(db.Text(100))
    submission_error = db.Column(db.Text(500))
    input_case = db.Column(db.Text(10000))
    expected_output_case = db.Column(db.Text(10000))
    client_output_case = db.Column(db.Text(10000))
    limit_run_time = db.Column(db.Text(100))
    limit_memory_usage = db.Column(db.Text(100))
