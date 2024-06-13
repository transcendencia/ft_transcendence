import { getTranslatedText } from "./translatePages.js";
import { gameState } from "../../game/js/main.js";
import { togglePlanet } from "./enterPlanet.js";
import { afterGameTournament } from "../../tournament/js/newTournament.js";
import { createGame } from "../../tournament/js/gameData.js";
import { gamemodeCounterTournament, mapCounterTournament } from "../../tournament/js/newTournament.js";

const userlist = document.querySelector(".userlistBackground");
const plusButtons = document.querySelectorAll(".plusPlayer");

const leftColumn = document.querySelector(".leftColumn");
const userlistTitle = leftColumn.childNodes[1];
userlistTitle.textContent = getTranslatedText('userlist');

let plusClicked = false;
const botID = 0;
let playerNb = 0;


export const blue = '#3777ff';
export const purple = 'rgb(164, 67, 255)'
export const grey = '#141414';
export const lightGrey = '#505050';
export const green = 'rgb(14, 255, 26)';

function Glow() {
    userlist.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    userlist.style.borderColor = '#ffb30eff';
    userlist.style.animation = 'shadowBlink 1s infinite alternate ease-in-out';
    userTiles.forEach((tile, i) => {
        if (profileAdded[i])
            return;
        const tileChildren = tile.HTMLelement.querySelectorAll(":scope > *");
        tileChildren.forEach(function(element) {
            element.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
            element.style.borderColor = '#ffb30eff';
            element.style.animation = 'shadowBlink 1s infinite alternate ease-in-out';
        });
    });
}

let gamemodeCounter = 0;
let mapCounter = 0;

function toggleGamemode(buttonHeader, imgIndex) {
    if (imgIndex === 0){
        gamemodeCounter--;
        if (gamemodeCounter === -1)
            gamemodeCounter = 3;
        }
    else {
        gamemodeCounter++;    
        if (gamemodeCounter === 3) // 0 = classic 1 = powerless 2= spin only 
            gamemodeCounter = 0;
        } 
    if (gamemodeCounter === 0)
        buttonHeader.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('gamemodeNameText1');
    if (gamemodeCounter === 1)
        buttonHeader.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('gamemodeNameText2');
    if (gamemodeCounter === 2)
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
    if (mapCounter === 1)
        buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Ocean';
    if (mapCounter === 2)
        buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Sky';
    if (mapCounter === 3)
        buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Dragon Pit';
}

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
        });
    });
});


function resetGlow() {
    userlist.style.borderColor = blue;
    userlist.style.animation = '';
    userTiles.forEach((child, i) => {
        const children = child.HTMLelement.querySelectorAll(":scope > *");
        children.forEach(element => {
            element.style.borderColor = blue;
            element.style.animation = '';
            if (isBot(i))
                element.style.borderColor = purple;
            else if (child.type === 'Friend')
                element.style.borderColor = green;
        });
        
    });
} 

function resetAddingMode() {
    userlistTitle.textContent = getTranslatedText('userlist');
    plusClicked = 0;
    plusButtons.forEach(function(otherPlusButton) {
        otherPlusButton.style.pointerEvents = 'auto';
    });
    profileAdded[botID] = false;
    userTiles.forEach(tile => {tile.HTMLelement.querySelector(".textContainer").style.pointerEvents = 'none';});
}

function setAddingMode(plusButton, i) {
    userlistTitle.textContent = getTranslatedText('chooseProfile');
    if (i === 0) {
        plusClicked = 1;
        profileAdded[botID] = true;
        userTiles.forEach((tile, index) => {if(!isBot(index)) tile.HTMLelement.querySelector(".textContainer").style.pointerEvents = 'auto';});
    }
    else {
        plusClicked = 2;
        userTiles.forEach(tile => {tile.HTMLelement.querySelector(".textContainer").style.pointerEvents = 'auto';});
    }
    plusButtons.forEach(function(otherPlusButton) {
        if (otherPlusButton !== plusButton) {
            otherPlusButton.style.pointerEvents = 'none';
        }
        
    });
}

