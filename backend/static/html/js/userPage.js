import { togglePlanet } from './enterPlanet.js';
import { userList, getCookie, createMatchBlock} from './loginPage.js';

const statsButtons = document.querySelectorAll('.statButton');
const statsScreen = document.querySelector('.statsBlock');
const colorClicked = '#5d75ff47';

statsButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (index < 3)
        for (let i = 0; i < 3; i++)
            statsButtons[i].style.backgroundColor = 'transparent';
      else
        for (let i = 3; i < 6; i++)
          statsButtons[i].style.backgroundColor = 'transparent';
      button.style.backgroundColor = colorClicked;
    });
});

// Sample user data
//generate more random users
  const userPagesContainer = document.querySelector('.userPagesContainer');
  const hostUserPage = document.getElementById("hostUserPage");
  const searchedUserPage = document.getElementById("searchedUserPage");
  const backButtonUserPage = document.querySelectorAll(".planetBackButton")[1];
  const modifyInfoButton = document.querySelector(".pencilImg");
  const modifyUserPage = document.querySelector(".modifyPage");

  let pageDisplayed = "hostProfile";

 export function returnToHost() {
    if (pageDisplayed === "userProfile") {
      searchedUserPage.style.animation = "slideHostPage 1s backwards ease-in-out";    
      hostUserPage.style.animation = "slideHostPage 1s backwards ease-in-out";
      pageDisplayed = "hostProfile";
    }
    else if (pageDisplayed === "modifyPage") {
      hostUserPage.style.animation = "slideHostPageDown 1s forwards ease-in-out";
      modifyUserPage.style.animation = "slideHostPageDown 1s forwards ease-in-out";
      pageDisplayed = "hostProfile";
    }
  }

  backButtonUserPage.addEventListener('click', () => {
    if (pageDisplayed === "hostProfile")
      togglePlanet();
    else returnToHost();
  });

  modifyInfoButton.addEventListener('click', () => {
    if (userPagesContainer.contains(searchedUserPage))
      searchedUserPage.style.display = 'none'; // Make it invisible
    userPagesContainer.style.flexDirection = "column";
    hostUserPage.style.animation = "slideHostPageUp 1s forwards ease-in-out";
    modifyUserPage.style.animation = "slideHostPageUp 1s forwards ease-in-out";
    pageDisplayed = "modifyPage"
  });

  let inputElement = document.getElementById("searchInput");

  function slideAnimations(user) {
      if (pageDisplayed === "hostProfile") {
        searchedUserPage.style.display = 'flex';
        userPagesContainer.style.flexDirection = "row";
        searchedUserPage.style.animation = "slideUserPage 1s forwards ease-in-out";    
        hostUserPage.style.animation = "slideUserPage 1s forwards ease-in-out";
        pageDisplayed = "userProfile";
      }
      else if (pageDisplayed === "modifyPage") {
        setTimeout(() => {
          searchedUserPage.style.display = 'flex';
          userPagesContainer.style.flexDirection = "row";
        },500)
        searchedUserPage.style.animation = "slideDiagonally 0.5s forwards ease-in-out";    
        modifyUserPage.style.animation = "slideDiagonally 0.5s forwards ease-in-out";
        pageDisplayed = "userProfile";
      }
      else {
        searchedUserPage.style.animation = "slideUserPageUp 0.25s forwards ease-in";
        setTimeout(() => {
          searchedUserPage.style.animation = "slideUserPageUpp 0.25s forwards ease-out";
        }, 250);
      }
  }

  const userListBackground = document.getElementById('userlistUserPage');

  function fillSearchedUserPage(user) {
    // Get the DOM elements
    const profilePic = document.getElementById('profile_pic2');
    const username = document.getElementById('username2');
    const bio = document.getElementById('bio2');
    
    // // Assuming these elements exist in the rightBlock for user stats
    // const history = document.querySelector('.history');

    // Update the DOM elements with user information
    profilePic.src = user.profile_picture;
    username.textContent = user.username;
    bio.textContent = user.bio;

    document.getElementById('searchedUserHistory').innerHTML = '';
    
    getHistoryMatchPlayer2(user);

    // // Assuming user.history is an array of history entries
    // user.history.forEach(entry => {
    //     const entryElement = document.createElement('div');
    //     entryElement.textContent = entry; // Adjust based on the structure of entry
    //     history.appendChild(entryElement);
    // });

    // Assuming user has stats properties: games, wins, losses, goals
    const statsBlock = document.getElementById('winLoseTexts2');
    statsBlock.innerHTML = `
        <div style="font-family: 'Space'; font-size: 20px; color: white"> Parties : ${user.games}</div>
        <div style="font-family: 'Space'; font-size: 20px; color: white"> Victoires : ${user.wins}</div>
        <div style="font-family: 'Space'; font-size: 20px; color: white"> Defaites : ${user.losses}</div>
        <div style="font-family: 'Space'; font-size: 20px; color: white"> Buts : ${user.goals}</div>
    `;
}

function getHistoryMatchPlayer2(user) {
  const token = localStorage.getItem('host_auth_token');
  const csrftoken = getCookie('csrftoken');
  
  fetch('get_game_player2/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken
    },
    body: JSON.stringify({id: user.id})
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error lors de la recuperation des donnees');
    }
    return response.json();
  })
  .then(data => {
    data.games.forEach(game => {
      let winner = false;
      let player1;
      let player1Score;
      let player1Picture;
      let player2;
      let player2Score;
      let player2Picture;

      if (user.id === game.player1) {
        player1 = game.player1_username;
        player1Score = game.scorePlayer1;
        player1Picture = game.player1_profilePicture;
        player2 = game.player2_username;
        player2Score = game.scorePlayer2;
        player2Picture = game.player2_profilePicture;
        if (game.scorePlayer1 > game.scorePlayer2) {
          winner = true;
        }
      } else {
        player1 = game.player2_username;
        player1Score = game.scorePlayer2;
        player1Picture = game.player2_profilePicture;
        player2 = game.player1_username;
        player2Score = game.scorePlayer1;
        player2Picture = game.player1_profilePicture;
        if (game.scorePlayer2 > game.scorePlayer1) {
          winner = true;
        }
      }
      createMatchBlock(game.gameplayMode, game.Date, game.modeGame, player1, player1Picture, player1Score, player2Score, player2, player2Picture, game.player3_username, winner, data.host_id === user.id);
    });
  })
  .catch(error => {
    console.error('Erreur :', error);
  });
}

function RenderUsersSearched(query) {
    userListBackground.innerHTML = ''; // Clear existing user tiles

    const filteredUsers = userList.filter(user => user.username.toLowerCase().includes(query.toLowerCase()));
  
    filteredUsers.forEach(user => {
      if (user.is_host)
        return;
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
        slideAnimations(loupeContainer);
        setTimeout(() => {
        fillSearchedUserPage(user);}, 125)
      });
      
      userTile.appendChild(imgContainer);
      userTile.appendChild(textContainer);
      userTile.appendChild(loupeContainer);
  
      userListBackground.appendChild(userTile);
    });
}

// Function to handle input event on search input
inputElement.addEventListener('input', function(event) {
    const searchQuery = this.value.trim();
    RenderUsersSearched(searchQuery);
});

// Event listener to show user list when input element is clicked
inputElement.addEventListener('click', function(event) {
    const searchQuery = this.value.trim();
    RenderUsersSearched(searchQuery);
});