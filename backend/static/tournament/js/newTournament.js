import { getTranslatedText } from "../../html/js/translatePages.js";
import { gameState } from "../../game/js/main.js";
import { createUserInfoObject, displayRemovePlayerVisual, resetToPlusButton, resetUserInfoVisual, createUserTile, switchToGame } from "../../html/js/arenaPage.js";
import { blue, purple, grey, lightGrey } from "../../html/js/arenaPage.js";
import { printBracket, updateBracket, resetBracket } from "./bracket.js";
import { getProfileInfo, get_friends_list, getUserStatus } from "../../html/js/userManagement.js";


export let gamemodeCounterTournament = 0;
export let mapCounterTournament = 0;
export let botDifficultyTournament = 1;

function toggleGamemodeTournament(buttonHeader, imgIndex) {
  if (imgIndex === 0){
      gamemodeCounterTournament--;
      if (gamemodeCounterTournament === -1)
          gamemodeCounterTournament = 2;
      }
  else {
      gamemodeCounterTournament++;    
      if (gamemodeCounterTournament === 3) // 0 = classic 1 = powerless 2= spin only 
          gamemodeCounterTournament = 0;
      } 
  if (gamemodeCounterTournament === 0)
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = getTranslatedText('gamemodeNameText1');
  else if (gamemodeCounterTournament === 1)
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = getTranslatedText('gamemodeNameText2');
  else if (gamemodeCounterTournament === 2)
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = getTranslatedText('gamemodeNameText3');
}

function handleMapsTournament(buttonHeader, imgIndex) {
  if (imgIndex === 0){
      mapCounterTournament--;
      if (mapCounterTournament === -1)
          mapCounterTournament = 3;
  }
  else {
      mapCounterTournament++;    
      if (mapCounterTournament === 4)
          mapCounterTournament = 0;
  } 
  if (mapCounterTournament === 0)
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = 'Space';
  else if (mapCounterTournament === 1)
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = 'Ocean';
  else if (mapCounterTournament === 2)
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = 'Sky';
  else if (mapCounterTournament === 3)
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = 'Dragon Pit';
}

function handleBotDifficulty(buttonHeader, imgIndex) {
  if (imgIndex === 0){
      botDifficultyTournament--;
      if (botDifficultyTournament === -1)
          botDifficultyTournament = 2;
  }
  else {
      botDifficultyTournament++;    
      if (botDifficultyTournament === 3)
          botDifficultyTournament = 0;
  }
  if (botDifficultyTournament === 0)
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = getTranslatedText('botDifficultyEasy');
  else if (botDifficultyTournament === 1)
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = getTranslatedText('botDifficultyMedium');
  else if (botDifficultyTournament === 2)
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = getTranslatedText('botDifficultyHard');
}

const buttonHeaders = document.querySelectorAll('.buttonTitleVert');
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
                toggleGamemodeTournament(buttonHeader, imgIndex);
            if (index === 1)
                handleMapsTournament(buttonHeader, imgIndex);
            if (index === 2)
                handleBotDifficulty(buttonHeader, imgIndex);
        });
    });
});

export function RenderUserTournament(user) {
    const usernameElement = document.getElementById('player1TournamentUsername');
    usernameElement.textContent = user.username;
    const pictureElement = document.getElementById('player1TournamentPicture');
    pictureElement.src = user.profile_picture;
    addUserToTournament(user.id, user.username, user.profile_picture);
  }

let plusButtons = document.querySelectorAll(".plusPlayerTournament");
const userTilesTournament = [];  // Array to store the user tiles

export async function RenderAllUsersTournament() {
    const userListBackground = document.getElementById('userlistTournamentPage');
    
    userListBackground.innerHTML = '';
    userTilesTournament.length = 0;
    const users = await get_friends_list();

    createUserTile(users.bot, 'Bot', userListBackground, userTilesTournament);
    users.friends.forEach(obj => {createUserTile(obj.user, 'Friend', userListBackground, userTilesTournament)});
    users.user_not_friend.forEach(user => {createUserTile(user, '', userListBackground, userTilesTournament)});
    addEventListenerToTilesTournament();
}

