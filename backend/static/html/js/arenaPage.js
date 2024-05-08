import { getTranslatedText } from "./loginPage.js";

const thirdPlayerCont = document.querySelector('.thirdPlayerCont')
const userlist = document.querySelector(".userlistBackground");
const plusSigns = document.querySelectorAll(".plusPlayer");
const leftColumn = document.querySelector(".leftColumn");
const userlistTitle = leftColumn.childNodes[1];

let plusClicked = false;

function Glow() {
    userlist.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    userlist.style.borderColor = '#ffb30e';
    userlist.style.animation = 'shadowBlink 1s infinite alternate ease-in-out';
    userTiles.forEach(child => {
        const children = child.querySelectorAll(":scope > *");
        children.forEach(function(element) {
            element.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
            element.style.borderColor = '#ffb30e';
            element.style.animation = 'shadowBlink 1s infinite alternate ease-in-out';
        });
    });
}

function resetGlow() {
    userlist.style.borderColor = '#3777ff';
    userlist.style.animation = '';
    userTiles.forEach(child => {
        const children = child.querySelectorAll(":scope > *");
        children.forEach(function(element) {
            element.style.borderColor = '#3777ff';
            element.style.animation = '';
        });
    });
    
} 

const userTiles = userlist.querySelectorAll(":scope > *");

userlistTitle.textContent = getTranslatedText('userlistTitle');
plusSigns.forEach(function(plusSign, i) {
    plusSign.addEventListener('click', function () {
        if (!plusClicked) {
            Glow();
            userlistTitle.textContent = getTranslatedText('userlistTitle2');
            plusSign.style.backgroundColor = '#323232';
            if (i === 0)
                plusClicked = 1;
            else plusClicked = 2;
            plusSigns.forEach(function(otherPlusSign) {
                if (otherPlusSign !== plusSign) {
                    otherPlusSign.style.pointerEvents = 'none';
                }
            });
        }
        else {
            resetGlow();
            userlistTitle.textContent = getTranslatedText('userlistTitle');
            plusSign.style.backgroundColor = '#141414';
            plusClicked = 0;
            // Re-add click event listeners to all plus signs
            plusSigns.forEach(function(otherPlusSign) {
                otherPlusSign.style.pointerEvents = 'auto';
            });
        }
    });
    //Hovering
    plusSign.addEventListener('mouseenter', function () {
        if (!plusClicked)
            plusSign.style.backgroundColor = '#323232';
    });

    plusSign.addEventListener('mouseleave', function () {
        if (!plusClicked)
            plusSign.style.backgroundColor = '#141414';
    });
});

let profileAdded = [];

//hovering for userTiles when a plusSign is clicked
userTiles.forEach(tile => {
    tile.addEventListener('click', function(){
        if (plusClicked) {
            profileAdded[tile] = true;
            const userInfoCont = document.createElement('div');
            const profilePic = document.createElement('div');
            const imgContainer = tile.querySelector('.imgContainer');
            const img = imgContainer.querySelector('img');
            const clonedImg = img.cloneNode(true);
            const textContainer = tile.querySelector('.textContainer');
            const tileText = textContainer.textContent;
            const textNode = document.createTextNode(tileText);
            const tileImgSrc = img.src;
            clonedImg.src = tileImgSrc; // Update the cloned image source
            userInfoCont.classList.add('userInfoCont');
            profilePic.classList.add('profilePic');
            profilePic.appendChild(clonedImg); // Append the cloned image
            userInfoCont.appendChild(profilePic);
            userInfoCont.appendChild(textNode);
            const plusSign = plusSigns[plusClicked - 1];
            plusSign.parentNode.replaceChild(userInfoCont, plusSign);
            resetGlow();
            plusClicked = 0;
        }
    });

    const textCont = tile.querySelector(".textContainer");
    textCont.addEventListener('mouseenter', function () {
        if (plusClicked && !profileAdded[tile])
            textCont.style.backgroundColor = 'rgba(90, 142, 255, 0.219)';
    });
    textCont.addEventListener('mouseleave', function () {
        if (plusClicked && !profileAdded[tile])
            textCont.style.backgroundColor = '#00000031';
    });
});

