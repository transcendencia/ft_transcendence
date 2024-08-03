import { getTranslatedText } from "../../html/js/translatePages.js";
import { getProfileInfoAsync } from "../../html/js/userManagement.js";

const blockchainWindow = document.querySelectorAll(".enterPasswordWindow")[2];
const showTournamentResult = document.getElementById("showTournamentResult");
const blockingPanel = document.getElementById('blockingPanel');

getTranslatedText('showTournamentText')
getTranslatedText('blockchainText')

showTournamentResult.addEventListener('click', async function() {
    blockchainWindow.classList.toggle("showRectangle");
	blockingPanel.classList.add("show");
    const allTournamentTab = document.getElementById('allTournamentTab');
    allTournamentTab.innerHTML = "";
    const tournaments = await getAllTournaments();
    if (tournaments) {
        for (const tournament of tournaments) {
            // console.log("tournament: ", tournament);
            const title = document.createElement('h2');
            const hyperTextHash = document.createElement('a');
            hyperTextHash.textContent = getTranslatedText('tournamentTitle') + " " + tournament.id + ":";
            hyperTextHash.href = "https://sepolia.etherscan.io/tx/" + tournament.transaction_hash;
            hyperTextHash.target = "_blank";
            hyperTextHash.style.textDecoration = "none";
            title.appendChild(hyperTextHash);
            allTournamentTab.appendChild(title);    
            for (const match of tournament.matches) {
                const matchText = document.createElement('div');
                let player1 = await getProfileInfoAsync(match.player1Id);
                player1 = player1 ? player1.profile_info.username : getTranslatedText('unknown');
                let player2 = getTranslatedText('noPlayer');
                if (!match.isPlayer2NoPlayer) {
                    player2 = await getProfileInfoAsync(match.player2Id);
                    player2 = player2 ? player2.profile_info.username : getTranslatedText('unknown');
                }
                let player3 = "";
                if (!match.isPlayer3NoPlayer) {
                    player3 = await getProfileInfoAsync(match.player3Id);
                    player3 = player3 ? player3.profile_info.username : getTranslatedText('unknown');
                }
                if (player3 == "")
                    matchText.innerHTML = `${match.tournamentPhase}: <span class="color-text">${player1}</span> ${match.scorePlayer1} vs ${match.scorePlayer2} <span class="color-text">${player2}</span>`;
                else
                    matchText.innerHTML = `${match.tournamentPhase}: <span class="color-text">${player1}</span> ${match.scorePlayer1} vs ${match.scorePlayer2} <span class="color-text">${player2}</span> ${getTranslatedText('thirdPlayer')}: <span class="color-text"> ${player3}</span>`;
                allTournamentTab.appendChild(matchText);
            }
        };
    }
});

const closeBlockchainPanel = document.getElementById("closeBlockchainPanel");

closeBlockchainPanel.addEventListener('click', async function() {
    blockchainWindow.classList.remove("showRectangle");
    blockingPanel.classList.remove('show');
});

export function createTournament(matches) {
    const token = sessionStorage.getItem('host_auth_token');

    fetch('/create_tournament/', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ matches })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
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