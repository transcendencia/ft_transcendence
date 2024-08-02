import { getTranslatedText } from "../../html/js/translatePages.js";
import { gameState } from "../../game/js/main.js";
import { getProfileInfo, populateProfileInfos, getUserStatus } from "../../html/js/userManagement.js";
import { togglePlanet } from "../../html/js/enterPlanet.js";
import { resetAddingMode, setAddingMode, plusClicked} from "../../html/js/arenaPage.js";
import { addedPlayerBadges, resetToPlusButton, profileAdded, putUserInMatch, switchToGame } from "../../html/js/arenaPage.js";
import { printBracket, updateBracket, resetBracket, updateElementDisplayAndText } from "./bracket.js";
import { toggleRSContainerVisibility } from "../../html/js/main.js";
import { createTournament } from "./blockchain.js";

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
      if (gamemodeCounterTournament === 3) // 0 = classic 1 = powerless 2 = spin only 
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

export function resetHostTournament(){
	getProfileInfo(sessionStorage.getItem("host_id"))
	.then(data => {
		populateProfileInfos(data);
	})
}

export function resetTournamentPlayer(){
  tournamentPlayer.length = 0;
}

export function resetTournament() {
  if (tournamentState === 1 | tournamentState === -1)
      return ;
  document.querySelectorAll('.before-launch').forEach(function(el) {
    el.style.display = 'flex';
  });
  bracketElement.style.display = "none";
  nextMatchElement.textContent = getTranslatedText('nextMatch');
  nextMatchElement.style.display = "block";
  bottomTournamentElement.style.display = "none";
  midColumn.style.width = '80%';
  addedPlayerBadges.forEach(obj => {
		resetToPlusButton(obj.userBadge, plusButtonsTournament[obj.plusClicked - 1]);
	});
  profileAdded.length = 0;
  addedPlayerBadges.length = 0;
  tournamentPlayer.length = 0;
  tournamentState = 0;
  round = 1;
  getProfileInfo(sessionStorage.getItem("host_id"))
  .then(data => {
      populateProfileInfos(data);
  })
  resetAddingMode("tournament");
  resetBracket();
}

let tournamentState = -1;

export function changeTournamentStatus(newValue) {
  if (newValue === 2 && tournamentState !== 1)
    return;
  tournamentState = newValue;
}

const leftColumn = document.querySelector(".leftColumn");
const userlistTitle = leftColumn.childNodes[1];
userlistTitle.textContent = getTranslatedText('userlist');

export let plusButtonsTournament = document.querySelectorAll(".plusPlayerTournament");
plusButtonsTournament.forEach((plusButton, i) => {
	plusButton.classList.add('hover-enabled');
	plusButton.addEventListener('click', function () {
		if (!plusClicked)
			setAddingMode(plusButton, i, false);
		else if (plusClicked === i + 1)
			resetAddingMode("tournament");
	});
});

const blockingPanel = document.getElementById('blockingPanel');
const aliasWindow = document.querySelectorAll(".enterPasswordWindow")[1];
const validateAliasButton = document.getElementById("aliasLogInButton");

const backButtonTournamentPage = document.getElementById("trnmtBackButton");
const backButtonLaunchTournamentPage = document.getElementById("trnmtLaunchBackButton");
const cancelTournamentButton = document.getElementById("cancelTournamentButton");

backButtonTournamentPage.addEventListener('click', () => {togglePlanet(/* toggleRsContainer: */ true);});

backButtonLaunchTournamentPage.addEventListener('click', () => {togglePlanet(/* toggleRsContainer: */ true);});

