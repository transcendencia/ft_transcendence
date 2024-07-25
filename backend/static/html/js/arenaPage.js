import { getTranslatedText } from "./translatePages.js";
import { gameState } from "../../game/js/main.js";
import { togglePlanet, setCheckerToInterval, checkEach5Sec} from "./enterPlanet.js";
import { afterGameTournament, botDifficultyTournament, addUserToTournament } from "../../tournament/js/newTournament.js";
import { createGame } from "../../tournament/js/gameData.js";
import { gamemodeCounterTournament, mapCounterTournament, plusButtonsTournament } from "../../tournament/js/newTournament.js";
import { askForAlias, resetHostTournament } from "../../tournament/js/newTournament.js";
import { getProfileInfo, populateProfileInfos } from "./userManagement.js";

const leftColumn = document.querySelector(".leftColumn");
const userlistTitle = leftColumn.childNodes[1];
userlistTitle.textContent = getTranslatedText('userlist');

export let plusClicked = 0;
const botID = 1;

export const blue = '#3777ff';
export const purple = 'rgb(164, 67, 255)'
export const bgPurple = '#2d25a1'
export const grey = '#141414';
export const lightGrey = '#505050';
export const green = 'rgb(14, 255, 26)';

const buttonHeaders = document.querySelectorAll('.buttonTitle');
buttonHeaders.forEach((buttonHeader, index) => {
	const images = buttonHeader.querySelectorAll('img');
	images.forEach((image, imgIndex) => {
		image.addEventListener('mouseenter', function () {
			image.classList.add('lightblueShadowfilter');
		});
		image.addEventListener('mouseleave', function () {
			image.classList.remove('lightblueShadowfilter');
		});
		image.addEventListener('click', function () {
			if (index === 0)
				toggleGamemode(buttonHeader, imgIndex);
			if (index === 1)
				handleMaps(buttonHeader, imgIndex);
			if (index === 2)
				handleBotDifficulty(buttonHeader, imgIndex);
		});
	});
});

export function Glow(tournament = false, plusClicked) {
	userListBackground.classList.add('whiteGlowing');
		userTiles.forEach((tile) => {
			if (isBotId(tile.user.id) && tournament && plusClicked === 1)
				return;
			const tileChildren = tile.HTMLelement.querySelectorAll(":scope > *");
			tileChildren.forEach(child => child.classList.add('whiteGlowing'))
		});
	}
	
export function resetGlow() {
	userListBackground.classList.remove('whiteGlowing')
	userTiles.forEach((child, i) => {
		const children = child.HTMLelement.querySelectorAll(":scope > *");
		children.forEach(element => {
			element.classList.remove('whiteGlowing')
		});
		
	});
} 

userlistTitle.textContent = getTranslatedText('userlist');

export function resetAddingMode(mode) {
	if (mode === 'arena') {
		setCssClassToArray('add', 'hover-enabled', plusButtonsArena);
		setCssClassToArray('remove', 'clicked', plusButtonsArena);
	} else {
		setCssClassToArray('add', 'hover-enabled', plusButtonsTournament);
		setCssClassToArray('remove', 'clicked', plusButtonsTournament);
	}
	userlistTitle.textContent = getTranslatedText('userlist');
	resetGlow();
	plusClicked = 0;
	profileAdded[botID] = false;
	userTiles.forEach(tile => {tile.HTMLelement.querySelector(".textContainer").classList.remove('hovered')});
}

export function setAddingMode(plusButton, i, arena) {
	if (arena)
		setCssClassToArray('remove', 'hover-enabled', plusButtonsArena);
	else setCssClassToArray('remove', 'hover-enabled', plusButtonsTournament);
	plusButton.classList.add('clicked');
	plusClicked = i + 1;
	userlistTitle.textContent = getTranslatedText('chooseProfile');
	Glow(arena, plusClicked);
	userTiles.forEach(tile => {
		// if (isBotId(tile.user.id) && (!arena || (arena && plusClicked !== 1))) 
		if (!(isBotId(tile.user.id) && arena && plusClicked === 1))
			tile.HTMLelement.querySelector(".textContainer").classList.add('hovered')
	});
}

