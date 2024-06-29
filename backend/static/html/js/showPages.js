import { moveCameraToBackOfCockpit, moveCameraToFrontOfCockpit} from "./signUpPage.js";

export function showPage(pageId) {
    var pages = document.querySelectorAll('.page');
    pages.forEach(function(page) {
        page.classList.remove('show'); // Remove the 'show' class from all pages
    });

    // Show the selected page
    if (pageId == 'none')
        return;
    window.location.hash = `#${pageId}`;
    pageId = '.' + pageId;
    var selectedPage = document.querySelector(pageId);
    selectedPage.classList.add('show'); // Add the 'show' class to the selected page
}

let oldLocation = window.location.hash || '#loginPage';

if (!window.location.hash) {
    window.location.hash = '#loginPage';
    oldLocation = '#loginPage';
} else {
    showPage(window.location.hash.substring(1)); // Show the current page based on the hash
}

addEventListener("hashchange", (event) => {
    if (window.location.hash == '#loginPage' && oldLocation == '#signUpPage' )
        moveCameraToBackOfCockpit();   
    if (window.location.hash == '#signUpPage' && oldLocation == '#loginPage')
        moveCameraToFrontOfCockpit();
    if (window.location.hash == '#signUpPage' && oldLocation == '#galaxy') {
        showPage('signUpPage');
        moveCameraToFrontOfCockpit();
    }
    oldLocation = window.location.hash;
});

showPage('loginPage');