cancelTournamentButton.addEventListener('click', () => {
  tournamentState = 2;
  togglePlanet(/*rscontainer*/true);
});

  export function askForAlias(user){
    aliasWindow.classList.toggle("showRectangle");
    const aliasText = document.getElementById('aliasText');
    if (user.alias === null)
      aliasText.textContent = user.username;
    else
      aliasText.textContent = user.alias;
  }

  validateAliasButton.addEventListener('click', function() {
		putUserInMatch(plusButtonsTournament, 'tournament');
    aliasWindow.classList.remove("showRectangle");
		blockingPanel.classList.remove('show');
  });

  const tournamentPlayer = [];

  export function addUserToTournament(playerId, username, profile_picture) {
    if (tournamentPlayer.some(player=> player.username === username && player.username !== "bot"))
      return ;
    tournamentPlayer.push({
      playerId: playerId,
      username: username,
      profile_picture: profile_picture,
      order: -1,
      position: 0,
      round: 1,
    });
  }

  export function removeUserFromTournament(playerId) {
    const playerIndex = tournamentPlayer.findIndex(player => player.playerId === playerId);
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

  function addPlayerToCurrentMatch(player1, player2, player3, inverted){
    currentMatch.push([
      player1,
      player2,
      -1,
      -1,
      player3,
      inverted,
    ]);
  }

  function putFinalPosiionWhenLost(playersInTournament){
    if (round != 1){
      tournamentPlayer.forEach(function(player){
        if (player.round + 1 === round)
          player.position = playersInTournament.length + 1;
      })
    }

  }

  function endTournament(playersInTournament, matchElement){
    tournamentState = 2;
    allMatch = formatAllMatches(allMatch);
    console.log("allMatch:", allMatch);
    createTournament(allMatch);
    console.log("createTournament");

    tournamentPlayer.forEach(function(player){
      if (player.position === 0)
        player.position = 1;
    })
    nextMatchElement.style.display = "none";
    if (playersInTournament.length == 0)
      matchElement.textContent = "..." + getTranslatedText('winningTournament');
    else
      matchElement.textContent = playersInTournament[0].username + getTranslatedText('winningTournament');
    launchMatchElement.style.display = "none";
    cancelTournamentButton.style.display = "none";
  }

  function printNextMatch(){
    const matchElement = document.getElementById("match");
    if (currentMatch[nbMatch][0] && currentMatch[nbMatch][1])
      matchElement.textContent = currentMatch[nbMatch][0].myRef.username + " vs " + currentMatch[nbMatch][1].myRef.username;
    else if (currentMatch[nbMatch][0])
      matchElement.textContent = currentMatch[nbMatch][0].myRef.username;
  }

  let allMatch = [];

  function storeAllMatchs(current, all) {
    current = current.map(match => {
        match = match.map(item => {
            if (typeof item === 'object' && item !== null && 'myRef' in item)
                return item.myRef.playerId;
            return item;
        });
        match.unshift(tournamentPhase);
        match.pop();
        const thirdValue = match.splice(2, 1)[0];
        match.splice(4, 0, thirdValue);
        if (match[4] === ''){
          match[4] = 0;
          match.push(false);
        }
        else
          match.push(true);
        if (match[5] === ''){
          match[5] = 0;
          match.push(false);
        }
        else
          match.push(true);
        return match;
    });
    all.push(...current);
    return all;
  }

  function formatAllMatches(allMatch) {
    const formattedMatches = allMatch.map(match => {
      return {
        tournamentPhase: match[0],
        player1Id: match[1],
        scorePlayer1: match[2],
        scorePlayer2: match[3],
        player2Id: match[4],
        player3Id: match[5],
        isPlayer2NoPlayer: match[6],
        isPlayer3NoPlayer: match[7]
      };
    });
    return formattedMatches;
}


  function makeMatchup() {
    const ul = document.getElementById("match");
    let playersInTournament = tournamentPlayer.filter(player => player.position === 0 && player.round == round);
    let j = 0;
    nbMatch = 0;
    allMatch = storeAllMatchs(currentMatch, allMatch);
    currentMatch = [];
    putFinalPosiionWhenLost(playersInTournament);
    if (playersInTournament.length == 1 || playersInTournament.length == 0){
      endTournament(playersInTournament, ul);
      return ;
    }
    for (let i = 0; i < playersInTournament.length; i += 2) {
      let inverted = 0;
      if (i + 1 >= playersInTournament.length)
        addPlayerToCurrentMatch({ myRef: playersInTournament[i] }, "", "", inverted);
      else{
        if (playersInTournament[i].username === "bot"){
          const tmp = playersInTournament[i];
          playersInTournament[i] = playersInTournament[i + 1];
          playersInTournament[i + 1] = tmp;
          inverted = 1;
        }
        if (thirdPlayerMode){
          let thirdPlayer = getRandomNumber(tournamentPlayer, playersInTournament[i].username, playersInTournament[i + 1].username);
          addPlayerToCurrentMatch({ myRef: playersInTournament[i] }, { myRef: playersInTournament[i + 1] }, { myRef: tournamentPlayer[thirdPlayer] }, inverted);
        }
        else{
          addPlayerToCurrentMatch({ myRef: playersInTournament[i] }, { myRef: playersInTournament[i + 1] }, "", inverted);
        }
      }
      j ++;
    }
    printNextMatch();
    if (round > 1){
      for (let i = 0; i < currentMatch.length; i ++) {
        if (thirdPlayerMode){
          if (round === 2){
            if (i === 0)
              updateElementDisplayAndText("third-B1_name", currentMatch[0][4].myRef.username);
            else if (i === 1){
              if (currentMatch[1][4])
                updateElementDisplayAndText("third-B2_name", currentMatch[1][4].myRef.username);
              else
                updateElementDisplayAndText("third-B2_name", "...");
            }
          }
          else if (round === 3)
            updateElementDisplayAndText("third-C1_name", currentMatch[0][4].myRef.username);
        }
      }
    }
    round ++;
    if (round == 2)
      return;
    if (tournamentPhase == "1/4")
        tournamentPhase = "1/2";
    else
      tournamentPhase = "1/1";
  }

  const launchTournamentElement = document.getElementById("launch");
  const launchMatchElement = document.getElementById("launchMatch");
  const bracketElement = document.getElementById("bracket");
  const bottomTournamentElement = document.getElementById("bottomTournament");
  const nextMatchElement = document.getElementById("next-match");
  const midColumn = document.getElementById("midColumn");


  function  countNonBotPlayer(tournamentPlayer){
    let nbPlayer = 0;
    for (let player of tournamentPlayer) {
      if (player.username !== "bot")
        nbPlayer ++;
    }
    return nbPlayer;
  }

  let tournamentPhase;

  launchTournamentElement.addEventListener("click", function() {
    if (countNonBotPlayer(tournamentPlayer) < 3 && thirdPlayerMode){
      updateElementDisplayAndText("error_msg", getTranslatedText('ErrorMinus'));
      return ;
    }
    if (tournamentPlayer.length < 3 && !thirdPlayerMode){
      updateElementDisplayAndText("error_msg", getTranslatedText('ErrorMinus'));
      return ;
    }
    if (tournamentPlayer.length <= 4)
      tournamentPhase = "1/2";
    else
      tournamentPhase = "1/4";
    allMatch = [];
    tournamentState = 1;
    updateElementDisplayAndText("error_msg", "");
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
    cancelTournamentButton.style.display = "flex";
    bracketElement.style.display = "inline";
    bottomTournamentElement.style.display = "flex";
    midColumn.style.width = "100%";
    printBracket(tournamentPlayer, currentMatch, thirdPlayerMode);
  });

  launchMatchElement.addEventListener("click", function(){
    findWinner();
  });

  function nextMatch() {
    nbMatch ++;
    if (nbMatch >= currentMatch.length){
      makeMatchup();
      return ; 
    }
    printNextMatch();
  }

  export function  afterGameTournament(leftScore, rightScore, noWinner = false) {
    let winner_name;

    if (noWinner){
      updateBracket(tournamentPlayer, "...", currentMatch, nbMatch, round);
      nextMatch();
      if (gameState.arenaCreated) //if the game has never been launch
        gameState.arena.game.resetUsers();
    }
    currentMatch[nbMatch][2] = leftScore;
    currentMatch[nbMatch][3] = rightScore;
    if (leftScore > rightScore){
      winner_name = currentMatch[nbMatch][0].myRef.username;
      currentMatch[nbMatch][0].myRef.round ++;
    }
    else{
      winner_name = currentMatch[nbMatch][1].myRef.username;
      currentMatch[nbMatch][1].myRef.round ++;
    }
    updateBracket(tournamentPlayer, winner_name, currentMatch, nbMatch, round);
    nextMatch();
    if (gameState.arenaCreated) //if the game has never been launch
      gameState.arena.game.resetUsers();
  }

  async function checkPlayerStatus() {
    const player1Status = getUserStatus(currentMatch[nbMatch][0].myRef.playerId);
    const player2Status = getUserStatus(currentMatch[nbMatch][1].myRef.playerId);

    return Promise.all([player1Status, player2Status]).then(([status1, status2]) => {
        if (status1 == undefined || status2 == undefined){
          afterGameTournament(0, 0, true);
          return 1;
        }
        if (status1 === "offline" && status2 === "offline") {
          afterGameTournament(0, 0, true);
          return 1;
        }
        if (status1 === "offline") {
          afterGameTournament(0, 3);
          return 1;
        }
        if (status2 === "offline") {
          afterGameTournament(3, 0);
          return 1;
        }
        return 0;
    }).catch(error => {
        afterGameTournament(0, 0, true);
        return 1;
    });
}

  async function findWinner(){
    afterGameTournament(3, 0);
    return; 
    if (!currentMatch[nbMatch][1]){
      afterGameTournament(3, 0);
      return;
    }
    const status = await checkPlayerStatus();
    if (status)
      return;
    if (currentMatch[nbMatch][0].myRef.playerId === currentMatch[nbMatch][1].myRef.playerId)
      afterGameTournament(3, 0);
    else
      switchToGame(gameState, currentMatch[nbMatch][0].myRef, currentMatch[nbMatch][1].myRef, currentMatch[nbMatch][4].myRef, true);
    }

