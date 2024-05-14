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

//============================================================================

function partition(arr, start, end){
  // Taking the last element as the pivot
  const pivotValue = arr[end];
  let pivotIndex = start; 
  for (let i = start; i < end; i++) {
      if (arr[i] < pivotValue) {
      // Swapping elements
      changes.push([i, arr[pivotIndex]]);
      changes.push([pivotIndex, arr[i]]);
      [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];

      // my try to get swapping
      //
      // Moving to next element
      pivotIndex++;
      }
  }
  
  // Putting the pivot value in the middle
  changes.push([pivotIndex, arr[end]]);
  changes.push([end, arr[pivotIndex]]);
  [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]] 
  return pivotIndex;
};

function quickSortRecursive(arr, start, end) {
  // Base case or terminating case
  if (start >= end) {
      return;
  }
  
  // Returns pivotIndex
  let index = partition(arr, start, end);
  
  // Recursively apply the same logic to the left and right subarrays
  quickSortRecursive(arr, start, index - 1);
  quickSortRecursive(arr, index + 1, end);
}


//============================================================================


async function visualizeAlgorithm(){
  document.getElementById('inputRange').disabled = true; // block the input range to be changed during visualizing
  counterSpeed = 1;

  for(let i=0;i<changes.length;i++){
    setTimeout(() => {
      //listOfCols[changes[i][0]].className = "sortColumnTraverse";
      if(i%2 == 0 && i > 1){
        listOfCols[changes[i-1][0]].style.background = "#34b4eb";
        listOfCols[changes[i-2][0]].style.background = "#34b4eb";
      }
      listOfCols[changes[i][0]].style.background = "#e18300";
      listOfCols[changes[i][0]].style.height = changes[i][1] + "px";
    }, actualSpeed * counterSpeed * 2);
    counterSpeed += 1;
  }
  await new Promise(p => setTimeout(p, actualSpeed * counterSpeed * 2));
  listOfCols[changes[changes.length-1][0]].style.background = "#34b4eb";
  listOfCols[changes[changes.length-2][0]].style.background = "#34b4eb";

  document.getElementById('inputRange').disabled = false;  
  flagForRunningSorting = false; // the sorting process has ended and we need a new array
  flagSortAvailable = false;
  counterSpeed = 1;
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
    console.log(arrayToSort);
    quickSortRecursive(arrayToSort, 0, arrayToSort.length-1);
    console.log(arrayToSort);
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