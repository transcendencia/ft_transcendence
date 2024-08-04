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

export function resetBracket() {
  const ids = [
    "A1_name", "A2_name", "A3_name", "A4_name", "A5_name", "A6_name", "A7_name", "A8_name",
    "B1_name", "B2_name", "B3_name", "B4_name",
    "C1_name", "C2_name",
    "third-A1_name", "third-A2_name", "third-A3_name", "third-A4_name", "third-B1_name", "third-B2_name", "third-C1_name",
    "A1_score", "A2_score", "A3_score", "A4_score", "A5_score", "A6_score", "A7_score", "A8_score",
    "B1_score", "B2_score", "B3_score", "B4_score", "C1_score", "C2_score"
  ];

  ids.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = '';
    }
  });

  const matchElements = [
    { element: A1A2matchElement, className: "match" },
    { element: A3A4matchElement, className: "match" },
    { element: A5A6matchElement, className: "match" },
    { element: A7A8matchElement, className: "match" },
    { element: B1B2matchElement, className: "match" },
    { element: B3B4matchElement, className: "match" },
    { element: C1C2matchElement, className: "match" },
  ];

  matchElements.forEach(({ element, className }) => {
    element.className = '';
    element.classList.add(className);
  });

  const elementsToHide = [
    A1Element, A2Element, A3Element, A4Element, A5Element, A6Element, A7Element, A8Element,
    B1Element, B2Element, B3Element, B4Element,
    C1Element, C2Element,
    thirdA1Element, thirdA2Element, thirdA3Element, thirdA4Element, thirdB1Element, thirdB2Element, thirdC1Element,
    firstTopTopElement, firstTopBotElement, firstSecondTopElement, firstBotTopElement, firstBotBotElement, firstSecondBotElement,
    secondTopElement, secondBotElement, secondLineElement
  ];

  elementsToHide.forEach(element => {
    element.style.display = "none";
  });
}

function updateBracketGap(thirdPlayerMode){
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
}

export function updateElementDisplayAndText(elementId, textContent, element = null) {
  if (element)
    element.style.display = "flex";
  const ul = document.getElementById(elementId);
  ul.textContent = textContent;
}

function display4PlayersBracket(thirdPlayerMode){
  B1Element.style.display = "flex";
  B2Element.style.display = "flex";
  if (thirdPlayerMode)
    thirdB1Element.style.display = "flex";
  firstTopTopElement.style.display = "block";
  firstTopBotElement.style.display = "block";
  firstSecondTopElement.style.display = "block";
}

