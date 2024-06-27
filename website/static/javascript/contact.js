document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission
        
        // Form data
        const name = form.elements['name'].value;
        const email = form.elements['email'].value;
        const subject = form.elements['subject'].value;
        const message = form.elements['message'].value;
        const data = {'name': name, 'email': email, 'subject': subject, 'message': message};
        const currentUrl = window.location.href;

        // Simple validation
        if (name && email && subject && message) {
            alert('Your message has been sent!');
            form.reset(); // Clear form fields
        } else {
            alert('Please fill in all fields.');
        }

        fetch(currentUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(data) // Send the text as JSON data
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            console.log('Response from server:', data);
            // Handle the response from the server if needed
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle errors if any
        });
    });
});
