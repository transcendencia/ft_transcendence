import { moveCameraToFrontOfCockpit } from "./signUpPage.js";
import { showPage } from "./showPages.js";
import { alien1, alien2, alien3} from "./objs.js";
import { TranslateAllTexts, currentLanguage, languageIconsClicked, setlanguageIconsClicked, setCurrentLanguage, getTranslatedText} from "./translatePages.js";
import { gameState } from "../../game/js/main.js";
import { RenderAllUsersInList } from "./arenaPage.js";


import { startAnimation } from "./main.js";
// import { changeGraphics } from "./arenaPage.js";

function addGlow(elementId, glow) {
    var element = document.getElementById(elementId);
    if (element)
        element.classList.add(glow);
}

function removeGlow(elementId, glow) {
    var element = document.getElementById(elementId);
    if (element)
    element.classList.remove(glow);
}

let languageIcons = document.querySelectorAll('.languageIcon');
let graphicsIcons = document.querySelectorAll('.graphicsIcon');
const signupHereButton = document.querySelector('.actionCont');
signupHereButton.addEventListener('click', function() {
    moveCameraToFrontOfCockpit();
});

showPage('loginPage');


graphicsIcons.forEach(function(icon) {
    icon.addEventListener('click', function () {
        if (icon.id === 'graphicsIcon1' && gameState.graphics != 'low')
        {
            gameState.graphicsNeedToChange = true;
            gameState.graphics = 'low';
        }
        if (icon.id === 'graphicsIcon2' && gameState.graphics != 'medium')
        {
            gameState.graphicsNeedToChange = true;
            gameState.graphics = 'medium';
        }
        if (icon.id === 'graphicsIcon3' && gameState.graphics != 'high')
        {
            gameState.graphicsNeedToChange = true;
            gameState.graphics = 'high';
        }
        addGlow(icon.id, 'redGlow');
        graphicsIcons.forEach(function(otherIcon) {
        if (otherIcon != icon)
            removeGlow(otherIcon.id, 'redGlow');
        });
    });
});

 export function getCookie(name) {
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

// Sélection du bouton par son ID
// var disconnectButton = document.getElementById("disconnectButton");

// // Ajout d'un gestionnaire d'événements pour le clic sur le bouton
// disconnectButton.addEventListener("click", function() {
//     localStorage.clear();
//     console.log("Le bouton Disconnect a été cliqué !");
// });

languageIcons.forEach(function(icon) {
    icon.addEventListener('click', function () {
        if (icon.id === 'fr' || icon.id == 'fr1') {
            alien1.visible = false;
            alien2.visible = true;
            alien3.visible = false;
        }
        if (icon.id === 'en'|| icon.id == 'en1') {
            alien1.visible = true;
            alien2.visible = false;
            alien3.visible = false;
        }
        if (icon.id === 'es'|| icon.id == 'es1') {
            alien1.visible = false;
            alien2.visible = false;
            alien3.visible = true;
        }
        addGlow(icon.id, 'glow');
        setlanguageIconsClicked(true);
        setCurrentLanguage(icon.id.slice(0, 2));
        icon.querySelector('.flag').style.opacity = 1;
        icon.querySelector('.icon').style.opacity = 0;
        TranslateAllTexts();
        languageIcons.forEach(function(otherIcon) {
            if (otherIcon != icon) {
                removeGlow(otherIcon.id, 'glow');
                otherIcon.querySelector('.flag').style.opacity = 0;
                otherIcon.querySelector('.icon').style.opacity = 1;
            }
        });
        
        // Send POST request to change user language in the back if user is logged in
        const token = localStorage.getItem('host_auth_token');
        if (token) {
            fetch('change_language/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ language: currentLanguage })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la modification de la langue');
                }
            })
            .catch(error => {
                console.error('Erreur :', error);
            });
        }
    });
    //init english flag
    if (icon.id === currentLanguage) {
        icon.querySelector('.flag').style.opacity = 1;
        icon.querySelector('.icon').style.opacity = 0;
    }

    icon.addEventListener('mouseenter', function () {
        icon.querySelector('.flag').style.opacity = 1;
        icon.querySelector('.icon').style.opacity = 0;
    });

    icon.addEventListener('mouseleave', function () {
        if (icon.id.slice(0, 2) !== currentLanguage) {
            icon.querySelector('.flag').style.opacity = 0;
            icon.querySelector('.icon').style.opacity = 1;
        }
    });
});

