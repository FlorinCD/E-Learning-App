/*
Weight => a node where to go but you have a distance of Weight.value
That means that if a node has a weight of "50", from current node to weighted node you have the cost distance of "50"
If you are situated at a weighted node and you have a normal node nearby you can go there with cost distance of "1"
From normal node to normal node the cost is always "1"
From weighted node to normal node the cost is always "1"
From normal node to weighted node the cost is alyways the weighted node.value
From weighted node0 to weighted node1 the cost is always the weighted node1 
*/
var obstacles_flag = false; // flag for obstacles
var searchpoint_flag = false; // flag for searchpoint
var clear_flag = true; // flag for clear
var process_running = false; // flag for process running (an action that is happening - should not be stopped by anything) 
var process_start = false; // flag for process start
var startpoint_flag = false; // flag for startpoint button
var numberStartpoint = 0; // number of startpoints -- needs to be one
var numberSearchpoint = 0; // number of searchpoints -- needs to be one
var obstacles_process_ended = false; // flag for obstacles to not be displayed after finishing the searching process
var started_process_ended = false; // flag for process to not start multiple times until clear button is pressed
var weights_flag = false; // flag for weights button pressed
var weights_process_ended = false; // flag for weights to not be displayed after finishing the searching process
var weight_val = 1; // weight value
var maze_rd_flag = false; // flag for recursion division maze
var maze_r_flag = false; // flag for random maze

var startpoint_pos = [-1, -1];  // the position of startpoint
var searchpoint_pos = [-1, -1];  // the position of searchpoint

var visitedNodesOrder = 1; // the order visiting every node
var speedVisiting = 5; // the speed for visiting nodes animation

var arrow_class_toDel = "";

var rows = 30;
var cols = 60;

var walls = new Set();
var weights = new Set();
var dist = new Map();
var cost = new Map(); // cost to go to that node
var grid = [];
var maze_path = [];
var shortestPath = [];

const color_map = {"obstacle": "#2b1b23", "startpoint": "#007d0c", "searchpoint": "#c2ba44", "empty": "#ffffff", "searched": "#cf69ff", "edgeSearch": "cyan"};

function createGrid(rows, columns) {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = "";

    for (let i = 0; i < rows; i++) {
        let myRow = document.createElement("div");
        myRow.className = "grid-row";
        myRow.id = "row"+i;
        grid.push([]);
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.id = 'grid'+"-"+i+"-"+j;
            myRow.appendChild(cell);
            grid[i].push(0);
        }
        gridContainer.appendChild(myRow);
    }
}
createGrid(rows, cols);

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }  

// code to create the maze 
let maze_walls;
function recursiveDivisionMaze(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }
  let vertical = range(grid[0].length);
  let horizontal = range(grid.length);
  maze_walls = [];
  getRecursiveWalls(vertical, horizontal, grid, startNode, finishNode);
  return maze_walls;
}

function range(len) {
  let result = [];
  for (let i = 0; i < len; i++) {
    result.push(i);
  }
  return result;
}

//dir === 0 => Horizontal
//dir === 1 => Vertical

function getRecursiveWalls(vertical, horizontal, grid, startNode, finishNode) {
  if (vertical.length < 2 || horizontal.length < 2) {
    return;
  }
  let dir;
  let num;
  if (vertical.length > horizontal.length) {
    dir = 0;
    num = generateOddRandomNumber(vertical);
  }
  if (vertical.length <= horizontal.length) {
    dir = 1;
    num = generateOddRandomNumber(horizontal);
  }

  if (dir === 0) {
    addWall(dir, num, vertical, horizontal, startNode, finishNode);
    getRecursiveWalls(
      vertical.slice(0, vertical.indexOf(num)),
      horizontal,
      grid,
      startNode,
      finishNode
    );
    getRecursiveWalls(
      vertical.slice(vertical.indexOf(num) + 1),
      horizontal,
      grid,
      startNode,
      finishNode
    );
  } else {
    addWall(dir, num, vertical, horizontal, startNode, finishNode);
    getRecursiveWalls(
      vertical,
      horizontal.slice(0, horizontal.indexOf(num)),
      grid,
      startNode,
      finishNode
    );
    getRecursiveWalls(
      vertical,
      horizontal.slice(horizontal.indexOf(num) + 1),
      grid,
      startNode,
      finishNode
    );
  }
}

