function addGlow(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.classList.add('glow');
    }
}

// Function to remove glowing effect from an element
function removeGlow(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('glow');
    }
}
// Get all elements with the class "languageIcon"
var languageIcons = document.querySelectorAll('.languageIcon');
const loginText = document.getElementById('loginText');
const passwordText = document.getElementById('passwordText');
const loginLanguageText = document.getElementById('loginLanguageText');

// Loop through each language icon element and add a click event listener
languageIcons.forEach(function(icon) {
    icon.addEventListener('click', function () {
		addGlow(icon.id);
		// loginText.textContent = getTranslatedText(icon.id, 'loginText');
		// passwordText.textContent = getTranslatedText(icon.id), 'passwordText';			
		// loginLanguageText.textContent = getTranslatedText(icon.id, 'loginLanguageText');			
        languageIcons.forEach(function(otherIcon) {
            if (otherIcon !== icon) {
                removeGlow(otherIcon.id);
            }
        });
    });
});