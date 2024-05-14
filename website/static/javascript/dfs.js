var obstacles_flag = false; // flag for obstacles
var searchpoint_flag = false; // flag for searchpoint
var clear_flag = true; // flag for clear
var process_running = false; // flag for process running 
var process_start = false; // flag for process start
var startpoint_flag = false; // flag for startpoint button
var numberStartpoint = 0; // number of startpoints -- needs to be one
var numberSearchpoint = 0; // number of searchpoints -- needs to be one
var obstacles_process_ended = false; // flag for obstacles to not be displayed after finishing the searching process
var started_process_ended = false; // flaf for process to not start multiple times until clear button is pressed
var cellfound = false; // flag for finding the searched cell
var matrix = []; // matrix for visited cells
var maze_rd_flag = false; // flag for recursion division maze
var maze_r_flag = false; // flag for random maze

var startpoint_pos = [-1, -1];  // the position of startpoint
var searchpoint_pos = [-1, -1];  // the position of searchpoint

var dfs_path = [];
var grid = [];

var rows = 30;
var cols = 60;

var walls = new Set();

const color_map = {"obstacle": "#2b1b23", "startpoint": "#007d0c", "searchpoint": "#c2ba44", "empty": "#ffffff", "searched": "#cf69ff", "edgeSearch": "cyan"};

