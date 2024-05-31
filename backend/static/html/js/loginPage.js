import { moveCameraToFrontOfCockpit } from "./signUpPage.js";
import { showPage } from "./showPages.js";
import { alien1, alien2, alien3} from "./objs.js";
import { TranslateAllTexts, currentLanguage, languageIconsClicked, setlanguageIconsClicked, setCurrentLanguage} from "./translatePages.js";
import { gameState } from "../../game/js/main.js";
import { RenderAllUsersInList } from "./arenaPage.js";


import { startAnimation } from "./main.js";
// import { changeGraphics } from "./arenaPage.js";

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
        if (icon.id === 'graphicsIcon1' && gameState.graphics != 'low')
        {
            gameState.graphicsNeedToChange = true;
            gameState.graphics = 'low';
        }
        if (icon.id === 'graphicsIcon2' && gameState.graphics != 'medium')
        {
            gameState.graphicsNeedToChange = true;
            gameState.graphics = 'medium';
        }
        if (icon.id === 'graphicsIcon3' && gameState.graphics != 'high')
        {
            gameState.graphicsNeedToChange = true;
            gameState.graphics = 'high';
        }
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

// Sélection du bouton par son ID
// var disconnectButton = document.getElementById("disconnectButton");

// // Ajout d'un gestionnaire d'événements pour le clic sur le bouton
// disconnectButton.addEventListener("click", function() {
//     localStorage.clear();
//     console.log("Le bouton Disconnect a été cliqué !");
// });

languageIcons.forEach(function(icon) {
    icon.addEventListener('click', function () {
        if (icon.id === 'fr' || icon.id == 'fr1') {
            alien1.visible = false;
            alien2.visible = true;
            alien3.visible = false;
        }
        
        if (icon.id === 'en'|| icon.id == 'en1') {
            alien1.visible = true;
            alien2.visible = false;
            alien3.visible = false;
        }
        if (icon.id === 'es'|| icon.id == 'es1') {
            alien1.visible = false;
            alien2.visible = false;
            alien3.visible = true;
        }
        addGlow(icon.id, 'glow');
        setlanguageIconsClicked(true);
        setCurrentLanguage(icon.id);
        if (icon.id.length === 3)
            setCurrentLanguage(icon.id.slice(0, 2));
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
        const token = localStorage.getItem('host_auth_token');
        if (token) {
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

    const formData = new FormData(this);
    formData.append('language', currentLanguage);
    formData.append('languageClicked', languageIconsClicked);
    setlanguageIconsClicked(false);
    fetch('login_page/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == "succes") {
            localStorage.setItem("host_auth_token", data.token)
            setCurrentLanguage(data.language);
            TranslateAllTexts();
            get_user_list();
            getProfileInfo();
            showPage('none');
            startAnimation();
        } else 
            document.getElementById('messageContainer').innerText = data.message;
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
}

document.addEventListener('DOMContentLoaded', get_user_list());

function getProfileInfo() {
	const token = localStorage.getItem('host_auth_token');
		fetch('get_profile_info/', {
		    method: 'GET',
			headers: {
				'Authorization': `Token ${token}`,
			}
		})
		.then(response => {
			if (!response.ok)
				throw new Error('Error lors de la recuperation des donne');
				return response.json();
		})
		.then(data=> {
			document.getElementById('username').textContent = data.profile_info.username;
			document.getElementById('bio').textContent = data.profile_info.bio;
			document.getElementById('profile_pic').src = data.profile_info.profile_picture;
		})
		.catch(error => {
			console.error('Erreur :', error);
		});
}

// Logout
var disconnectButton = document.getElementById("disconnectButton");
disconnectButton.addEventListener("click", handleLogout);

function handleLogout() {
    updateUserStatus('offline')
    .then(() => {
        return get_user_list();
    })
    .then(() => {
        localStorage.clear();
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
};

function updateUserStatus(status) {
    const token = localStorage.getItem('host_auth_token');
    return fetch('update_status/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ status: status })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du logout');
        }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
};

function getUserStatus() {
    const token = localStorage.getItem('host_auth_token');
    fetch('get_status/', {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};

export let userList;

// export function get_user_list() {
//     const token = localStorage.getItem('host_auth_token');
//     fetch('get_user_list/', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Token ${token}`,
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         userList = data;
//         RenderAllUsersInList(data);
//     })
//     .catch(error => console.error('Error:', error));
// };

export function get_user_list(){
    const token = localStorage.getItem('host_auth_token');
    // console.log(token);
    fetch('get_user_list/', {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        userList = data;
        RenderAllUsersInList(data);
        console.log(userList);
        // console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
        throw error;
    });
};