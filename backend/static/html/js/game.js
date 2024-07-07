

let gamemodeCounter = 0;
let mapCounter = 0;
let botDifficulty = 1;


function toggleGamemode(buttonHeader, imgIndex) {
	if (imgIndex === 0){
		gamemodeCounter--;
		if (gamemodeCounter === -1)
			gamemodeCounter = 2;
	}
	else {
		gamemodeCounter++;    
		if (gamemodeCounter === 3) // 0 = classic 1 = powerless 2= spin only 
			gamemodeCounter = 0;
	} 
	if (gamemodeCounter === 0)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('gamemodeNameText1');
	else if (gamemodeCounter === 1)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('gamemodeNameText2');
	else if (gamemodeCounter === 2)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('gamemodeNameText3');
}

function handleMaps(buttonHeader, imgIndex) {
	if (imgIndex === 0){
		mapCounter--;
		if (mapCounter === -1)
			mapCounter = 3;
		}
	else {
		mapCounter++;    
		if (mapCounter === 4)
			mapCounter = 0;
		} 
	if (mapCounter === 0)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Space';
	else if (mapCounter === 1)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Ocean';
	else if (mapCounter === 2)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Sky';
	else if (mapCounter === 3)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Dragon Pit';
}

function handleBotDifficulty(buttonHeader, imgIndex) {
	if (imgIndex === 0){
		botDifficulty--;
		if (botDifficulty === -1)
			botDifficulty = 2;
	}
	else {
		botDifficulty++;    
		if (botDifficulty === 3)
			botDifficulty = 0;
	}
	if (botDifficulty === 0)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('botDifficultyEasy');
	else if (botDifficulty === 1)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('botDifficultyMedium');
	else if (botDifficulty === 2)
		buttonHeader.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('botDifficultyHard');
  }

export let gameStarted = false;

export function toggleGameStarted() {
	gameStarted = !gameStarted;
}

export function endGame(isTournament) {
	let token = sessionStorage.getItem('host_auth_token');
	updateUserStatus('online', token);
	for(let i = 0; i < guestLoggedIn.length; i++) {
		console.log("lets check:", guestLoggedIn[i][0].id, gameState.arena.game.user2.id)
		if (guestLoggedIn[i][0].id === gameState.arena.game.user2.id || guestLoggedIn[i][0].id === gameState.arena.game.user3.id) {
			console.log("les id des gens:", guestLoggedIn[i][0].id, gameState.arena.game.user2.id, gameState.arena.game.user3.id);
			token = guestLoggedIn[i][1];
			updateUserStatus('online', token);
		}
	}
	gameStarted = false;
	let user3 = null;

	if (gameState.arena.game.thirdPlayer)
		user3 = gameState.arena.game.user3.id
	if (isTournament){
		planetPanel[2].style.visibility = 'visible';
		createGame(gameState.arena.game.user1.id, gameState.arena.game.user2.id, user3, gameState.arena.game.leftScore, gameState.arena.game.rightScore, "tournament", gameState.arena.game.gameMode, gameState.arena.game.map, gameState.arena.game.user1, gameState.arena.game.user2, gameState.arena.game.user3, gameState.arena.game.gameTime);
		afterGameTournament(gameState.arena.game.leftScore, gameState.arena.game.rightScore);
	}
	else{
		planetPanel[0].style.visibility = 'visible';
		createGame(gameState.arena.game.user1.id, gameState.arena.game.user2.id, user3, gameState.arena.game.leftScore, gameState.arena.game.rightScore, "arena", gameState.arena.game.gameMode, gameState.arena.game.map, gameState.arena.game.user1, gameState.arena.game.user2, gameState.arena.game.user3, gameState.arena.game.gameTime);
	}
	rsContainer.style.visibility = 'visible';
	gameUI.style.visibility = 'hidden';
	document.getElementById('c4').style.display = 'block';
	document.getElementById('c3').style.display = 'none';
	document.getElementById('c1').style.display = 'none';
	gameState.arena.game.resetUsers();
}

export function rematchGame() {
	let user3 = null;

	if (gameState.arena.game.thirdPlayer)
		user3 = gameState.arena.game.user3.id  
	createGame(gameState.arena.game.user1.id, gameState.arena.game.user2.id, user3, gameState.arena.game.leftScore, gameState.arena.game.rightScore, "arena", gameState.arena.game.gameMode, gameState.arena.game.map, gameState.arena.game.user1, gameState.arena.game.user2, gameState.arena.game.user3, gameState.arena.game.gameTime);
	gameState.arena.game.resetUsers();
}

