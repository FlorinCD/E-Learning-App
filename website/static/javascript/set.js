// Initialize a set to hold unique elements
let mySet = new Set();

// Function to add elements to the set
function addElement() {
    const inputElement = document.getElementById('elementInput');
    const value = inputElement.value.trim();

    if (value) {
        mySet.add(value);
        inputElement.value = '';
        renderSet();
    } else {
        alert('Please enter a valid element.');
    }
}

// Function to remove an element from the set
function removeElement(element) {
    mySet.delete(element);
    renderSet();
}

// Function to render the set
function renderSet() {
    const setContainer = document.getElementById('setContainer');
    setContainer.innerHTML = ''; // Clear previous content

    mySet.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'set-element';
        elementDiv.innerHTML = `<span>${element}</span><button onclick="removeElement('${element}')">×</button>`;
        setContainer.appendChild(elementDiv);
    });
}