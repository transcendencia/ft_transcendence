import { moveCameraToBackOfCockpit } from "./signUpPage.js";

export function showPage(pageId) {
    var pages = document.querySelectorAll('.page');
    pages.forEach(function(page) {
        page.classList.remove('show');
        page.classList.add('invisible'); // Remove the 'show' class from all pages
    });

    // Show the selected page
    if (pageId == 'none')
        return;
    history.pushState(pageId, null, null);
    pageId = '.' + pageId;
    var selectedPage = document.querySelector(pageId);
    selectedPage.classList.remove('invisible');
    selectedPage.classList.add('show'); // Add the 'show' class to the selected page
    console.log("state", history);
}

// Event listener for popstate to handle back/forward button
window.addEventListener('popstate', function(event) {
    if (!event.state)
        return;
    showPage(event.state);
    if (event.state == 'loginPage')
        moveCameraToBackOfCockpit();
});

// Initial load handling
window.addEventListener('DOMContentLoaded', function() {
    showPage('loginPage');
    history.replaceState('loginPage', null, null);
});
