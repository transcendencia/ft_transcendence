

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