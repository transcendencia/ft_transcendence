import { moveCameraToFrontOfCockpit } from "./signUpPage.js";
import { showPage } from "./showPages.js";
import { alien1, alien2, alien3, spaceShip, spaceShipInt} from "./objs.js";
import { TranslateAllTexts, currentLanguage, languageIconsClicked, setlanguageIconsClicked, setCurrentLanguage, getTranslatedText} from "./translatePages.js";
import { keyDown, swapToFullScreen, gameState } from "../../game/js/main.js";
import { changeGraphics, toggleGameStarted, guestLoggedIn, initArenaPlanet, refreshUserListIfChanged } from "./arenaPage.js";
import { startAnimation, toggleBlurDisplay, toggleEscapeContainerVisibility, togglePause, toggleLobbyStart, bluelight, createUserBadge, scene, swipeLeftSideContainer, whitelight, displayHostEscapePage, removeContainerVisible, escapeBG, structure, resetGameEscape , toggleRSContainerVisibility, escapeContainerVisible, lobbyStart, panelRemove} from "./main.js";
import { updateUserLanguage, updateUserStatus, get_friends_list, getProfileInfo, populateProfileInfos} from "./userManagement.js";
import { planetInRange, resetOutline } from "./planetIntersection.js";
import { rsContVisible } from "./main.js";
import { checkEach5Sec, landedOnPlanet, togglePlanet, setCheckerToInterval } from "./enterPlanet.js";
import { returnToHost } from "./userPage.js";
import { changeTournamentStatus, resetTournament } from "../../tournament/js/newTournament.js";

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

function reactivateLoginFields() {
    document.getElementById('usernameLoginInput').disabled = false;
    document.getElementById('passwordLoginInput').disabled = false;
}

function disableLoginFields() {
    document.getElementById('usernameLoginInput').disabled = true;
    document.getElementById('passwordLoginInput').disabled = true;
}

function removeLastUserInfoConts() {
    const container = document.getElementById('lsCont');
    const hostBadge = document.getElementById('playersConnHostBadge');
    let currentElement = container.lastElementChild;

    while (currentElement && currentElement !== hostBadge) {
        if (currentElement.classList.contains('userInfoCont')) {
            const elementToRemove = currentElement;
            currentElement = currentElement.previousElementSibling;
            container.removeChild(elementToRemove);
        } else {
            break;
        }
    }
}

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', handleLoginSubmit);

function handleLoginSubmit(event) {
    event.preventDefault();


    const formData = new FormData(this);
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    handleLogin(formData)
}

export async function handleLogin(formData) {
    disableLoginFields();

    const hostLoggedIn = initializeHostLoggedIn();
    const submitButton = document.getElementById('loginButton');

    appendFormData(formData, hostLoggedIn);

    setlanguageIconsClicked(false);
    const messageContainerId = (hostLoggedIn === 'true') ? 'errorLogGuest' : 'messageContainer';
    document.getElementById(messageContainerId).innerText = '';

    try {
        const response = await fetch('login_page/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: formData
        });

        if (!response.ok) {
            const err = await response.json();
            throw err;
        }

        const data = await response.json();
        
        let guest_token = null;
        if (hostLoggedIn === 'false') {
            handleHostLogin(data);
        } else {
            guest_token = data.token;
        }
        
        return guest_token;
    } catch (error) {
        error;
        document.getElementById(messageContainerId).innerText = getTranslatedText(error.msg_code);
    } finally {
        submitButton.disabled = false;
        reactivateLoginFields();
    }
}

function initializeHostLoggedIn() {
    if (sessionStorage.getItem("hostLoggedIn") === null) {
        sessionStorage.setItem("hostLoggedIn", 'false');
    }
    return sessionStorage.getItem("hostLoggedIn");
}

function appendFormData(formData, hostLoggedIn) {
    formData.append('hostLoggedIn', hostLoggedIn);
    if (hostLoggedIn === 'false') {
        formData.append('language', currentLanguage);
        formData.append('languageClicked', languageIconsClicked);
    }
}

function handleHostLogin(data){
    sessionStorage.setItem("hostLoggedIn", 'true');
    sessionStorage.setItem("host_auth_token", data.token);
    sessionStorage.setItem("host_id", data.id);
                
    setCurrentLanguage(data.language.slice(0, 2));
    setEscapeLanguageVisual();
    
    getProfileInfo(sessionStorage.getItem("host_id"))
    .then(data => {
        populateProfileInfos(data);
        createUserBadge(data, "playersConnHostBadge");
        removeLastUserInfoConts();
    })
    .catch(error => {
        error;
    });
    getGameInfo();
                
    changeGraphics(data.graphic_mode);
    updateGraphicsIcon(data.graphic_mode);
    
    TranslateAllTexts();
    showPage('none');
    startAnimation();

    emptyLoginField();
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
    userHI1.innerHTML = `<div class="imgFrame" style="height: 40px; width: 50px; margin-right: 5px; border-color: ${borderColor};"><img src="data:image/png;base64,${player1ImgSrc}"></div>${player1Name}`;
 
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
    userHI2.innerHTML = `${player2Name}<div class="imgFrame" style="height: 40px; width: 50px; margin-left: 5px; border-color: ${borderColor};"><img src="data:image/png;base64,${player2ImgSrc}"></div>`;
  
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
			error;
		});
}

