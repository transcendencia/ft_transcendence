import { getCookie } from "../../html/js/loginPage.js";

export async function createGame(player1Id, player2Id, player3Id, scorePlayer1, scorePlayer2, gameplayMode, modeGame, map, user1, user2, user3, gameTime) {
    const payload = {
        player1: player1Id,
        player2: player2Id,
        player3: player3Id,
        scorePlayer1: scorePlayer1,
        scorePlayer2: scorePlayer2,
        gameplayMode: gameplayMode,
        modeGame: modeGame,
        gameTime: gameTime,
        mapGame: map,
        user1: user1.toJson(),
        user2: user2.toJson(),
        user3: user3.toJson()
    };
    try {
        const token = sessionStorage.getItem('host_auth_token');

        const response = await fetch('/add_game/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')   
            },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            const data = await response.json();
        } else {
            console.error('Failed to create game');
        }
    } catch (error) {
        error;
    }
}
