import { moveCameraToFrontOfCockpit } from "./signUpPage.js";
import { showPage } from "./showPages.js";
import { alien1, alien2 } from "./objs.js";
import { TranslateAllTexts } from "./translatePages.js";

export let currentLanguage = 'en';
let languageFile;
var languageIconsClicked = false;

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
        else console.error('Current language ' + currentLanguage + 'not found in language file');
    }
}

function addGlow(elementId, glow) {
    var element = document.getElementById(elementId);
    if (element)
        element.classList.add(glow);
}

function removeGlow(elementId, glow) {
    var element = document.getElementById(elementId);
    if (element)
        element.classList.remove(glow);
}

let languageIcons = document.querySelectorAll('.languageIcon');
let graphicsIcons = document.querySelectorAll('.graphicsIcon');
const signupHereButton = document.querySelector('.actionCont');
signupHereButton.addEventListener('click', function() {
    moveCameraToFrontOfCockpit();
});

showPage('loginPage');

graphicsIcons.forEach(function(icon) {
    icon.addEventListener('click', function () {
        addGlow(icon.id, 'redGlow');
        graphicsIcons.forEach(function(otherIcon) {
        if (otherIcon != icon)
            removeGlow(otherIcon.id, 'redGlow');
        });
    });
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

languageIcons.forEach(function(icon) {
    icon.addEventListener('click', function () {
        console.log("Je clique pour changer de langue")
        if (icon.id === 'fr' || icon.id == 'fr1') {
            alien1.visible = false;
            alien2.visible = true;
        }
        if (icon.id === 'en'|| icon.id == 'en1') {
            alien1.visible = true;
            alien2.visible = false;
        }
        addGlow(icon.id, 'glow');
        languageIconsClicked = true;
        currentLanguage = icon.id;
        if (icon.id.length === 3)
            currentLanguage = icon.id.slice(0, 2);
        icon.querySelector('.flag').style.opacity = 1;
        icon.querySelector('.icon').style.opacity = 0;
        TranslateAllTexts();
        languageIcons.forEach(function(otherIcon) {
            if (otherIcon != icon) {
                removeGlow(otherIcon.id, 'glow');
                otherIcon.querySelector('.flag').style.opacity = 0;
                otherIcon.querySelector('.icon').style.opacity = 1;
            }
        });

        // Send POST request to change user language in the back if user is logged in
        const token = localStorage.getItem('auth_token');
        if (token) {
            console.log("je change de langue");
            console.log(currentLanguage);
            fetch('change_language/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ language: currentLanguage })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la modification de la langue');
                }
                console.log('Langue modifiée avec succès');
            })
            .catch(error => {
                console.error('Erreur :', error);
            });
        }
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

// Add event listener to the loginForm
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', handleLogin);

// Handle form submission
function handleLogin(event) {
    event.preventDefault();

    // console.log(currentLanguage);

    const formData = new FormData(this);
    formData.append('language', currentLanguage);
    formData.append('languageClicked', languageIconsClicked);
    languageIconsClicked = false;
    console.log(languageIconsClicked);
    fetch('login_page/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == "succes")
            localStorage.setItem("auth_token", data.token)
            currentLanguage = data.language;
        document.getElementById('messageContainer').innerText = data.message;
        console.log(currentLanguage);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    })
}
