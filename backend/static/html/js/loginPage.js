import { moveCameraToFrontOfCockpit } from "./signUpPage.js";
import { showPage } from "./showPages.js";
import { alien1, alien2, alien3, spaceShip, spaceShipInt} from "./objs.js";
import { TranslateAllTexts, currentLanguage, languageIconsClicked, setlanguageIconsClicked, setCurrentLanguage, getTranslatedText} from "./translatePages.js";
import { gameState } from "../../game/js/main.js";
import { changeGraphics, toggleGameStarted, guestLoggedIn } from "./arenaPage.js";
import { startAnimation, toggleBlurDisplay, toggleEscapeContainerVisibility, togglePause, toggleLobbyStart, bluelight, createUserBadge, scene, swipeLeftSideContainer, whitelight, displayHostEscapePage, removeContainerVisible, escapeBG, structure, resetGameEscape , toggleRSContainerVisibility, escapeContainerVisible, lobbyStart} from "./main.js";
import { updateUserLanguage, updateUserStatus, get_friends_list, getProfileInfo, populateProfileInfos} from "./userManagement.js";
import { planetInRange, resetOutline } from "./planetIntersection.js";
import { rsContVisible } from "./main.js";
import { checkEach5Sec, landedOnPlanet, togglePlanet } from "./enterPlanet.js";
import { returnToHost } from "./userPage.js";
import { keyDown } from "../../game/js/main.js";

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

    // const formData = new FormData(this);
    // handleLogin(formData);


    const formData = new FormData(this);
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    handleLogin(formData)
}

function reactivateLoginFields() {
    document.getElementById('usernameLoginInput').disabled = false;
    document.getElementById('passwordLoginInput').disabled = false;
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

// Handle form submission
// Should I change it with a patch request
export async function handleLogin(formData) {
    document.getElementById('usernameLoginInput').disabled = true;
    document.getElementById('passwordLoginInput').disabled = true;
    if (sessionStorage.getItem("hostLoggedIn") === null) {
        sessionStorage.setItem("hostLoggedIn", 'false');
    }

    const hostLoggedIn = sessionStorage.getItem("hostLoggedIn")
    const submitButton = document.getElementById('loginButton');

    formData.append('hostLoggedIn', hostLoggedIn);
    if (hostLoggedIn === 'false') {
        formData.append('language', currentLanguage);
        formData.append('languageClicked', languageIconsClicked);
    }

    setlanguageIconsClicked(false);

    return new Promise((resolve, reject) => {
        fetch('login_page/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            let guest_token = null;
            const messageContainerId = (hostLoggedIn === 'true') ? 'errorLogGuest' : 'messageContainer';
            console.log(data.status);
            if (data.status === "success") {

                // console.log("hostLoggedIn", hostLoggedIn);
                if (hostLoggedIn === 'false') {

                    //ici
                    sessionStorage.setItem("hostLoggedIn", 'true');
                    sessionStorage.setItem("host_auth_token", data.token);
                    sessionStorage.setItem("host_id", data.id);
                    
                    setCurrentLanguage(data.language.slice(0, 2));
                    setEscapeLanguageVisual();
                    get_friends_list();
                    // console.log("host id:", sessionStorage.getItem("host_id"));
                    getProfileInfo(sessionStorage.getItem("host_id"))
                    .then(data => {
                        populateProfileInfos(data);
                        createUserBadge(data, "playersConnHostBadge");
                        removeLastUserInfoConts();
                    })
                    .catch(error => {
                        console.error('Failed to retrieve profile info:', error);
                    });
                    
                    TranslateAllTexts();
                    getGameInfo();
                    changeGraphics(data.graphic_mode);
                    updateGraphicsIcon(data.graphic_mode);
                    showPage('none');
                    
                    startAnimation();

                    emptyLoginField();
                } else {
                    guest_token = data.token;
                    submitButton.disabled = false;
                }
                resolve(guest_token);
            } else {
                submitButton.disabled = false;

                document.getElementById(messageContainerId).innerText = getTranslatedText(data.msg_code);
                reactivateLoginFields()
                resolve(null);
            }
        })
        .catch(error => {
            console.error('Erreur :', error);
            submitButton.disabled = false;
            reactivateLoginFields()
            reject(error);
        })
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

function resetHTMLelements(){
    document.querySelector(".gameUI").style.visibility = 'hidden';
    document.getElementById('c4').style.display = 'block';
    document.getElementById('c3').style.display = 'none';
    document.getElementById('c1').style.display = 'none';
}


export let isLoggingOut = false;

export function backToLobby(historyArrow = false) {
    if (historyArrow) {
        console.log("oui");
        keyDown['e'] = true;
        setTimeout(() => {
            keyDown['e'] = false;
            gameState.arena.displayBackPanel(true);
            gameState.arena.thirdPlayer.deactivateThirdPlayer();
            gameState.arena.idleCameraAnimation();
        }, 10);
    } else {
        resetGameEscape();
        gameState.arena.displayBackPanel(true);
        gameState.arena.thirdPlayer.deactivateThirdPlayer();
        gameState.arena.idleCameraAnimation();
    }
}



export async function handleLogout(userId, token) {
    if (!userId || !token || isLoggingOut) 
        return;
    isLoggingOut = true;

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
        }
        setSpaceShipToLoginState();
        showPage('loginPage');
        swipeLeftSideContainer('-40%');
        logoutGuest(userId);
        logoutUser(token);
        reactivateLoginFields();
        sessionStorage.clear();
        setTimeout(() => {
            toggleLobbyStart();
            resolve();
            gameState.paused = false;
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

async function logoutUser(token) {
    console.log("logoutUser");
    try {
        const response = await fetch('/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ status: status }),
            keepalive: true,
        });

        if (!response.ok) {
            throw new Error('Erreur lors du logout');
        } else {
            const data = await response.json();
            // console.log(`User ${data.user_id} status updated to ${data.status}`);
        }
    } catch (error) {
        console.error('Erreur :', error);
    }
}

export function logoutGuest(userId) {
    if (userId === sessionStorage.getItem('host_id')) {
        guestLoggedIn.forEach(user => {
            logoutUser(user[1]);
        });
    }
    guestLoggedIn.splice(0, guestLoggedIn.length);
}

window.addEventListener('beforeunload', async function (event) {
    // event.preventDefault();
    const token = sessionStorage.getItem('host_auth_token');
    handleLogout(sessionStorage.getItem('host_id'), token);
    sessionStorage.clear();
});

export function emptyLoginField() {
    document.getElementById('messageContainer').innerText = '';
    document.getElementById('usernameLoginInput').value = '';
    document.getElementById('passwordLoginInput').value = '';
}

