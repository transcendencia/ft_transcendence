import { createGame } from "./gameData.js";
import { getTranslatedText } from "../../html/js/translatePages.js";

//affichage info

let gamemodeCounter = 0;
let mapCounter = 0;

function toggleGamemodeTournament(buttonHeader, imgIndex) {
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
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = getTranslatedText('gamemodeNameText1');
  if (gamemodeCounter === 1)
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = getTranslatedText('gamemodeNameText2');
  if (gamemodeCounter === 2)
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = getTranslatedText('gamemodeNameText3');
}

function handleMapsTournament(buttonHeader, imgIndex) {
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
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = 'Space';
  if (mapCounter === 1)
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = 'Ocean';
  if (mapCounter === 2)
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = 'Sky';
  if (mapCounter === 3)
      buttonHeader.parentNode.querySelector('.buttonContVert').textContent = 'Dragon Pit';
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
        });
    });
});

//ajout des users au tournois

import { blue } from "../../html/js/arenaPage.js";
import { purple } from "../../html/js/arenaPage.js";
import { grey } from "../../html/js/arenaPage.js";
import { lightGrey } from "../../html/js/arenaPage.js";

const userlist = document.querySelector(".userlistBackground");

const plusButtons = document.querySelectorAll(".plusPlayerTournament");
let profileAddedToTournament = [];
let plusClickedTournament = false
const botID = 0;
let playerNb = 0;

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
  if (i === 0) {
      plusClickedTournament = 1;
      profileAddedToTournament[botID] = true;
  }
  else plusClickedTournament = i + 1;
  plusButtons.forEach(function(otherPlusButton) {
      if (otherPlusButton !== plusButton) {
          otherPlusButton.style.pointerEvents = 'none';
      }
  });
}

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

import { userTilesTournament } from "../../html/js/arenaPage.js";
import { createUserInfoObject } from "../../html/js/arenaPage.js";
import { displayRemovePlayerVisual } from "../../html/js/arenaPage.js";
import { resetToPlusButton } from "../../html/js/arenaPage.js";
import { resetUserInfoVisual } from "../../html/js/arenaPage.js";

