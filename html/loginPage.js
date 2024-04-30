export let currentLanguage = 'en';

// Function to fetch language data from JSON file
function fetchLanguageData(language, textElem) {
    // Fetch JSON data from the server
    return fetch('languages.json')
        .then(response => response.json())
		.then(data => {
            return updateLanguage(data[language], textElem);
        })
        .catch(error => {
            console.error('Error fetching language data:', error);
        });
}

// Function to update text content based on language data
function updateLanguage(languageData, textElem) {
	return (languageData[textElem]);
}

function getTranslatedTextPromise(language, textElem) {
    // Return the result of updateLanguage directly
    return fetchLanguageData(language, textElem)
		.then(translatedText => {
            return translatedText;
        });
}

export function setTranslatedText(language, textElemString, textElem) {
    getTranslatedTextPromise(language, textElemString)
        .then(text => {
            textElem.textContent = text;
    })
    .catch(error => {
        console.error('Error:', error); // Handle errors
    });
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

async function changeText(id) {
    setTranslatedText(id, "loginText", loginText.childNodes[0]);
    setTranslatedText(id, "passwordText", passwordText.childNodes[0]);
    setTranslatedText(id, "loginLanguageText", loginLanguageText.childNodes[4]);
}

// Loop through each language icon element and add a click event listener
languageIcons.forEach(function(icon) {
    icon.addEventListener('click', function () {
		addGlow(icon.id);
        changeText(icon.id);
        currentLanguage = icon.id;
        languageIcons.forEach(function(otherIcon) {
            if (otherIcon !== icon) {
                removeGlow(otherIcon.id);
            }
        });
    });
});