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
        currentLanguage = icon.id;
        loginText.childNodes[0].textContent = getTranslatedText('loginText');
        passwordText.childNodes[0].textContent = getTranslatedText('passwordText');
        loginLanguageText.childNodes[4].textContent = getTranslatedText('loginLanguageText');
        languageIcons.forEach(function(otherIcon) {
            if (otherIcon !== icon) {
                removeGlow(otherIcon.id);
            }
        });
    });
});

// Add event listener to the loginForm
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', handleLogin);

// Handle form submission
function handleLogin(event) {
    event.preventDefault();

    const formData = new FormData(this);
    fetch('login_page/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.status == "succes")
            localStorage.setItem("token", data.token)
        document.getElementById('messageContainer').innerText = data.message;
    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    })
}
