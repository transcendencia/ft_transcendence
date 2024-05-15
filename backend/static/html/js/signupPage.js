// Add event listener to the sign-up form
const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', handleSignup);

// Handle form submission
function handleSignup(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    fetch('signup/', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Rediriger 
		// Store dans le local storage
    })
    .catch(error => {
        console.error('There was a problem with the sign-up:', error);
    });
}

