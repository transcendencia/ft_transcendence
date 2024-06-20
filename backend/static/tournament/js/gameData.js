export async function createGame(player1Id, player2Id, player3Id, scorePlayer1, scorePlayer2, gameplayMode, modeGame, map, user1, user2, user3) {
    const csrfToken = getCookie('csrftoken');

    console.log(user1);
    console.log(modeGame);
    const payload = {
        player1: player1Id,
        player2: player2Id,
        player3: player3Id,
        scorePlayer1: scorePlayer1,
        scorePlayer2: scorePlayer2,
        gameplayMode: gameplayMode,
        modeGame: modeGame,
        mapGame: map,
        user1: user1.toJson(),
        user2: user2.toJson(),
        user3: user3.toJson()
    };
    try {
        const response = await fetch('/add_game/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken  // Include CSRF token in the request headers
            },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Game created successfully with ID:', data.game_id);
        } else {
            console.error('Failed to create game');
        }
    } catch (error) {
        console.error('Error creating game:', error);
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


