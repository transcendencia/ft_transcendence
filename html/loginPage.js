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

export async function getTranslatedText(language, textElem) {
    // Return the result of updateLanguage directly
    return fetchLanguageData(language, textElem)
		.then(translatedText => {
			console.log(translatedText);
            return translatedText;
        });
}

function addGlow(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.classList.add('glow');
    }
}

// Function to remove glowing effect from an element
function removeGlow(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('glow');
    }
}
// Get all elements with the class "languageIcon"
var languageIcons = document.querySelectorAll('.languageIcon');
const loginText = document.getElementById('loginText');
const passwordText = document.getElementById('passwordText');
const loginLanguageText = document.getElementById('loginLanguageText');

async function changeText(id) {
	const text1 = await getTranslatedText(id, "loginText");
	const text2 = await getTranslatedText(id, "passwordText");
	const text3 = await getTranslatedText(id, "loginLanguageText");
	loginText.childNodes[0].textContent = text1;
	passwordText.childNodes[0].textContent = text2;
	loginLanguageText.childNodes[4].textContent = text3;
}

// Loop through each language icon element and add a click event listener
languageIcons.forEach(function(icon) {
    icon.addEventListener('click', function () {
		addGlow(icon.id);
		changeText(icon.id);
        languageIcons.forEach(function(otherIcon) {
            if (otherIcon !== icon) {
                removeGlow(otherIcon.id);
            }
        });
    });
});