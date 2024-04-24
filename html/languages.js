// Function to fetch language data from JSON file
function fetchLanguageData(language, textElem) {
    // Fetch JSON data from the server
    return fetch('languages.json')
        .then(response => response.json())
		.then(data => {
            return updateLanguage(data[language], textElem);
        })
        .catch(error => {
            console.error('Error fetching language data:', error);
        });
}

// Function to update text content based on language data
function updateLanguage(languageData, textElem) {
	return (languageData[textElem]);
}

export async function getTranslatedText(language, textElem) {
    // Return the result of updateLanguage directly
    return fetchLanguageData(language, textElem)
		.then(translatedText => {
            return translatedText;
        });
}