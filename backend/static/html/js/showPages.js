export function showPage(pageId) {
    var pages = document.querySelectorAll('.page');
    pages.forEach(function(page) {
        page.style.opacity = 0;
    });

    // Show the selected page
    pageId = '.' + pageId;
    var selectedPage = document.querySelector(pageId);
    console.log(selectedPage);
    selectedPage.style.opacity = 1;
}

// Find all anchor elements on the page
var anchors = document.querySelectorAll('a');

// Add event listener to each anchor element
anchors.forEach(function(anchor) {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
        // Prevent default link behavior
        var id = anchor.getAttribute('button');
        history.pushState(id, null, null);
        showPage(id);
    });
});

window.addEventListener('popstate', function(event) {
    showPage(event.state);
});

history.replaceState('home', null, null);