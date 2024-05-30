import { togglePlanet } from './enterPlanet.js';
import { userList } from './loginPage.js';
const statsButtons = document.querySelectorAll('.statButton');
const statsScreen = document.querySelector('.statsBlock');
const colorClicked = '#5d75ff47';

statsButtons.forEach((button) => {
    button.addEventListener('click', () => {
        statsButtons.forEach((button) => {
            button.style.backgroundColor = 'transparent';
        });
        button.style.backgroundColor = colorClicked;
    });
});

function createMatchBlock(tournament, date, mode, player1Name, player1ImgSrc, Score, player2Name, player2ImgSrc, thirdPlayer, victory) {

    let borderColor = '#ff3737';
    let bgColor = '#ff373777';
    let bg2Color = '#a3000087';
    if (victory) {
        borderColor = '#43ff43';
        bgColor = '#43ff4377';
        bg2Color = '#00ab00c0';
    }

    const matchBlock = document.createElement('div');
    matchBlock.classList.add('matchBlock');
    matchBlock.style.borderColor = borderColor;
    matchBlock.style.backgroundColor = bgColor;
  
    const firstLine = document.createElement('div');
    firstLine.classList.add('firstLine');
    firstLine.style.color = borderColor;
    firstLine.innerHTML = `<div id="type" style="width: 30%;">${tournament}</div><div class="date" id="date" style="border-color: ${borderColor}; background-color: ${bg2Color}">${date}</div><div id="mode" style="width: 30%;">${mode}</div>`;
  
    const secondLine = document.createElement('div');
    secondLine.classList.add('secondLine');
  
    const userHI1 = document.createElement('div');
    userHI1.classList.add('userHI');
    if (player1Name.length > 8)
        userHI1.setAttribute('text-length-mode', 'long');
    userHI1.innerHTML = `<div class="imgFrame" style="height: 40px; width: 50px; margin-right: 5px; border-color: ${borderColor};"><img src="${player1ImgSrc}"></div>${player1Name}`;
  
    const scoreAndThirdPlayer = document.createElement('div');
    scoreAndThirdPlayer.classList.add('scoreAndThirdPlayer');
    scoreAndThirdPlayer.innerHTML = `<div class="matchScore" style="border-color:  ${borderColor}; background-color: ${bg2Color};">${Score}</div><div class="thirdPlayer">Third Player : ${thirdPlayer}</div>`;
  
    const userHI2 = document.createElement('div');
    userHI2.classList.add('userHI');
    if (player2Name.length > 8)
        userHI2.setAttribute('text-length-mode', 'long');
    userHI2.style.justifyContent = 'flex-end';
    userHI2.innerHTML = `${player2Name}<div class="imgFrame" style="height: 40px; width: 50px; margin-left: 5px; border-color: ${borderColor};"><img src="${player2ImgSrc}"></div>`;
  
    // Append elements
    secondLine.appendChild(userHI1);
    secondLine.appendChild(scoreAndThirdPlayer);
    secondLine.appendChild(userHI2);
  
    matchBlock.appendChild(firstLine);
    matchBlock.appendChild(secondLine);
  
    // Append match block to history container
    const historyContainer = document.querySelector('.history');
    historyContainer.appendChild(matchBlock);
}
  
