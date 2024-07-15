import { getTranslatedText } from "../../html/js/translatePages.js";
import { gameState } from "../../game/js/main.js";
import { resetAddingMode, setAddingMode, plusClicked} from "../../html/js/arenaPage.js";
import { switchToGame } from "../../html/js/arenaPage.js";
import { printBracket, updateBracket, resetBracket } from "./bracket.js";
import { getProfileInfo, populateProfileInfos, getUserStatus } from "../../html/js/userManagement.js";
import { putUserInMatch } from "../../html/js/arenaPage.js";


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

export function resetTournament() {
  document.querySelectorAll('.before-launch').forEach(function(el) {
    el.style.display = 'flex';
  });
  bracketElement.style.display = "none";
  nextMatchElement.textContent = getTranslatedText('nextMatch');
  nextMatchElement.style.display = "block";
  bottomTournamentElement.style.display = "none";
  midColumn.style.width = '80%';
  playerNb = 0;
  tournamentState = 0;
  gamemodeCounterTournament = 0;
  mapCounterTournament = 0;
  botDifficultyTournament = 1;
  round = 1;
  thirdPlayerMode = false;
  plusClickedTournament = false;
  getProfileInfo(sessionStorage.getItem("host_id"))
  .then(data => {
      populateProfileInfos(data);
  })
  resetAddingMode("tournament");
  resetBracket();
}

//add user to tournaments

let profileAddedToTournament = [];
let plusClickedTournament = false;
const botID = 0;
let playerNb = 0;
export let tournamentState = 0;

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

const pwWindow = document.querySelectorAll(".enterPasswordWindow")[0];
const aliasWindow = document.querySelectorAll(".enterPasswordWindow")[1];
let tempTileIndexTournament = -1;
const validateAliasButton = document.getElementById("aliasLogInButton");


  export function askForAlias(user){
    pwWindow.classList.remove("showRectangle");
    aliasWindow.classList.toggle("showRectangle");
    console.log("user", user);
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
    if (tournamentPlayer.some(player=> player.username === username && player.username !== "bot")){
      return ;
    }
    tournamentPlayer.push({
      playerId: playerId,
      username: username,
      profile_picture: profile_picture,
      order: -1,
      position: 0,
      round: 1,
    });
  }


  export function toggleThirdPlayerMode() {
    
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
  let thirdPlayerMode = false; //must be removed to use the real variable

  function makeMatchup() {
    const ul = document.getElementById("match");
    // ul.innerHTML = "";
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
      ul.textContent = playersInTournament[0].username + " has won the tournament!";
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
    if (currentMatch[nbMatch][0] && currentMatch[nbMatch][1])
      ul.textContent = currentMatch[nbMatch][0].myRef.username + " vs " + currentMatch[nbMatch][1].myRef.username;
    else if (currentMatch[nbMatch][0])
      ul.textContent = currentMatch[nbMatch][0].myRef.username;
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

  launchTournamentElement.addEventListener("click", function() {
    if (countNonBotPlayer(tournamentPlayer) < 3){
      const ul = document.getElementById("error_msg");
      ul.textContent = getTranslatedText('ErrorMinus');
      return ;
    }
    else if (tournamentPlayer.length > 8){
      const ul = document.getElementById("error_msg");
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
    bottomTournamentElement.style.display = "flex";
    midColumn.style.width = "100%";
    printBracket(tournamentPlayer, currentMatch, thirdPlayerMode);
  });

  launchMatchElement.addEventListener("click", function(){
    findWinner();
  });

  function nextMatch() {
    nbMatch ++;
    let ul = document.getElementById("match");
    // ul.innerHTML = "";
    if (nbMatch >= currentMatch.length){
      makeMatchup();
      return ; 
    }
    else if (currentMatch[nbMatch][0] && currentMatch[nbMatch][1])
      ul.textContent = currentMatch[nbMatch][0].myRef.username + " vs " + currentMatch[nbMatch][1].myRef.username;
    else if (currentMatch[nbMatch][0])
      ul.textContent = currentMatch[nbMatch][0].myRef.username;
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
    updateBracket(tournamentPlayer, winner_name, currentMatch, nbMatch, round);
    nextMatch();
    if (gameState.arenaCreated) //if the game has never been launch
      gameState.arena.game.resetUsers();
  }

  function findWinner(){
    // afterGameTournament(3,0);
    // return;
    if (!currentMatch[nbMatch][1]){
      afterGameTournament(3, 0);
      return;
    }
    const player1Status = getUserStatus(currentMatch[nbMatch][0].myRef.playerId);
    const player2Status = getUserStatus(currentMatch[nbMatch][1].myRef.playerId);
    if (player1Status === undefined)//if (player1Status === undefined || player1Status === "offline"){
      afterGameTournament(0, 3);
    else if (player2Status === undefined) //if (player2Status === undefined || player2Status === "offline"){
      afterGameTournament(3, 0);
    else if (currentMatch[nbMatch][0].myRef.playerId === currentMatch[nbMatch][1].myRef.playerId)
      afterGameTournament(3, 0);
    else
      switchToGame(gameState, currentMatch[nbMatch][0].myRef, currentMatch[nbMatch][1].myRef, currentMatch[nbMatch][4].myRef, true);
    }

