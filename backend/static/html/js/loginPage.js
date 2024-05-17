import { moveCameraToFrontOfCockpit } from "./signUpPage.js";
import { showPage } from "./showPages.js";
import { alien1, alien2 } from "./objs.js";

export let currentLanguage = 'en';
let languageFile;

fetch('../../static/html/languages.json')
    .then(response => response.json())
    .then(data => {
        languageFile = data;
    })
    .catch(error => {
        console.error('Error fetching language data:', error);
    });

export function getTranslatedText(key) {
    if (languageFile) {
        if (languageFile[currentLanguage])
            return languageFile[currentLanguage][key];
        else console.error('Current language not found in language file');
    }
}

function addGlow(elementId) {
    var element = document.getElementById(elementId);
    if (element)
        element.classList.add('glow');
}

// Function to remove glowing effect from an element
function removeGlow(elementId) {
    var element = document.getElementById(elementId);
    if (element)
        element.classList.remove('glow');
}

function updateText() {
    loginText.childNodes[0].textContent = '- ' + getTranslatedText('login') + ' -';
    passwordText.childNodes[0].textContent = '- ' + getTranslatedText('password') + ' -';
    loginLanguageText.childNodes[4].textContent = '- ' + getTranslatedText('loginLanguage') + ' -';
    newToTheGame.childNodes[0].textContent = getTranslatedText('newToTheGame');
    signupHereButton.textContent = getTranslatedText('signUpHere');
    SignUpTitle.childNodes[0].textContent = getTranslatedText('signUpTitle');
    SignUpTitle.childNodes[1].textContent = getTranslatedText('createAnAccount');
    enterLogin.childNodes[0].textContent = getTranslatedText('login');
    enterPassword.childNodes[0].textContent = getTranslatedText('password');
    confirmPassword.childNodes[0].textContent = getTranslatedText('confirmPassword');
    backToLoginButton.childNodes[0].textContent = getTranslatedText('backToLogin');
    SignUpButton.childNodes[0].textContent = getTranslatedText('signUpTitle');
}

// Get all elements with the class "languageIcon"
var languageIcons = document.querySelectorAll('.languageIcon');
const loginText = document.getElementById('loginText');
const passwordText = document.getElementById('passwordText');
const enterLogin = document.getElementById('enterLogin');
const enterPassword = document.getElementById('enterPassword');
const loginLanguageText = document.getElementById('loginLanguageText');
const newToTheGame = document.querySelector('.newToTheGame');
const signupHereButton = document.querySelector('.actionCont');
const confirmPassword = document.getElementById('confirmPassword');
const SignUpTitle = document.querySelector('.perspective');
const SignUpButton = document.querySelectorAll('.actionCont')[1];
const backToLoginButton = document.querySelector('.backButton');

signupHereButton.addEventListener('click', function() {
    moveCameraToFrontOfCockpit();
});

showPage('loginPage');

languageIcons.forEach(function(icon) {
    icon.addEventListener('click', function () {
        if (icon.id === 'fr') {
            alien1.visible = false;
            alien2.visible = true;
        }
        if (icon.id === 'en') {
            alien1.visible = true;
            alien2.visible = false;
        }
        addGlow(icon.id);
        currentLanguage = icon.id;
        icon.querySelector('.flag').style.opacity = 1;
        icon.querySelector('.icon').style.opacity = 0;
        updateText();
        languageIcons.forEach(function(otherIcon) {
            if (otherIcon != icon) {
                removeGlow(otherIcon.id);
                otherIcon.querySelector('.flag').style.opacity = 0;
                otherIcon.querySelector('.icon').style.opacity = 1;
            }
        });
    });
    //init english flag
    if (icon.id === currentLanguage) {
        icon.querySelector('.flag').style.opacity = 1;
        icon.querySelector('.icon').style.opacity = 0;
    }

    icon.addEventListener('mouseenter', function () {
        icon.querySelector('.flag').style.opacity = 1;
        icon.querySelector('.icon').style.opacity = 0;
    });

    icon.addEventListener('mouseleave', function () {
        if (icon.id !== currentLanguage) {
            icon.querySelector('.flag').style.opacity = 0;
            icon.querySelector('.icon').style.opacity = 1;
        }
    });
});
