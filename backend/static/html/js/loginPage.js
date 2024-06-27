import { moveCameraToFrontOfCockpit } from "./signUpPage.js";
import { moveCameraToBackOfCockpit }  from "./signUpPage.js";
import { showPage } from "./showPages.js";
import { alien1, alien2, alien3, spaceShip, spaceShipInt} from "./objs.js";
import { TranslateAllTexts, currentLanguage, languageIconsClicked, setlanguageIconsClicked, setCurrentLanguage, getTranslatedText} from "./translatePages.js";
import { gameState } from "../../game/js/main.js";
import { changeGraphics, toggleGameStarted, guestLoggedIn } from "./arenaPage.js";
import { startAnimation, lobbyVisuals, toggleBlurDisplay, toggleRSContainerVisibility, toggleEscapeContainerVisibility, togglePause, lobbyStart, toggleLobbyStart } from "./main.js";
import { updateUserLanguage, updateUserStatus, get_friends_list, get_user_list, getProfileInfo } from "./userManagement.js";
import { resetOutlineAndText, resetOutline } from "./planetIntersection.js";

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
    moveCameraToFrontOfCockpit();
}));

showPage('loginPage');

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
        const token = localStorage.getItem('host_auth_token');
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
    if (localStorage.getItem("hostLoggedIn") === null) {
        localStorage.setItem("hostLoggedIn", 'false');
    }

    const hostLoggedIn = localStorage.getItem("hostLoggedIn");

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
            if (data.status === "succes") {
                console.log("hostLoggedIn", hostLoggedIn);

                if (hostLoggedIn === 'false') {
                    localStorage.setItem("hostLoggedIn", 'true');
                    localStorage.setItem("host_auth_token", data.token);
                    localStorage.setItem("host_id", data.id);
                    setCurrentLanguage(data.language);
                    setEscapeLanguageVisual();
                    get_friends_list();
                    getProfileInfo();
                    TranslateAllTexts();
                    getGameInfo();
                    changeGraphics(data.graphic_mode);
                    showPage('none');
                    startAnimation();
                } else {
                    guest_token = data.token;
                }
                resolve(guest_token);
            } else {
                document.getElementById('messageContainer').innerText = getTranslatedText(data.msg_code);
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
disconnectButton.addEventListener("click", () => {
    handleLogout(localStorage.getItem('host_id'), localStorage.getItem('host_auth_token')); 
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
    if (userId === localStorage.getItem('host_id')) {
        console.log(guestLoggedIn.length);
        guestLoggedIn.forEach(user => {
            updateUserStatus('offline', user[1]);
        });
    }
    guestLoggedIn.splice(0, guestLoggedIn.length);
    const lsCont = document.getElementById('lsCont');
    lsCont.innerHTML = `
        <div class="tinyRedShadowfilter">
            Players Connected
        </div>
    `;

    // Disconnect the host
    updateUserStatus('offline', token)
    .then(() => {
        localStorage.clear();
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
    // const hostLoggedIn = localStorage.getItem("hostLoggedIn")
    // console.log(hostLoggedIn)
    // if (hostLoggedIn === 'true') {
    //     // localStorage.setItem('hostLoggedIn', 'false');
    //     localStorage.clear();
    //     console.log(localStorage.getItem("hostLoggedIn"));
    // }
    if (gameState.inGame) {
        gameState.inGame = false;
        gameState.inLobby = true;
        toggleGameStarted();
        resetHTMLelements();
    }
    togglePause();
    spaceShip.position.set(0, 0, -1293.5);
    spaceShip.rotation.set(0, 0, 0);
    setTimeout(() => {
        toggleBlurDisplay(true);
        toggleEscapeContainerVisibility();
        resetOutline();
        spaceShipInt.visible = true;
        showPage('loginPage');
        toggleLobbyStart();
    }, 50);
};

// window.addEventListener('beforeunload', function (event) {
    // event.preventDefault();

    // handleLogout(localStorage.getItem('host_id'), localStorage.getItem('host_auth_token'));
    
    // event.returnValue = '';
// });

// window.addEventListener('unload', function (event) {
//     handleLogout(localStorage.getItem('host_id'), localStorage.getItem('host_auth_token'));
// });

// document.onvisibilitychange = function() {
//     if (document.visibilityState === 'hidden') {
//         handleLogout(localStorage.getItem('host_id'), localStorage.getItem('host_auth_token'));
//     }
// };