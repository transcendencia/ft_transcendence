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
    const lastPage = sessionStorage.getItem('currentPage') || 'loginPage';
    if (lastPage === 'signUpPage' || lastPage === 'rgpdPage')
        moveCameraToFrontOfCockpit(lastPage, 'signUp');
    else moveCameraToBackOfCockpit();
}

window.addEventListener("load", function() {
    const lastPage = sessionStorage.getItem('currentPage') || 'loginPage';
    window.location.hash = `#${lastPage}`;
});

addEventListener("hashchange", () => {
    console.log("info", window.location.hash, oldLocation, lobbyStart, isLoggingOut);
    if (gameState.loading)
        return;
    if (lobbyStart && !gameState.inGame) {
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
    } else if (window.location.hash === '#galaxy' && (oldLocation === '#rgpdPage' || oldLocation === "#signUpPage"))
        moveCameraToBackOfCockpit();
    else if (window.location.hash === '#galaxy' && oldLocation === '#game' && !backToLobbyPressed){
        showAlert(getTranslatedText("SPABackToLobby"));
        backToLobby(/*historyArrow: */true);
    }
    oldLocation = window.location.hash;
});

function showAlert(message) {
    let duration = 6000;
    // Create alert element
    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.textContent = message;

    // Add to body
    document.body.appendChild(alert);

    // Trigger reflow to enable transition
    alert.offsetHeight;

    // Show alert
    alert.classList.add('show');

    // Hide and remove after duration
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(alert);
        }, 300); // Wait for fade out transition
    }, duration);
}