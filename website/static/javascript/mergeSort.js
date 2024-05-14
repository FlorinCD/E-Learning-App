var numberOfCols = 47; // number of columns to sort 100
var listOfCols = [];
var arrayToSort = []; // the array with number instead of divs to be able to sort it
var counterSpeed = 1; // used for async function to make the next animation after the first one at n miliseconds
var actualSpeed = 10; // miliseconds
var changes = []; // all the changes between columns

var flagForGeneratingArray = false;
var flagForRunningSorting = false; // able to sort
var flagSortAvailable = true; // it's true when there is a generated array / to not run sorting multple times on a sorted array

parentElement = document.getElementById('SortVisualization');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }  

function getHeightOfDiv(currDiv){return parseInt(currDiv.style.height.substring(0, currDiv.style.height.length-2));}

function getSizeOfClient(){
  var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  return [w, h];
}

function buildArray(){
  for(let i=0;i<numberOfCols;i++){
      const column = document.createElement('div');
      column.className = 'sortColumn';
      column.style.height = getRandomInt(100) + 'px';
      parentElement.appendChild(column);
      listOfCols.push(column);
      arrayToSort.push(getHeightOfDiv(column));
      //console.log(column.style.height);
  }
}

// =============================================================================================================================

function mergeSort(arr) {
    const len = arr.length;
    const temp = new Array(len);

    for (let size = 1; size < len; size *= 2) {
        for (let leftStart = 0; leftStart < len - 1; leftStart += 2 * size) {
            const mid = Math.min(leftStart + size - 1, len - 1);
            const rightEnd = Math.min(leftStart + 2 * size - 1, len - 1);

            merge(arr, temp, leftStart, mid, rightEnd);
        }
    }

    return arr;
}

function merge(arr, temp, leftStart, mid, rightEnd) {
    let left = leftStart;
    let right = mid + 1;
    let index = leftStart;

    // Merge the two halves into a temporary array
    while (left <= mid && right <= rightEnd) {
        if (arr[left] <= arr[right]) {
            changes.push([index, arr[left]]);
            temp[index++] = arr[left++];
        } else {
            changes.push([index, arr[right]]);
            temp[index++] = arr[right++];
        }
    }

    // Copy remaining elements from both halves (if any)
    while (left <= mid) {
        changes.push([index, arr[left]]);
        temp[index++] = arr[left++];
    }

    while (right <= rightEnd) {
        changes.push([index, arr[right]]);
        temp[index++] = arr[right++];
    }

    // Copy elements back to the original array
    for (let i = leftStart; i <= rightEnd; i++) {
        changes.push([i, temp[i]]);
        arr[i] = temp[i];
    }
}
/*
const swap = (arr, left, right) =>  {
    const temp = arr[left]
    arr[left] = arr[right]
    changes.push([left, arr[right]]);
    changes.push([right, temp]);
    arr[right] = temp;
  }
*/

// =============================================================================================================================

async function visualizeAlgorithm(){
  document.getElementById('inputRange').disabled = true; // block the input range to be changed during visualizing
  counterSpeed = 1;

  for(let i=0;i<changes.length;i++){
    setTimeout(() => {
      listOfCols[changes[i][0]].className = "sortColumnTraverse";
      listOfCols[changes[i][0]].style.height = changes[i][1] + "px";
    }, actualSpeed * counterSpeed);
    counterSpeed += 1;
  }
  await new Promise(p => setTimeout(p, actualSpeed * counterSpeed));
  document.getElementById('inputRange').disabled = false;  
  flagForRunningSorting = false; // the sorting process has ended and we need a new array
  flagSortAvailable = false;
  counterSpeed = 1;
  //console.log("The sorting process has ended");
  //console.log(counterSpeed*10);
}

// generate array button
buttonGenerateArray = document.getElementById('button-addArray');
buttonGenerateArray.addEventListener('click', function onClick(){
  if(!flagForRunningSorting){
    arrayToSort = [];
    changes = [];
    flagForGeneratingArray = true;
    flagSortAvailable = true;
    for(let i=0;i<listOfCols.length;i++){
      listOfCols[i].style.height = getRandomInt(100) + 'px';
      listOfCols[i].className = 'sortColumn';
      arrayToSort.push(getHeightOfDiv(listOfCols[i]));
    }
  }
  flagForGeneratingArray = false;
});


// visualizing sorting button
buttonVisualizeSorting = document.getElementById('button-start');
buttonVisualizeSorting.addEventListener('click', async function onClick(){
  if(!flagForGeneratingArray && !flagForRunningSorting && flagSortAvailable){
    flagForRunningSorting = true;
    arrayToSort = mergeSort(arrayToSort.slice());
    visualizeAlgorithm();
  }
});


  // input range
inputRange = document.getElementById('inputRange');
inputRange.addEventListener('change', function() {
  actualSpeed = inputRange.value;
  
});


// get's the size of the window at every change
/*
window.onresize = function(){
  console.log("Size changed!");
  var colsSort = document.getElementsByClassName('sortColumn');
  var colsSortAnimations = document.getElementsByClassName('sortColumnTraverse');

  for(i = 0; i < colsSort.length; i++) {
    colsSort[i].style.width = 1 + "px";
  }
  for(i = 0; i < colsSortAnimations.length; i++) {
    colsSortAnimations[i].style.width = 1 + "px";
  }


  var size = getSizeOfClient();
  var width = size[0];
  /*
  var cols0 = document.getElementsByClassName('sortColumn');
  var cols1 = document.getElementsByClassName('sortColumnTraverse');

  for(i = 0; i < cols0.length; i++) {
    cols0[i].style.width = parseInt(width/100) + "px";
  }
  for(i = 0; i < cols1.length; i++) {
    cols1[i].style.width = parseInt(width/100) + "px";
  }
  
}
*/

buildArray();