function generateOddRandomNumber(array) {
  let max = array.length - 1;
  let randomNum =
    Math.floor(Math.random() * (max / 2)) +
    Math.floor(Math.random() * (max / 2));
  if (randomNum % 2 === 0) {
    if (randomNum === max) {
      randomNum -= 1;
    } else {
      randomNum += 1;
    }
  }
  return array[randomNum];
}

//dir === 0 => Horizontal
//dir === 1 => Vertical

function addWall(dir, num, vertical, horizontal, startNode, finishNode) {
  let isStartFinish = false;
  let tempWalls = [];
  if (dir === 0) {
    if (horizontal.length === 2) return;
    for (let temp of horizontal) {
      if (
        (temp === startNode.row && num === startNode.col) ||
        (temp === finishNode.row && num === finishNode.col)
      ) {
        isStartFinish = true;
        continue;
      }
      tempWalls.push([temp, num]);
    }
  } else {
    if (vertical.length === 2) return;
    for (let temp of vertical) {
      if (
        (num === startNode.row && temp === startNode.col) ||
        (num === finishNode.row && temp === finishNode.col)
      ) {
        isStartFinish = true;
        continue;
      }
      tempWalls.push([num, temp]);
    }
  }
  if (!isStartFinish) {
    tempWalls.splice(generateRandomNumber(tempWalls.length), 1);
  }
  for (let wall of tempWalls) {
    maze_walls.push(wall);
  }
}

function generateRandomNumber(max) {
  let randomNum =
    Math.floor(Math.random() * (max / 2)) +
    Math.floor(Math.random() * (max / 2));
  if (randomNum % 2 !== 0) {
    if (randomNum === max) {
      randomNum -= 1;
    } else {
      randomNum += 1;
    }
  }
  return randomNum;
}
/*--------------------------------------------------------------------------*/

// checks if a string is a valid number
function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseInt(str)) // ...and ensure strings of whitespace fail
}


  // set flag if button pressed for obstacles
  const obstacles_obj = document.getElementById('button-obstacles');
  obstacles_obj.addEventListener('click', function onClick() {
      obstacles_flag = true;
      searchpoint_flag = false;
      startpoint_flag = false;
      clear_flag = false;
      weights_flag = false;
  });

  // set flag if button pressed for weights
  const weights_obj = document.getElementById('button-weights');
  weights_obj.addEventListener('click', function onClick() {
      weights_flag = true;
      obstacles_flag = false;
      searchpoint_flag = false;
      startpoint_flag = false;
      clear_flag = false;
      var resVal = document.getElementById("weight-value").value;
      // if it's a valid value
      if(isNumeric(resVal)){
        weight_val = parseInt(resVal);
        if(weight_val < 1){
          weight_val = 1;
        }
      }
  });

// set flag if button preseed for startpoint - start
const startpoint_obj = document.getElementById('button-startpoint');
startpoint_obj.addEventListener('click', function onClick() {
    startpoint_flag = true;
    searchpoint_flag = false;
    obstacles_flag = false;
    clear_flag = false;
    weights_flag = false;
});

// set flag if button pressed for searchpoint - destination
const searchpoint_obj = document.getElementById('button-searchpoint');
searchpoint_obj.addEventListener('click', function onClick() {
    searchpoint_flag = true;
    obstacles_flag = false;
    startpoint_flag = false;
    clear_flag = false;
    weights_flag = false;
});

// set flag if button pressed for recursion division maze
const maze_rd_obj = document.getElementById('button-recursiveD-maze');
maze_rd_obj.addEventListener('click', async function onClick() {
    if(!process_running && clear_flag && !maze_rd_flag && !maze_r_flag) {
        obstacles_flag = false;
        maze_rd_flag = true;
        process_running = true;
        maze_path = recursiveDivisionMaze(grid, startpoint_pos, searchpoint_pos);
        for(let i=0;i<maze_path.length;i++){
            let r = maze_path[i][0];
            let c = maze_path[i][1];
            const new_element = document.getElementById('grid-'+(r)+'-'+(c));
            new_element.className = "node-wall";
            new_element.style.backgroundColor = "#2b1b23";
            new_element.style.borderColor = "#2b1b23";
            var temp = (r) + "-" + (c);
            walls.add(temp);
            await new Promise(p => setTimeout(p, 7));
        }
        process_running = false;
    }
});