function createGrid(rows, columns) {
    const gridContainer = document.getElementById('grid-container');

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
  
function dfs(matrix, r, c, n, m, dist, level, my_levels, path, maxLevel) {
    if(cellfound){return;}
    let newId = r + "-" + c;
    dfs_path.push(newId);
        
    for(let d of dist){
        if((0 <= parseInt(r)+parseInt(d[0]) && parseInt(r)+parseInt(d[0]) < parseInt(n)) && (parseInt(0) <= parseInt(c)+parseInt(d[1]) && parseInt(c)+parseInt(d[1]) < parseInt(m)) && matrix[parseInt(r)+parseInt(d[0])][parseInt(c)+parseInt(d[1])] == 0){
            var currentLevel = parseInt(level.get(r+"-"+c))+1;
            maxLevel = Math.max(maxLevel, currentLevel);
            //console.log("currentLevel:", currentLevel);
            level.set((parseInt(r)+d[0]) + "-" + (parseInt(c)+d[1]), currentLevel);
            matrix[parseInt(r)+d[0]][parseInt(c)+d[1]] = 1;
            const parentPath = [...path.get(r+"-"+c)]; // get copy of parent's path
            parentPath.push((parseInt(r)+d[0]) + "-" + (parseInt(c)+d[1]));
            path.set((parseInt(r)+d[0]) + "-" + (parseInt(c)+d[1]), parentPath);

            // put to levels
            if(!my_levels.has(currentLevel)){
                my_levels.set(currentLevel, []);
            }

            // the searched cell has been found
            
            
            if(parseInt(r)+parseInt(d[0]) == searchpoint_pos[0] && parseInt(c)+parseInt(d[1]) == searchpoint_pos[1]){
                cellfound = true;
            }
            my_levels.get(currentLevel).push((parseInt(r)+d[0]) + "-" + (parseInt(c)+d[1]));
            dfs(matrix, parseInt(r)+d[0], parseInt(c)+d[1], n, m, dist, level, my_levels, path, maxLevel); 
        }
    }   
}



document.addEventListener("DOMContentLoaded", function() {

    // set flag if button pressed for obstacles
    const obstacles_obj = document.getElementById('button-obstacles');
    obstacles_obj.addEventListener('click', function onClick() {
        obstacles_flag = true;
        searchpoint_flag = false;
        startpoint_flag = false;
        clear_flag = false;
    });

    // set flag if button preseed for startpoint - start
    const startpoint_obj = document.getElementById('button-startpoint');
    startpoint_obj.addEventListener('click', function onClick() {
        startpoint_flag = true;
        searchpoint_flag = false;
        obstacles_flag = false;
        clear_flag = false;
    });

    // set flag if button pressed for searchpoint - destionation
    const searchpoint_obj = document.getElementById('button-searchpoint');
    searchpoint_obj.addEventListener('click', function onClick() {
        searchpoint_flag = true;
        obstacles_flag = false;
        startpoint_flag = false;
        clear_flag = false;
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
            searchpoint_flag = 0;
            searchpoint_pos = [-1, -1];
            startpoint_pos = [-1, -1];
            numberSearchpoint = 0;
            numberStartpoint = 0;
            maze_r_flag = false;
            maze_rd_flag = false;
            dfs_path = [];
            matrix = [];
            cellfound = false;
            maze_path = []
            const cells = document.getElementsByClassName("grid-cell");
            for (const cell of cells){
                cell.style.backgroundColor = color_map["empty"];
                cell.style.borderColor = "#abd2ff";
            }
            walls = new Set();
            const boxes = document.querySelectorAll('.circle-cell');
            boxes.forEach(box => {
                box.remove();
            });

            const eye0 = document.getElementById("eye0");
            if(eye0 !== null){
                eye0.remove();
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
        }
    });

    // set flag if start button is pressed
    const start_obj = document.getElementById('button-start');
    start_obj.addEventListener('click', async function onClick() {
        if(!process_running && !started_process_ended && !process_start && numberStartpoint == 1 && numberSearchpoint == 1){
            process_running = true;
            process_start = true;
            console.log("HERE");
            // DFS running
            let n = parseInt(rows);
            let m = parseInt(cols);

            //var matrix = [];  // the grid for visiting
            for(let i=0; i<n; i++){
                matrix.push([]);
                for(let j=0; j<m; j++){
                    if(walls.has(i+"-"+j)){
                        matrix[i].push(1);
                    }
                    else{
                        matrix[i].push(0);
                    }
                }
            }
            const level = new Map(); // cell - level
            const my_levels = new Map(); // levels - [cell1, cell2, ..]
            const path = new Map(); // x-y : [1-2 ..]
            var maxLevel = 0;
            level.set(startpoint_pos[0]+"-"+startpoint_pos[1], 0);
            my_levels.set(0, [startpoint_pos[0]+"-"+startpoint_pos[1]]);
            path.set(startpoint_pos[0]+"-"+startpoint_pos[1], [startpoint_pos[0]+"-"+startpoint_pos[1]]);

            let dist = [[0, -1], [-1, 0], [0, 1], [1, 0]]; // where to move
            matrix[startpoint_pos[0]][startpoint_pos[1]] = 1;

            dfs(matrix, startpoint_pos[0], startpoint_pos[1], n, m, dist, level, my_levels, path, maxLevel);
            if(cellfound){dfs_path.push(searchpoint_pos[0]+"-"+searchpoint_pos[1])};

            for(let i = 0; i < dfs_path.length; i++){
                let u = document.getElementById("grid-"+dfs_path[i]);
                u.className = "node-visited";
            
                await new Promise(p => setTimeout(p, 10));
            }

            process_running = false;
            process_start = false;
            obstacles_process_ended = true;
            started_process_ended = true;
    }
    });



    // Get a reference to the HTML element you want to select
    // it will a list of all elements which have the class name grid-cell
    
    const elements = document.getElementsByClassName("grid-cell");

            // Add click event listeners to all elements with the class
            for (const element of elements) {
                
                // create obstacles while hovering and pressing mouse
                var flag = false; 
                
                window.onmouseup = () => { flag = false; }
                element.onmouseover = () => {
                    coords = element.id.split('-').slice(1,);
                    if(!process_running && !obstacles_process_ended && element && flag && obstacles_flag && (coords[0] != searchpoint_pos[0] || coords[1] != searchpoint_pos[1]) && (coords[0] != startpoint_pos[0] || coords[1] != startpoint_pos[1])){
                        element.className = "node-wall";
                        element.style.backgroundColor = "#2b1b23";
                        element.style.borderColor = "#2b1b23";
                        var temp = coords[0] + "-" + coords[1];
                        walls.add(temp);
                        console.log(obstacles_process_ended);
                    }
                    }
                element.onmousedown = () => { flag = true; }
                

                // create startpoint
                element.addEventListener("click", function(){
                    coords = element.id.split('-').slice(1,);
                    console.log(numberStartpoint);
                    if(!process_running && startpoint_flag && numberStartpoint == 0 && (coords[0] != searchpoint_pos[0] || coords[1] != searchpoint_pos[1]) && (coords[0] != startpoint_pos[0] || coords[1] != startpoint_pos[1]) && (!walls.has(coords[0]+"-"+coords[1]))){
                        element.style.backgroundColor = "#66CCFF";
                        startpoint_pos = element.id.split('-').slice(1,);
                        numberStartpoint += 1;
                    }
                });

                // create searchpoint
                element.addEventListener("click", function(){
                    coords = element.id.split('-').slice(1,);
                    if(!process_running && searchpoint_flag && numberSearchpoint == 0 && (coords[0] != searchpoint_pos[0] || coords[1] != searchpoint_pos[1]) && (coords[0] != startpoint_pos[0] || coords[1] != startpoint_pos[1]) && (coords[0] != startpoint_pos[0] || coords[1] != startpoint_pos[1]) && (!walls.has(coords[0]+"-"+coords[1]))){
                        searchpoint_pos = element.id.split('-').slice(1,);
                        let new_eye = document.createElement("div");
                        element.appendChild(new_eye);
                        new_eye.className = "eye";
                        new_eye.id = "eye0";
                        

                        numberSearchpoint += 1;
                    }
                });

                // create delete obstacles function
            }
});