const gameUI = document.querySelector(".gameUI");

export function switchToGame(gameState, player1, player2, player3, isTournament) {
	gameStarted = true;
	gameUI.style.visibility = 'visible';
	if (isTournament)
		planetPanel[2].style.visibility = 'hidden';
	else
		planetPanel[0].style.visibility = 'hidden';
	loginPage.style.visibility = 'hidden';
	rsContainer.style.visibility = 'hidden';
	document.getElementById('c4').style.display = 'none';
	if (gameState.arena != undefined)
		gameState.arena.loadingScreen.activateLoadingScreen();
	initGame(gameState, player1, player2, player3, isTournament);
}

export function    initGame(gameState, player1, player2, player3, isTournament) {
	// prepare for initialization
	console.log("players", player1, player2, player3);
	gameState.loading = true;
	gameState.inLobby = false;
	setTimeout(() => {
		let token = sessionStorage.getItem('host_auth_token');
		updateUserStatus('in_game', token);
		for(let i = 0; i < guestLoggedIn.length; i++) {
			console.log("lets check:", guestLoggedIn[i][0].id, player2.playerId)
			if (guestLoggedIn[i][0].id === player2.playerId || guestLoggedIn[i][0].id === player3.playerId) {
				token = guestLoggedIn[i][1];
				updateUserStatus('in_game', token);
			}
		}
	  gameState.arena.game.hasToBeInitialized = true;
	  // choose gameMode
	  if (isTournament){
		gamemodeCounter = gamemodeCounterTournament;
		mapCounter = mapCounterTournament;  
		botDifficulty = botDifficultyTournament;
	  }
	  if (gamemodeCounter === 0) {
		  gameState.arena.game.powerUpsActivated = true;
		  gameState.arena.game.effectsOnly = false;
	  }
	  else if (gamemodeCounter === 1) {
		  gameState.arena.game.powerUpsActivated = false;
		  gameState.arena.game.effectsOnly = false;
	  }
	  else if (gamemodeCounter === 2) {
		  gameState.arena.game.powerUpsActivated = true;
		  gameState.arena.game.effectsOnly = true;
	  }
	  const modeList = ["CLASSIC", "POWERLESS", "SPIN ONLY"];
	  gameState.arena.game.gameMode = modeList[gamemodeCounter];
	  // choose map
	  const mapList = ["spaceMap", "oceanMap", "skyMap", "dragonMap"];
	  gameState.arena.game.map = mapList[mapCounter];
	  // choose bot difficulty
	  const difficultyList = ["easy", "medium", "hard"];
	  gameState.arena.bot.difficulty = difficultyList[botDifficulty];

	  // add players
	  // const 
	  gameState.arena.game.user1.setUser(player1.username, player1.playerId, player1.profile_picture);
	  gameState.arena.game.user2.setUser(player2.username, player2.playerId, player2.profile_picture);
	  if (playerNb === 2) {
		gameState.arena.game.user3.setUser(player3.username, player3.playerId, player3.profile_picture);
		gameState.arena.game.thirdPlayer = true;
	  }
	  else gameState.arena.game.thirdPlayer = false;
	  gameState.arena.game.tournamentGame = isTournament;
	  gameState.arena.loadingScreen.loadingComplete();
	}, 250);
  }

export function changeGraphics(mode) {
	if (gameState.graphics === mode)
		return;
	gameState.graphics = mode;
	gameState.graphicsNeedToChange = true;
}


const rsContainer = document.querySelector('.rightSideContainer');
const loginPage = document.querySelector('.loginPage');
const planetPanel = document.querySelectorAll('.planetPanel');
const startButton = document.querySelector('.redButton');
startButton.addEventListener('click', function() {
	let player2;
	let player3;
	if (matchPlayer.length < 2)
		return;
	if (matchPlayer.length === 2){
		player2 = matchPlayer[1];
		player3 = "";
	}
	else {
		if (matchPlayer[1].thirdPlayer){
			player2 = matchPlayer[2];
			player3 = matchPlayer[1];
		}
		else {
			player2 = matchPlayer[1];
			player3 = matchPlayer[2];
		}
	}
	switchToGame(gameState, matchPlayer[0], player2, player3, false);
});
