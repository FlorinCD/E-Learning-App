
var caseTitleElement0State = false; // not clicked / not opened yet
var caseTitleElement1State = false; // not clicked / not opened yet
var language_code = ""; // the language in which the code will be sent

// animation for AI solution and hint
const solution_amimation = document.getElementById("solution-animation");
const hint_amimation = document.getElementById("hint-animation");
const improve_amimation = document.getElementById("improve-animation");

const currentUrl = window.location.href;
// Split the URL by '/' to get the different parts
const parts = currentUrl.split('/');
// Get the last part of the URL, which should be the endpoint
var current_endpoint = '/' + parts[parts.length - 2] + '/' + parts[parts.length - 1];

var editor = CodeMirror.fromTextArea(document.getElementById('editor'),{
    mode: "text/x-python",
    /*theme: "ambiance",*/
    /*theme: "duotone-dark",*/
    /*theme: "monokai", // pare nice */
    /*theme: "paraiso-dark",*/
    theme: "ambiance",
    lineNumbers: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    indentUnit: 4,
    indentWithTabs: true,
    matchBrackets: true,
    autocapitalize: true,
    
});
console.log(editor);

var width = window.innerWidth;
editor.setSize("", "500");

var option0 = document.getElementById("inlineFormSelectPref0");
var option1 = document.getElementById("inlineFormSelectPref1");
var option2 = document.getElementById("inlineFormSelectPref2");

function displayMessage(message) {
    // Create a new message element
    var messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.position = 'fixed';
    messageElement.style.top = '20px';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translateX(-50%)';
    messageElement.style.backgroundColor = '#8f8f8f';
    messageElement.style.color = '#241c1c';
    messageElement.style.padding = '10px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.zIndex = '9999';
    messageElement.style.fontWeight = '500';

    // Append the message element to the body
    document.body.appendChild(messageElement);

    // Set a timeout to remove the message after 5 seconds
    setTimeout(function() {
        messageElement.remove();
    }, 3500);
}

