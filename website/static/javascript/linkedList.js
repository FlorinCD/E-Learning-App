// script.js
let linkedList = []; // Array to simulate linked list

// Function to add a node to the linked list
function addNode() {
    const nodeValue = document.getElementById('nodeValue').value;
    if (nodeValue === '') {
        alert('Please enter a value for the node.');
        return;
    }
    linkedList.push(nodeValue);
    renderLinkedList();
    document.getElementById('nodeValue').value = ''; // Clear input field
}

// Function to remove a node from the front of the linked list
function removeNode() {
    var inputVal = document.getElementById('nodeValue').value;
    if (linkedList.length === 0) {
        alert('No nodes to remove.');
        return;
    }
    else if(inputVal === ''){
        alert('Please enter the value of the node you want to delete!');
        return;
    }
    for(let i=0;i<linkedList.length-1;i++){
        if(linkedList[i] == inputVal){
            linkedList.splice(i, 1); // Remove the first occurence
        }
    }
    //linkedList.shift(); // Remove the first element
    renderLinkedList();
}

// Function to render the linked list
function renderLinkedList() {
    const linkedListContainer = document.getElementById('linkedList');
    linkedListContainer.innerHTML = ''; // Clear existing nodes

    linkedList.forEach((value, index) => {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'node';
        nodeDiv.textContent = value;

        linkedListContainer.appendChild(nodeDiv);

        if (index < linkedList.length - 1) {
            const arrowDiv = document.createElement('div');
            arrowDiv.className = 'arrow';
            linkedListContainer.appendChild(arrowDiv);
        }
    });
}

// Initial render
renderLinkedList();
