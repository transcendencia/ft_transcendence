import { togglePlanet, setCheckerToInterval} from './enterPlanet.js';
import {  getCookie, createMatchBlock, getGameInfo, clearMatchBlocks } from './loginPage.js';
import { get_friends_list, send_friend_request, accept_friend_request, delete_friend_request, getProfileInfo, populateProfileInfos, updateUserStatus } from './userManagement.js';
import { getUserStats, chooseStats } from './stats.js';
import {  resetModifyPageField } from './modifyPage.js';

const statsButtons = document.querySelectorAll('.statButton');
const colorClicked = '#5d75ff47';

statsButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
    if (index < 3)
    {
      for (let i = 0; i < 3; i++)
          statsButtons[i].style.backgroundColor = 'transparent';
      getUserStats(sessionStorage.getItem("host_id"));
    }
    else
    {
      for (let i = 3; i < 6; i++)
        statsButtons[i].style.backgroundColor = 'transparent';
      getUserStats(displayedUserOnSearchPage.id);
    }
    button.style.backgroundColor = colorClicked;
    chooseStats(index + 1);
    });
});


let previousFriendList = [];
let previousSearchList = [];

export async function userListChanged() {
  const newData = await get_friends_list();
  if (searchQuery === '') {
    const friendList = filterAndSortLists(newData, '');
    const friendListChanged = JSON.stringify(friendList) !== JSON.stringify(previousFriendList);
    if (friendListChanged)
      console.log("friendListChanged!");
    return friendListChanged;
  }
  const searchList = filterAndSortLists(newData, searchQuery);
  const searchListChanged = JSON.stringify(searchList) !== JSON.stringify(previousSearchList);
  if (searchListChanged)
    console.log("searchListChanged!");
  return searchListChanged;
}

export function refreshUserList() {
  if (searchQuery === '')
      renderFriendList();
  else RenderUsersSearched(searchQuery);
}

export function initUserPlanet() {
  renderFriendList();
  getProfileInfo(sessionStorage.getItem("host_id"))
  .then(data => {
      populateProfileInfos(data);
  })
  const searchBar = document.getElementById('searchInput');
  searchBar.value = '';
  clearMatchBlocks();
  getGameInfo();
  //delay the animation of stats while page is opening
  setTimeout(getUserStats(sessionStorage.getItem("host_id"), 1750));
  setCheckerToInterval(setInterval(async() => {
  if (await userListChanged())
    refreshUserList();
  if (pageDisplayed === "searchedProfile")
    refreshSearchedPage(displayedUserOnSearchPage);
  console.log("checking...");
  }, 5000));
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

 export function returnToHost(updateStats = true) {
    if (pageDisplayed === "searchedProfile") {
      searchedUserPage.style.animation = "slideHostPage 1s backwards ease-in-out";    
      hostUserPage.style.animation = "slideHostPage 1s backwards ease-in-out";
      pageDisplayed = "hostProfile";
    }
    else if (pageDisplayed === "modifyPage") {
      hostUserPage.style.animation = "slideHostPageDown 1s forwards ease-in-out";
      modifyUserPage.style.animation = "slideHostPageDown 1s forwards ease-in-out";
      pageDisplayed = "hostProfile";
      resetModifyPageField();
    }
    if (updateStats) {
      chooseStats(1);
      setTimeout(getUserStats(sessionStorage.getItem("host_id"), 500));
    }
  }

  backButtonUserPage.addEventListener('click', () => {
    if (pageDisplayed === "hostProfile")
      togglePlanet(/* toggleRsContainer: */ true);
    else if (pageDisplayed === "modifyPage")
    {
      const modifyPage = document.getElementById('userInfoForm');
      returnToHost();
      //prevent tab on modifyPage input bars
      setTimeout(() => {
        modifyPage.style.visibility = 'hidden';
      }, 1000);
    }
    else if (pageDisplayed === "searchedProfile")
    {
      clearInterval(searchUserInterval);
      previousUserInfos = null;
      returnToHost();
    }
  });

  modifyInfoButton.addEventListener('click', () => {
    if (userPagesContainer.contains(searchedUserPage))
      searchedUserPage.style.display = 'none'; // Make it invisible
    userPagesContainer.style.flexDirection = "column";
    hostUserPage.style.animation = "slideHostPageUp 1s forwards ease-in-out";
    modifyUserPage.style.animation = "slideHostPageUp 1s forwards ease-in-out";
    pageDisplayed = "modifyPage"
    const modifyPage = document.getElementById('userInfoForm');
    modifyPage.style.visibility = 'visible';
  });

  let inputElement = document.getElementById("searchInput");

  function slideAnimations(user) {
      if (pageDisplayed === "hostProfile") {
        searchedUserPage.style.display = 'flex';
        userPagesContainer.style.flexDirection = "row";
        searchedUserPage.style.animation = "slideUserPage 1s forwards ease-in-out";    
        hostUserPage.style.animation = "slideUserPage 1s forwards ease-in-out";
        pageDisplayed = "searchedProfile";
      }
      else if (pageDisplayed === "modifyPage") {
        setTimeout(() => {
          searchedUserPage.style.display = 'flex';
          userPagesContainer.style.flexDirection = "row";
        },500)
        searchedUserPage.style.animation = "slideDiagonally 0.5s forwards ease-in-out";    
        modifyUserPage.style.animation = "slideDiagonally 0.5s forwards ease-in-out";
        pageDisplayed = "searchedProfile";
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
  const alias = document.getElementById('alias2');
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
      await RenderUsersSearched(searchQuery);
    } catch (error) {
      console.error('Error deleting friend request:', error);
    }
  });
  
  checkMarkImg.addEventListener('click', async () => {
    resetProfile();
    displayFriendProfile(displayedUserOnSearchPage);
    try {
      await accept_friend_request(requestId);
      await RenderUsersSearched(searchQuery);
    } catch (error) {
      console.error('Error validating friend request:', error);
    }
  });

  bluePlusImg.addEventListener('click', () => {
    resetProfile();
    displayRequestSent();
    send_friend_request(displayedUserOnSearchPage.id);
  });


  function displayRequestSent() {
    checkMarkImg.style.display = "none";
    redCrossImg.style.display = "none";
    bluePlusImg.style.display = 'none';
    requestSentElem.style.display = 'block';
  }

  function resetProfile() {
    friendActionCont.classList.remove("OnlineFriendTile");
    friendActionCont.classList.remove("RequestTile");
    friendActionCont.classList.remove("OfflineFriendTile");
    profilePic.parentNode.classList.remove("OnlineFriendTile");
    profilePic.parentNode.classList.remove("RequestTile");
    profilePic.parentNode.classList.remove("OfflineFriendTile");
    friendActionCont.style.justifyContent = 'center';
    checkMarkImg.style.display = "none";
    redCrossImg.style.display = "none";
    requestSentElem.style.display = 'none';
    bluePlusImg.style.display = "block";
  }

  function displayFriendProfile(user) {
    bluePlusImg.style.display = "none";
    checkMarkImg.style.display = "none";
    requestSentElem.style.display = 'none';
    redCrossImg.style.display = "block";
    friendActionCont.style.justifyContent = 'center';
    if (user.status === 'online' || user.status === 'in_game') {
      profilePic.parentNode.classList.add("OnlineFriendTile");
      friendActionCont.classList.add("OnlineFriendTile");
    }
    else if (user.status === 'Offline'){
      profilePic.parentNode.classList.add("OfflineFriendTile");
      friendActionCont.classList.add("OfflineFriendTile")
    }
  }

  function displayFriendRequestProfile() {
    bluePlusImg.style.display = "none";
    requestSentElem.style.display = 'none';
    checkMarkImg.style.display = "block";
    redCrossImg.style.display = "block";
    friendActionCont.style.justifyContent = 'space-evenly';
    friendActionCont.classList.add("RequestTile");
    profilePic.parentNode.classList.add("RequestTile");
  }