option0.addEventListener("change", function () {
    let current_option = "";
    if (option0.value == "Javascript") {
        editor.setOption("mode", "text/javascript");
        //editor.setValue("class Solution{\n\t\n}");
        current_option = "javascript";
    }
    else if(option0.value == "None"){
        editor.setValue("");
    }
    else if (option0.value == "Python") {
        //editor.setOption("mode", "text/x-python");
        editor.setOption("mode", "text/x-python");
        //editor.setValue("class Solution:\n\tdef isPalindrome(self, s: str) -> bool:\n\t\t");
        current_option = "python";
        language_code = current_option;
        // GET request with Code-Language in header to get from the database the code for the specific language the user has chosen as response 
        fetch(current_endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain; charset=utf-8', 'Code-Language': current_option
            },
        })
        .then(response => response.json())
        .then(data => {
            //console.log(data); // Log the response to the console
            // Preprocess the text to replace escape sequences with actual newlines and tabs
            var processedText = data.code.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
            editor.setValue(processedText);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    else {
        editor.setOption("mode", "text/x-c++src");
        language_code = "";
        //editor.setValue("");
    }                
});

option1.addEventListener("change", function () {
    if (option1.value == "ambiance") {
        editor.setOption("theme", "ambiance");
    }
    else if (option1.value == "darcula") {
        editor.setOption("theme", "darcula");
    }
    else if (option1.value == "monokai") {
        editor.setOption("theme", "monokai");
    }               
});

option2.addEventListener("change", function () {
    if (option2.value == "22px") {
        $(document).ready(function() {
            $('.CodeMirror').css('font-size', '22px');
        });
    }
    else if (option2.value == "20px") {
        $(document).ready(function() {
            $('.CodeMirror').css('font-size', '20px');
        });
    }
    else if (option2.value == "18px") {
        $(document).ready(function() {
            $('.CodeMirror').css('font-size', '18px');
        });
    }
    else if(option2.value == "16px") {
        $(document).ready(function() {
            $('.CodeMirror').css('font-size', '16px');
        });
    }                
});

// set the variable to modify the two testcases
const caseTitleElement0 = document.getElementById("case0-title-col");
const caseRowInput0 = document.getElementById("case-row0");
const caseRowInput1 = document.getElementById("case-row1");
const caseRowInput2 = document.getElementById("case-row2");
const lines0 = document.getElementsByClassName("line0");

const caseTitleElement1 = document.getElementById("case1-title-col");
const caseRowInput3 = document.getElementById("case-row3");
const caseRowInput4 = document.getElementById("case-row4");
const caseRowInput5 = document.getElementById("case-row5");
const lines1 = document.getElementsByClassName("line1");

const output_stdout_title = document.getElementById("output_stdout_title");
const output_stdout_title_content = document.getElementById("text-stdout-title-content");
const output_stdout = document.getElementById("output_stdout");
const output_stdout_content = document.getElementById("output_stdout_content");

// only one because we get the whole answer of the run button and we don't run the testcases one at a time
const caseRunning = document.querySelectorAll(".lds-dual-ring");
console.log(caseRunning);

// set the test case elements on display none by default
caseRowInput0.style.display = "none";
caseRowInput1.style.display = "none";
caseRowInput2.style.display = "none";
caseRowInput3.style.display = "none";
caseRowInput4.style.display = "none";
caseRowInput5.style.display = "none";
for(const line of lines0){
    line.style.display = "none";
}
for(const line of lines1){
    line.style.display = "none";
}

output_stdout_title.addEventListener("click", function(){
    if(output_stdout.style.display == "none"){
        output_stdout.style.display = "block";
    }
    else{
        output_stdout.style.display = "none";
    }
});

caseTitleElement0.addEventListener("click", function(){
    if(caseTitleElement0State){
        caseRowInput0.style.display = "none";
        caseRowInput1.style.display = "none";
        caseRowInput2.style.display = "none";
        for(const line of lines0){
            line.style.display = "none";
        }
        caseTitleElement0State = false;
    }
    else{
        caseRowInput0.style.display = "";
        caseRowInput1.style.display = "";
        caseRowInput2.style.display = "";
        for(const line of lines0){
            line.style.display = "";
        }
        caseTitleElement0State = true;
    }
});

caseTitleElement1.addEventListener("click", function(){
    if(caseTitleElement1State){
        caseRowInput3.style.display = "none";
        caseRowInput4.style.display = "none";
        caseRowInput5.style.display = "none";
        for(const line of lines1){
            line.style.display = "none";
        }
        caseTitleElement1State = false;
    }
    else{
        caseRowInput3.style.display = "";
        caseRowInput4.style.display = "";
        caseRowInput5.style.display = "";
        for(const line of lines1){
            line.style.display = "";
        }
        caseTitleElement1State = true;
    }
});


// handle the middle bar
var firstRowWidth = $('#firstRow').width();
var leftSideWidth = $('#leftside').width();
var rightSideWidth = $('#rightside').width();
var minimumSideWith = 0;
var w = 1512;

$(window).resize(function() {
    w = window.innerWidth;
    //console.log("The width is:", w);
});

$(document).ready(function(){
	$('.middle-bar').on('mousedown',function(e){
		$('#firstRow').on('mousemove',function(e){
			diff = $('.middle-bar').offset().left + 0 - e.pageX ;
            firstRowWidth = $('#firstRow').width();
            leftSideWidth = $('#leftside').width();
            rightSideWidth = $('#rightside').width();
            minimumSideWith = Math.min(leftSideWidth, rightSideWidth);
            //console.log(Math.min(leftSideWidth, rightSideWidth), "Diff = ", diff);
            // modify the width only if the minimum of any window is above 30% of the parent window
            if(w > 1200){
                console.log("WTF is going on", w);
                if(minimumSideWith > (firstRowWidth / 100 * 25)){
                    $('#leftside').width($('#leftside').width()-diff);
                    $('#rightside').width($('#rightside').width()+diff);
                }
                else{
                    if(leftSideWidth == minimumSideWith && diff < 0){
                        $('#leftside').width($('#leftside').width()-diff);
                        $('#rightside').width($('#rightside').width()+diff);
                    }
                    else if(rightSideWidth == minimumSideWith && diff > 0){
                        $('#leftside').width($('#leftside').width()-diff);
                        $('#rightside').width($('#rightside').width()+diff);
                    }
                }
            }
		});
	});
	$('#firstRow').on('mouseup',function(){
		$('#firstRow').off('mousemove');
	});
});



// run cases button 
document.getElementById("case-run-button").addEventListener("click", function() {
    var text = editor.getValue().replace(/\t/g, '    ');
    // Get the text from the textarea
    // Replace tabs with spaces -> It's a problem either from OpenAI API or Codemirror text editor 

    // Handle the response from the server if needed
    const first_case_passed_element = document.getElementById("case-passed1");
    const first_case_failed_element = document.getElementById("case-failed1");
    const second_case_passed_element = document.getElementById("case-passed2");
    const second_case_failed_element = document.getElementById("case-failed2");
    const case_answer1 = document.getElementById("case-answer1");
    const case_answer2 = document.getElementById("case-answer2");

    first_case_passed_element.style.display = "none";
    first_case_failed_element.style.display = "none";
    second_case_passed_element.style.display = "none";
    second_case_failed_element.style.display = "none";

    case_answer1.innerHTML = "";
    case_answer2.innerHTML = "";
    
    for(const current_case of caseRunning){
        current_case.style.display = "inline-block";
    }

    // Send a POST request to the server
    fetch(current_endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain; charset=utf-8', 'Button': 'run', "Code-Language": language_code
        },
        body: text // Send the text as JSON data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        console.log('Response from server:', data);

        for(const current_case of caseRunning){
            current_case.style.display = "none";
        }


        if(data.first_case == "0"){
            first_case_passed_element.style.display = "none";
            first_case_passed_element.style.animation = "none";

            first_case_failed_element.style.display = "block";
            first_case_failed_element.style.animation = "case_appear 1s ease 0.1s forwards";
        }
        else{
            first_case_passed_element.style.display = "block";
            first_case_passed_element.style.animation = "case_appear 1s ease 0.1s forwards";

            first_case_failed_element.style.display = "none";
            first_case_failed_element.style.animation = "none";
        }

        if(data.second_case == "0"){
            second_case_passed_element.style.display = "none";
            second_case_passed_element.style.animation = "none";

            second_case_failed_element.style.display = "block";
            second_case_failed_element.style.animation = "case_appear 1s ease 0.1s forwards";
        }
        else{
            second_case_passed_element.style.display = "block";
            second_case_passed_element.style.animation = "case_appear 1s ease 0.1s forwards";

            second_case_failed_element.style.display = "none";
            second_case_failed_element.style.animation = "none";
        }
        case_answer1.innerHTML = data.case1_output;
        case_answer2.innerHTML = data.case2_output;

        if(data.running_error != ""){
            output_stdout_title_content.style.color = "#ff0000";
            output_stdout_content.style.color = "#ff0000";
            output_stdout_content.innerHTML = "Error:" + data.running_error;
        }
        else{
            output_stdout_title_content.style.color = "#cccccc";
            output_stdout_content.style.color = "#cccccc";
            output_stdout_content.innerHTML = data.stdout_output;
        }

    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        for(const current_case of caseRunning){
            current_case.style.display = "none";
        }
        // Handle errors if any
    });
});