// set flag if button pressed for random maze
const maze_r_obj = document.getElementById('button-random-maze');
maze_r_obj.addEventListener('click', async function onClick() {
    if(!process_running && clear_flag && !maze_rd_flag && !maze_r_flag){
        obstacles_flag = false;
        maze_r_flag = true;
        process_running = true;
        for(let i=0; i < 700; i++){
            let random_r = getRandomInt(30);
            let random_c = getRandomInt(60);
            if((random_r != startpoint_pos[0] || random_c != startpoint_pos[1]) && (random_r != searchpoint_pos[0] || random_c != searchpoint_pos[1]))
            {
                const new_element = document.getElementById('grid-'+random_r+'-'+random_c);
                new_element.className = "node-wall";
                new_element.style.backgroundColor = "#2b1b23";
                new_element.style.borderColor = "#2b1b23";
                var temp = random_r + "-" + random_c;
                walls.add(temp);
                await new Promise(p => setTimeout(p, 5));
            }
        }
        process_running = false;
    }
});

// set flag if button pressed for clear
const clear_obj = document.getElementById('button-clear');
clear_obj.addEventListener('click', function onClick() {
    if(!process_running && !process_start){
        started_process_ended = false;
        clear_flag = true;
        searchpoint_flag = false;
        startpoint_flag = false;
        obstacles_flag = false;
        obstacles_process_ended = false;
        weights_flag = false;
        weights_process_ended = false;
        maze_rd_flag = false;
        maze_r_flag = false;
        searchpoint_flag = 0;
        searchpoint_pos = [-1, -1];
        startpoint_pos = [-1, -1];
        numberSearchpoint = 0;
        numberStartpoint = 0;
        visitedNodesOrder = 1;
        maze_path = [];
        walls = new Set();
        weights = new Set();
        cost = new Map();
        dist = new Map();
        shortestPath = [];

        const cells = document.getElementsByClassName("grid-cell");
        for (const cell of cells){
            cell.style.backgroundColor = color_map["empty"];
            cell.style.borderColor = "#abd2ff";
        }
        
        const start = document.getElementById("startpoint");
        if(start !== null){
            start.remove();
        }

        const eye0 = document.getElementById("eye0");
        if(eye0 !== null){
            eye0.remove();
        }

        $(arrow_class_toDel).remove();

        const weights_del = document.querySelectorAll('.dumbell');
        weights_del.forEach(weight => {
            weight.remove();
            });
        
        const boxes = document.querySelectorAll('.circle-cell');
        if(boxes !== null){
            boxes.forEach(box => {
            box.remove();
            });
        }
        const node_walls = document.querySelectorAll('.node-wall');
        if(node_walls !== null){
            for(const node_wall of node_walls){
                node_wall.className = "grid-cell";
                node_wall.style.backgroundColor = color_map["empty"];
                node_wall.style.borderColor = "#abd2ff";
            }
        }
        const nodes_visited = document.querySelectorAll('.node-visited');
        if(nodes_visited !== null){
            for(const node_visited of nodes_visited){
                node_visited.className = "grid-cell";
                node_visited.style.backgroundColor = color_map["empty"];
                node_visited.style.borderColor = "#abd2ff";
            }
        }
        const nodes_shortestPath = document.querySelectorAll('.nodeShortestPath');
        if(nodes_shortestPath !== null){
          for(const node_shortestPath of nodes_shortestPath){
              node_shortestPath.className = "grid-cell";
              node_shortestPath.style.backgroundColor = color_map["empty"];
              node_shortestPath.style.borderColor = "#abd2ff";
          }
        }
    }
});

// returns the dist to a node || => if it's a normal node is 1 and if it's a weight is the distance passed with the button from webpage
function returnDistance(new_r, new_c){
  if(weights.has(new_r+"-"+new_c)){
    var newId = new_r + "-" + new_c;
    return cost[newId];
  }
  else{ // normal node with no weight
    return 1;
  }
}
function getShortestPath(parent, currNode){
  shortestPath.unshift(currNode);
  if(parent.has(currNode)){
    getShortestPath(parent, parent.get(currNode));
  }
}