export function resetTournament() {
  document.querySelectorAll('.before-launch').forEach(function(el) {
    el.style.display = 'flex';
  });
  launchMatchElement.style.display = "none";
  bracketElement.style.display = "none";
  nextMatchElement.style.display = "none";
  matchElement.style.display = "none";
  profileAddedToTournament = [];
  playerNb = 0;
  tournamentState = 0;
  tournamentPlayer.length = 0;
  gamemodeCounterTournament = 0;
  mapCounterTournament = 0;
  botDifficultyTournament = 1;
  round = 1;
  thirdPlayerMode = false;
  plusClickedTournament = false;
  getProfileInfo();
  resetPlusButton();
  resetBracket();
  plusButtons = document.querySelectorAll(".plusPlayerTournament");
  plusButtons.forEach(function(otherPlusButton) {
    otherPlusButton.style.pointerEvents = 'auto';
  });
}

//add user to tournaments

const userlist = document.querySelectorAll(".userlistBackground")[2];

let profileAddedToTournament = [];
let plusClickedTournament = false
const botID = 0;
let playerNb = 0;
export let tournamentState = 0;

function GlowTournament() {
  userlist.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
  userlist.style.borderColor = '#ffb30eff';
  userlist.style.animation = 'shadowBlink 1s infinite alternate ease-in-out';
  userTilesTournament.forEach((tile, i) => {
      if (profileAddedToTournament[i])
          return;
      const tileChildren = tile.HTMLelement.querySelectorAll(":scope > *");
      tileChildren.forEach(function(element) {
          element.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
          element.style.borderColor = '#ffb30eff';
          element.style.animation = 'shadowBlink 1s infinite alternate ease-in-out';
      });
  });
}

function resetGlowTournament() {
  userlist.style.borderColor = blue;
  userlist.style.animation = '';
  userTilesTournament.forEach((child, i) => {
      const children = child.HTMLelement.querySelectorAll(":scope > *");
      children.forEach(element => {
          element.style.borderColor = blue;
          element.style.animation = '';
      });
      if (i === botID) {
          children.forEach(element => {
              element.style.borderColor = purple;
          });
      }
  });
}

const leftColumn = document.querySelector(".leftColumn");
const userlistTitle = leftColumn.childNodes[1];
userlistTitle.textContent = getTranslatedText('userlist');

function resetAddingModeTournament() {
  userlistTitle.textContent = getTranslatedText('userlist');
  plusClickedTournament = 0;
  plusButtons.forEach(function(otherPlusButton) {
      otherPlusButton.style.pointerEvents = 'auto';
  });
  profileAddedToTournament[botID] = false;
}

function setAddingModeTournament(plusButton, i) {
  userlistTitle.textContent = getTranslatedText('chooseProfile');
  plusClickedTournament = i + 1;
  plusButtons.forEach(function(otherPlusButton) {
      if (otherPlusButton !== plusButton) {
          otherPlusButton.style.pointerEvents = 'none';
      }
  });
}

export function addEventListenersToPlusButtons() {
  plusButtons.forEach(function(plusButton, i) {
    plusButton.addEventListener('click', function () {
      if (!plusClickedTournament) {
            setAddingModeTournament(plusButton, i);
            GlowTournament();
            plusButton.style.backgroundColor = lightGrey;
        }
        else {
            resetAddingModeTournament(plusButton);
            resetGlowTournament();
            plusButton.style.backgroundColor = grey;
        }
    });
    //Hovering
    plusButton.addEventListener('mouseenter', function () {
        if (!plusClickedTournament)
            plusButton.style.backgroundColor = lightGrey;
    });
  
    plusButton.addEventListener('mouseleave', function () {
        if (!plusClickedTournament)
            plusButton.style.backgroundColor = grey;
    });
  });
}

export function initTournamentPlanet(){
  RenderAllUsersTournament();
  addEventListenersToPlusButtons();
}