export let gameStarted = false;

export function endGame(isTournament) {
    gameStarted = false;
    let user3 = null;

    if (gameState.arena.game.thirdPlayer)
        user3 = gameState.arena.game.user3.id
    if (isTournament){
        planetPanel[2].style.visibility = 'visible';
        createGame(gameState.arena.game.user1.id, gameState.arena.game.user2.id, user3, gameState.arena.game.leftScore, gameState.arena.game.rightScore, "tournament", gameState.arena.game.gameMode);
        afterGameTournament(gameState.arena.game.leftScore, gameState.arena.game.rightScore);
    }
    else{
        planetPanel[0].style.visibility = 'visible';
        createGame(gameState.arena.game.user1.id, gameState.arena.game.user2.id, user3, gameState.arena.game.leftScore, gameState.arena.game.rightScore, "arena", gameState.arena.game.gameMode);
    }
    rsContainer.style.visibility = 'visible';
    gameUI.style.visibility = 'hidden';
    document.getElementById('c4').style.display = 'block';
    document.getElementById('c3').style.display = 'none';
    document.getElementById('c1').style.display = 'none';
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

export function    initGame(gameState, player1, player2, player3, isTournament) {
    // prepare for initialization
    gameState.loading = true;
    gameState.inLobby = false;
    setTimeout(() => {    
      gameState.arena.game.hasToBeInitialized = true;
      // choose gameMode
      if (isTournament){
        gamemodeCounter = gamemodeCounterTournament;
        mapCounter = mapCounterTournament;  
      }
      if (gamemodeCounter === 0) {
          gameState.arena.game.powerUpsActivated = true;
          gameState.arena.game.effectsOnly = false;
      }
      if (gamemodeCounter === 1) {
          gameState.arena.game.powerUpsActivated = false;
          gameState.arena.game.effectsOnly = false;
      }
      if (gamemodeCounter === 2) {
          gameState.arena.game.powerUpsActivated = true;
          gameState.arena.game.effectsOnly = true;
      }
      const modeList = ["CLASSIC", "POWERLESS", "SPIN ONLY"];
      gameState.arena.game.gameMode = modeList[gamemodeCounter];
      // choose map
      const mapList = ["spaceMap", "oceanMap", "skyMap", "dragonMap"];
      gameState.arena.game.map = mapList[mapCounter];
      // add players
      gameState.arena.game.user1.setUser(player1.username, player1.playerId, player1.profile_picture);
      gameState.arena.game.user2.setUser(player2.username, player2.playerId, player2.profile_picture);
      if (typeof player3 !== "undefined"){
        gameState.arena.game.user3.setUser(player3.username, player3.playerId, player3.profile_picture);
        gameState.arena.game.thirdPlayer = true;
      }
      gameState.arena.game.tournamentGame = isTournament;
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
    if (matchPlayer.length < 2)
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

userlistTitle.textContent = getTranslatedText('userlist');
plusButtons.forEach(function(plusButton, i) {
    plusButton.addEventListener('click', function () {
        if (!plusClicked) {
            setAddingMode(plusButton, i);
            Glow();
            plusButton.style.backgroundColor = lightGrey;
        }
        else {
            resetAddingMode(plusButton);
            resetGlow();
            plusButton.style.backgroundColor = grey;
        }
    });
    //Hovering
    plusButton.addEventListener('mouseenter', function () {
        if (!plusClicked)
            plusButton.style.backgroundColor = lightGrey;
    });

    plusButton.addEventListener('mouseleave', function () {
        if (!plusClicked)
            plusButton.style.backgroundColor = grey;
    });
});

let profileAdded = [];

function isBot(i) {
    return (i === botID)
}

export function displayRemovePlayerVisual(userInfoCont, clonedImg, profilePic) {
    clonedImg.src = '../../../static/html/assets/icons/whiteCross.png';
    profilePic.style.borderColor = 'red';
    userInfoCont.style.borderColor = 'red';
    userInfoCont.style.fontSize = '20px';
    userInfoCont.style.fontFamily = 'computer';
    userInfoCont.childNodes[1].textContent = getTranslatedText('removePlayer');
}

export function resetUserInfoVisual(userInfoCont, clonedImg, profilePic, tileText, i, tile) {
    if (isBot(i)) {
        userInfoCont.style.borderColor = purple;
        profilePic.style.borderColor = purple;
    }
    else {
        profilePic.style.borderColor = blue;
        userInfoCont.style.borderColor = blue;
    }
    clonedImg.src = tile.HTMLelement.querySelector('.imgContainer').querySelector('img').src;
    userInfoCont.childNodes[1].textContent = tileText;
    userInfoCont.style.fontFamily = 'space';
    userInfoCont.style.fontSize = '12px';
}

export function resetToPlusButton(userInfoCont, oldObj, textCont, type) {
    userInfoCont.parentNode.replaceChild(oldObj, userInfoCont)
    console.log(type);
    if (type === 'Friend')
        textCont.style.backgroundColor = "rgba(14, 255, 26, 0.322)";
    else if (type === 'Bot')
        textCont.style.backgroundColor = "rgba(164, 67, 255, 0.257)";
    else textCont.style.backgroundColor = '#00000031';
    textCont.classList.add('hoverable');
    oldObj.style.backgroundColor = grey;
}

export function createUserInfoObject(tile, i) {
    const userInfoCont = document.createElement('div');
    const profilePic = document.createElement('div');
    const clonedImg = tile.HTMLelement.querySelector('.imgContainer').querySelector('img').cloneNode(true);
    const tileText = tile.HTMLelement.querySelector('.textContainer').textContent;
    const textNode = document.createTextNode(tileText);
    userInfoCont.classList.add('userInfoCont');
    profilePic.classList.add('profilePic');
    profilePic.appendChild(clonedImg);
    userInfoCont.appendChild(profilePic);
    userInfoCont.appendChild(textNode);
    console.log(tile.type);
    if (isBot(i)) {
        userInfoCont.style.borderColor = purple;
        profilePic.style.borderColor = purple;
    }
    return {userInfoCont, clonedImg, profilePic, tileText};
}

function addEventListenerToTiles() {
    userTiles.forEach((tile, i) => {
        const textCont = tile.HTMLelement.querySelector(".textContainer");
        profileAdded[i] = false;
        tile.HTMLelement.addEventListener('click', function(){
        if (plusClicked && !profileAdded[i]) {
            profileAdded[i] = true;
            playerNb++;
            const newObj = createUserInfoObject(tile, i);
            if (plusClicked === 1)
                addUserToMatch(tile.user.id, tile.user.username, tile.user.profile_picture, 1);
            else addUserToMatch(tile.user.id, tile.user.username, tile.user.profile_picture, 0);
            console.log("user add:", tile.user);
            const oldObj = plusButtons[plusClicked - 1];
            oldObj.parentNode.replaceChild(newObj.userInfoCont, oldObj);
            resetGlow();
            resetAddingMode();
            newObj.userInfoCont.addEventListener('mouseenter', function () {
                displayRemovePlayerVisual(newObj.userInfoCont, newObj.clonedImg, newObj.profilePic);
            });
            newObj.userInfoCont.addEventListener('mouseleave', function () {
                resetUserInfoVisual(newObj.userInfoCont, newObj.clonedImg, newObj.profilePic, newObj.tileText, i, tile);
            });
            newObj.userInfoCont.addEventListener('click', function() {
                resetToPlusButton(newObj.userInfoCont, oldObj, textCont, tile.type);
                profileAdded[i] = false;
                profileAdded[botID] = false;
                playerNb--;
                removeUserFromMatch(tile.user.id);
            });
            if (tile.type === 'Friend')
                textCont.style.backgroundColor = 'rgba(14, 255, 26, 0.500)';
            else if (tile.type === 'Bot')
                textCont.style.backgroundColor = 'rgba(164, 67, 255, 0.500)';
            else textCont.style.backgroundColor = 'rgba(90, 142, 255, 0.500)';
        }
    });
    });
}

const matchPlayer = [];

function addUserToMatch(playerId, username, profile_picture, thirdPlayer) {
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
  } else {
      console.log(`Player with ID ${playerId} is not in the match.`);
  }
}

const userListBackground = document.getElementById('userlistArenaPage');

export const userTiles = [];  // Array to store the user tiles

function createUserTile(user, type) {
    const userTile = document.createElement('div');
    userTile.classList.add('userTile');

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('imgContainer');
    imgContainer.innerHTML = `<img src="${user.profile_picture}">`;

    const textContainer = document.createElement('div');
    textContainer.classList.add('textContainer');
    textContainer.textContent = user.username;

    imgContainer.classList.add(`arena${type}Tile`);
    textContainer.classList.add(`arena${type}Tile`);
    userTile.appendChild(imgContainer);
    userTile.appendChild(textContainer);

    userListBackground.appendChild(userTile);
    
    userTiles.push({
        user: user,
        HTMLelement: userTile,
        type: type
    });
}

export async function RenderAllUsersInList() {
    
    userListBackground.innerHTML = '';
    const users = await get_friends_list();

    createUserTile(users.bot, 'Bot');
    users.friends.forEach(obj => {createUserTile(obj.user, 'Friend')});
    users.user_not_friend.forEach(user => {createUserTile(user, '')});
    addEventListenerToTiles();
}

import { addEventListenerToTilesTournament } from "../../tournament/js/newTournament.js";
export const userTilesTournament = [];  // Array to store the user tiles


export function RenderAllUsersTournament(users) {
    let userListBackground = document.getElementById('userlistTournamentPage');

    // clean the list before addinmg all the lines
    userListBackground.innerHTML = '';

    //adding the bot to the userTiles
    // userTilesTournament.push({
    //     user: null,
    //     HTMLelement : document.getElementById("botUserTournamentTile"),
    // });

    users.forEach(user => {
        const userTile = document.createElement('div');
        userTile.classList.add('userTile');

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('imgContainer');
        imgContainer.innerHTML = `<img src="${user.profile_picture}">`;

        const textContainer = document.createElement('div');
        textContainer.classList.add('textContainer');
        textContainer.textContent = user.username;

        userTile.appendChild(imgContainer);
        userTile.appendChild(textContainer);

        userListBackground.appendChild(userTile);

        userTilesTournament.push({
            user: user,
            HTMLelement: userTile,
        });
    });
    addEventListenerToTilesTournament();
  }

  export function RenderHostMatch(user) {
    const usernameElement = document.getElementById('player1MatchUsername');
    usernameElement.textContent = user.username;
    const pictureElement = document.getElementById('player1MatchPicture');
    pictureElement.src = user.profile_picture; 
    addUserToMatch(user.id, user.username, user.profile_picture, 0);
  }

  import { addUserToTournament } from "../../tournament/js/newTournament.js";
import { get_friends_list } from "./userManagement.js";

  export function RenderUserTournament(user) {
    const usernameElement = document.getElementById('player1TournamentUsername');
    usernameElement.textContent = user.username;
    const pictureElement = document.getElementById('player1TournamentPicture');
    pictureElement.src = user.profile_picture;
    addUserToTournament(user.id, user.username, user.profile_picture);
  }

const backButtonArenaPage = document.querySelector(".planetBackButton");
backButtonArenaPage.addEventListener('click', () => {
    togglePlanet();
  });

  export function initArenaPlanet() {
    RenderAllUsersInList();
  }