export function setCssClassToArray(mode, className, array) {
	if (mode == 'add')
		array.forEach(button => {button.classList.add(className)}); 
	else array.forEach(button => {button.classList.remove(className)});	 
}

const plusButtonsArena = document.querySelectorAll(".plusPlayer");
plusButtonsArena.forEach((plusButton, i) => {
	plusButton.classList.add('hover-enabled');
	plusButton.addEventListener('click', function () {
		if (!plusClicked)
			setAddingMode(plusButton, i, true);
		else if (plusClicked === i + 1)
			resetAddingMode("arena");
	});
});

export let profileAdded = [];

function isBotId(id) {
	return (id === botID)
}

function displayTypeColor(type, ...containers) {
    const newType = type === 'Friend' ? 'OnlineFriend' : type;
    containers.forEach(cont => cont.classList.add(`${newType}Tile`));
}

export function resetToPlusButton(userInfoCont, plusButton) {
	userInfoCont.parentNode.replaceChild(plusButton, userInfoCont);
}

export function createUserInfoObject(tile, hoverEnabled = false) {
    const userInfoCont = document.createElement('div');
    userInfoCont.classList.add('userInfoCont');
	if (hoverEnabled)
		userInfoCont.classList.add('hover-enabled');

	const profilePic = document.createElement('div');
    userInfoCont.appendChild(profilePic);

    const clonedImg = tile.HTMLelement.querySelector('.imgContainer').querySelector('img').cloneNode(true);
    clonedImg.classList.add('user-img');
    profilePic.classList.add('profilePic');
    profilePic.appendChild(clonedImg);

    const hoverClonedImg = document.createElement('img');
    hoverClonedImg.src = "../../../static/html/assets/icons/whiteCross.png";
    hoverClonedImg.classList.add('hover-img');
    profilePic.appendChild(hoverClonedImg);
    
    const textSpan = document.createElement('span');
    textSpan.classList.add('default-text');
    textSpan.textContent = tile.user.username;
    userInfoCont.appendChild(textSpan);

    const hoverTextSpan = document.createElement('span');
    hoverTextSpan.classList.add('hover-text');
    hoverTextSpan.textContent = getTranslatedText('removePlayer');
    userInfoCont.appendChild(hoverTextSpan);

    displayTypeColor(tile.type, userInfoCont, profilePic);
    return {userInfoCont, clonedImg, profilePic};
}

function addClickListenerToNewUserBadge(userBadge, plusButton, tile) {
	userBadge.userInfoCont.addEventListener('click', function() {
		profileAdded[tile.user.id] = false;
		console.log(plusButton);
		resetToPlusButton(userBadge.userInfoCont, plusButton);
		updateListAndResetTimer();
		removeUserFromMatch(tile.user.id);
		addedPlayerBadges = addedPlayerBadges.filter(badge => badge.username !== tile.user.username);
	});
}

const blockingPanel = document.getElementById('blockingPanel');
const pwWindow = document.querySelectorAll(".enterPasswordWindow")[0];
const aliasWindow = document.querySelectorAll(".enterPasswordWindow")[1];
const validatePasswordButton = document.getElementById("arenaLogInButton");
const backPasswordButton = document.getElementById("arenaBackLogInButton");
let userClickedId = -1; // To store the index of the tile that was clicked
export let addedPlayerBadges = [];

export function putUserInMatch(plusButtonsArray, mode) {
	updateListAndResetTimer();
	const tile = userTiles.get(userClickedId);
	const textCont = tile.HTMLelement.querySelector(".textContainer");

	profileAdded[tile.user.id] = true;
	
	const userBadge = createUserInfoObject(tile, true);
	addedPlayerBadges.push({userBadge: userBadge.userInfoCont, plusClicked, username: tile.user.username});
	const plusButton = plusButtonsArray[plusClicked - 1];
	plusButton.parentNode.replaceChild(userBadge.userInfoCont, plusButton);
	let thirdPlayer = 0;
	if (plusClicked === 1)
		thirdPlayer = 1;
	resetGlow();
	resetAddingMode(mode);
	addClickListenerToNewUserBadge(userBadge, plusButton, tile, userClickedId);
	if (mode === 'tournament'){
		addUserToTournament(tile.user.id, tile.user.username, tile.user.profile_picture);
	}
	else {
		addUserToMatch(tile.user.id, tile.user.username, tile.user.profile_picture, thirdPlayer);
	}
}

