// Function to show a specific page and hide others
function showPage(pageId) {
    // Hide all pages
    var pages = document.querySelectorAll('.page');
    pages.forEach(function(page) {
        page.classList.remove('active');
    });

    // Show the selected page
    pageId = '.' + pageId;
    var selectedPage = document.querySelector(pageId);
    selectedPage.classList.add('active');
}


// Find all anchor elements on the page
var anchors = document.querySelectorAll('a');

// Add event listener to each anchor element
anchors.forEach(function(anchor) {
    anchor.addEventListener('click', function(event) {
        // Prevent default link behavior
        var id = anchor.getAttribute('button');
        showPage(id);
    });
});

showPage('home');