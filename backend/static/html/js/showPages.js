import { lobbyStart, setLobbyStart } from "./main.js";
import { moveCameraToBackOfCockpit, moveCameraToFrontOfCockpit } from "./signUpPage.js";
import { backToLobby, handleLogout, isLoggingOut } from "./loginPage.js";
import { backToLobbyPressed, gameState } from "../../game/js/main.js";
import { getTranslatedText } from "./translatePages.js";

export function showPage(pageId, transition = 'default', changeHash = true) {
    var pages = document.querySelectorAll('.page');
    pages.forEach(function(page) {
        page.classList.remove('show'); 
        page.classList.remove('default');
        page.classList.remove('signUp');
    });
    if (pageId === 'none') 
        return;
    if (changeHash)
        window.location.hash = `#${pageId}`;
   sessionStorage.setItem('currentPage', pageId); // Store current page in sessionStorage
    pageId = '.' + pageId;
    var selectedPage = document.querySelector(pageId);
    selectedPage.classList.add('show'); // Add the 'show' class to the selected page
    selectedPage.classList.add(transition);
}

let oldLocation = window.location.hash || '#loginPage';

export function initPage() {
    if (sessionStorage.getItem('currentPage'))
        showAlert(getTranslatedText("SPALoggedOut"));
    const lastPage = sessionStorage.getItem('currentPage') || 'loginPage';
    if (lastPage === 'signUpPage' || lastPage === 'rgpdPage')
        moveCameraToFrontOfCockpit(lastPage, 'signUp');
    else moveCameraToBackOfCockpit();
}

addEventListener("hashchange", () => {
    if (lobbyStart && !gameState.inGame && !gameState.loading) {
        showAlert(getTranslatedText("SPALoggedOut"));
        handleLogout(sessionStorage.getItem('host_id'), sessionStorage.getItem('host_auth_token'), false);
        return;
    }
    if (window.location.hash === '#loginPage' && oldLocation === '#signUpPage') {
        moveCameraToBackOfCockpit();
    } else if (window.location.hash === '#signUpPage' && (oldLocation === '#loginPage' || oldLocation === '#galaxy')) {
        moveCameraToFrontOfCockpit('signUpPage');
    } else if (window.location.hash === '#rgpdPage' && oldLocation === '#signUpPage') {
        moveCameraToFrontOfCockpit('rgpdPage');
        const RGPDPage = document.querySelector(".rgpdPage");
        RGPDPage.classList.add("perspectived");
    } else if (window.location.hash === '#signUpPage' && oldLocation === '#rgpdPage') {
        showPage('signUpPage');
    } else if ((window.location.hash === '#galaxy' || window.location.hash === '#game' || window.location.hash === '#loading') && (oldLocation === '#rgpdPage' || oldLocation === "#signUpPage")) {
        moveCameraToBackOfCockpit();
    }
    else if (window.location.hash === '#loading' && oldLocation === '#game' && !backToLobbyPressed && gameState.inGame){
        showAlert(getTranslatedText("SPABackToLobby"));
        backToLobby(/*historyArrow: */true);
    }
    else if (window.location.hash === '#galaxy' && oldLocation === '#loading' && gameState.loading) {
        showAlert(getTranslatedText("SPABackToLobby"));
        gameState.loadingToLobby();
    }
    oldLocation = window.location.hash;
});

export function showAlert(message, duration = 7000) {
    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.textContent = message;

    document.body.appendChild(alert);

    alert.offsetHeight;
    alert.classList.add('show');

    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(alert);
        }, 300); // Wait for fade out transition
    }, duration);
}