function updateListAndResetTimer() {
	RenderAllUsersInList();
	clearTimeout(checkEach5Sec);
	setCheckerToInterval(setInterval(refreshUserListIfChanged, 5000));
}

import { handleLogin } from './loginPage.js';
import { displayUsersLogged } from './main.js';

export let guestLoggedIn = [];

let isValidating = false;

validatePasswordButton.addEventListener('click', async function() {
    if (isValidating)
        return;
    isValidating = true;
    // validatePasswordButton.style.pointerEvents = 'none';
    
    try {
        if (guestLoggedIn.length < 7) {
            let guest = userTiles.get(userClickedId).user;
            const password = document.getElementById("enterPasswordInput");
            const formData = new FormData();
            formData.append("username", guest.username);
            formData.append("password", password.value);
            
            let guestToken = await handleLogin(formData);
            
            if (guestToken) {
                guestLoggedIn.push([guest, guestToken]);
                if (planetInRange.name === 'arena')
                    putUserInMatch(plusButtonsArena, 'arena');
                else 
                    askForAlias(guest);
                displayUsersLogged(guest, guestToken);
                document.getElementById('enterPasswordInput').value = '';
                document.getElementById('errorLogGuest').innerHTML = '';
                pwWindow.classList.remove("showRectangle");
                if (planetInRange.name === 'arena')
                    blockingPanel.classList.remove('show');
            } else {
                console.log("Erreur dans le login");
            }
        }
        else {
            console.log("Too many guest");
        }
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
    } finally {
        isValidating = false;
        // validatePasswordButton.style.pointerEvents = '';
    }
});

backPasswordButton.addEventListener('click', function() {
	pwWindow.classList.remove("showRectangle");
	blockingPanel.classList.remove('show');
	document.getElementById('enterPasswordInput').value = '';
	document.getElementById('errorLogGuest').innerText = '';
});

function addEventListenerToTile(tile, arena) {
	tile.HTMLelement.addEventListener('click', function() {
	if (!plusClicked || isBotId(tile.user.id) && planetInRange.name === "arena" && plusClicked === 1)
		return;
	if (isBotId(tile.user.id) || (tile.user.status === 'online' && isGuest(tile.user.id))) {
		userClickedId = tile.user.id;
		if (planetInRange.name === 'arena')
			putUserInMatch(plusButtonsArena, 'arena');
		else putUserInMatch(plusButtonsTournament, 'tournament');
		return;
	}
	pwWindow.classList.toggle("showRectangle");
	blockingPanel.classList.add("show");
	userClickedId = tile.user.id;
	const userBadge = createUserInfoObject(tile);
	const userBadgeAlias = createUserInfoObject(tile);
	pwWindow.replaceChild(userBadge.userInfoCont, pwWindow.querySelector('.userInfoCont'));
	aliasWindow.replaceChild(userBadgeAlias.userInfoCont, aliasWindow.querySelector('.userInfoCont'));
	});
  }

export function setHostAsPlayerOne(user, mode) {
	const usernameElement = document.getElementById(`player1${mode}Username`);
	const pictureElement = document.getElementById(`player1${mode}Picture`);
	usernameElement.textContent = user.username;
	pictureElement.src = user.profile_picture;
	
	if (mode === 'Tournament')
		addUserToTournament(user.id, user.username, user.profile_picture);
	else addUserToMatch(user.id, user.username, user.profile_picture);
}

import { get_friends_list, updateUserStatus } from "./userManagement.js";
import { planetInRange } from "./planetIntersection.js";

const backButtonArenaPage = document.getElementById("arenaBackButton");
backButtonArenaPage.addEventListener('click', () => {togglePlanet(/* toggleRsContainer: */ true)});

let previousUserList = [];