export function resetPlusButton() {
  let addPlayerElements = document.querySelectorAll('.addPlayer');

  addPlayerElements.forEach((element, index) => {
    if (index === 0)
      return;
    let playerNumber = index + 1;
    element.innerHTML = `
      <div class="plusPlayerTournament" style="pointer-events: none;">+</div></div>
      <div id="player${playerNumber}Text" style="z-index:99; font-size: 15px; font-family: 'space'; color: white;"> Player ${playerNumber} </div>
    `;
  });
};

const blockingPanel = document.getElementById('blockingPanel');
const pwWindow = document.querySelector(".enterPasswordWindow");
const validatePasswordButton = document.getElementById("arenaLogInButton");
const backPasswordButton = document.getElementById("arenaBackLogInButton");
let tempTileIndexTournament = -1;

function addEventListenerToTilesTournament() {
  userTilesTournament.forEach((tile, i) => {
      profileAddedToTournament[i] = false;
      tile.HTMLelement.addEventListener('click', function() {
          if (plusClickedTournament && !profileAddedToTournament[i]) {
              if (tile.type == 'Bot' /*|| playerAlreadyLogged*/) {
                  tempTileIndexTournament = i;
                  putUserInTournament();
                  return;
              }
              pwWindow.classList.toggle("showRectangle");
              blockingPanel.classList.add('show');
              tempTileIndexTournament = i;
              const newObj = createUserInfoObject(tile, i);
              pwWindow.replaceChild(newObj.userInfoCont, pwWindow.querySelector('.userInfoCont'));
          }
      });
  });
}

  export function putUserInTournament() {
    if (plusClickedTournament && !profileAddedToTournament[tempTileIndexTournament]) {
      const i = tempTileIndexTournament;
      const tile = userTilesTournament[i];
      const textCont = tile.HTMLelement.querySelector(".textContainer");

      pwWindow.classList.remove("showRectangle");
      blockingPanel.classList.remove('show');
      profileAddedToTournament[i] = true;
      playerNb++;
      const newObj = createUserInfoObject(tile, i);
      addUserToTournament(tile.user.id, tile.user.username, tile.user.profile_picture);
      const oldObj = plusButtons[plusClickedTournament - 1];
      oldObj.parentNode.replaceChild(newObj.userInfoCont, oldObj);
      resetGlowTournament();
      resetAddingModeTournament();
      newObj.userInfoCont.addEventListener('mouseenter', function () {
          displayRemovePlayerVisual(newObj.userInfoCont, newObj.clonedImg, newObj.profilePic);
      });
      newObj.userInfoCont.addEventListener('mouseleave', function () {
          resetUserInfoVisual(newObj.userInfoCont, newObj.clonedImg, newObj.profilePic, newObj.tileText, i, tile);
      });
      newObj.userInfoCont.addEventListener('click', function() {
          resetToPlusButton(newObj.userInfoCont, oldObj, textCont);
          profileAddedToTournament[i] = false;
          profileAddedToTournament[botID] = false;
          playerNb--;
          removeUserFromTournament(tile.user.id);
      });

      if (tile.type === 'Friend')
        textCont.classList.remove('friendBg');
      else if (tile.type === 'Bot')
          textCont.classList.remove('botBg');
      else textCont.classList.remove('defaultBg');
    }
  }

  validatePasswordButton.addEventListener('click', function() {
    putUserInTournament();
  });

  backPasswordButton.addEventListener('click', function() {
    pwWindow.classList.remove("showRectangle");
    blockingPanel.classList.remove('show');
  });

  const tournamentPlayer = [];

  export function addUserToTournament(playerId, username, profile_picture) {
      if (!tournamentPlayer.some(player => player.username === username)) {
          tournamentPlayer.push({
            playerId: playerId,
            username: username,
            profile_picture: profile_picture,
            order: -1,
            position: 0,
            round: 1,
          });
      }
  }

  function removeUserFromTournament(playerId) {
    const playerIndex = tournamentPlayer.findIndex(player => player.playerId === playerId);
    //remove if player is find
    if (playerIndex !== -1)
        tournamentPlayer.splice(playerIndex, 1);
  }

  export function toggleThirdPlayerMode() {
    if (thirdPlayerMode === false)
      thirdPlayerMode = true;
    else thirdPlayerMode = false;
  }

  function getRandomNumber(tournamentPlayer, player1, player2) {
    let number;
    let username;
    do {
        number = Math.floor(Math.random() * tournamentPlayer.length);
        username = tournamentPlayer[number].username;
    } while (username === player1 || username === player2 || username === "bot");
    return number;
  }

  let currentMatch = [];
  let round = 1;
  let nbMatch;
  let thirdPlayerMode = false;

  function makeMatchup() {
    const ul = document.getElementById("match");
    ul.innerHTML = "";
    let playersInTournament = tournamentPlayer.filter(player => player.position === 0 && player.round == round);
    let j = 0;
    nbMatch = 0;
    currentMatch = [];
    //put final position for players who lost
    if (round != 1){
      tournamentPlayer.forEach(function(player){
        if (player.round + 1 === round)
          player.position = playersInTournament.length + 1;
      })
    }
    //put final position for the winner
    if (playersInTournament.length == 1){
      tournamentState = 2;
      tournamentPlayer.forEach(function(player){
        if (player.position === 0)
          player.position = 1;
      })
      nextMatchElement.style.display = "none";
      const li = document.createElement("p");
      li.textContent = playersInTournament[0].username + " has won the tournament!";
      ul.appendChild(li);
      launchMatchElement.style.display = "none";
      return ;
    }
    //put matchup in currentMatch variable
    for (let i = 0; i < playersInTournament.length; i += 2) {
      if (i + 1 >= playersInTournament.length){
        currentMatch.push([
          { myRef: playersInTournament[i] },
          "",
          -1,
          -1,
          "",
        ]);
      }
      else{
        if (playersInTournament[i].username === "bot"){
          const tmp = playersInTournament[i];
          playersInTournament[i] = playersInTournament[i + 1];
          playersInTournament[i + 1] = tmp;
        }
        if (thirdPlayerMode){
          let thirdPlayer = getRandomNumber(tournamentPlayer, playersInTournament[i].username, playersInTournament[i + 1].username);
          currentMatch.push([
            { myRef: playersInTournament[i] },
            { myRef: playersInTournament[i + 1] },
            -1,
            -1,
            { myRef: tournamentPlayer[thirdPlayer]},
          ]);
        }
        else{
          currentMatch.push([
            { myRef: playersInTournament[i] },
            { myRef: playersInTournament[i + 1] },
            -1,
            -1,
            "",
          ]);
        }
      }
      j ++;
    }
    const li = document.createElement("p");
    if (currentMatch[nbMatch][0] && currentMatch[nbMatch][1])
      li.textContent = currentMatch[nbMatch][0].myRef.username + " vs " + currentMatch[nbMatch][1].myRef.username;
    else if (currentMatch[nbMatch][0])
      li.textContent = currentMatch[nbMatch][0].myRef.username;
    ul.appendChild(li);
    if (round > 1){
      for (let i = 0; i < currentMatch.length; i ++) {
        if (thirdPlayerMode){
          if (round === 2){
            if (i === 0){
              let ul = document.getElementById("third-B1_name");
              ul.textContent = currentMatch[0][4].myRef.username;
            }
            else if (i === 1){
              let ul = document.getElementById("third-B2_name");
              if (currentMatch[1][4])
                ul.textContent = currentMatch[1][4].myRef.username;
              else
                ul.textContent = "...";
            }
          }
          else if (round === 3){
            let ul = document.getElementById("third-C1_name");
            ul.textContent = currentMatch[0][4].myRef.username;
          }
        }
      }
    }
    round ++;
  }

  const launchTournamentElement = document.getElementById("launch");
  const launchMatchElement = document.getElementById("launchMatch");
  const bracketElement = document.getElementById("bracket");
  const nextMatchElement = document.getElementById("next-match");
  const matchElement = document.getElementById("match");

  //launch the tournament when there is the right amount of players
  //create the matchup / print the bracket structure

  function botInTournament(tournamentPlayer){
    for (let player of tournamentPlayer) {
      if (player.username === "bot")
          return 1;
    }
    return 0;
  }

  launchTournamentElement.addEventListener("click", function() {
    if (tournamentPlayer.length < 3){
      const ul = document.getElementById("error_msg");
      // ul.textContent = "Not enough players";
      ul.textContent = getTranslatedText('ErrorMinus3');
      return ;
    }
    else if (tournamentPlayer.length < 4 && botInTournament(tournamentPlayer)){
      const ul = document.getElementById("error_msg");
      // ul.textContent = "4 players minimum to play with a bot";
      ul.textContent = getTranslatedText('ErrorMinus4');
      return ;
    }
    else if (tournamentPlayer.length > 8){
      const ul = document.getElementById("error_msg");
      // ul.textContent = "Too many players";
      ul.textContent = getTranslatedText('ErrorTooMany');
      return ;
    }
    tournamentState = 1;
    const ul = document.getElementById("error_msg");
    ul.textContent = "";
    tournamentPlayer.forEach(function(player){
      player.order = -1;
    });
    tournamentPlayer.forEach(function(player){
      let newOrder;
      do {
        newOrder = Math.floor(Math.random() * tournamentPlayer.length);
      } while (tournamentPlayer.some(otherPlayer => otherPlayer.order === newOrder));
      player.order = newOrder;
    });
    tournamentPlayer.sort((a, b) => a.order - b.order);
    makeMatchup();
    document.querySelectorAll('.before-launch').forEach(function(el) {
      el.style.display = 'none';
   });
    launchMatchElement.style.display = "flex";
    bracketElement.style.display = "inline";
    nextMatchElement.style.display = "flex";
    matchElement.style.display = "flex";
    printBracket(tournamentPlayer, currentMatch, thirdPlayerMode);
  });

  launchMatchElement.addEventListener("click", function(){
    findWinner();
  });

  function nextMatch() {
    nbMatch ++;
    let ul = document.getElementById("match");
    ul.innerHTML = "";
    let li = document.createElement("p");
    if (nbMatch >= currentMatch.length){
      makeMatchup();
      return ; 
    }
    else if (currentMatch[nbMatch][0] && currentMatch[nbMatch][1])
      li.textContent = currentMatch[nbMatch][0].myRef.username + " vs " + currentMatch[nbMatch][1].myRef.username;
    else if (currentMatch[nbMatch][0])
      li.textContent = currentMatch[nbMatch][0].myRef.username;
    ul.appendChild(li);
  }

  export function  afterGameTournament(leftScore, rightScore) {
    let winner_name;

    currentMatch[nbMatch][2] = leftScore;
    currentMatch[nbMatch][3] = rightScore;
    if (leftScore > rightScore){
      winner_name = currentMatch[nbMatch][0].myRef.username;
      currentMatch[nbMatch][0].myRef.round ++;
    }
    else{
      winner_name = currentMatch[nbMatch][1].myRef.username;
      currentMatch[nbMatch][0].myRef.round ++;
    }
    updateBracket(winner_name, currentMatch, nbMatch, round);
    nextMatch();
    if (gameState.arenaCreated) //if the game has never been launch
      gameState.arena.game.resetUsers();
  }

  function findWinner(){
    const player1Status = getUserStatus(currentMatch[nbMatch][0].myRef.playerId);
    const player2Status = getUserStatus(currentMatch[nbMatch][1].myRef.playerId);
    if (player1Status === undefined)//if (player1Status === undefined || player1Status === "offline"){
      afterGameTournament(0, 3);
    else if (player2Status === undefined) //if (player2Status === undefined || player2Status === "offline"){
      afterGameTournament(3, 0);
    else if (currentMatch[nbMatch][1])
      switchToGame(gameState, currentMatch[nbMatch][0].myRef, currentMatch[nbMatch][1].myRef, currentMatch[nbMatch][4].myRef, true);
    else afterGameTournament(3, 0);
  }

