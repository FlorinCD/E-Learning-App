const hashmapSize = 7;  // Number of buckets
let hashmap = Array(hashmapSize).fill().map(() => null); // Initialize buckets with null

// Simple hash function to hash the keys
function hash(key) {
    let hashValue = 0;
    for (let char of key) {
        hashValue += char.charCodeAt(0);
    }
    return hashValue % hashmapSize;
}

// Function to add key-value pairs to the hashmap
function addKeyValue() {
    const key = document.getElementById('key').value;
    const value = document.getElementById('value').value;

    if (key === '' || value === '') {
        alert('Please enter both key and value.');
        return;
    }

    let index = hash(key);
    let startIndex = index;
    let inserted = false;

    while (!inserted) {
        if (hashmap[index] === null || hashmap[index].key === key) {
            hashmap[index] = { key, value };
            inserted = true;
        } else {
            index = (index + 1) % hashmapSize;
            if (index === startIndex) {
                alert('Hashmap is full.');
                return;
            }
        }
    }
    renderHashmap();
}

// Function to render the hashmap
function renderHashmap() {
    const hashmapContainer = document.getElementById('hashmap');
    hashmapContainer.innerHTML = ''; // Clear existing content

    hashmap.forEach((bucket, index) => {
        const bucketDiv = document.createElement('div');
        bucketDiv.className = 'bucket';
        bucketDiv.setAttribute('data-index', index);

        if (bucket !== null) {
            const keyValueDiv = document.createElement('div');
            keyValueDiv.className = 'key-value';
            keyValueDiv.innerHTML = `<strong>${bucket.key}</strong>: ${bucket.value}`;
            bucketDiv.appendChild(keyValueDiv);
        }

        hashmapContainer.appendChild(bucketDiv);
    });

    document.getElementById('key').value = '';
    document.getElementById('value').value = '';
}

// Initial render
renderHashmap();