async function isListsChanged() {
	const users = await get_friends_list();
	// Filter the available users
	const sortedNewFriends = users.friends.sort((a, b) => a.user.username.localeCompare(b.user.username));
	const sortedNewUserNotFriend = users.user_not_friend.sort((a, b) => a.username.localeCompare(b.username));
	const availableFriends = sortedNewFriends.filter(obj => isAvailable(obj.user)).map(obj => obj.user);
	const availableNotFriends = sortedNewUserNotFriend.filter(user => isAvailable(user));
	const newUserList = [...availableFriends, ...availableNotFriends];
	const listsChanged = JSON.stringify(previousUserList) !== JSON.stringify(newUserList);

	return listsChanged;
  }

  export function initArenaPlanet() {
	userListBackground = document.getElementById('userlistArenaPage');
	RenderAllUsersInList();
	setCheckerToInterval(setInterval(refreshUserListIfChanged, 5000));
	matchPlayer.length = 0;
	getProfileInfo(sessionStorage.getItem("host_id"))
  	.then(data => {
      populateProfileInfos(data);
  	})
  }

  export function initTournamentPlanet(){
	userListBackground = document.getElementById('userlistTournamentPage');
	RenderAllUsersInList();
	resetHostTournament();
	// tournamentPlayer.length = 0;
	// getProfileInfo(sessionStorage.getItem("host_id"))
	// .then(data => {
	// 	populateProfileInfos(data);
	// })
  }

export function resetArenaPage() {
	plusClicked = 0;
	addedPlayerBadges.forEach(obj => {
		resetToPlusButton(obj.userBadge, plusButtonsArena[obj.plusClicked - 1]);
	});
	profileAdded = [];
	addedPlayerBadges = [];
	matchPlayer.length = 0;
	getProfileInfo(sessionStorage.getItem("host_id"))
  	.then(data => {
      populateProfileInfos(data);
  	})
	resetAddingMode("arena");
}
  
  async function refreshUserListIfChanged() {
	if (await isListsChanged())
	  await RenderAllUsersInList();
	console.log("Checking...");
  }

  const userTiles = new Map();
   
let userListBackground;

export async function RenderAllUsersInList() {

	const users = await get_friends_list();
	const sortedNewFriends = users.friends.sort((a, b) => a.user.username.localeCompare(b.user.username));
	const sortedNewUserNotFriend = users.user_not_friend.sort((a, b) => a.username.localeCompare(b.username));

	const availableFriends = sortedNewFriends.filter(obj => isAvailable(obj.user)).map(obj => obj.user);
	const availableNotFriends = sortedNewUserNotFriend.filter(user => isAvailable(user));
	
	previousUserList = [...availableFriends, ...availableNotFriends];

	const availableUsers = [
		{ user: users.bot, type: 'Bot' },
	  ...availableFriends.map(user => ({ user, type: 'Friend' })),
	  ...availableNotFriends.map(user => ({ user, type: 'Default' }))
	];

	const sortedUsers = availableUsers.sort((a, b) => {
	  const typeOrder = { Bot: 0, Friend: 1, Default: 2 };
	  if (typeOrder[a.type] !== typeOrder[b.type]) {
		return typeOrder[a.type] - typeOrder[b.type];
	  }
	  return a.user.username.localeCompare(b.user.username);
	});
  
	// Remove tiles that are no longer in the list
	const tilesToRemove = [];
	for (let [id, { HTMLelement }] of userTiles.entries()) {
	  if (!sortedUsers.some(item => item.user.id === id)) {
		tilesToRemove.push({ id, HTMLelement });
	  }
	}
  
	// Animate removal
	const removePromises = tilesToRemove.map(({ id, HTMLelement }) => {
	  return new Promise(resolve => {
		HTMLelement.classList.add('removing');
		HTMLelement.addEventListener('transitionend', (e) => {
		userListBackground.removeChild(HTMLelement);
		userTiles.delete(id);
		resolve();
		}, { once: true });
	  });
	});
  
	// Wait for all removals to complete
	await Promise.all(removePromises);
  
	// Update existing tiles and create new ones
	const addPromises = [];
	sortedUsers.forEach(({ user, type }) => {
	  if (userTiles.has(user.id)) {
		const { HTMLelement } = userTiles.get(user.id);
		HTMLelement.querySelector('.textContainer').textContent = user.username;
		HTMLelement.querySelector('img').src = user.profile_picture;
	  } else {
		const newTile = createUserTile(user, type);
		newTile.classList.add('removing');
		addPromises.push(new Promise(resolve => {
			setTimeout(() => {
				newTile.classList.remove('removing');
			newTile.addEventListener('transitionend', (e) => {
				resolve();
			}, { once: true });
		  }, 50); // Small delay to ensure the 'adding' class is applied before removing
		}));
	  }
	});
  
	// Reorder tiles in the DOM
	sortedUsers.forEach(({ user }) => {
	  const { HTMLelement } = userTiles.get(user.id);
	  userListBackground.appendChild(HTMLelement);
	});
  
	await Promise.all(addPromises);
  }
  