let searchUserInterval;
let previousUserInfos;

function searchedUserFinishedAMatch(nbr_match) {
  if (!previousUserInfos)
    return false;
  if (nbr_match !== previousUserInfos.nbr_match)
    return true;
  return false;
}

function searchedUserInfoChanged(profilePic, username, alias) {
  if (!previousUserInfos)
    return false;
  if (profilePic !== previousUserInfos.profile_picture || alias !== previousUserInfos.alias || username !== previousUserInfos.username)
    return true;
  return false;
}

function updateSearchedUserInfos(profilePicture, newName, newAlias) {
  profilePic.src = profilePicture;
  username.textContent = newName;
  alias.textContent = newAlias;
}

async function displayUserType(user,type) {
  resetProfile();
  const newData = await get_friends_list();
  if (newData.sent_request_list.some(requestUser => requestUser.id === user.id) && type === 'Default')
    displayRequestSent();
  else if (type === 'Request')
    displayFriendRequestProfile();
  else if (type === 'Friend')
    displayFriendProfile(user);
}

function refreshSearchedPage(user) {
  if (!user)
    return;
  getProfileInfo(user.id).then(data => {
    const userData = data.profile_info;
    if (searchedUserFinishedAMatch(userData.nbr_match)) {
      document.getElementById('searchedUserHistory').innerHTML = '';
      getUserStats(user.id);
      createUserMatch(user);
      previousUserInfos = userData;
      console.log("stats changed : ", userData.username);
    }
    if (searchedUserInfoChanged(userData.profile_picture, userData.username, userData.alias)) {
      updateSearchedUserInfos(userData.profile_picture, userData.username, userData.alias);
      previousUserInfos = userData;
      console.log("info changed : ", userData.username);
    }
  });
}