function setEscapeLanguageVisual() {
    addGlow(currentLanguage + '1', 'glow');
    const icon = document.getElementById(currentLanguage + '1');
    icon.querySelector('.flag').style.opacity = 1;
    icon.querySelector('.icon').style.opacity = 0;
}

// Add event listener to the loginForm
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', handleLogin);

// Handle form submission
function handleLogin(event) {
    event.preventDefault();

    const formData = new FormData(this);
    formData.append('language', currentLanguage);
    formData.append('languageClicked', languageIconsClicked);
    setlanguageIconsClicked(false);
    fetch('login_page/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == "succes") {
            localStorage.setItem("host_auth_token", data.token)
            setCurrentLanguage(data.language);
            setEscapeLanguageVisual();
            TranslateAllTexts();
            get_user_list();
            getProfileInfo();
            getGameInfo();
            showPage('none');
            startAnimation();
        } else 
            document.getElementById('messageContainer').innerText = data.message;
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
}

import { RenderUserMatch, RenderUserTournament} from "./arenaPage.js";

function getProfileInfo() {
	const token = localStorage.getItem('host_auth_token');
		fetch('get_profile_info/', {
		    method: 'GET',
			headers: {
				'Authorization': `Token ${token}`,
			}
		})
		.then(response => {
			if (!response.ok)
				throw new Error('Error lors de la recuperation des donne');
				return response.json();
		})
		.then(data=> {
			document.getElementById('username').textContent = data.profile_info.username;
			document.getElementById('bio').textContent = data.profile_info.bio;
			document.getElementById('profile_pic').src = data.profile_info.profile_picture;
            const basicStats = document.getElementById('winLoseTexts1');
            basicStats.innerHTML = `
                <div class="basicStats"> ${getTranslatedText('winLoseText1')} : 1</div>
                <div class="basicStats"> ${getTranslatedText('winLoseText2')} : 1</div>
                <div class="basicStats"> ${getTranslatedText('winLoseText3')} : 1</div>
                <div class="basicStats"> ${getTranslatedText('winLoseText4')} : 1</div>
            `;
            RenderUserMatch(data.profile_info);
            RenderUserTournament(data.profile_info);
		})
		.catch(error => {
			console.error('Erreur :', error);
		});
}