export function createUserTile(user, type) {
	const userTile = document.createElement('div');
	userTile.classList.add('userTile');
	
	const imgContainer = document.createElement('div');
	imgContainer.classList.add('imgContainer');
	imgContainer.innerHTML = `<img src="${user.profile_picture}">`;
	
	const textContainer = document.createElement('div');
	textContainer.classList.add('textContainer');
	textContainer.textContent = user.username;
	textContainer.style.width = '85%';

	displayTypeColor(type, textContainer, imgContainer);
	userTile.appendChild(imgContainer);
	userTile.appendChild(textContainer);
  
	// Store the tile in the map
	userTiles.set(user.id, {
	  user: user,
	  HTMLelement: userTile,
	  type: type
	});
  
	userListBackground.appendChild(userTile);
	addEventListenerToTile(userTiles.get(user.id));  
	return userTile;
}

function isAvailable(user) {
	if (profileAdded[user.id])
		return false;
	if (user.status === 'online') {
		if (user.is_host === false && isGuest(user.id))
			return true;
		return false;
	}
	return true;
}

function isGuest(userId) {
	for (let i = 0; i < guestLoggedIn.length; i++) {
		if (guestLoggedIn[i][0].id === userId)
			return true;
	}
	return false;
}

let isInfoShow = false;
const infoButton = document.getElementById("arenaInfoIcon");
infoButton.addEventListener("mouseenter", displayInfo);
infoButton.addEventListener("mouseleave", hideInfo);

function displayInfo() {
	isInfoShow = true;
	document.getElementById("arenaInfoBox").classList.add("showRectangle");
}

function hideInfo() {
	isInfoShow = false;
	document.getElementById("arenaInfoBox").classList.remove("showRectangle");
}






































const matchPlayer = [];

function addUserToMatch(playerId, username, profile_picture, thirdPlayer = 0) {
	if (!matchPlayer.some(player => player.username === username)) {
		matchPlayer.push({
		  playerId: playerId,
		  username: username,
		  profile_picture: profile_picture,
		  thirdPlayer: thirdPlayer,
		});
	}
}

function removeUserFromMatch(playerId) {
  const playerIndex = matchPlayer.findIndex(player => player.playerId === playerId);
  //remove if player is find
  if (playerIndex !== -1) {
	  matchPlayer.splice(playerIndex, 1);
	  console.log(`Player with ID ${playerId} has been removed from the match.`);
  } else
	  console.log(`Player with ID ${playerId} is not in the match.`);
}


let gamemodeCounter = 0;
let mapCounter = 0;
let botDifficulty = 1;


function toggleGamemode(buttonHeader, imgIndex) {
	if (imgIndex === 0){
		gamemodeCounter--;
		if (gamemodeCounter === -1)
			gamemodeCounter = 2;
	}
	else {
		gamemodeCounter++;    
		if (gamemodeCounter === 3) // 0 = classic 1 = powerless 2= spin only 
			gamemodeCounter = 0;
	}
	if (gamemodeCounter === 0)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('gamemodeNameText1');
	else if (gamemodeCounter === 1)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('gamemodeNameText2');
	else if (gamemodeCounter === 2)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('gamemodeNameText3');
}

function handleMaps(buttonHeader, imgIndex) {
	if (imgIndex === 0){
		mapCounter--;
		if (mapCounter === -1)
			mapCounter = 3;
		}
	else {
		mapCounter++;    
		if (mapCounter === 4)
			mapCounter = 0;
		} 
	if (mapCounter === 0)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Space';
	else if (mapCounter === 1)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Ocean';
	else if (mapCounter === 2)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Sky';
	else if (mapCounter === 3)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Dragon Pit';
}

