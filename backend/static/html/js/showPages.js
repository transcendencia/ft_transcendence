import { escapeContainerVisible, lobbyStart } from "./main.js";
import { moveCameraToBackOfCockpit, moveCameraToFrontOfCockpit } from "./signUpPage.js";
import { handleLogout, isLoggingOut } from "./loginPage.js";

export function showPage(pageId, transition = 'default') {
    // console.log("pageid :", pageId);
    var pages = document.querySelectorAll('.page');
    pages.forEach(function(page) {
        page.classList.remove('show'); 
        page.classList.remove('default');
        page.classList.remove('signUp');
    });
    // Show the selected page
    if (pageId === 'none') 
        return;
    window.location.hash = `#${pageId}`;
    sessionStorage.setItem('currentPage', pageId); // Store current page in sessionStorage
    pageId = '.' + pageId;
    var selectedPage = document.querySelector(pageId);
    selectedPage.classList.add('show'); // Add the 'show' class to the selected page
    selectedPage.classList.add(transition);
    console.log("oldloc", window.location.hash, oldLocation);
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
    if (lobbyStart && !isLoggingOut) {
        handleLogout(sessionStorage.getItem('host_id'), sessionStorage.getItem('host_auth_token'), false);
        return;
    }
    console.trace(window.location.hash, oldLocation);
    if (window.location.hash === '#loginPage' && oldLocation === '#signUpPage') {
        moveCameraToBackOfCockpit();
    } else if (window.location.hash === '#signUpPage' && oldLocation === '#loginPage') {
        moveCameraToFrontOfCockpit('signUpPage');
    } else if (window.location.hash === '#rgpdPage' && oldLocation === '#signUpPage') {
        moveCameraToFrontOfCockpit('rgpdPage');
    } else if (window.location.hash === '#signUpPage' && oldLocation === '#rgpdPage') {
        showPage('signUpPage');
    }
    oldLocation = window.location.hash;
});