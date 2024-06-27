import { moveCameraToBackOfCockpit, moveCameraToFrontOfCockpit} from "./signUpPage.js";

export function showPage(pageId) {
    var pages = document.querySelectorAll('.page');
    pages.forEach(function(page) {
        page.classList.remove('show'); // Remove the 'show' class from all pages
    });

    // Show the selected page
    if (pageId == 'none')
        return;
    pageId = '.' + pageId;
    var selectedPage = document.querySelector(pageId);
    selectedPage.classList.add('show'); // Add the 'show' class to the selected page
}

export let oldLocation = null;

//if is empty
window.location.hash = '#loginPage';

showPage('loginPage');

addEventListener("hashchange", (event) => {
    console.log("hash", window.location.hash, oldLocation);
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
