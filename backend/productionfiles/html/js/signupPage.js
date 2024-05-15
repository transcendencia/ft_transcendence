// Add event listener to the sign-up form
const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', handleSignup);

// Handle form submission
function handleSignup(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);

    // Make a POST request to the sign-up API
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
        handleSuccessfulSignup(data);
    })
    .catch(error => {
        console.error('There was a problem with the sign-up:', error);
        // Display error message to the user
    });
}

// Function to handle successful sign-up
function handleSuccessfulSignup(data) {
    // Assuming you have a function to store the token and user data in local storage
    storeUserData(data.token, data.user);
    // Assuming you have a function to redirect the user to another page
    redirectToHomePage();
}
