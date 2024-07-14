import { moveCameraToFrontOfCockpit } from "./signUpPage.js";
import { showPage } from "./showPages.js";
import { alien1, alien2, alien3, spaceShip, spaceShipInt} from "./objs.js";
import { TranslateAllTexts, currentLanguage, languageIconsClicked, setlanguageIconsClicked, setCurrentLanguage, getTranslatedText} from "./translatePages.js";
import { gameState } from "../../game/js/main.js";
import { changeGraphics, toggleGameStarted, guestLoggedIn } from "./arenaPage.js";
import { startAnimation, toggleBlurDisplay, toggleEscapeContainerVisibility, togglePause, toggleLobbyStart, bluelight, createUserBadge, scene, swipeLeftSideContainer, whitelight} from "./main.js";
import { updateUserLanguage, updateUserStatus, get_friends_list, getProfileInfo, populateProfileInfos} from "./userManagement.js";
import { resetOutline } from "./planetIntersection.js";
import { togglePlanet } from "./enterPlanet.js";

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

if (signupHereButton.addEventListener('click', function() {
    moveCameraToFrontOfCockpit('signUpPage');
}));

graphicsIcons.forEach(function(icon) {
    icon.addEventListener('click', function () {
        if (icon.id === 'graphicsIcon1' && gameState.graphics != 'low') {
            gameState.graphicsNeedToChange = true;
            gameState.graphics = 'low';
        }
        if (icon.id === 'graphicsIcon2' && gameState.graphics != 'medium') {
            gameState.graphicsNeedToChange = true;
            gameState.graphics = 'medium';
        }
        if (icon.id === 'graphicsIcon3' && gameState.graphics != 'high') {
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

function updateGraphicsIcon(mode) {
    graphicsIcons.forEach(function(otherIcon) {
        removeGlow(otherIcon.id, 'redGlow');
    });
    if (mode === "low")
    addGlow("graphicsIcon1", 'redGlow');
    else if (mode === "medium")
        addGlow("graphicsIcon2", 'redGlow');
    else if (mode === "high")
        addGlow("graphicsIcon3", 'redGlow');
}

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
        const token = sessionStorage.getItem('host_auth_token');
        if (token && currentLanguage !== icon.id) {
            updateUserLanguage(icon.id);
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

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', handleLoginSubmit);

function handleLoginSubmit(event) {
    event.preventDefault();

    const formData = new FormData(this);
    handleLogin(formData);
}

// Handle form submission
export async function handleLogin(formData) {
    if (sessionStorage.getItem("hostLoggedIn") === null) {
        sessionStorage.setItem("hostLoggedIn", 'false');
    }

    const hostLoggedIn = sessionStorage.getItem("hostLoggedIn");

    formData.append('hostLoggedIn', hostLoggedIn);
    if (hostLoggedIn === 'false') {
        formData.append('language', currentLanguage);
        formData.append('languageClicked', languageIconsClicked);
    }

    setlanguageIconsClicked(false);

    return new Promise((resolve, reject) => {
        fetch('login_page/', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            let guest_token = null;
            console.log(data.status);
            if (data.status === "success") {
                if (hostLoggedIn === 'false') {
                    //passer avec session storage et id pour avoir plusieur personne de connecter sur plusieur fenetre

                    sessionStorage.setItem("hostLoggedIn", 'true');
                    sessionStorage.setItem("host_auth_token", data.token);
                    sessionStorage.setItem("host_id", data.id);
                    
                    setCurrentLanguage(data.language.slice(0, 2));
                    setEscapeLanguageVisual();
                    get_friends_list();
                    getProfileInfo(sessionStorage.getItem("host_id"))
                    .then(data => {
                        populateProfileInfos(data);
                        createUserBadge(data, "playersConnHostBadge")
                    })
                    TranslateAllTexts();
                    getGameInfo();
                    changeGraphics(data.graphic_mode);
                    updateGraphicsIcon(data.graphic_mode);
                    showPage('none');
                    startAnimation();
                    emptyLoginField();
                } else {
                    guest_token = data.token;
                }
                resolve(guest_token);
            } else {
                console.log("failed login", data);
                if (hostLoggedIn === 'false')
                    document.getElementById('messageContainer').innerText = getTranslatedText(data.msg_code);
                else if (hostLoggedIn === 'true')
                    document.getElementById('errorLogGuest').innerText = getTranslatedText(data.msg_code);
                resolve(null);
            }
        })
        .catch(error => {
            console.error('Erreur :', error);
            reject(error);
        });
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
    if (thirdPlayer === null)
        scoreAndThirdPlayer.innerHTML = `<div class="matchScore" style="border-color:  ${borderColor}; background-color: ${bg2Color};">${scorePlayer1} - ${scorePlayer2}</div><div class="thirdPlayer">No Third Player</div>`;
    else scoreAndThirdPlayer.innerHTML = `<div class="matchScore" style="border-color:  ${borderColor}; background-color: ${bg2Color};">${scorePlayer1} - ${scorePlayer2}</div><div class="thirdPlayer">Third Player : ${thirdPlayer}</div>`;
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

export function clearMatchBlocks() {
    const hostHistory = document.getElementById('hostHistory');
    const searchedUserHistory = document.getElementById('searchedUserHistory');
    hostHistory.innerHTML = '';
    searchedUserHistory.innerHTML = '';
}

export function getGameInfo() {
	const token = sessionStorage.getItem('host_auth_token');
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
const disconnectButton = document.getElementById("disconnectButton");
disconnectButton.addEventListener("click", () => {
    handleLogout(sessionStorage.getItem('host_id'), sessionStorage.getItem('host_auth_token')); 
    toggleEscapeContainerVisibility();
});

function resetHTMLelements(){
    document.querySelector(".gameUI").style.visibility = 'hidden';
    document.getElementsByClassName("bluebar")[0].style.opacity = 0;
    document.getElementById('c4').style.display = 'block';
    document.getElementById('c3').style.display = 'none';
    document.getElementById('c1').style.display = 'none';
}


function handleLogout(userId, token) {
    // Disconnect all the guest
    if (gameState.inGame)
        togglePlanet();
    logoutGuest(userId);
    // Disconnect the host
    updateUserStatus('offline', token)
    .then(() => {
        sessionStorage.clear();
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
    if (gameState.inGame) {
        gameState.inGame = false;
        gameState.inLobby = true;
        toggleEscapeContainerVisibility(true);
        toggleGameStarted();
        if (gameState.arena.game.user2.isBot)
            gameState.arena.bot.deactivateBot();
        resetHTMLelements();
    }
    else
        togglePause();
    spaceShip.rotation.set(0, 0, 0);
    spaceShip.position.set(0, 0, -1293.5);
    setTimeout(() => {
        toggleBlurDisplay(true);
        toggleEscapeContainerVisibility(true);
        resetOutline();
        spaceShipInt.visible = true;
        showPage('loginPage');
        toggleLobbyStart();
        swipeLeftSideContainer('-40%');
        scene.add(bluelight);
        scene.remove(whitelight);
    }, 50);
};

export function logoutGuest(userId) {
    if (userId === sessionStorage.getItem('host_id')) {
        guestLoggedIn.forEach(user => {
            updateUserStatus('offline', user[1]);
        });
    }
    guestLoggedIn.splice(0, guestLoggedIn.length);
}

window.addEventListener('beforeunload', function (event) {
    const token = sessionStorage.getItem('host_auth_token');
    if (token)
        handleLogout(sessionStorage.getItem('host_id'), token);
});

// window.addEventListener('beforeunload', function () {
//     if (sessionStorage.getItem('host_auth_token')) 
//         handleLogout(sessionStorage.getItem('host_id'), token);
// });

export function emptyLoginField() {
    document.getElementById('messageContainer').innerText = '';
    document.getElementById('usernameLoginInput').value = '';
    document.getElementById('passwordLoginInput').value = '';
}

