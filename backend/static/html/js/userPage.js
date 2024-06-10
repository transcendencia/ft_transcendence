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

export function initUserPlanet() {
  renderFriendList();
}

const greenCheck = document.getElementById('greenCheck');
const redCross = document.getElementById('redCross');

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
  const profilePic = document.getElementById('profile_pic2');
  const username = document.getElementById('username2');
  const bio = document.getElementById('bio2');
  const friendActionCont = document.querySelector('.friendActionCont');
  const checkMarkImg = friendActionCont.querySelectorAll('img')[0];
  const redCrossImg = friendActionCont.querySelectorAll('img')[1];
  const bluePlusImg = friendActionCont.querySelectorAll('img')[2];
  const requestSentElem = friendActionCont.querySelector('p');

  redCrossImg.addEventListener('click', () => {
    resetProfile();
    //Remove from friends or deny request
    //Actualize userList
  });

  checkMarkImg.addEventListener('click', () => {
    resetProfile();
    displayFriendProfile();
    //Add to friends
    //Actualize userList
  });

  bluePlusImg.addEventListener('click', () => {
    resetProfile();
    displayRequestSent();
    //Send friend request
    //Actualize userList
  });

  function displayRequestSent() {
    checkMarkImg.style.display = "none";
    redCrossImg.style.display = "none";
    bluePlusImg.style.display = 'none';
    requestSentElem.style.display = 'block';
  }

  function resetProfile() {
    friendActionCont.classList.remove("friendTile");
    friendActionCont.classList.remove("requestTile");
    profilePic.parentNode.classList.remove("friendTile");
    profilePic.parentNode.classList.remove("requestTile");
    friendActionCont.style.justifyContent = 'center';
    checkMarkImg.style.display = "none";
    redCrossImg.style.display = "none";
    requestSentElem.style.display = 'none';
    bluePlusImg.style.display = "block";
  }

  function displayFriendProfile() {
    bluePlusImg.style.display = "none";
    checkMarkImg.style.display = "none";
    requestSentElem.style.display = 'none';
    redCrossImg.style.display = "block";
    friendActionCont.style.justifyContent = 'center';
    friendActionCont.classList.add("friendTile");
    profilePic.parentNode.classList.add("friendTile");
  }

  function displayFriendRequestProfile() {
    bluePlusImg.style.display = "none";
    requestSentElem.style.display = 'none';
    checkMarkImg.style.display = "block";
    redCrossImg.style.display = "block";
    friendActionCont.style.justifyContent = 'space-evenly';
    friendActionCont.classList.add("requestTile");
    profilePic.parentNode.classList.add("requestTile");
  }

  function fillSearchedUserPage(user, type) {
    resetProfile();
    if (type === 'request')
      displayFriendRequestProfile();
    else if (type === 'friend')
      displayFriendProfile();

    // Get the DOM elements
    
    // Update the DOM elements with user information
    profilePic.src = user.profile_picture;
    username.textContent = user.username;
    bio.textContent = user.bio;

    document.getElementById('searchedUserHistory').innerHTML = '';
    
    getHistoryMatchPlayer2(user);

    const statsBlock = document.getElementById('winLoseTexts2');
    statsBlock.innerHTML = `
        <div style="font-family: 'Space'; font-size: 20px; color: white"> Parties : 1</div>
        <div style="font-family: 'Space'; font-size: 20px; color: white"> Victoires : 1</div>
        <div style="font-family: 'Space'; font-size: 20px; color: white"> Defaites : 1</div>
        <div style="font-family: 'Space'; font-size: 20px; color: white"> Buts : 1</div>
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

function createUserTile(user, type) {
  if (user.isHost)
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
      fillSearchedUserPage(user, type);
    }, 125);
  });

  imgContainer.classList.add(`${type}Tile`);
  textContainer.classList.add(`${type}Tile`);
  loupeContainer.classList.add(`loupe${type.charAt(0).toUpperCase() + type.slice(1)}Tile`);

  userTile.appendChild(imgContainer);
  userTile.appendChild(textContainer);
  userTile.appendChild(loupeContainer);
  
  userListBackground.appendChild(userTile);
}

function RenderUsersSearched(query) {
  userListBackground.innerHTML = ''; // Clear existing user tiles
  const requestList = userList.slice(0, 4).sort((a, b) => a.username.localeCompare(b.username));
  const friendList = userList.slice(4, 10).sort((a, b) => a.username.localeCompare(b.username));

  const filteredUsers = userList.filter(user => user.username.toLowerCase().includes(query.toLowerCase()));

  // Separate users into requests, friends, and others
  const requests = [];
  const friends = [];
  const others = [];

  filteredUsers.forEach(user => {
    if (requestList.includes(user))
      requests.push(user);
    else if (friendList.includes(user))
      friends.push(user);
    else others.push(user);
  });

  // Sort each group alphabetically by username
  const sortedRequests = requests.sort((a, b) => a.username.localeCompare(b.username));
  const sortedFriends = friends.sort((a, b) => a.username.localeCompare(b.username));
  const sortedOthers = others.sort((a, b) => a.username.localeCompare(b.username));

  sortedRequests.forEach(user => createUserTile(user, 'request'));
  sortedFriends.forEach(user => createUserTile(user, 'friend'));
  sortedOthers.forEach(user => createUserTile(user, ''));
}
  
inputElement.addEventListener('input', function(event) {
  const searchQuery = this.value.trim();
    RenderUsersSearched(searchQuery);
});

export function renderFriendList() {
  userListBackground.innerHTML = ''; // Clear existing user tiles

  const sortedRequests = userList.slice(0, 4).sort((a, b) => a.username.localeCompare(b.username));
  const sortedFriends = userList.slice(4, 10).sort((a, b) => a.username.localeCompare(b.username));

  sortedRequests.forEach(user => createUserTile(user, 'request'));
  sortedFriends.forEach(user => createUserTile(user, 'friend'));
}