function display8PlayersBracket(thirdPlayerMode){
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

export function printBracket(tournamentPlayer, currentMatch, thirdPlayerMode) {
    updateBracketGap(thirdPlayerMode); 
    if (tournamentPlayer.length > 0){
      updateElementDisplayAndText("A1_name", currentMatch[0][0].myRef.username, A1Element);
      updateElementDisplayAndText("A2_name", currentMatch[0][1].myRef.username, A2Element);
      if (thirdPlayerMode){
        updateElementDisplayAndText("third-A1_name", currentMatch[0][4].myRef.username, thirdA1Element);
      }
    }
    if (tournamentPlayer.length > 2){
      updateElementDisplayAndText("A3_name", currentMatch[1][0].myRef.username, A3Element);
      if (tournamentPlayer.length > 3)
        updateElementDisplayAndText("A4_name", currentMatch[1][1].myRef.username, A4Element);
      else
        updateElementDisplayAndText("A4_name", "...", A4Element);
      if (thirdPlayerMode){
        if (tournamentPlayer.length > 3)
          updateElementDisplayAndText("third-A2_name", currentMatch[1][4].myRef.username, thirdA2Element);
        else
          updateElementDisplayAndText("third-A2_name", "...", thirdA2Element);
      }
      display4PlayersBracket(thirdPlayerMode);
    }
    if (tournamentPlayer.length > 4){
      updateElementDisplayAndText("A5_name", currentMatch[2][0].myRef.username, A5Element);
      if (tournamentPlayer.length > 5)
        updateElementDisplayAndText("A6_name", currentMatch[2][1].myRef.username, A6Element);
      else
        updateElementDisplayAndText("A6_name", "...", A6Element);
      if (thirdPlayerMode){
        if (tournamentPlayer.length > 5)
          updateElementDisplayAndText("third-A3_name", currentMatch[2][4].myRef.username, thirdA3Element);
        else
          updateElementDisplayAndText("third-A3_name", "...", thirdA3Element);
      }
      display8PlayersBracket(thirdPlayerMode);
    }
    if (tournamentPlayer.length > 6){
      updateElementDisplayAndText("A7_name", currentMatch[3][0].myRef.username, A7Element);      
      if (tournamentPlayer.length > 7)
        updateElementDisplayAndText("A8_name", currentMatch[3][1].myRef.username, A8Element);
      else
        updateElementDisplayAndText("A8_name", "...", A8Element);
      if (thirdPlayerMode){
        if (tournamentPlayer.length > 7)
          updateElementDisplayAndText("third-A4_name", currentMatch[3][4].myRef.username, thirdA4Element);
        else
          updateElementDisplayAndText("third-A4_name", "...", thirdA4Element);
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
        updateElementDisplayAndText("B1_name", winner_name);
        if (currentMatch[nbMatch][2] > currentMatch[nbMatch][3])
          A1A2matchElement.classList.add("winner-top");
        else
          A1A2matchElement.classList.add("winner-bottom");
        updateElementDisplayAndText("A1_score", currentMatch[nbMatch][2]);
        updateElementDisplayAndText("A2_score", currentMatch[nbMatch][3]);
      }
      else if (nbMatch == 1){
        updateElementDisplayAndText("B2_name", winner_name);
        if (currentMatch[nbMatch][2] > currentMatch[nbMatch][3])
          A3A4matchElement.classList.add("winner-top");
        else
          A3A4matchElement.classList.add("winner-bottom");
        updateElementDisplayAndText("A3_score", currentMatch[nbMatch][2]);    
        updateElementDisplayAndText("A4_score", currentMatch[nbMatch][3]);
      }
      else if (nbMatch == 2){
        updateElementDisplayAndText("B3_name", winner_name);
        if (currentMatch[nbMatch][2] > currentMatch[nbMatch][3])
          A5A6matchElement.classList.add("winner-top");
        else
          A5A6matchElement.classList.add("winner-bottom");
        if (tournamentPlayer.length === 5){
          updateElementDisplayAndText("B4_name", "...");
        }
        updateElementDisplayAndText("A5_score", currentMatch[nbMatch][2]);
        updateElementDisplayAndText("A6_score", currentMatch[nbMatch][3]);
      }
      else if (nbMatch == 3){
        updateElementDisplayAndText("B4_name", winner_name);
        if (currentMatch[nbMatch][2] > currentMatch[nbMatch][3])
          A7A8matchElement.classList.add("winner-top");
        else
          A7A8matchElement.classList.add("winner-bottom");
        updateElementDisplayAndText("A7_score", currentMatch[nbMatch][2]);
        updateElementDisplayAndText("A8_score", currentMatch[nbMatch][3]);
      }
    }
    else if (round == 3){
      if (nbMatch == 0){
        updateElementDisplayAndText("C1_name", winner_name);
        if (currentMatch[nbMatch][2] > currentMatch[nbMatch][3])
          B1B2matchElement.classList.add("winner-top");
        else
          B1B2matchElement.classList.add("winner-bottom");
        updateElementDisplayAndText("B1_score", currentMatch[nbMatch][2]);
        updateElementDisplayAndText("B2_score", currentMatch[nbMatch][3]);
      }
      else if (nbMatch == 1){
        updateElementDisplayAndText("C2_name", winner_name);
        if (currentMatch[nbMatch][2] > currentMatch[nbMatch][3])
          B3B4matchElement.classList.add("winner-top");
        else
          B3B4matchElement.classList.add("winner-bottom");
        updateElementDisplayAndText("B3_score", currentMatch[nbMatch][2]);
        updateElementDisplayAndText("B4_score", currentMatch[nbMatch][3]);
      }
    }
    else if (round == 4){
      if (currentMatch[nbMatch][2] > currentMatch[nbMatch][3])
        C1C2matchElement.classList.add("winner-top");
      else
        C1C2matchElement.classList.add("winner-bottom");
      updateElementDisplayAndText("C1_score", currentMatch[nbMatch][2]);
      updateElementDisplayAndText("C2_score", currentMatch[nbMatch][3]);
    }
  }