function handleBotDifficulty(buttonHeader, imgIndex) {
	if (imgIndex === 0){
		botDifficulty--;
		if (botDifficulty === -1)
			botDifficulty = 2;
	}
	else {
		botDifficulty++;    
		if (botDifficulty === 3)
			botDifficulty = 0;
	}
	if (botDifficulty === 0)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('botDifficultyEasy');
	else if (botDifficulty === 1)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('botDifficultyMedium');
	else if (botDifficulty === 2)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('botDifficultyHard');
  }

export let gameStarted = false;

export function toggleGameStarted() {
	gameStarted = !gameStarted;
}

export async function endGame(isTournament, backToLobby = false) {
	const hostId = sessionStorage.getItem('host_id');
	if (hostId == gameState.arena.game.user1.id  || hostId == gameState.arena.game.user2.id  || (hostId == gameState.arena.game.user3.id )){
		const token = sessionStorage.getItem('host_auth_token');
		await updateUserStatus('online', token);
	}
	for(let i = 0; i < guestLoggedIn.length; i++) {
		if (guestLoggedIn[i][0].id == gameState.arena.game.user1.id || guestLoggedIn[i][0].id == gameState.arena.game.user2.id || guestLoggedIn[i][0].id == gameState.arena.game.user3.id) {
			const token = guestLoggedIn[i][1];
			await updateUserStatus('online', token);
		}
	}
	gameStarted = false;
	let user3 = null;

	if (gameState.arena.game.thirdPlayer)
		user3 = gameState.arena.game.user3.id
	if (isTournament){
		planetPanel[2].style.visibility = 'visible';
		if (!backToLobby)
		{
			createGame(gameState.arena.game.user1.id, gameState.arena.game.user2.id, user3, gameState.arena.game.leftScore, gameState.arena.game.rightScore, "tournament", gameState.arena.game.gameMode, gameState.arena.game.map, gameState.arena.game.user1, gameState.arena.game.user2, gameState.arena.game.user3, gameState.arena.game.gameTime);
			afterGameTournament(gameState.arena.game.leftScore, gameState.arena.game.rightScore);
		}
	}
	else{
		planetPanel[0].style.visibility = 'visible';
		if (!backToLobby)
			createGame(gameState.arena.game.user1.id, gameState.arena.game.user2.id, user3, gameState.arena.game.leftScore, gameState.arena.game.rightScore, "arena", gameState.arena.game.gameMode, gameState.arena.game.map, gameState.arena.game.user1, gameState.arena.game.user2, gameState.arena.game.user3, gameState.arena.game.gameTime);
	}
	rsContainer.style.visibility = 'visible';
	gameUI.style.visibility = 'hidden';
	document.getElementById('c4').style.display = 'block';
	document.getElementById('c3').style.display = 'none';
	document.getElementById('c1').style.display = 'none';
	gameState.arena.game.resetUsers();
	refreshUserListIfChanged();
}

export function rematchGame() {
	let user3 = null;

	if (gameState.arena.game.thirdPlayer)
		user3 = gameState.arena.game.user3.id  
	createGame(gameState.arena.game.user1.id, gameState.arena.game.user2.id, user3, gameState.arena.game.leftScore, gameState.arena.game.rightScore, "arena", gameState.arena.game.gameMode, gameState.arena.game.map, gameState.arena.game.user1, gameState.arena.game.user2, gameState.arena.game.user3, gameState.arena.game.gameTime);
	gameState.arena.game.resetUsers();
}

const gameUI = document.querySelector(".gameUI");

export function switchToGame(gameState, player1, player2, player3, isTournament) {
	gameStarted = true;
	gameUI.style.visibility = 'visible';
	if (isTournament)
		planetPanel[2].style.visibility = 'hidden';
	else
		planetPanel[0].style.visibility = 'hidden';
	loginPage.style.visibility = 'hidden';
	rsContainer.style.visibility = 'hidden';
	document.getElementById('c4').style.display = 'none';
	if (gameState.arena != undefined)
		gameState.arena.loadingScreen.activateLoadingScreen();
	initGame(gameState, player1, player2, player3, isTournament);
}

