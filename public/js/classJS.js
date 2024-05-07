document.addEventListener('DOMContentLoaded', function() {
    // Extract userID from the URL
    const userId = window.location.pathname.split('/').pop();

    // Fetch user data from the server
    fetch(`/class/user/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                document.getElementById('username').textContent = data.username;
            } else {
                console.error('Failed to fetch username:', data.message);
                alert('Failed to fetch user data. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to process the request.');
        });

    const options = document.querySelectorAll('.class-option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            options.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    document.getElementById('enterDungeon').addEventListener('click', function() {
        const selectedClass = document.querySelector('.class-option.selected');
        if (!selectedClass) {
            alert('Please select a class!');
            return;
        }
        const classId = selectedClass.id;
        window.location.href = `/game/${userId}/${classId}`;
    });
});