const usernameLinks = document.querySelectorAll('.username-link');

  usernameLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const username = link.textContent.trim();
      addUserToTournament(username);
    });
  });

  let landedOnPlanet = 1;

  var planetPanel = document.querySelector(".planetPanel");
  var square = document.querySelector(".background");
  var images = document.querySelectorAll(".planetPanel img");
  let anim;

  function togglePanelDisplay() {
    if (anim)
        clearTimeout(anim);
    if (landedOnPlanet) {
        anim = setTimeout(function () {triggerInfiniteAnim()}, 2000);
        planetPanel.style.animation = "roll 2s forwards";
        images[0].style.animation = "moveImageRight 2s forwards";
        images[1].style.animation = "moveImageLeft 2s forwards";
        square.style.animation = "expandBG 2s forwards";
        landedOnPlanet = 0;
    } else {
        images[0].style.animation = "moveImageRightreverse 1s forwards";
        images[1].style.animation = "moveImageLeftreverse 1s forwards";
        square.style.animation = "expandBGreverse 1s forwards"
        anim = setTimeout(function() {planetPanel.style.animation = "";
        landedOnPlanet = 1;
    }, 2000)
    }
  }

    function triggerInfiniteAnim() {
        images[0].style.animation = "upDownImgL 2s infinite alternate ease-in-out";
        images[1].style.animation = "upDownImgR 2s infinite alternate ease-in-out";
    }

  document.addEventListener('keydown', (event) => { 
    if (event.key === 'e')
        togglePanelDisplay();
  });

  const tournamentPlayer = [];

  function addUserToTournament(username) {
      if (!tournamentPlayer.some(player => player.username === username)) {
          tournamentPlayer.push({
            username: username,
            order: -1,
            position: 0,
            round: 1,
          });
          // printTournamentPlayer();
      }
  }

  function printTournamentPlayer() {
    const tournamentTable = document.querySelector("#tournamentTable");
    tournamentTable.innerHTML = "";
    tournamentPlayer.forEach(function(player) {
      const divRow = document.createElement("div");
      divRow.classList.add("userTile");
      
      
      const divUsername = document.createElement("div");
      divUsername.classList.add("textContainer")
      divUsername.textContent = player.username;
      divRow.appendChild(divUsername);

      const divImg = document.createElement("div");
      divImg.classList.add("imgContainer");
      divRow.appendChild(divImg);

    // const divAction = document.createElement("div");
    // const actionLink = document.createElement("a");
    // actionLink.href = "#";
    // actionLink.textContent = "-";
    // divAction.appendChild(actionLink);
    // divRow.appendChild(divAction);

    // actionLink.addEventListener("click", function() {
    //   const index = tournamentPlayer.indexOf(player);
    //   if (index !== -1) {
    //     tournamentPlayer.splice(index, 1);
    //     printTournamentPlayer();
    //   }
    // });
      tournamentTable.appendChild(divRow);
    });
  }

  let currentMatch = [];
  let allMatch = [];
  let round = 1;
  let nbMatch;
  
  function makeMatchup() {
    const ul = document.getElementById("match");
    ul.innerHTML = "";
    let playersInTournament = tournamentPlayer.filter(player => player.position === 0 && player.round == round);
    let j = 0;
    nbMatch = 0;
    currentMatch.forEach(function(match){
      allMatch.push(
        JSON.parse(JSON.stringify(match))
      );
    })
    currentMatch = [];
    //put final position for players who lost
    if (round != 1){
      const ul = document.getElementById("result");
      ul.textContent = "";
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
      li.textContent = playersInTournament[0].username + " have won the tournament!";
      ul.appendChild(li);
      launchMatchElement.style.display = "none";
      // printAllResult();
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
        ]);
      }
      else{
        currentMatch.push([
          { myRef: playersInTournament[i] },
          { myRef: playersInTournament[i + 1] },
          -1,
          -1
        ]);
      }
      j ++;
    }
    const li = document.createElement("p");
    if (currentMatch[nbMatch][0] && currentMatch[nbMatch][1])
      li.textContent = currentMatch[nbMatch][0].myRef.username + " vs " + currentMatch[nbMatch][1].myRef.username;
    else if (currentMatch[nbMatch][0])
      li.textContent = currentMatch[nbMatch][0].myRef.username;
    ul.appendChild(li);
    round ++;
  }
  
  function printAllResult(){
    const ul = document.getElementById("allMatch");
    ul.innerHTML = "";
    allMatch.forEach(function(match) {
        const li = document.createElement("p");
        li.textContent = match[0].myRef.username + " " + match[2] + " vs " + match[1].myRef.username + " " + match[3];
        ul.appendChild(li);
    });
  }
  
  const nbPlayerElement = document.getElementById("nbPlayer");
  const launchTournamentElement = document.getElementById("launch");
  const launchMatchElement = document.getElementById("launchMatch");
  const bracketElement = document.getElementById("bracket");
  const nextMatchElement = document.getElementById("next-match");
  
  
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
  
  //print the bracket structure with the first matchup
  function printBracket() {
    if (tournamentPlayer.length > 0){
      A1Element.style.display = "flex";
      let ul = document.getElementById("A1_name");
      ul.textContent = tournamentPlayer[0].username;
      A2Element.style.display = "flex";
      ul = document.getElementById("A2_name");
      ul.textContent = tournamentPlayer[1].username;
      // if (thirdPlayerMode)
      thirdA1Element.style.display = "flex";
    }
    if (tournamentPlayer.length > 2){
      A3Element.style.display = "flex";
      let ul = document.getElementById("A3_name");
      ul.textContent = tournamentPlayer[2].username;
      A4Element.style.display = "flex";
      ul = document.getElementById("A4_name");
      if (tournamentPlayer.length > 3)
        ul.textContent = tournamentPlayer[3].username;
      else
        ul.textContent = "...";
      // if (thirdPlayerMode)
      thirdA2Element.style.display = "flex";
      B1Element.style.display = "flex";
      B2Element.style.display = "flex";
      // if (thirdPlayerMode)
      thirdB1Element.style.display = "flex";
      firstTopTopElement.style.display = "block";
      firstTopBotElement.style.display = "block";
      firstSecondTopElement.style.display = "block";
    }
    if (tournamentPlayer.length > 4){
      A5Element.style.display = "flex";
      let ul = document.getElementById("A5_name");
      ul.textContent = tournamentPlayer[4].username;
      A6Element.style.display = "flex";
      ul = document.getElementById("A6_name");
      if (tournamentPlayer.length > 5)
        ul.textContent = tournamentPlayer[5].username;
      else
        ul.textContent = "...";
      // if (thirdPlayerMode)
      thirdA3Element.style.display = "flex";
      B3Element.style.display = "flex";
      B4Element.style.display = "flex";
      // if (thirdPlayerMode)
      thirdB2Element.style.display = "flex";
      C1Element.style.display = "flex";
      C2Element.style.display = "flex";
      // if (thirdPlayerMode)
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
      ul.textContent = tournamentPlayer[6].username;
      A8Element.style.display = "flex";
      ul = document.getElementById("A8_name");
      if (tournamentPlayer.length > 7)
        ul.textContent = tournamentPlayer[7].username;
      else
        ul.textContent = "...";
      // if (thirdPlayerMode)
      thirdA4Element.style.display = "flex";
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
    // printTournamentPlayer();
    launchMatchElement.style.display = "inline";
    bracketElement.style.display = "inline";
    nextMatchElement.style.display = "inline";
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
    let ul = document.getElementById("result");
    ul.innerHTML = "";
    let li = document.createElement("p");
    let winner_name;
    if (!currentMatch[nbMatch][1]){
      li.textContent = currentMatch[nbMatch][0].myRef.username + " is the winner !";
      currentMatch[nbMatch][0].myRef.round ++;
      currentMatch[nbMatch][2] = 3;
      currentMatch[nbMatch][3] = 0;
      winner_name = currentMatch[nbMatch][0].myRef.username;
    }
    else{
      let result = Math.floor(Math.random() * 2);
      if (result === 0){
        li.textContent = currentMatch[nbMatch][0].myRef.username + " is the winner !";
        currentMatch[nbMatch][0].myRef.round ++;
        currentMatch[nbMatch][2] = 3;
        currentMatch[nbMatch][3] = Math.floor(Math.random() * 3);
        winner_name = currentMatch[nbMatch][0].myRef.username;
      }
      else{
        li.textContent = currentMatch[nbMatch][1].myRef.username + " is the winner !";
        currentMatch[nbMatch][1].myRef.round ++;
        currentMatch[nbMatch][3] = 3;
        currentMatch[nbMatch][2] = Math.floor(Math.random() * 3);
        winner_name = currentMatch[nbMatch][1].myRef.username;
      }
    }
    ul.appendChild(li);
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
    ul = document.getElementById("match");
    ul.innerHTML = "";
    li = document.createElement("p");
    if (nbMatch >= currentMatch.length){
      makeMatchup();
      return ; 
    }
    else if (currentMatch[nbMatch][0] && currentMatch[nbMatch][1])
      li.textContent = currentMatch[nbMatch][0].myRef.username + " vs " + currentMatch[nbMatch][1].myRef.username;
    else if (currentMatch[nbMatch][0])
      li.textContent = currentMatch[nbMatch][0].myRef.username;
    ul.appendChild(li);
    // printTournamentPlayer();
  }

const plusPlayerTournament = document.querySelectorAll(".plusPlayerTournament");

function resetAddingMode() {
  console.log("resetAddingMode");
  userlistTitle.textContent = getTranslatedText('userlist');
  plusClicked = 0;
  plusPlayerTournament.forEach(function(otherPlusButton) {
      otherPlusButton.style.pointerEvents = 'auto';
  });
  profileAdded[botID] = false;
}

function setAddingMode(plusButton, i) {
  userlistTitle.textContent = getTranslatedText('chooseProfile');
  if (i === 0) {
      plusClicked = 1;
      profileAdded[botID] = true;
  }
  else plusClicked = 2;
  plusPlayerTournament.forEach(function(otherPlusButton) {
      if (otherPlusButton !== plusButton) {
          otherPlusButton.style.pointerEvents = 'none';
      }
  });
}

plusPlayerTournament.forEach(function(plusButton, i) {
  console.log("forEach");
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
