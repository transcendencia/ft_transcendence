import { getTranslatedText } from "./loginPage.js";
import { showPage } from "./showPages.js";

const userlist = document.querySelector(".userlistBackground");
const userTiles = userlist.querySelectorAll(":scope > *");
const plusButtons = document.querySelectorAll(".plusPlayer");

const leftColumn = document.querySelector(".leftColumn");
const userlistTitle = leftColumn.childNodes[1];
userlistTitle.textContent = getTranslatedText('userlist');

let plusClicked = false;
const botID = 0;

const blue = '#3777ff';
const purple = 'rgb(164, 67, 255)'
const grey = '#141414';
const lightGrey = '#323232';

function Glow() {
    userlist.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    userlist.style.borderColor = '#ffb30eff';
    userlist.style.animation = 'shadowBlink 1s infinite alternate ease-in-out';
    userTiles.forEach((tile, i) => {
        if (profileAdded[i])
            return;
        const tileChildren = tile.querySelectorAll(":scope > *");
        tileChildren.forEach(function(element) {
            element.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
            element.style.borderColor = '#ffb30eff';
            element.style.animation = 'shadowBlink 1s infinite alternate ease-in-out';
        });
    });
}

let gamemodeCounter = 0;
let mapCounter = 0;

function toggleGamemode(buttonHeader, imgIndex) {
    if (imgIndex === 0){
        gamemodeCounter--;
        if (gamemodeCounter === -1)
        gamemodeCounter = 3;
        }
    else {
        gamemodeCounter++;    
        if (gamemodeCounter === 3)
        gamemodeCounter = 0;
        } 
    if (gamemodeCounter === 0)
        buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Classic';
    if (gamemodeCounter === 1)
        buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Powerups';
    if (gamemodeCounter === 2)
        buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Spin Only';

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
    if (mapCounter === 1)
        buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Ocean';
    if (mapCounter === 2)
        buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Sky';
    if (mapCounter === 3)
        buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Road';
}

const buttonHeaders = document.querySelectorAll('.buttonTitle');
buttonHeaders.forEach((buttonHeader, index) => {
    
    const images = buttonHeader.querySelectorAll('img');
    images.forEach((image, imgIndex) => {
        image.addEventListener('mouseenter', function () {
            image.classList.add('lightblueShadowfilter');
        });
        image.addEventListener('mouseleave', function () {
            image.classList.remove('lightblueShadowfilter');
        });
        image.addEventListener('click', function () {
            // console.log(imgIndex);
            if (index === 0)
                toggleGamemode(buttonHeader, imgIndex);
            if (index === 1)
                handleMaps(buttonHeader, imgIndex);
        });
    });
});


function resetGlow() {
    userlist.style.borderColor = blue;
    userlist.style.animation = '';
    userTiles.forEach((child, i) => {
        const children = child.querySelectorAll(":scope > *");
        children.forEach(element => {
            element.style.borderColor = blue;
            element.style.animation = '';
        });
        if (isBot(i)) {
            children.forEach(element => {
                element.style.borderColor = purple;
            });
        }
    });
} 

function resetAddingMode() {
    userlistTitle.textContent = getTranslatedText('userlist');
    plusClicked = 0;
    plusButtons.forEach(function(otherPlusButton) {
        otherPlusButton.style.pointerEvents = 'auto';
    });
    profileAdded[botID] = false;
}

function setAddingMode(plusButton, i) {
    userlistTitle.textContent = getTranslatedText('chooseProfile');
    if (i === 0) {
        plusClicked = 1;
        profileAdded[botID] = true;
    }
    else plusClicked = 2;
    plusButtons.forEach(function(otherPlusButton) {
        if (otherPlusButton !== plusButton) {
            otherPlusButton.style.pointerEvents = 'none';
        }
    });
}


export let gameStarted = false;

export function endGame() {
    gameStarted = false;
    planetPanel.style.display = 'inline';
    loginPage.style.display = 'inline';
    rsContainer.style.display = 'inline';
    document.getElementById('c4').style.display = 'block';
    document.getElementById('c3').style.display = 'none';
}

const gameUI = document.querySelector(".gameUI");

export function switchToGame() {
    gameStarted = true;
    gameUI.style.visibility = 'visible';
    planetPanel.style.display = 'none';
    loginPage.style.display = 'none';
    rsContainer.style.display = 'none';
    document.getElementById('c4').style.display = 'none';
    document.getElementById('c1').style.display = 'block';
}
    

