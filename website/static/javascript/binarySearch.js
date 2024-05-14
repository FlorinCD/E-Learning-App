var arrayToSearch = []; // array to search on 
var flagValidInput = true;
var flagButtonAddArray = false; // flag for button AddArray pressed
var clearFlag = true; // flag for all things cleared
var speedShowing = 0.25; // speed for showing the animation
var flagStartVisualization = false; // flag for process started
var flagRandomArray = false; // flag for 1 time generated array
var flagArrayAdded = false; // flag for user added array
var target = -1; // target to search
var mySet = new Set(); // set with numbers from the array
 
function isInt(value) {
    return !isNaN(value) && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function binarySearchCompute(arr, target){
    let start = 0;
    let end = arr.length-1;
    let mid = -1;
    var mids = []; // the middle point at every step
    var starts = []; // the start point at every step
    var ends = []; // the end point at every step

    while(start <= end){
        mid = Math.floor((start + end) / 2);
        mids.push(mid);
        starts.push(start);
        ends.push(end);
        if(arr[mid] == target){
            console.log("Target found!");
            break;
        }
        else if(arr[mid] > target){
            end = mid - 1;
        }
        else if(arr[mid] < target){
            start = mid + 1;
        }

    }
    return {mids, starts, ends};
}

// function for visualize/start button
var visualize_button = document.getElementById('button-start');
visualize_button.addEventListener('click', async function onClick() {
    console.log("Visualization button clicked!");
    if(!flagStartVisualization && clearFlag && arrayToSearch.length > 0){
        console.log("Visualize");
        flagStartVisualization = true;
        var finalResult = binarySearchCompute(arrayToSearch, target);
        var mids = finalResult['mids'];
        var starts = finalResult['starts'];
        var ends = finalResult['ends'];
        const parent = document.getElementById('binarySearchVisualization');

        for(i=0;i<mids.length;i++){
            const wrapper = document.createElement('div');
            wrapper.className = 'wrapperForCells';

            for(j=starts[i];j<ends[i]+1;j++){
                const element = document.createElement('div');
                var elementValue = parseInt(arrayToSearch[j]);
                element.className = 'binaryCell';
                if(j == mids[i]){
                    element.className = 'middleCell';
                }
                if(i+1 < mids.length && starts[i+1] <= j && j <= ends[i+1]){
                    element.className = "markedCell";
                }
                if(i == mids.length-1 && arrayToSearch[j] == target){
                    element.className = "targetCell";
                }
                element.textContent = elementValue;
                wrapper.appendChild(element);
            }
            setTimeout(() => {
                parent.appendChild(wrapper);
            }, 2000 * speedShowing);
            speedShowing += 1;
        }
        speedShowing += 1;
        await new Promise(p => setTimeout(p, speedShowing*1800));
        flagStartVisualization = false;
        clearFlag = false;
    }
});

// function for adding a custom array
var addArray_button = document.getElementById('button-addArray');
addArray_button.addEventListener('click', function onClick() {
    console.log(!flagRandomArray, !flagStartVisualization, clearFlag);
    if(!flagRandomArray && !flagStartVisualization && clearFlag) {
        console.log("Array added");
        flagArrayAdded = true;
        var resVal = document.getElementById('addArrayInput').value;
        var buttonList = document.getElementById('button-list-container');
        var arr = resVal.split(',');
        var flagValidInput = true;
        arrayToSearch = [];
        for(i=0; i<arr.length; i++) {
            arr[i] = arr[i].trim();
            if((!isInt(arr[i]) || (isInt(arr[i]) && Math.abs(parseInt(arr[i])) >= 100 || arr.length > 24)) && !flagButtonAddArray) {
                console.log("Problem:", arr[i]);
                var invalidInput = document.getElementById('targetInput');
                invalidInput.className = 'invalidInput';
                invalidInput.textContent = "Invalid input!";
                flagValidInput = false;
                flagButtonAddArray = true;
                break;
            }
        }
        arrayToSearch = arr;
        if(flagValidInput && !flagButtonAddArray){
            var validInput = document.getElementById('targetInput');
            validInput.className = 'arrayAdded';
            validInput.textContent = "Array added!";
            flagButtonAddArray = true;

            arrayToSearch.sort(function(a, b) {
                return a - b;
            });
            const parent = document.getElementById('binarySearchVisualization');
            const wrapper = document.createElement('div');
            wrapper.className = 'wrapperForCells';
            for(i=0;i<arrayToSearch.length;i++) {
                const element = document.createElement('div');
                var elementValue = parseInt(arrayToSearch[i]);
                element.className = 'binaryCell';
                element.textContent = elementValue;
                wrapper.appendChild(element);
            }
            parent.appendChild(wrapper);
        }
    }
});


// function for adding the target
var addTarget_button = document.getElementById('button-addTarget');
addTarget_button.addEventListener('click', async function onClick() {
    var resVal = document.getElementById("addTargetInput").value;
    if(isInt(resVal) && parseInt(resVal) < 100){
        target = parseInt(resVal);
        const valueAdded = document.getElementById('targetInput');
        valueAdded.className = 'targetInput';
        valueAdded.textContent = "Target added!";
    }
    else{
        console.log("Invalid input!");
    }
});

// function for clear
var clear_button = document.getElementById('button-clear');
clear_button.addEventListener('click', function onClick() {
    console.log("Clear button clicked", flagStartVisualization);
    if(!flagStartVisualization){
        console.log("Clear");
        flagButtonAddArray = false;
        flagValidInput = true
        flagStartVisualization = false;
        flagRandomArray = false;
        clearFlag = true;
        flagArrayAdded = false;
        arrayToSearch = [];
        speedShowing = 0.25;
        mySet = new Set();
        target = -1;

        const binaryDivs = document.querySelectorAll('.binaryCell');
        if(binaryDivs !== null){
            for(const element of binaryDivs) {
                element.remove();
            }
        }

        const divInput = document.querySelector('#targetInput');
        if(divInput !== null){
            divInput.className = "";
        }

        const wrapperForCells = document.querySelectorAll('.wrapperForCells');
        if(wrapperForCells !== null){
            for(const element of wrapperForCells){
                element.remove();
            }
        }

        const middleCell = document.querySelector('.middleCell');
        if(middleCell !== null){
            for(const element of middleCell){
                element.remove();
            }
        }

        const valueAdded = document.getElementById('targetInput');
        if(valueAdded !== null){
            valueAdded.className = "";
            valueAdded.textContent = "";
        }
    }
});

// function for generating random array
var random_button = document.getElementById('button-random');
random_button.addEventListener('click', function onClick() {
    if(!flagStartVisualization && !flagRandomArray && clearFlag && !flagArrayAdded){
        arrayToSearch = [];
        flagRandomArray = true;
        console.log("Random");
        if(!flagStartVisualization){
            for(i=0;i<23;i++){
                let x = getRandomInt(100);
                while(mySet.has(x)){
                    x = getRandomInt(100);
                }
                arrayToSearch.push(x);
                mySet.add(x);
            }
        }
    
        arrayToSearch.sort(function(a, b){
            return a-b;
        })
    
        const parent = document.getElementById('binarySearchVisualization');
        const wrapper = document.createElement('div');
        wrapper.className = 'wrapperForCells';
        for(i=0;i<arrayToSearch.length;i++) {
            const element = document.createElement('div');
            var elementValue = parseInt(arrayToSearch[i]);
            element.className = 'binaryCell';
            element.textContent = elementValue;
            wrapper.appendChild(element);
        }
        parent.appendChild(wrapper);
        console.log(arrayToSearch);        
    }
});