async function fillSearchedUserPage(user, type) {
  displayedUserOnSearchPage = user;
  
  resetProfile();
  displayUserType(user, type);

  updateSearchedUserInfos(user.profile_picture, user.username, user.alias);
  getUserStats(user.id);
  chooseStats(4);

  document.getElementById('searchedUserHistory').innerHTML = '';
  createUserMatch(user);
  
  getProfileInfo(user.id).then(data => {previousUserInfos = data.profile_info;});
  refreshSearchedPage(user);
}
function createUserMatch(user) {
  const token = sessionStorage.getItem('host_auth_token');
  const csrfToken = getCookie('csrftoken');
  
  fetch(`get_game_player2/?id=${encodeURIComponent(user.id)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error retrieving data');
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
    console.error('Error:', error);
  });
}

function createStatusPellet(status) {
  const statusPelletElement = document.createElement('div');
  statusPelletElement.classList.add('redPellet');
  if (status === 'in_game' || status === 'online')
    statusPelletElement.classList.add('OnlineFriendTile');
    else statusPelletElement.classList.add('OfflineFriendTile');
  if (status !== 'offline')
    statusPelletElement.classList.add(status);
  return statusPelletElement;
}

function createUserTile(user, type, reqId) {
  if (user.isHost)
    return;
  
  console.log("statuuuus:", user.status);
  const userTile = document.createElement('div');
  userTile.classList.add('userTile');
  
  const imgContainer = document.createElement('div');
  imgContainer.classList.add('imgContainer');
  imgContainer.innerHTML += `<img src="${user.profile_picture}">`;
  
  const textContainer = document.createElement('div');
  textContainer.classList.add('textContainer');
  textContainer.textContent = user.username;

  const loupeContainer = document.createElement('div');
  loupeContainer.innerHTML = `<img src="../../../static/html/assets/icons/loupe.png">`;
  loupeContainer.classList.add('loupeImg');
  loupeContainer.addEventListener('click', () => {
    if (pageDisplayed === "modifyPage")
      resetModifyPageField();
    slideAnimations(loupeContainer);
    setTimeout(() => {
      fillSearchedUserPage(user, type);
      if (reqId !== undefined)
        requestId = reqId;
    }, 125);
  });

  //status : 'offline', 'online', or '' to fit css classes names.
  const status = (type === 'Friend') ? (user.status === 'online' || user.status === 'in_game' ? 'Online' : 'Offline') : '';
  const colorClass = `${status}${type}Tile`;

  imgContainer.classList.add(`dark${colorClass}`);
  textContainer.classList.add(colorClass);
  loupeContainer.classList.add(colorClass);
  loupeContainer.classList.add('hovered');
  if (type === 'Friend')
    userTile.appendChild(createStatusPellet(user.status));

  userTile.appendChild(imgContainer);
  userTile.appendChild(textContainer);
  userTile.appendChild(loupeContainer);
  userListBackground.appendChild(userTile);
}

function filterAndSortLists(data, query) {
  if (!data)
    return ;
  let requestList = data.received_request_list;
  let friendList = data.friends;
  let otherList = data.other_user_list;

  if (query !== '') {
    requestList = requestList.filter(obj => obj.user.username.toLowerCase().includes(query.toLowerCase()));
    friendList = friendList.filter(obj => obj.user.username.toLowerCase().includes(query.toLowerCase()));
    otherList = otherList.filter(user => user.username.toLowerCase().includes(query.toLowerCase()));
  }

  requestList.sort((a, b) => a.user.username.localeCompare(b.user.username));
  friendList.sort((a, b) => {
    const statusOrder = { 'online': 0, 'in_game': 1, 'offline': 2 };
    if (a.user.status !== b.user.status) {
    otherList.sort((a, b) => a.username.localeCompare(b.username));
      return statusOrder[a.user.status] - statusOrder[b.user.status];
    }
    return a.user.username.localeCompare(b.user.username);
  });

  return { requestList, friendList, otherList };
}

async function RenderUsersSearched(query) {
  userListBackground.innerHTML = ''; // Clear existing user tiles

  if (query === '') {
    renderFriendList();
    return;
  }
  const data = await get_friends_list();
  if (!data) return;
  // Filter and sort the lists based on the query
  const lists = filterAndSortLists(data, query);
  previousSearchList = lists;
  // Render tiles based on filtered and sorted lists
  lists.requestList.forEach(obj => createUserTile(obj.user, 'Request', obj.request_id));
  lists.friendList.forEach(obj => createUserTile(obj.user, 'Friend', obj.request_id));
  lists.otherList.forEach(user => createUserTile(user, 'Default', undefined));
}

export async function renderFriendList() {
    userListBackground.innerHTML = ''; // Clear existing user tiles

    const data = await get_friends_list();

    const lists = filterAndSortLists(data, '');
    previousFriendList = lists;
    lists.requestList.forEach(userSendingRq => createUserTile(userSendingRq.user, 'Request', userSendingRq.request_id));
    lists.friendList.forEach(friend => createUserTile(friend.user, 'Friend', friend.request_id));
  }

  let searchTimeout;
  let searchQuery = '';

  inputElement.addEventListener('input', function() {
      searchQuery = this.value.trim();
  
      // Clear previous timeout
      clearTimeout(searchTimeout);
  
      // Set new timeout to execute RenderUsersSearched after 300ms of user inactivity
      searchTimeout = setTimeout(() => {
          if (searchQuery.length === 0)
              renderFriendList();
          else RenderUsersSearched(searchQuery);
      }, 300); // Adjust the debounce delay as needed
  });