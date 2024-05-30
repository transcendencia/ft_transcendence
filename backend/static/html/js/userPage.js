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
