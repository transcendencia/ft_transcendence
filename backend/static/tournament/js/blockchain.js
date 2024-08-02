const blockchainWindow = document.querySelectorAll(".enterPasswordWindow")[2];
const showTournamentResult = document.getElementById("showTournamentResult");
const blockingPanel = document.getElementById('blockingPanel');

showTournamentResult.addEventListener('click', async function() {
    blockchainWindow.classList.toggle("showRectangle");
	blockingPanel.classList.add("show");
    const allTournamentTab = document.getElementById('allTournamentTab');
    allTournamentTab.innerHTML = "";
    getAllTournaments().then(tournaments => {
        if (tournaments) {
            tournaments.forEach(tournament => {
                console.log("tournament: ", tournament);
                const title = document.createElement('h2');
                const hyperTextHash = document.createElement('a');
                hyperTextHash.textContent = "Tournament " + tournament.id + ":";
                hyperTextHash.href = "https://sepolia.etherscan.io/tx/" + tournament.transaction_hash;
                hyperTextHash.target = "_blank";
                hyperTextHash.style.textDecoration = "none";
                title.appendChild(hyperTextHash);
                allTournamentTab.appendChild(title);    
                tournament.matches.map(match => {
                    const matchText = document.createElement('p');
                    let player2 = match.isPlayer2NoPlayer ? "no player" : match.player2Id;
                    let player3 = match.isPlayer3NoPlayer ? "" : match.player3Id;
                    if (player3 == "")
                        matchText.textContent = "   " + match.tournamentPhase + " player 1 id: " + match.player1Id + " " + match.scorePlayer1 + " vs " + match.scorePlayer2 +  " player 2 id: " + player2;
                    else
                        matchText.textContent = "   " + match.tournamentPhase + " player 1 id: " + match.player1Id + " " + match.scorePlayer1 + " vs " + match.scorePlayer2 + " player 2 id: " + player2 + " player 3 id: " + player3;
                    allTournamentTab.appendChild(matchText);
                })
            });
        }
    }); 
});

const closeBlockchainPanel = document.getElementById("closeBlockchainPanel");

closeBlockchainPanel.addEventListener('click', async function() {
    blockchainWindow.classList.remove("showRectangle");
    blockingPanel.classList.remove('show');
});


async function fetchTournamentData(tournamentId) {
    try {
        const response = await fetch(`/get_tournament/${tournamentId}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === 'success') {
            const tournamentData = data.tournament_data;
            console.log('Tournament Data:', tournamentData);
            return tournamentData;
        } else {
            console.error('Error:', data.message);
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Fetch Error:', error.message);
    }
}

export function createTournament(matches) {
    fetch('/create_tournament/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ matches })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();  // Parse the JSON response
    })
    .then(result => {
        if (result.status === 'success') {
            console.log('Tournament created successfully');
            console.log('Transaction hash:', result.transaction_hash);
        } else {
            console.error('Error creating tournament:', result.message);
        }
    })
    .catch(error => {
        console.error('Error in createTournament:', error);
    });
}

async function getAllTournaments() {
    const token = sessionStorage.getItem('host_auth_token');
    try {
        const response = await fetch('/all-tournaments/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            }
        });
        if (response.status === 403) {  
            return null;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === 'success') {
            return data.tournaments;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

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