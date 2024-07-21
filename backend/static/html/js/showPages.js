import { lobbyStart, setLobbyStart } from "./main.js";
import { moveCameraToBackOfCockpit, moveCameraToFrontOfCockpit } from "./signUpPage.js";
import { backToLobby, handleLogout, isLoggingOut } from "./loginPage.js";
import { gameState } from "../../game/js/main.js";

export function showPage(pageId, transition = 'default', changeHash = true) {
    var pages = document.querySelectorAll('.page');
    pages.forEach(function(page) {
        page.classList.remove('show'); 
        page.classList.remove('default');
        page.classList.remove('signUp');
    });
    // console.trace("showPage :", pageId);
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
    else if (window.location.hash === '#galaxy' && oldLocation === '#game'){
        console.log("ouiii");
        backToLobby(/*historyArrow: */true);
    }
    oldLocation = window.location.hash;
});