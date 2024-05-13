export let currentLanguage = 'esp';
let languageFile;

fetch('languages.json')
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
    } else {
        console.error('Language file not initialized');
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
    loginText.childNodes[0].textContent = '- ' + getTranslatedText('loginText') + ' -';
    passwordText.childNodes[0].textContent = '- ' + getTranslatedText('passwordText') + ' -';
    loginLanguageText.childNodes[4].textContent = '- ' + getTranslatedText('loginLanguageText') + ' -';
}

// Get all elements with the class "languageIcon"
var languageIcons = document.querySelectorAll('.languageIcon');
const loginText = document.getElementById('loginText');
const passwordText = document.getElementById('passwordText');
const loginLanguageText = document.getElementById('loginLanguageText');
const signupHereButton = document.querySelector('actionCont');


languageIcons.forEach(function(icon) {
    icon.addEventListener('click', function () {
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