function resetHTMLelements(){
    document.querySelector(".gameUI").style.visibility = 'hidden';
    document.getElementById('c4').style.display = 'block';
    document.getElementById('c3').style.display = 'none';
    document.getElementById('c1').style.display = 'none';
}


export let isLoggingOut = false;

export function backToLobby(historyArrow = false) {
    if (historyArrow) {
        keyDown['e'] = true;
    } else {
        resetGameEscape();
    }
    // window.location.hash = "#galaxy";
    history.replaceState(null, null, "#galaxy");
    setTimeout(() => {
        keyDown['e'] = false;
        gameState.eKeyWasPressed = false;
        gameState.arena.displayBackPanel(true);
        gameState.arena.thirdPlayer.deactivateThirdPlayer();
        gameState.arena.idleCameraAnimation();
        gameState.arena.swapToFullScreen();
        gameState.arena.resetPoint();
        gameState.arena.game.leftScore = 0;
        gameState.arena.game.rightScore = 0;
        gameState.arena.resetParticles();
        gameState.arena.resetUI();
        setCheckerToInterval(setInterval(refreshUserListIfChanged, 5000));
    }, 100);

}


/*LOGOUT*/
export async function handleLogout(userId, token) {
    if (!userId || !token || isLoggingOut) 
        return;
    isLoggingOut = true;
    history.pushState(null, null, window.location.href);
    await new Promise(resolve => {
        gameState.paused = false;
        if (rsContVisible)
            toggleRSContainerVisibility();
        if (escapeContainerVisible) {
            togglePause();
            toggleBlurDisplay(true);
            toggleEscapeContainerVisibility();
        }
        if (landedOnPlanet) {
            if (planetInRange.name === "settings")
                returnToHost();
            clearInterval(checkEach5Sec);
            togglePlanet(/* toggleRsContainer: */ false);
            panelRemove();
        }
        showPage('loginPage');
        setSpaceShipToLoginState();
        swipeLeftSideContainer('-40%');
        changeTournamentStatus(2);
        resetTournament();
        logoutAllGuest(userId);
        logoutUser(token);
        reactivateLoginFields();
        clearHostValuesFromSessionStorage();
        setTimeout(() => {
            toggleLobbyStart();
            gameState.paused = false;
            resolve();
        }, 50);
    });
    isLoggingOut = false;
}

export function setSpaceShipToLoginState() {
    spaceShip.rotation.set(0, 0, 0);
    spaceShip.position.set(0, 0, -1293.5);
    spaceShipInt.visible = true;
    scene.add(bluelight);
    scene.remove(whitelight);
}

const disconnectButton = document.getElementById("disconnectButton");
disconnectButton.addEventListener("click", () => {
    if (gameState.inGame)
        backToLobby();
    else
        handleLogout(sessionStorage.getItem('host_id'), sessionStorage.getItem('host_auth_token'));
});

function printXYZofVector(vector) {
    console.log("x: ", vector.x, "y: ", vector.y, "z: ", vector.z);
}

export async function logoutUser(token) {
    if (!token)
        return;
    fetch('/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        keepalive: true,
    })
    .then(response => {
        if (!response.ok)
            throw new Error('Erreur lors du logout');
    })
    .catch(error => {
        error;
    });
}

export function logoutAllGuest(userId) {
    if (userId === sessionStorage.getItem('host_id')) {
        guestLoggedIn.forEach(user => {
            logoutUser(user[1]);
        });
        guestLoggedIn.splice(0, guestLoggedIn.length);
    }
}

// window.addEventListener('beforeunload', async function (event) {
//     const token = sessionStorage.getItem('host_auth_token');
//     const hostId = sessionStorage.getItem('host_id');
    
//     logoutAllGuest(hostId);
//     logoutUser(token);
//     clearHostValuesFromSessionStorage();
// });

function isFirefox() {
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  }

export function clearHostValuesFromSessionStorage() {
    sessionStorage.removeItem("hostLoggedIn");
    sessionStorage.removeItem("host_auth_token");
    sessionStorage.removeItem("host_id");
}

function synchronousLogout(token) {
    if (!token) return;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", '/logout/', false);  // false makes it synchronous
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Token ${token}`);
    xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    xhr.send();

    if (xhr.status !== 200) {
        console.error('Error during synchronous logout:', xhr.statusText);
    }
}

function handleBeforeUnload(event) {
    const isLoggingOut = localStorage.getItem('logging_out');
    if (!isLoggingOut) {
        console.log("logging out");
        const token = sessionStorage.getItem('host_auth_token');
        const hostId = sessionStorage.getItem('host_id');
        
        if (token && hostId) {
            localStorage.setItem('logging_out', 'true');
            guestLoggedIn.forEach(user => {
                synchronousLogout(user[1]);
            });
            synchronousLogout(token);
            clearHostValuesFromSessionStorage();
            localStorage.removeItem('logging_out');
        }
    }
    event.returnValue = '';
}

if (isFirefox())
    window.addEventListener('beforeunload', handleBeforeUnload);
else
{
    window.addEventListener('beforeunload', async function (event) {
    const token = sessionStorage.getItem('host_auth_token');
    const hostId = sessionStorage.getItem('host_id');
    
    logoutAllGuest(hostId);
    logoutUser(token);
    clearHostValuesFromSessionStorage();
    });
}


export function emptyLoginField() {
    document.getElementById('messageContainer').innerText = '';
    document.getElementById('usernameLoginInput').value = '';
    document.getElementById('passwordLoginInput').value = '';
}

