export let currentLanguage = 'en';
let languageFile;

fetch('static/html/languages.json')
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
// Get all elements with the class "languageIcon"
var languageIcons = document.querySelectorAll('.languageIcon');
const loginText = document.getElementById('loginText');
const passwordText = document.getElementById('passwordText');
const loginLanguageText = document.getElementById('loginLanguageText');

// Loop through each language icon element and add a click event listener
languageIcons.forEach(function(icon) {
    icon.addEventListener('click', function () {
        addGlow(icon.id);
        
        console.log(languageFile);
        currentLanguage = icon.id;
        languageIcons.forEach(function(otherIcon) {
            if (otherIcon !== icon) {
                removeGlow(otherIcon.id);
            }
        });
    });
});