export function createMatchBlock(tournament, date, modeGame, player1Name, player1ImgSrc, scorePlayer1, scorePlayer2, player2Name, player2ImgSrc, thirdPlayer, victory, isHost = true) {

    let borderColor = '#ff3737';
    let bgColor = '#ff373777';
    let bg2Color = '#a3000087';
    if (victory) {
        borderColor = '#43ff43';
        bgColor = '#43ff4377';
        bg2Color = '#00ab00c0';
    }

    const matchBlock = document.createElement('div');
    matchBlock.classList.add('matchBlock');
    matchBlock.style.borderColor = borderColor;
    matchBlock.style.backgroundColor = bgColor;
  
    const firstLine = document.createElement('div');
    firstLine.classList.add('firstLine');
    firstLine.style.color = borderColor;
    firstLine.innerHTML = `<div id="type" style="width: 30%;">${tournament}</div><div class="date" id="date" style="border-color: ${borderColor}; background-color: ${bg2Color}">${date}</div><div id="mode" style="width: 30%;">${modeGame}</div>`;
  
    const secondLine = document.createElement('div');
    secondLine.classList.add('secondLine');
  
    const userHI1 = document.createElement('div');
    userHI1.classList.add('userHI');
    if (player1Name.length > 8)
        userHI1.setAttribute('text-length-mode', 'long');
    userHI1.innerHTML = `<div class="imgFrame" style="height: 40px; width: 50px; margin-right: 5px; border-color: ${borderColor};"><img src="${player1ImgSrc}"></div>${player1Name}`;
 
    const scoreAndThirdPlayer = document.createElement('div');
    scoreAndThirdPlayer.classList.add('scoreAndThirdPlayer');
    scoreAndThirdPlayer.innerHTML = `<div class="matchScore" style="border-color:  ${borderColor}; background-color: ${bg2Color};">${scorePlayer1} - ${scorePlayer2}</div><div class="thirdPlayer">Third Player : ${thirdPlayer}</div>`;
  
    const userHI2 = document.createElement('div');
    userHI2.classList.add('userHI');
    if (player2Name.length > 8)
        userHI2.setAttribute('text-length-mode', 'long');
    userHI2.style.justifyContent = 'flex-end';
    userHI2.innerHTML = `${player2Name}<div class="imgFrame" style="height: 40px; width: 50px; margin-left: 5px; border-color: ${borderColor};"><img src="${player2ImgSrc}"></div>`;
  
    // Append elements
    secondLine.appendChild(userHI1);
    secondLine.appendChild(scoreAndThirdPlayer);
    secondLine.appendChild(userHI2);
  
    matchBlock.appendChild(firstLine);
    matchBlock.appendChild(secondLine);
    
    let historyContainer = document.getElementById('hostHistory');
    if (!isHost)
        historyContainer = document.getElementById('searchedUserHistory');
    historyContainer.appendChild(matchBlock);
}

function getGameInfo() {
	const token = localStorage.getItem('host_auth_token');
		fetch('get_game_user/', {
		    method: 'GET',
			headers: {
				'Authorization': `Token ${token}`,
			}
		})
		.then(response => {
			if (!response.ok)
				throw new Error('Error lors de la recuperation des donnees');
				return response.json();
		})
		.then(data=> {
			data.games.forEach(game => {
                let winner = false;
                let player1;
                let player1Score;
                let player1Picture;
                let player2;
                let player2Score;
                let player2Picture;

                if (data.user_id === game.player1){
                    player1 = game.player1_username;
                    player1Score = game.scorePlayer1;
                    player1Picture = game.player1_profilePicture;
                    player2 = game.player2_username;
                    player2Score = game.scorePlayer2;
                    player2Picture = game.player2_profilePicture;
                    if (game.scorePlayer1 > game.scorePlayer2)
                        winner = true
                }
                else{
                    player1 = game.player2_username;
                    player1Score = game.scorePlayer2;
                    player1Picture = game.player2_profilePicture;
                    player2 = game.player1_username;
                    player2Score = game.scorePlayer1;
                    player2Picture = game.player1_profilePicture;
                    if (game.scorePlayer2 > game.scorePlayer1)
                        winner = true
                }
                createMatchBlock(game.gameplayMode, game.Date, game.modeGame, player1, player1Picture, player1Score, player2Score, player2, player2Picture, game.player3_username, winner);
            })
		})
		.catch(error => {
			console.error('Erreur :', error);
		});
}

// Logout
var disconnectButton = document.getElementById("disconnectButton");
disconnectButton.addEventListener("click", handleLogout);

function handleLogout() {
    updateUserStatus('offline');
    localStorage.clear();
};

function updateUserStatus(status) {
    const token = localStorage.getItem('host_auth_token');
    fetch('update_status/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ status: status })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du logout');
        }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
};

function getUserStatus() {
    const token = localStorage.getItem('host_auth_token');
    fetch('get_status/', {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};

export let userList;
import { RenderAllUsersTournament } from "./arenaPage.js";

export function get_user_list() {
    const token = localStorage.getItem('host_auth_token');
    fetch('get_user_list/', {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        userList = data;
        RenderAllUsersInList(data);
        RenderAllUsersTournament(data);
    })
    .catch(error => console.error('Error:', error));
};
