// Function to fetch language data from JSON file
function fetchLanguageData(language, callback, textElem) {
    // Fetch JSON data from the server
    fetch('languages.json')
        .then(response => response.json())
        .then(data => {
            callback(data[language], textElem);
        })
        .catch(error => {
            console.error('Error fetching language data:', error);
        });
}

// Function to update text content based on language data
function updateLanguage(languageData, textElem) {
	return(languageData[textElem]);
}

export function getTranslatedText(language, textElem) {
    fetchLanguageData(language, updateLanguage, textElem);
}

