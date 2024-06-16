let stack = []; // Array to simulate stack

// Function to push an item onto the stack
function pushStack() {
    const stackValue = document.getElementById('stackValue').value;
    if (stackValue === '') {
        alert('Please enter a value to push onto the stack.');
        return;
    }
    stack.push(stackValue);
    renderStack();
    document.getElementById('stackValue').value = ''; // Clear input field
}

// Function to pop an item from the stack
function popStack() {
    if (stack.length === 0) {
        alert('No items to pop from the stack.');
        return;
    }
    stack.pop(); // Remove the last element
    renderStack();
}

// Function to render the stack
function renderStack() {
    const stackContainer = document.getElementById('stackContainer');
    stackContainer.innerHTML = ''; // Clear existing stack items

    stack.forEach((value, index) => {
        const stackItem = document.createElement('div');
        stackItem.className = 'stack-item';
        stackItem.textContent = value;
        stackContainer.appendChild(stackItem);
    });
}

// Initial render
renderStack();
