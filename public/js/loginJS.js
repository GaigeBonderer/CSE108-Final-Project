// loginJS.js

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the traditional form submission

    var formData = new FormData(this);
    var encodedData = new URLSearchParams();
    for (const pair of formData) {
        encodedData.append(pair[0], pair[1]);
    }

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: encodedData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect; // Redirect if login is successful
        } else {
            alert(data.message); // Show an alert box if there's an error
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to process the request.'); // Alert if there's a network or server error
    });
});

document.getElementById('signupButton').addEventListener('click', function() {
    window.location.href = '/signup';
});