// submit cases button 
document.getElementById("case-submit-button").addEventListener("click", function() {
    var text = editor.getValue().replace(/\t/g, '    ');
    // Get the text from the textarea
    // Replace tabs with spaces -> It's a problem either from OpenAI API or Codemirror text editor 
    
    // Send a POST request to the server
    fetch(current_endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain; charset=utf-8', 'Button': 'submit', "Code-Language": language_code
        },
        body: text // Send the text as JSON data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        console.log('Response from server:', data.run);
        if (data.run == "success") {
            // Redirect to a different page (route)

            console.log(data);
            //send_post_request("/problems/success", data); // needs to be deleted
            window.location.href = data.template;
        }
        else if(data.run == "fail"){
            console.log(data);
            //send_post_request("/problems/fail", data); // needs to be deleted
            window.location.href = data.template;
        }
        // Handle the response from the server if needed
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        // Handle errors if any
    });
});

//=====================================================================================

function send_post_request(url, content){
    // Send a POST request to the server
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(content) // Send the text as JSON data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        console.log('Response from server:', data);
        // Handle the response from the server if needed
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        // Handle errors if any
    });
}


// button for AI-solution from OpenAI API
document.getElementById("button-solution").addEventListener("click", function() {

    // check if the language is selected
    if(option0.value == "Python"){
        
        solution_amimation.style.display = "block";
        let current_code = btoa(editor.getValue());
        // GET request to the server with the purpose of getting a hint from chatGPT
        fetch(current_endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain; charset=utf-8', 'Ai': "Solution"
            },
            body: current_code
        })
        .then(response => response.json())
        .then(data => {
            
            solution_amimation.style.display = "";
            console.log(data.code);
            editor.setValue(data.code);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    else{        
        displayMessage("Select a programming language!");
    }
});

// button for AI-hint from OpenAI API
document.getElementById("button-hint").addEventListener("click", function() {
    let current_code = btoa(editor.getValue());
    // GET request to the server with the purpose of getting a hint from chatGPT
    // check if the language is selected
    if(option0.value == "Python"){
        hint_amimation.style.display = "block";

        fetch(current_endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain; charset=utf-8', 'Ai': "Hint"
            },
            body: current_code
        })
        .then(response => response.json())
        .then(data => {
            hint_amimation.style.display = "";
            console.log(data.code);
            editor.setValue(data.code);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    else{
        displayMessage("Select a programming language!");
    }
});

// button for AI-Improve from OpenAI API
document.getElementById("button-improve").addEventListener("click", function() {
    let current_code = btoa(editor.getValue());
    // GET request to the server with the purpose of getting a hint from chatGPT
    // check if the language is selected
    if(option0.value == "Python"){
        improve_amimation.style.display = "block";

        fetch(current_endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain; charset=utf-8', 'Ai': "Improve"
            },
            body: current_code
        })
        .then(response => response.json())
        .then(data => {
            improve_amimation.style.display = "";
            console.log(data.code);
            editor.setValue(data.code);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    else{
        displayMessage("Select a programming language!");
    }
});