async function createGame() {
    const csrfToken = getCookie('csrftoken');  // You need to handle CSRF tokens if CSRF protection is enabled
    const response = await fetch('/add_game/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken  // Include CSRF token in the request headers
        },
        body: JSON.stringify({
            player1: 1,  // Replace with the actual player1 ID
            player2: 2,  // Replace with the actual player2 ID
            player3: 3,  // Replace with the actual player3 ID (optional)
            scorePlayer1: 3,
            scorePlayer2: 0,
            gameplayMode: 'Classic'
        })
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Game created successfully with ID:', data.game_id);
    } else {
        console.error('Failed to create game');
    }
}

// Utility function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Call the createGame function (for example, on form submission)
document.querySelector('#createGameForm').addEventListener('submit', function(event) {
    event.preventDefault();
    createGame();
});