
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function(event) {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (username === '' || password === '') {
            alert('Please enter both username and password.');
            event.preventDefault();
        }
        // Additional validation logic can be added here
    });
});