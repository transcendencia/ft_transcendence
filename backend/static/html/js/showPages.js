import { moveCameraToBackOfCockpit, moveCameraToFrontOfCockpit} from "./signUpPage.js";

export function showPage(pageId, transition = 'default') {
    var pages = document.querySelectorAll('.page');
    pages.forEach(function(page) {
        page.classList.remove('show'); // Remove the 'show' class from all pages
        //remove transitions
        page.classList.remove('default');
        page.classList.remove('signUp');
    });
    // Show the selected page
    if (pageId == 'none')
        return;
    window.location.hash = `#${pageId}`;
    pageId = '.' + pageId;
    var selectedPage = document.querySelector(pageId);
    selectedPage.classList.add('show'); // Add the 'show' class to the selected page
    selectedPage.classList.add(transition);
}

let oldLocation = window.location.hash || '#loginPage';

if (!window.location.hash) {
    window.location.hash = '#loginPage';
    oldLocation = '#loginPage';
    showPage('loginPage');
} else {
    showPage(window.location.hash.substring(1)); // Show the current page based on the hash
}


addEventListener("hashchange", () => {
    if (window.location.hash == '#loginPage' && oldLocation == '#signUpPage' )
        moveCameraToBackOfCockpit();   
    else if (window.location.hash == '#signUpPage' && oldLocation == '#loginPage')
        moveCameraToFrontOfCockpit();
    else if (window.location.hash == '#rgpdPage' && oldLocation == '#signUpPage'){
        showPage('rgpdPage');
        const RGPDPage = document.querySelector(".rgpdPage");
        RGPDPage.classList.add("perspectived");
    }
    else if (window.location.hash == '#signUpPage' && oldLocation == '#rgpdPage') {
        showPage('signUpPage')
    }
    oldLocation = window.location.hash;
});