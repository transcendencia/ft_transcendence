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

function createMatchBlock(tournament, date, modeGame, player1Name, player1ImgSrc, scorePlayer1, scorePlayer2, player2Name, player2ImgSrc, thirdPlayer, victory) {

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
    firstLine.innerHTML = `<div id="type" style="width: 30%;">${tournament}</div><div class="date" id="date" style="border-color: ${borderColor}; background-color: ${bg2Color}">${date}</div><div id="mode" style="width: 30%;">${modeGame}</div>`;
  
    const secondLine = document.createElement('div');
    secondLine.classList.add('secondLine');
  
    const userHI1 = document.createElement('div');
    userHI1.classList.add('userHI');
    if (player1Name.length > 8)
        userHI1.setAttribute('text-length-mode', 'long');
    userHI1.innerHTML = `<div class="imgFrame" style="height: 40px; width: 50px; margin-right: 5px; border-color: ${borderColor};"><img src="${player1ImgSrc}"></div>${player1Name}`;
 
    const scoreAndThirdPlayer = document.createElement('div');
    scoreAndThirdPlayer.classList.add('scoreAndThirdPlayer');
    scoreAndThirdPlayer.innerHTML = `<div class="matchScore" style="border-color:  ${borderColor}; background-color: ${bg2Color};">${scorePlayer1} - ${scorePlayer2}</div><div class="thirdPlayer">Third Player : ${thirdPlayer}</div>`;
  
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

function getGameInfo() {
	const token = localStorage.getItem('host_auth_token');
		fetch('get_game_user/', {
		    method: 'GET',
			headers: {
				'Authorization': `Token ${token}`,
			}
		})
		.then(response => {
			if (!response.ok)
				throw new Error('Error lors de la recuperation des donnees');
				return response.json();
		})
		.then(data=> {
            console.log(data);
			data.games.forEach(game => {
                let winner = false;
                let player1;
                let player1Score;
                let player1Picture;
                let player2;
                let player2Score;
                let player2Picture;

                if (data.user_id === game.player1){
                    player1 = game.player1_username;
                    player1Score = game.scorePlayer1;
                    player1Picture = game.player1_profilePicture;
                    player2 = game.player2_username;
                    player2Score = game.scorePlayer2;
                    player2Picture = game.player2_profilePicture;
                    if (game.scorePlayer1 > game.scorePlayer2)
                        winner = true
                }
                else{
                    player1 = game.player2_username;
                    player1Score = game.scorePlayer2;
                    player1Picture = game.player2_profilePicture;
                    player2 = game.player1_username;
                    player2Score = game.scorePlayer1;
                    player2Picture = game.player1_profilePicture;
                    if (game.scorePlayer2 > game.scorePlayer1)
                        winner = true
                }
                createMatchBlock(game.gameplayMode, game.Date, game.modeGame, player1, player1Picture, player1Score, player2Score, player2, player2Picture, game.player3_username, winner);
            })
		})
		.catch(error => {
			console.error('Erreur :', error);
		});
}

document.addEventListener('keydown', (event) => { 
    if (event.key === 't')
        getGameInfo();
  });

// Sample user data
//generate more random users
const users = [
    { username: 'Vatiroi', avatar: '../../../static/html/assets/icons/FR_NU.png'},
    { username: 'Rise' , avatar: '../../../static/html/assets/icons/BR_NU.png'},
    { username: 'Sylvain', avatar: '../../../static/html/assets/icons/ES_NU.png'},
    { username: 'Doggodito', avatar: '../../../static/html/assets/icons/FR_NU.png'},
    { username: 'biboup654432', avatar: '../../../static/html/assets/icons/BR_NU.png'},
    { username: 'wolff', avatar: '../../../static/html/assets/icons/ES_NU.png'},
    { username: 'paul968', avatar: '../../../static/html/assets/icons/FR_NU.png'},
    { username: 'dsal968', avatar: '../../../static/html/assets/icons/BR_NU.png'},
    { username: 'optyes', avatar: '../../../static/html/assets/icons/ES_NU.png'},
  ];
  
  // Function to render user tiles based on search query
  function renderUsers(query) {
    const userListBackground = document.getElementById('userlistUserPage');
    userListBackground.innerHTML = ''; // Clear existing user tiles
  
    const filteredUsers = users.filter(user => user.username.toLowerCase().includes(query.toLowerCase()));
  
    filteredUsers.forEach(user => {
      const userTile = document.createElement('div');
      userTile.classList.add('userTile');
  
      const imgContainer = document.createElement('div');
      imgContainer.classList.add('imgContainer');
      imgContainer.innerHTML = `<img src="${user.avatar}">`;
  
      const textContainer = document.createElement('div');
      textContainer.classList.add('textContainer');
      textContainer.textContent = user.username;

      const loupeContainer = document.createElement('div');
      loupeContainer.classList.add('loupeImg');
      loupeContainer.innerHTML = `<img src="../../../static/html/assets/icons/loupe.png">`;
  
      userTile.appendChild(imgContainer);
      userTile.appendChild(textContainer);
      userTile.appendChild(loupeContainer);
  
      userListBackground.appendChild(userTile);
    });
  }
  
  // Function to handle input event on search input
  document.getElementById('searchInput').addEventListener('input', function(event) {
    const searchQuery = this.value.trim();
    renderUsers(searchQuery);
  });
