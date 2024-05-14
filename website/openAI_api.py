import base64
import os

from flask import jsonify
from openai import OpenAI
from dotenv import load_dotenv


# this function call the OpenAI api with a given prompt
# and gets a response which can be used by the user
def get_openAI_response(given_prompt: str) -> str:
    # Load environment variables from .env file
    load_dotenv()

    my_api_key = os.environ.get('OPENAI_API_KEY')
    model = "gpt-3.5-turbo"
    temperature = 0.7  # 0.7 by default ~ how deterministic the model is (the lower the model the deterministic it is)
    topic = "Programming"
    max_tokens = 500

    client = OpenAI(
        # This is the default and can be omitted
        api_key=my_api_key,
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": given_prompt,
            }
        ],
        model=model,
        temperature=temperature,
        max_tokens=max_tokens
    )
    return chat_completion.choices[0].message.content


# gets solution for the problem from OpenAi api for solution
def get_AI_solution(statement, data):
    # Get the Base64 encoded Python code snippet from the request header
    encoded_python_code = data

    # Decode the Base64 encoded Python code snippet
    decoded_python_code = base64.b64decode(encoded_python_code).decode('utf-8')
    asking = 'Based on the statement of the problem, use the same class and function and in the interior of the function write the solution of the problem. Do not append any other string to the code you give back!'
    given_prompt = f'{statement}\n{decoded_python_code}\n{asking}'
    prompt_answer = get_openAI_response(given_prompt)
    print(prompt_answer)
    # check if the answer is not right -- hardcoded for now - it's hard to manipulate this
    if "'''python" in prompt_answer:
        prompt_answer.replace("'''python", "")
        prompt_answer.replace("'''", "")
    return jsonify({"code": prompt_answer})


# gets hint from OpenAi api for solution
def get_AI_hint(statement, data):
    # Get the Base64 encoded Python code snippet from the request header
    encoded_python_code = data

    # Decode the Base64 encoded Python code snippet
    decoded_python_code = base64.b64decode(encoded_python_code).decode('utf-8')
    given_prompt = f'Give me all the steps needed to solve this problem as a comment I repeat.. AS A COMMENT for the programming language given. The code is this {decoded_python_code}'

    prompt_answer = get_openAI_response(given_prompt)
    refactor_answer = decoded_python_code + "\n" + prompt_answer
    return jsonify({"code": refactor_answer})