const rsContainer = document.querySelector('.rightSideContainer');
const loginPage = document.querySelector('.loginPage');
const planetPanel = document.querySelector('.planetPanel');
const startButton = document.querySelector('.startButton');
startButton.addEventListener('click', function() {
    switchToGame();
});

userlistTitle.textContent = getTranslatedText('userlist');
plusButtons.forEach(function(plusButton, i) {
    plusButton.addEventListener('click', function () {
        if (!plusClicked) {
            setAddingMode(plusButton, i);
            Glow();
            plusButton.style.backgroundColor = lightGrey;
        }
        else {
            resetAddingMode(plusButton);
            resetGlow();
            plusButton.style.backgroundColor = grey;
        }
    });
    //Hovering
    plusButton.addEventListener('mouseenter', function () {
        if (!plusClicked)
            plusButton.style.backgroundColor = lightGrey;
    });

    plusButton.addEventListener('mouseleave', function () {
        if (!plusClicked)
            plusButton.style.backgroundColor = grey;
    });
});

let profileAdded = [];

function isBot(i) {
    return (i === botID)
}

function displayRemovePlayerVisual(userInfoCont, clonedImg, profilePic) {
    clonedImg.src = '../assets/icons/whiteCross.png';
    profilePic.style.borderColor = 'red';
    userInfoCont.style.borderColor = 'red';
    userInfoCont.style.fontSize = '25px';
    userInfoCont.style.fontFamily = 'computer';
    userInfoCont.childNodes[1].textContent = getTranslatedText('removePlayer');
}

function resetUserInfoVisual(userInfoCont, clonedImg, profilePic, tileText, i, tile) {
    if (isBot(i)) {
        userInfoCont.style.borderColor = purple;
        profilePic.style.borderColor = purple;
    }
    else {
        profilePic.style.borderColor = blue;
        userInfoCont.style.borderColor = blue;
    }
    clonedImg.src = tile.querySelector('.imgContainer').querySelector('img').src;
    userInfoCont.childNodes[1].textContent = tileText;
    userInfoCont.style.fontFamily = 'space';
    userInfoCont.style.fontSize = '15px';
}

function resetToPlusButton(userInfoCont, oldObj, textCont) {
    userInfoCont.parentNode.replaceChild(oldObj, userInfoCont)
    textCont.style.backgroundColor = '#00000031';
    oldObj.style.backgroundColor = grey;
}

function createUserInfoObject(tile, i) {
    const userInfoCont = document.createElement('div');
    const profilePic = document.createElement('div');
    const clonedImg = tile.querySelector('.imgContainer').querySelector('img').cloneNode(true);
    const tileText = tile.querySelector('.textContainer').textContent;
    const textNode = document.createTextNode(tileText);
    userInfoCont.classList.add('userInfoCont');
    profilePic.classList.add('profilePic');
    profilePic.appendChild(clonedImg);
    userInfoCont.appendChild(profilePic);
    userInfoCont.appendChild(textNode);
    if (isBot(i)) {
        userInfoCont.style.borderColor = purple;
        profilePic.style.borderColor = purple;
    }
    return {userInfoCont, clonedImg, profilePic, tileText};
}

userTiles.forEach((tile, i) => {
    profileAdded[i] = false;
    tile.addEventListener('click', function(){
        if (plusClicked && !profileAdded[i]) {
            profileAdded[i] = true;
            const newObj = createUserInfoObject(tile, i);
            const oldObj = plusButtons[plusClicked - 1];
            oldObj.parentNode.replaceChild(newObj.userInfoCont, oldObj);
            resetGlow();
            resetAddingMode();
            newObj.userInfoCont.addEventListener('mouseenter', function () {
                displayRemovePlayerVisual(newObj.userInfoCont, newObj.clonedImg, newObj.profilePic);
            });
            newObj.userInfoCont.addEventListener('mouseleave', function () {
                resetUserInfoVisual(newObj.userInfoCont, newObj.clonedImg, newObj.profilePic, newObj.tileText, i, tile);
            });
            newObj.userInfoCont.addEventListener('click', function() {
                resetToPlusButton(newObj.userInfoCont, oldObj, textCont);
                profileAdded[i] = false;
                profileAdded[botID] = false;
            });
        }
    });

    const textCont = tile.querySelector(".textContainer");
    textCont.addEventListener('mouseenter', function () {
        if (plusClicked && !profileAdded[i])
            textCont.style.backgroundColor = 'rgba(90, 142, 255, 0.219)';
    });
    textCont.addEventListener('mouseleave', function () {
        if (plusClicked && !profileAdded[i])
            textCont.style.backgroundColor = '#00000031';
    });
});


