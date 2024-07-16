import { moveCameraToBackOfCockpit, moveCameraToFrontOfCockpit } from "./signUpPage.js";

export function showPage(pageId, transition = 'default') {
    var pages = document.querySelectorAll('.page');
    pages.forEach(function(page) {
        page.classList.remove('show'); // Remove the 'show' class from all pages
        // Remove transitions
        page.classList.remove('default');
        page.classList.remove('signUp');
    });
    // Show the selected page
    if (pageId === 'none') return;
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
    window.location.hash = `#${lastPage}`;
    if (lastPage === 'signUpPage' || lastPage === 'rgpdPage')
        moveCameraToFrontOfCockpit(lastPage, 'signUp');
    else moveCameraToBackOfCockpit();
}

addEventListener("hashchange", () => {
    if (window.location.hash === '#loginPage' && oldLocation === '#signUpPage') {
        moveCameraToBackOfCockpit();
    } else if (window.location.hash === '#signUpPage' && oldLocation === '#loginPage') {
        moveCameraToFrontOfCockpit('signUpPage');
    } else if (window.location.hash === '#rgpdPage' && oldLocation === '#signUpPage') {
        moveCameraToFrontOfCockpit('rgpdPage');
        const RGPDPage = document.querySelector(".rgpdPage");
        RGPDPage.classList.add("perspectived");
    } else if (window.location.hash === '#signUpPage' && oldLocation === '#rgpdPage') {
        showPage('signUpPage');
    }
    oldLocation = window.location.hash;
});
