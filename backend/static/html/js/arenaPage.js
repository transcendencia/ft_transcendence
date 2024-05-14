import { getTranslatedText } from "./loginPage.js";

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

let powerupActive = true;
let mapCounter = 0;

function togglePowerups(image) {
    if (!powerupActive) {
        image.parentNode.querySelector('.buttonCont').style.borderColor = 'rgb(79, 226, 0)';
        image.parentNode.querySelector('.buttonCont').style.backgroundColor = 'rgba(38, 255, 0, 0.374)';
        image.parentNode.querySelector('.buttonCont').style.color = 'rgb(79, 226, 0)';
        image.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('enabled');
        powerupActive = true;
    }
    else {
        image.parentNode.querySelector('.buttonCont').style.borderColor = 'red';
        image.parentNode.querySelector('.buttonCont').style.backgroundColor = 'rgba(255, 0, 0, 0.374)';
        image.parentNode.querySelector('.buttonCont').style.color = 'red';
        image.parentNode.querySelector('.buttonCont').textContent = getTranslatedText('disabled');
        powerupActive = false;
    }
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
        buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Arabic';
    if (mapCounter === 1)
        buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Blue';
    if (mapCounter === 2)
        buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'City';
    if (mapCounter === 3)
        buttonHeader.parentNode.querySelector('.buttonCont').textContent = 'Desert';
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
            console.log(imgIndex);
            if (index === 0)
                togglePowerups(buttonHeader);
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
    clonedImg.src = 'assets/icons/whiteCross.png';
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