export function addEventListenerToTilesTournament() {
  userTilesTournament.forEach((tile, i) => {
      profileAddedToTournament[i] = false;
      tile.HTMLelement.addEventListener('click', function(){
        if (plusClickedTournament && !profileAddedToTournament[i]) {
          profileAddedToTournament[i] = true;
          playerNb++;
          const newObj = createUserInfoObject(tile.HTMLelement, i);
          console.log("user add:", tile.user);
          addUserToTournament(tile.user.id, tile.user.username);
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
      }
  });
  
  const textCont = tile.HTMLelement.querySelector(".textContainer");
  textCont.addEventListener('mouseenter', function () {
      if (plusClickedTournament && !profileAddedToTournament[i])
      textCont.style.backgroundColor = 'rgba(90, 142, 255, 0.219)';
  });
  textCont.addEventListener('mouseleave', function () {
      if (plusClickedTournament && !profileAddedToTournament[i])
      textCont.style.backgroundColor = '#00000031';
  });
  });
}

  const tournamentPlayer = [];

  export function addUserToTournament(playerId, username) {
      if (!tournamentPlayer.some(player => player.username === username)) {
          tournamentPlayer.push({
            playerId: playerId,
            username: username,
            order: -1,
            position: 0,
            round: 1,
          });
      }
  }

  function removeUserFromTournament(playerId) {
    const playerIndex = tournamentPlayer.findIndex(player => player.playerId === playerId);
    //remove if player is find
    if (playerIndex !== -1) {
        tournamentPlayer.splice(playerIndex, 1);
        console.log(`Player with ID ${playerId} has been removed from the tournament.`);
    } else {
        console.log(`Player with ID ${playerId} is not in the tournament.`);
    }
  }

  function getRandomNumber(tournamentPlayer, player1, player2) {
    let number;
    do {
        number = Math.floor(Math.random() * tournamentPlayer.length);
    } while (tournamentPlayer[number].username === player1 || tournamentPlayer[number].username === player2);
    return number;
  }

  let currentMatch = [];
  let allMatch = [];
  let round = 1;
  let nbMatch;
  let thirdPlayerMode = 1; //must be removed to use the real variable

  function makeMatchup() {
    console.log(tournamentPlayer);
    const ul = document.getElementById("match");
    ul.innerHTML = "";
    let playersInTournament = tournamentPlayer.filter(player => player.position === 0 && player.round == round);
    let j = 0;
    nbMatch = 0;
    //all results are puts in allMatch
    currentMatch.forEach(function(match){
      allMatch.push(
        JSON.parse(JSON.stringify(match))
      );
    })
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
          ""
        ]);
      }
      else{
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
  
  
  const thirdA1Element = document.getElementById("third-A1");
  const thirdA2Element = document.getElementById("third-A2");
  const thirdA3Element = document.getElementById("third-A3");
  const thirdA4Element = document.getElementById("third-A4");
  const thirdB1Element = document.getElementById("third-B1");
  const thirdB2Element = document.getElementById("third-B2");
  const thirdC1Element = document.getElementById("third-C1");


  const A1Element = document.getElementById("A1");
  const A2Element = document.getElementById("A2");
  const A3Element = document.getElementById("A3");
  const A4Element = document.getElementById("A4");
  const A5Element = document.getElementById("A5");
  const A6Element = document.getElementById("A6");
  const A7Element = document.getElementById("A7");
  const A8Element = document.getElementById("A8");
  const B1Element = document.getElementById("B1");
  const B2Element = document.getElementById("B2");
  const B3Element = document.getElementById("B3");
  const B4Element = document.getElementById("B4");
  const C1Element = document.getElementById("C1");
  const C2Element = document.getElementById("C2");
  const A1A2matchElement = document.getElementById("A1-A2-match");
  const A3A4matchElement = document.getElementById("A3-A4-match");
  const A5A6matchElement = document.getElementById("A5-A6-match");
  const A7A8matchElement = document.getElementById("A7-A8-match");
  const B1B2matchElement = document.getElementById("B1-B2-match");
  const B3B4matchElement = document.getElementById("B3-B4-match");
  const C1C2matchElement = document.getElementById("C1-C2-match");
  const firstTopTopElement = document.getElementById("first-top-top");
  const firstTopBotElement = document.getElementById("first-top-bot");
  const firstSecondTopElement = document.getElementById("first-second-top");
  const firstBotTopElement = document.getElementById("first-bot-top");
  const firstBotBotElement = document.getElementById("first-bot-bot");
  const firstSecondBotElement = document.getElementById("first-second-bot");
  const secondTopElement = document.getElementById("second-top");
  const secondBotElement = document.getElementById("second-bot");
  const secondLineElement = document.getElementById("second-line");
  
  function printBracket() {
    if (!thirdPlayerMode){
      document.querySelectorAll('.match').forEach(function(el) {
        el.style.height = "62px";
      });
      document.querySelectorAll('.match-bottom').forEach(function(el) {
        el.style.borderRadius = "0 0 5px 5px";
      });
    }
    if (tournamentPlayer.length > 0){
      A1Element.style.display = "flex";
      let ul = document.getElementById("A1_name");
      ul.textContent = currentMatch[0][0].myRef.username;
      A2Element.style.display = "flex";
      ul = document.getElementById("A2_name");
      ul.textContent = currentMatch[0][1].myRef.username;
      if (thirdPlayerMode){
        thirdA1Element.style.display = "flex";
        ul = document.getElementById("third-A1_name");
        ul.textContent = currentMatch[0][4].myRef.username;
      }
    }
    if (tournamentPlayer.length > 2){
      A3Element.style.display = "flex";
      let ul = document.getElementById("A3_name");
      ul.textContent = currentMatch[1][0].myRef.username;
      A4Element.style.display = "flex";
      ul = document.getElementById("A4_name");
      if (tournamentPlayer.length > 3)
        ul.textContent = currentMatch[1][1].myRef.username;
      else
        ul.textContent = "...";
      if (thirdPlayerMode){
        thirdA2Element.style.display = "flex";
        ul = document.getElementById("third-A2_name");
        if (tournamentPlayer.length > 3)
          ul.textContent = currentMatch[1][4].myRef.username;
        else
          ul.textContent = "...";
      }
      B1Element.style.display = "flex";
      B2Element.style.display = "flex";
      if (thirdPlayerMode)
        thirdB1Element.style.display = "flex";
      firstTopTopElement.style.display = "block";
      firstTopBotElement.style.display = "block";
      firstSecondTopElement.style.display = "block";
    }
    if (tournamentPlayer.length > 4){
      A5Element.style.display = "flex";
      let ul = document.getElementById("A5_name");
      ul.textContent = currentMatch[2][0].myRef.username;
      A6Element.style.display = "flex";
      ul = document.getElementById("A6_name");
      if (tournamentPlayer.length > 5)
        ul.textContent = currentMatch[2][1].myRef.username;
      else
        ul.textContent = "...";
      if (thirdPlayerMode){
        thirdA3Element.style.display = "flex";
        ul = document.getElementById("third-A3_name");
        if (tournamentPlayer.length > 5)
          ul.textContent = currentMatch[2][4].myRef.username;
        else
          ul.textContent = "...";
      }
      B3Element.style.display = "flex";
      B4Element.style.display = "flex";
      if (thirdPlayerMode)
        thirdB2Element.style.display = "flex";
      C1Element.style.display = "flex";
      C2Element.style.display = "flex";
      if (thirdPlayerMode)
        thirdC1Element.style.display = "flex";
      firstBotTopElement.style.display = "block";
      firstSecondBotElement.style.display = "block";
      secondTopElement.style.display = "block";
      secondBotElement.style.display = "block";
      secondLineElement.style.display = "block";
    }
    if (tournamentPlayer.length > 6){
      A7Element.style.display = "flex";
      let ul = document.getElementById("A7_name");
      ul.textContent = currentMatch[3][0].myRef.username;
      A8Element.style.display = "flex";
      ul = document.getElementById("A8_name");
      if (tournamentPlayer.length > 7)
        ul.textContent = currentMatch[3][1].myRef.username;
      else
        ul.textContent = "...";
      if (thirdPlayerMode){
        thirdA4Element.style.display = "flex";
        ul = document.getElementById("third-A4_name");
        if (tournamentPlayer.length > 7)
          ul.textContent = currentMatch[3][4].myRef.username;
        else
          ul.textContent = "...";
      }
      firstBotBotElement.style.display = "block";
    }
  }

  //launch the tournament when there is the right amount of players
  //create the matchup / print the bracket structure

  launchTournamentElement.addEventListener("click", function() {
    if (tournamentPlayer.length < 3){
      const ul = document.getElementById("error_msg");
      ul.textContent = "Not enough players";
      return ;
    }
    if (tournamentPlayer.length > 8){
      const ul = document.getElementById("error_msg");
      ul.textContent = "Too many players";
      return ;
    }
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
    launchMatchElement.style.display = "inline";
    bracketElement.style.display = "inline";
    nextMatchElement.style.display = "inline";
    matchElement.style.display = "inline";
    const leftColumnElement = document.getElementById("leftColumn");
    const midColumnElement = document.getElementById("midColumn");
    const rightColumnElement = document.getElementById("rightColumn");
    leftColumnElement.style.width = "0%";
    midColumnElement.style.width = "30%";
    rightColumnElement.style.width = "70%";
    printBracket();
  });

  launchMatchElement.addEventListener("click", function(){
    findWinner();
  });
  
  function findWinner(){
    let winner_name;
    if (!currentMatch[nbMatch][1]){
      currentMatch[nbMatch][0].myRef.round ++;
      currentMatch[nbMatch][2] = 3;
      currentMatch[nbMatch][3] = 0;
      winner_name = currentMatch[nbMatch][0].myRef.username;
    }
    else{
      let result = Math.floor(Math.random() * 2);
      if (result === 0){
        currentMatch[nbMatch][0].myRef.round ++;
        currentMatch[nbMatch][2] = 3;
        currentMatch[nbMatch][3] = Math.floor(Math.random() * 3);
        winner_name = currentMatch[nbMatch][0].myRef.username;
      }
      else{
        currentMatch[nbMatch][1].myRef.round ++;
        currentMatch[nbMatch][3] = 3;
        currentMatch[nbMatch][2] = Math.floor(Math.random() * 3);
        winner_name = currentMatch[nbMatch][1].myRef.username;
      }
      createGame(currentMatch[nbMatch][0].myRef.playerId, currentMatch[nbMatch][1].myRef.playerId, currentMatch[nbMatch][4].myRef.playerId, currentMatch[nbMatch][2], currentMatch[nbMatch][3], "tournament", "test");
    }
    if (round == 2){
      if (nbMatch == 0){
        let ul = document.getElementById("B1_name");
        ul.textContent = winner_name;
        if (currentMatch[nbMatch][2] > currentMatch[nbMatch][3])
          A1A2matchElement.classList.add("winner-top");
        else
          A1A2matchElement.classList.add("winner-bottom");
        ul = document.getElementById("A1_score");
        ul.textContent = currentMatch[nbMatch][2];
        ul = document.getElementById("A2_score");
        ul.textContent = currentMatch[nbMatch][3];
      }
      else if (nbMatch == 1){
        let ul = document.getElementById("B2_name");
        ul.textContent = winner_name;
        if (currentMatch[nbMatch][2] > currentMatch[nbMatch][3])
          A3A4matchElement.classList.add("winner-top");
        else
          A3A4matchElement.classList.add("winner-bottom");
        ul = document.getElementById("A3_score");
        ul.textContent = currentMatch[nbMatch][2];
        ul = document.getElementById("A4_score");
        ul.textContent = currentMatch[nbMatch][3];
      }
      else if (nbMatch == 2){
        let ul = document.getElementById("B3_name");
        ul.textContent = winner_name;
        if (currentMatch[nbMatch][2] > currentMatch[nbMatch][3])
          A5A6matchElement.classList.add("winner-top");
        else
          A5A6matchElement.classList.add("winner-bottom");
        if (tournamentPlayer.length === 5){
          ul = document.getElementById("B4_name");
          ul.textContent = "...";
        }
        ul = document.getElementById("A5_score");
        ul.textContent = currentMatch[nbMatch][2];
        ul = document.getElementById("A6_score");
        ul.textContent = currentMatch[nbMatch][3];
      }
      else if (nbMatch == 3){
        let ul = document.getElementById("B4_name");
        ul.textContent = winner_name;
        if (currentMatch[nbMatch][2] > currentMatch[nbMatch][3])
          A7A8matchElement.classList.add("winner-top");
        else
          A7A8matchElement.classList.add("winner-bottom");
        ul = document.getElementById("A7_score");
        ul.textContent = currentMatch[nbMatch][2];
        ul = document.getElementById("A8_score");
        ul.textContent = currentMatch[nbMatch][3];
      }
    }
    if (round == 3){
      if (nbMatch == 0){
        let ul = document.getElementById("C1_name");
        ul.textContent = winner_name;
        if (currentMatch[nbMatch][2] > currentMatch[nbMatch][3])
          B1B2matchElement.classList.add("winner-top");
        else
          B1B2matchElement.classList.add("winner-bottom");
        ul = document.getElementById("B1_score");
        ul.textContent = currentMatch[nbMatch][2];
        ul = document.getElementById("B2_score");
        ul.textContent = currentMatch[nbMatch][3];
      }
      else if (nbMatch == 1){
        let ul = document.getElementById("C2_name");
        ul.textContent = winner_name;
        if (currentMatch[nbMatch][2] > currentMatch[nbMatch][3])
          B3B4matchElement.classList.add("winner-top");
        else
          B3B4matchElement.classList.add("winner-bottom");
        ul = document.getElementById("B3_score");
        ul.textContent = currentMatch[nbMatch][2];
        ul = document.getElementById("B4_score");
        ul.textContent = currentMatch[nbMatch][3];
      }
    }
    if (round == 4){
      if (currentMatch[nbMatch][2] > currentMatch[nbMatch][3])
          C1C2matchElement.classList.add("winner-top");
        else
          C1C2matchElement.classList.add("winner-bottom");
      let ul = document.getElementById("C1_score");
      ul.textContent = currentMatch[nbMatch][2];
      ul = document.getElementById("C2_score");
      ul.textContent = currentMatch[nbMatch][3];
    }
    //print the nextMatch
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

