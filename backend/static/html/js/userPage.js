import { togglePlanet } from './enterPlanet.js';
import {  getCookie, createMatchBlock} from './loginPage.js';
import { get_friends_list, send_request, accept_friend_request, delete_friend_request } from './userManagement.js';
import { getTranslatedText } from './translatePages.js';

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


let previousReqFriendList = [];

async function isListsChanged() {
  const newData = await get_friends_list();
  
  const sortedNewRequests = newData.received_request_list.sort((a, b) => a.user.username.localeCompare(b.user.username));
  const sortedNewFriends = newData.friends.sort((a, b) => a.user.username.localeCompare(b.user.username));
  const concatenatedNewList = sortedNewRequests.concat(sortedNewFriends);
  const listsChanged = JSON.stringify(concatenatedNewList) !== JSON.stringify(previousReqFriendList);
  
  if (listsChanged)
    previousReqFriendList = concatenatedNewList;
  return listsChanged;
}

export let checkEach5Sec;

export function initUserPlanet() {
  renderFriendList();
  const basicStats = document.getElementById('winLoseTexts1');
  basicStats.innerHTML = `
      <div style="font-family: 'Space'; font-size: 20px; color: white"> ${getTranslatedText('winLoseText1')} : 1</div>
      <div style="font-family: 'Space'; font-size: 20px; color: white"> ${getTranslatedText('winLoseText2')} : 1</div>
      <div style="font-family: 'Space'; font-size: 20px; color: white"> ${getTranslatedText('winLoseText3')} : 1</div>
      <div style="font-family: 'Space'; font-size: 20px; color: white"> ${getTranslatedText('winLoseText4')} : 1</div>
  `;
  checkEach5Sec = setInterval(async function() {
    if (await isListsChanged()) {
      if (inputElement.value === '')
        await renderFriendList();
      else await RenderUsersSearched(inputElement.value);
    }
    console.log("Checking...");
  }, 5000);
}

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
  
  let requestId;
  let displayedUserOnSearchPage;

  redCrossImg.addEventListener('click', async () => {
    resetProfile();
    try {
      await delete_friend_request(requestId);
      await RenderUsersSearched(inputElement.value);
    } catch (error) {
      console.error('Error deleting friend request:', error);
    }
  });
  

  checkMarkImg.addEventListener('click', async () => {
    resetProfile();
    displayFriendProfile();
    try {
      await accept_friend_request(requestId);
      await RenderUsersSearched(inputElement.value);
    } catch (error) {
      console.error('Error deleting friend request:', error);
    }
  });

  bluePlusImg.addEventListener('click', () => {
    resetProfile();
    displayRequestSent();
    send_request(displayedUserOnSearchPage.username);
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

  async function fillSearchedUserPage(user, type) {
    displayedUserOnSearchPage = user;
    resetProfile();
    const newData = await get_friends_list();
    if (newData.sent_request_list.some(requestUser => requestUser.id === user.id))
      displayRequestSent();
    else if (type === 'request')
      displayFriendRequestProfile();
    else if (type === 'friend')
      displayFriendProfile();

    // Update the DOM elements with user information
    profilePic.src = user.profile_picture;
    username.textContent = user.username;
    bio.textContent = user.bio;

    document.getElementById('searchedUserHistory').innerHTML = '';
    
    getHistoryMatchPlayer2(user);

    const statsBlock = document.getElementById('winLoseTexts2');
    statsBlock.innerHTML = `
        <div style="font-family: 'Space'; font-size: 20px; color: white"> ${getTranslatedText('winLoseText1')} : 1</div>
        <div style="font-family: 'Space'; font-size: 20px; color: white"> ${getTranslatedText('winLoseText2')} : 1</div>
        <div style="font-family: 'Space'; font-size: 20px; color: white"> ${getTranslatedText('winLoseText3')} : 1</div>
        <div style="font-family: 'Space'; font-size: 20px; color: white"> ${getTranslatedText('winLoseText4')} : 1</div>
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

function createUserTile(user, type, reqId) {
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
      if (reqId !== undefined)
        requestId = reqId;
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

async function RenderUsersSearched(query) {
  userListBackground.innerHTML = ''; // Clear existing user tiles

  if (query === '') {
    renderFriendList();
    return;
  }
  const data = await get_friends_list();
  if (!data)
    return ;
  let requestList = [];
  let friendList = [];
  let otherList = [];

  if (data.received_request_list.length > 0)  
    requestList = data.received_request_list.filter(obj => obj.user.username.toLowerCase().includes(query.toLowerCase()));
  if (data.friends.length > 0)
    friendList = data.friends.filter(obj => obj.user.username.toLowerCase().includes(query.toLowerCase()));
  if (data.other_user_list.length)
    otherList = data.other_user_list.filter(obj => obj.username.toLowerCase().includes(query.toLowerCase()));
  
  previousReqFriendList = data.received_request_list.sort((a, b) => a.user.username.localeCompare(b.username)).concat(data.friends.sort((a, b) => a.user.username.localeCompare(b.username)));

  const filteredRequestList = requestList.sort((a, b) => a.user.username.localeCompare(b.username));
  const filteredFriendList = friendList.sort((a, b) => a.user.username.localeCompare(b.username));
  const filteredOthers = otherList.sort((a, b) => a.username.localeCompare(b.username));

  filteredRequestList.forEach(obj => createUserTile(obj.user, 'request', obj.request_id));
  filteredFriendList.forEach(obj => createUserTile(obj.user, 'friend', obj.request_id));
  filteredOthers.forEach(user => createUserTile(user, '', undefined));
}
  
inputElement.addEventListener('input', function(event) {
  const searchQuery = this.value.trim();
    RenderUsersSearched(searchQuery);
});

export async function renderFriendList() {
  userListBackground.innerHTML = ''; // Clear existing user tiles

  try {
      const data = await get_friends_list();
      const sortedRequests = data.received_request_list.sort((a, b) => a.user.username.localeCompare(b.user.username));
      const sortedFriends = data.friends.sort((a, b) => a.user.username.localeCompare(b.user.username));

      previousReqFriendList = sortedRequests.concat(sortedFriends);

      sortedRequests.forEach(userSendingRq => createUserTile(userSendingRq.user, 'request', userSendingRq.request_id));
      sortedFriends.forEach(user => createUserTile(user.user, 'friend', user.request_id));
  } catch (error) {
      console.error('Error in rendering friend list:', error);
  }
} 