// Example usage:
createMatchBlock('Tournament', '13-10-2000', 'Powerless', 'Doggodito', '../../../static/html/assets/icons/FR_NU.png', '3 - 2', 'Player 2', '../../../static/html/assets/icons/FR_NU.png', 'Player 3', true);
createMatchBlock('Arena', '15-10-2000', 'Spin Only', 'Doggodito', '../../../static/html/assets/icons/FR_NU.png', '1 - 3', 'biboup654432', '../../../static/html/assets/icons/FR_NU.png', 'Player 3', false);
createMatchBlock('Tournament', '19-10-2000', 'Spin Only', 'Doggodito', '../../../static/html/assets/icons/BR_NU.png', '1 - 3', 'biboup654432', '../../../static/html/assets/icons/BR_NU.png', 'Player 3', false);
createMatchBlock('Arena', '21-10-2000', 'Powerless', 'Doggodito', '../../../static/html/assets/icons/BR_NU.png', '3 - 2', 'Player 2', '../../../static/html/assets/icons/BR_NU.png', 'Player 3', true);
createMatchBlock('Tournament', '17-10-2000', 'Powerless', 'Doggodito', '../../../static/html/assets/icons/BR_NU.png', '3 - 0', 'Player 2', '../../../static/html/assets/icons/FR_NU.png', 'Player 3', true);
createMatchBlock('Tournament', '25-10-2000', 'Powerless', 'Doggodito', '../../../static/html/assets/icons/FR_NU.png', '3 - 0', 'Player 2', '../../../static/html/assets/icons/FR_NU.png', 'Player 3', true);
createMatchBlock('Arena', '27-10-2000', 'Spin Only', 'Doggodito', '../../../static/html/assets/icons/ES_NU.png', '1 - 3', 'biboup654432', '../../../static/html/assets/icons/ES_NU.png', 'Player 3', false);
createMatchBlock('Tournament', '23-10-2000', 'Spin Only', 'Doggodito', '../../../static/html/assets/icons/ES_NU.png', '1 - 3', 'biboup654432', '../../../static/html/assets/icons/ES_NU.png', 'Player 3', false);
createMatchBlock('Tournament', '31-10-2000', 'Spin Only', 'Doggodito', '../../../static/html/assets/icons/FR_NU.png', '1 - 3', 'biboup654432', '../../../static/html/assets/icons/FR_NU.png', 'Player 3', false);
createMatchBlock('Tournament', '29-10-2000', 'Powerless', 'Doggodito', '../../../static/html/assets/icons/FR_NU.png', '3 - 2', 'Player 2', '../../../static/html/assets/icons/FR_NU.png', 'Player 3', true);
createMatchBlock('Arena', '02-11-2000', 'Powerless', 'Doggodito', '../../../static/html/assets/icons/FR_NU.png', '3 - 2', 'Player 2', '../../../static/html/assets/icons/FR_NU.png', 'Player 3', true);

// Sample user data
//generate more random users
  const hostUserPage = document.getElementById("hostUserPage");
  const exploreUserPage = document.getElementById("exploreUserPage");
  const backButtonUserPage = document.querySelectorAll(".planetBackButton")[1];

  backButtonUserPage.addEventListener('click', () => {
    if (!onHostUserPage) {
      exploreUserPage.style.animation = "slideHostPage 1s backwards ease-in-out";    
      hostUserPage.style.animation = "slideHostPage 1s backwards ease-in-out";
      onHostUserPage = true;
    }
    else togglePlanet();
  });

  let onHostUserPage = true;
  // Function to render user tiles based on search query
function RenderUsersSearched(query) {
    const userListBackground = document.getElementById('userlistUserPage');
    userListBackground.innerHTML = ''; // Clear existing user tiles
  
    const filteredUsers = userList.filter(user => user.username.toLowerCase().includes(query.toLowerCase()));
  
    filteredUsers.forEach(user => {
      const userTile = document.createElement('div');
      userTile.classList.add('userTile');
  
      const imgContainer = document.createElement('div');
      imgContainer.classList.add('imgContainer');
      imgContainer.innerHTML = `<img src="${user.profile_picture}">`;
  
      const textContainer = document.createElement('div');
      textContainer.classList.add('textContainer');
      textContainer.textContent = user.username;

      const loupeContainer = document.createElement('div');
      loupeContainer.classList.add('loupeImg');
      loupeContainer.innerHTML = `<img src="../../../static/html/assets/icons/loupe.png">`;
        loupeContainer.addEventListener('click', () => {
          if (onHostUserPage) {
            exploreUserPage.style.animation = "slideUserPage 1s forwards ease-in-out";    
            hostUserPage.style.animation = "slideUserPage 1s forwards ease-in-out";
            onHostUserPage = false; 
          }
          // else displayOtherUser(){}
        });
      userTile.appendChild(imgContainer);
      userTile.appendChild(textContainer);
      userTile.appendChild(loupeContainer);
  
      userListBackground.appendChild(userTile);
    });
  }
  
  // Function to handle input event on search input
  document.getElementById('searchInput').addEventListener('input', function(event) {
    const searchQuery = this.value.trim();
    RenderUsersSearched(searchQuery);
  });