// set flag if start button is pressed
const start_obj = document.getElementById('button-start');
start_obj.addEventListener('click', async function onClick() {
    if(!process_running && !started_process_ended && !process_start && numberStartpoint == 1 && numberSearchpoint == 1){
        process_running = true;
        process_start = true;

        // Dijkstra running
        let n = parseInt(rows);
        let m = parseInt(cols);
        var INFINITY = Math.pow(10, 1000);
        var my_distance = [[0, -1], [-1, 0], [0, 1], [1, 0]]; // directions to move
        var queue = [];
        var visited = new Set();
        var traversal = [];
        var matrix = [];  // the grid for visiting
        var parent = new Map(); // map of each node's parent
        var cellfound = false;
        var arrow_dir = "K";

        for(let i=0; i<n; i++){
            matrix.push([]);
            for(let j=0; j<m; j++){
                if(walls.has(i+"-"+j)){
                    matrix[i].push("#");
                }
                else if(weights.has(i+"-"+j)){
                    matrix[i].push("*");
                }
                else{
                  matrix[i].push(".");
                }
            }
        }
        
        /*------------------------------------------*/
        
        for(let i=0; i<n; i++){
            for(let j=0; j<m; j++){
              let grid_id = i+"-"+j;
              dist.set(grid_id, INFINITY); // set the distance to all nodes to infinity

              if(!weights.has(grid_id)){
                cost.set(grid_id, 1); // normal node || not a weight || not a wall
              }
            }
        }
        dist.set(startpoint_pos[0]+"-"+startpoint_pos[1], 0);
        queue.push([cost.get(startpoint_pos[0]+"-"+startpoint_pos[1]), startpoint_pos]);

        while(queue.length > 0){
            var element = queue.shift();
            var d = element[0]; // dist
            var u = element[1]; // current node

            //check if we reached destination
            if(u[0] == searchpoint_pos[0] && u[1] == searchpoint_pos[1]){
              cellfound = true;
              break;
            }

            if(!visited.has(u[0]+"-"+u[1])){
                visited.add(u[0]+"-"+u[1]);
                var traversalElement = document.getElementById("grid-"+u[0]+"-"+u[1]);
                traversal.push(traversalElement);

                for(var dist_element of my_distance){
                    var new_r = parseInt(u[0])+parseInt(dist_element[0]);
                    var new_c = parseInt(u[1])+parseInt(dist_element[1]);
                    var id = new_r + "-" + new_c;

                    if(0 <= new_r && new_r < n && 0 <= new_c && new_c < m && !visited.has(id) && !walls.has(id)){

                        if(d + cost.get((new_r+"-"+new_c)) < dist.get(id)){
                            dist.set(id, (d + cost.get((new_r+"-"+new_c))));

                            // map with the parent of each node 
                            parent.set(new_r+"-"+new_c, u[0]+"-"+u[1]);
                        }
                        var my_node = [new_r, new_c];
                        queue.push([dist.get(id), my_node]);
                    }
                }
                queue.sort(function(a, b) {
                    return a[0] - b[0];
                });
            }
        }
        /*------------------------------------------*/

        // let this the same for now -- it's just for animations
            for(const node of traversal){
                visitedNodesOrder += 1; 
                setTimeout(() => {
                    node.className = "node node-visited";
                  }, visitedNodesOrder*speedVisiting);
            }
            if(cellfound){
              getShortestPath(parent, searchpoint_pos[0]+"-"+searchpoint_pos[1]);
              var u = shortestPath[1].split("-");
              var r_arrow = parseInt(u[0]);
              var c_arrow = parseInt(u[1]);
              if(shortestPath[0] == (r_arrow-1)+"-"+c_arrow){
                arrow_dir = "D";
              }
              else if(shortestPath[0] == (r_arrow+1)+"-"+c_arrow){
                arrow_dir = "U";
              }
              else if(shortestPath[0] == r_arrow+"-"+(c_arrow-1)){
                arrow_dir = "R";
              }
              else if (shortestPath[0] == r_arrow+"-"+(c_arrow+1)){
                arrow_dir = "L";
              }

              var arrow_element = document.getElementById("grid-"+shortestPath[0]);
              if(arrow_dir == "U"){
                var arrow_element_child = document.createElement('div');
                arrow_element_child.className = "arrow-up";
              }
              else if(arrow_dir == "D"){
                var arrow_element_child = document.createElement('div');
                arrow_element_child.className = "arrow-down";
              }
              else if(arrow_dir == "L"){
                var arrow_element_child = document.createElement('div');
                arrow_element_child.className = "arrow-left";
              }
              else if(arrow_dir == "R"){
                var arrow_element_child = document.createElement('div');
                arrow_element_child.className = "arrow-right";
              }
              var to_del_startpoint = document.getElementById("startpoint");
              to_del_startpoint.remove();
              arrow_class_toDel = "." + arrow_element_child.className;
              arrow_element.appendChild(arrow_element_child);
            }
            //await new Promise(p => setTimeout(p, visitedNodesOrder*speedVisiting+1500));

            for(const node of shortestPath){
              visitedNodesOrder += 5;
              setTimeout(() => {
                const shortestPathNode = document.getElementById("grid-"+node);
                shortestPathNode.className = "nodeShortestPath";
              }, visitedNodesOrder*speedVisiting);
            }

            // wait that amount of time for the last node to make its animation (to fix the clear issue)
            await new Promise(p => setTimeout(p, visitedNodesOrder*speedVisiting+1500));
            process_running = false;
            process_start = false;
            obstacles_process_ended = true;
            started_process_ended = true;
            weights_process_ended = true;
            
    }
});