function initGameMode(gameState, isTournament){
	let gamemodeCounterTmp = gamemodeCounter;
	let mapCounterTmp = mapCounter;  
	let botDifficultyTmp = botDifficulty;
	if (isTournament){
	  gamemodeCounterTmp = gamemodeCounterTournament;
	  mapCounterTmp = mapCounterTournament;  
	  botDifficultyTmp = botDifficultyTournament;
	}
	if (gamemodeCounterTmp === 0) {
		gameState.arena.game.powerUpsActivated = true;
		gameState.arena.game.effectsOnly = false;
	}
	else if (gamemodeCounterTmp === 1) {
		gameState.arena.game.powerUpsActivated = false;
		gameState.arena.game.effectsOnly = false;
	}
	else if (gamemodeCounterTmp === 2) {
		gameState.arena.game.powerUpsActivated = true;
		gameState.arena.game.effectsOnly = true;
	}
	const modeList = ["CLASSIC", "POWERLESS", "SPIN ONLY"];
	gameState.arena.game.gameMode = modeList[gamemodeCounterTmp];
	const mapList = ["spaceMap", "oceanMap", "skyMap", "dragonMap"];
	gameState.arena.game.map = mapList[mapCounterTmp];
	const difficultyList = ["easy", "medium", "hard"];
	gameState.arena.bot.difficulty = difficultyList[botDifficultyTmp];
}

export function    initGame(gameState, player1, player2, player3, isTournament) {
	// prepare for initialization
	gameState.loading = true;
	gameState.inLobby = false;
	setTimeout(() => {
		let hostId = sessionStorage.getItem('host_id');
		if (hostId == player1.playerId || hostId == player2.playerId || (player3 && hostId == player3.playerId)){
			let token = sessionStorage.getItem('host_auth_token');
			updateUserStatus('in_game', token);
		}
		for(let i = 0; i < guestLoggedIn.length; i++) {
			if (guestLoggedIn[i][0].id === player1.playerId || guestLoggedIn[i][0].id === player2.playerId || (player3 && guestLoggedIn[i][0].id === player3.playerId)) {
				const token = guestLoggedIn[i][1];
				updateUserStatus('in_game', token);
			}
		}
	  gameState.arena.game.hasToBeInitialized = true;
	  // choose gameMode
	  initGameMode(gameState, isTournament);
	  // add players
	  // const 
	  gameState.arena.game.rightScore = 0;
	  gameState.arena.game.leftScore = 0;
	  gameState.arena.resetUI();
	  gameState.arena.game.user1.setUser(player1.username, player1.playerId, player1.profile_picture);
	  gameState.arena.game.user2.setUser(player2.username, player2.playerId, player2.profile_picture);
	  if (player3){
		gameState.arena.game.user3.setUser(player3.username, player3.playerId, player3.profile_picture);
		gameState.arena.game.thirdPlayer = true;
	  }
	  else
	  	gameState.arena.game.thirdPlayer = false;
	  gameState.arena.game.tournamentGame = isTournament;
	  gameState.arena.loadingScreen.loadingComplete();
	}, 250);
  }

export function changeGraphics(mode) {
	if (gameState.graphics === mode)
		return;
	gameState.graphics = mode;
	gameState.graphicsNeedToChange = true;
}


const rsContainer = document.querySelector('.rightSideContainer');
const loginPage = document.querySelector('.loginPage');
const planetPanel = document.querySelectorAll('.planetPanel');
const startButton = document.querySelector('.redButton');
startButton.addEventListener('click', function() {
    let player2;
    let player3;
	console.log("matchPlayer", matchPlayer);
    if (matchPlayer.length < 2 || (matchPlayer.length < 3 && matchPlayer[1].thirdPlayer))
        return;
    if (matchPlayer.length === 2){
        player2 = matchPlayer[1];
        player3 = "";
    }
    else {
        if (matchPlayer[1].thirdPlayer){
            player2 = matchPlayer[2];
            player3 = matchPlayer[1];
        }
        else {
            player2 = matchPlayer[1];
            player3 = matchPlayer[2];
        }
    }
    switchToGame(gameState, matchPlayer[0], player2, player3, false);
});
