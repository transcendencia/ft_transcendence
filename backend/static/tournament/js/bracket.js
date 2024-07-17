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
const firstTopTopElement = document.getElementById("first-top-top");
const firstTopBotElement = document.getElementById("first-top-bot");
const firstSecondTopElement = document.getElementById("first-second-top");
const firstBotTopElement = document.getElementById("first-bot-top");
const firstBotBotElement = document.getElementById("first-bot-bot");
const firstSecondBotElement = document.getElementById("first-second-bot");
const secondTopElement = document.getElementById("second-top");
const secondBotElement = document.getElementById("second-bot");
const secondLineElement = document.getElementById("second-line");


export function resetBracket(){
  let ul = document.getElementById("A1_name");
  ul.textContent = '';
  ul = document.getElementById("A2_name");
  ul.textContent = '';
  ul = document.getElementById("A3_name");
  ul.textContent = '';
  ul = document.getElementById("A4_name");
  ul.textContent = '';
  ul = document.getElementById("A5_name");
  ul.textContent = '';
  ul = document.getElementById("A6_name");
  ul.textContent = '';
  ul = document.getElementById("A7_name");
  ul.textContent = '';
  ul = document.getElementById("A8_name");
  ul.textContent = '';
  ul = document.getElementById("B1_name");
  ul.textContent = '';
  ul = document.getElementById("B2_name");
  ul.textContent = '';
  ul = document.getElementById("B3_name");
  ul.textContent = '';
  ul = document.getElementById("B4_name");
  ul.textContent = '';
  ul = document.getElementById("C1_name");
  ul.textContent = '';
  ul = document.getElementById("C2_name");
  ul.textContent = '';
  ul = document.getElementById("third-A1_name");
  ul.textContent = '';
  ul = document.getElementById("third-A2_name");
  ul.textContent = '';
  ul = document.getElementById("third-A3_name");
  ul.textContent = '';
  ul = document.getElementById("third-A4_name");
  ul.textContent = '';
  ul = document.getElementById("third-B1_name");
  ul.textContent = '';
  ul = document.getElementById("third-B2_name");
  ul.textContent = '';
  ul = document.getElementById("third-C1_name");
  ul.textContent = '';
  ul = document.getElementById("A1_score");
  ul.textContent = '';
  ul = document.getElementById("A2_score");
  ul.textContent = '';
  ul = document.getElementById("A3_score");
  ul.textContent = '';
  ul = document.getElementById("A4_score");
  ul.textContent = '';
  ul = document.getElementById("A5_score");
  ul.textContent = '';
  ul = document.getElementById("A6_score");
  ul.textContent = '';
  ul = document.getElementById("A7_score");
  ul.textContent = '';
  ul = document.getElementById("A8_score");
  ul.textContent = '';
  ul = document.getElementById("B1_score");
  ul.textContent = '';
  ul = document.getElementById("B2_score");
  ul.textContent = '';
  ul = document.getElementById("B3_score");
  ul.textContent = '';
  ul = document.getElementById("B4_score");
  ul.textContent = '';
  ul = document.getElementById("C1_score");
  ul.textContent = '';
  ul = document.getElementById("C2_score");
  ul.textContent = '';

  A1A2matchElement.className = '';
  A1A2matchElement.classList.add("match");
  A3A4matchElement.className = '';
  A3A4matchElement.classList.add("match");
  A5A6matchElement.className = '';
  A5A6matchElement.classList.add("match");
  A7A8matchElement.className = '';
  A7A8matchElement.classList.add("match");
  B1B2matchElement.className = '';
  B1B2matchElement.classList.add("match");
  B3B4matchElement.className = '';
  B3B4matchElement.classList.add("match");
  C1C2matchElement.className = '';
  C1C2matchElement.classList.add("match");

  A1Element.style.display = "none";
  A2Element.style.display = "none";
  A3Element.style.display = "none";
  A4Element.style.display = "none";
  A5Element.style.display = "none";
  A6Element.style.display = "none";
  A7Element.style.display = "none";
  A8Element.style.display = "none";
  B1Element.style.display = "none";
  B2Element.style.display = "none";
  B3Element.style.display = "none";
  B4Element.style.display = "none";
  C1Element.style.display = "none";
  C2Element.style.display = "none";
  thirdA1Element.style.display = "none";
  thirdA2Element.style.display = "none";
  thirdA3Element.style.display = "none";
  thirdA4Element.style.display = "none";
  thirdB1Element.style.display = "none";
  thirdB2Element.style.display = "none";
  thirdC1Element.style.display = "none";
  firstTopTopElement.style.display = "none";
  firstTopBotElement.style.display = "none";
  firstSecondTopElement.style.display = "none";
  firstBotTopElement.style.display = "none";
  firstBotBotElement.style.display = "none";
  firstSecondBotElement.style.display = "none";
  secondTopElement.style.display = "none";
  secondBotElement.style.display = "none";
  secondLineElement.style.display = "none";
}

export function printBracket(tournamentPlayer, currentMatch, thirdPlayerMode) {
    console.log("tournamentPlayer", tournamentPlayer);
    console.log("currentMatch", currentMatch);
    if (!thirdPlayerMode){
      document.querySelectorAll('.match').forEach(function(el) {
        el.style.height = "62px";
      });
      document.querySelectorAll('.match-bottom').forEach(function(el) {
        el.style.borderRadius = "0 0 5px 5px";
      });
    }
    else {
      document.querySelectorAll('.match').forEach(function(el) {
        el.style.height = "93px";
      });
      document.querySelectorAll('.match-bottom').forEach(function(el) {
        el.style.borderRadius = "0 0 0px 0px";
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

  const A1A2matchElement = document.getElementById("A1-A2-match");
  const A3A4matchElement = document.getElementById("A3-A4-match");
  const A5A6matchElement = document.getElementById("A5-A6-match");
  const A7A8matchElement = document.getElementById("A7-A8-match");
  const B1B2matchElement = document.getElementById("B1-B2-match");
  const B3B4matchElement = document.getElementById("B3-B4-match");
  const C1C2matchElement = document.getElementById("C1-C2-match");

  export function updateBracket(tournamentPlayer, winner_name, currentMatch, nbMatch, round){ 
    if (round >= 3 && currentMatch[nbMatch][5]){
      let tmp = currentMatch[nbMatch][0];
      let tmpScore = currentMatch[nbMatch][2];
      
      currentMatch[nbMatch][0] = currentMatch[nbMatch][1];
      currentMatch[nbMatch][1] = tmp;
      currentMatch[nbMatch][2] = currentMatch[nbMatch][3];
      currentMatch[nbMatch][3] = tmpScore
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
    else if (round == 3){
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
    else if (round == 4){
      if (currentMatch[nbMatch][2] > currentMatch[nbMatch][3])
          C1C2matchElement.classList.add("winner-top");
        else
          C1C2matchElement.classList.add("winner-bottom");
      let ul = document.getElementById("C1_score");
      ul.textContent = currentMatch[nbMatch][2];
      ul = document.getElementById("C2_score");
      ul.textContent = currentMatch[nbMatch][3];
    }
  }