// Get a reference to the HTML element you want to select
// it will a list of all elements which have the class name grid-cell

const elements = document.getElementsByClassName("grid-cell");

// Add click event listeners to all elements with the class
for (const element of elements) {
    
    // create obstacles / weights while hovering and pressing mouse
    var flag = false; 
    
    window.onmousedown = () => {flag = true};
    window.onmouseup = () => { flag = false;}
    element.onmouseover = () => {
        coords = element.id.split('-').slice(1,);
        // draw obstacles
        if(!process_running && !obstacles_process_ended && element && flag && obstacles_flag && (coords[0] != searchpoint_pos[0] || coords[1] != searchpoint_pos[1]) && (coords[0] != startpoint_pos[0] || coords[1] != startpoint_pos[1]) && !weights.has(coords[0]+"-"+coords[1]) && !walls.has(coords[0]+"-"+coords[1])){
            element.className = "node-wall";
            element.style.backgroundColor = "#2b1b23";
            element.style.borderColor = "#2b1b23";
            var temp = coords[0] + "-" + coords[1];
            walls.add(temp);
        }
        // draw weights
        if(!process_running && !weights_process_ended && element && flag && weights_flag && (coords[0] != searchpoint_pos[0] || coords[1] != searchpoint_pos[1]) && (coords[0] != startpoint_pos[0] || coords[1] != startpoint_pos[1]) && !walls.has(coords[0]+"-"+coords[1]) && !weights.has(coords[0]+"-"+coords[1])){
            var temp = coords[0] + "-" + coords[1];
            weights.add(temp);
            cost.set(temp, weight_val);
            console.log("Node:", temp, "Dist:", cost.get(temp));
            var dumbell = document.createElement('div');
            dumbell.className = "dumbell";
            element.appendChild(dumbell);
        }
    }
    element.onmousedown = () => { flag = true; }
    

    // create startpoint
    element.addEventListener("click", function(){
        coords = element.id.split('-').slice(1,);
        if(!process_running && startpoint_flag && numberStartpoint == 0 && (coords[0] != searchpoint_pos[0] || coords[1] != searchpoint_pos[1]) && (coords[0] != startpoint_pos[0] || coords[1] != startpoint_pos[1]) && (coords[0] != startpoint_pos[0] || coords[1] != startpoint_pos[1]) && (!walls.has(coords[0]+"-"+coords[1]))){
            //element.style.backgroundColor = color_map["startpoint"];
            var startpoint_child = document.createElement('div');
            startpoint_child.id = "startpoint";
            element.appendChild(startpoint_child);
            startpoint_pos = element.id.split('-').slice(1,);
            numberStartpoint += 1;
        }
    });

    // create searchpoint
    element.addEventListener("click", function(){
        coords = element.id.split('-').slice(1,);
        if(!process_running && searchpoint_flag && numberSearchpoint == 0 && (coords[0] != searchpoint_pos[0] || coords[1] != searchpoint_pos[1]) && (coords[0] != startpoint_pos[0] || coords[1] != startpoint_pos[1]) && (coords[0] != startpoint_pos[0] || coords[1] != startpoint_pos[1]) && (!walls.has(coords[0]+"-"+coords[1]))){
            /*element.style.backgroundColor = color_map["searchpoint"];*/
            searchpoint_pos = element.id.split('-').slice(1,);
            /*
            <div class="eye"></div>
            */
            let new_eye = document.createElement("div");
            element.appendChild(new_eye);
            new_eye.className = "eye";
            new_eye.id = "eye0";
            

            numberSearchpoint += 1;
        }
    });
    // create delete obstacles function
}
