const queue = [];

function enqueue() {
    const elementInput = document.getElementById('elementInput');
    const value = elementInput.value.trim();

    if (value === '') {
        alert('Please enter an element.');
        return;
    }

    queue.push(value);
    elementInput.value = '';
    renderQueue();
}

function dequeue() {
    if (queue.length === 0) {
        alert('Queue is empty.');
        return;
    }

    queue.shift();
    renderQueue();
}

function renderQueue() {
    const queueContainer = document.getElementById('queueContainer');
    queueContainer.innerHTML = '';

    queue.forEach((element) => {
        const queueElement = document.createElement('div');
        queueElement.className = 'queue-element';
        queueElement.textContent = element;
        queueContainer.appendChild(queueElement);
    });

    document.getElementById('elementInput').value = '';
}

// Initial render
renderQueue();
