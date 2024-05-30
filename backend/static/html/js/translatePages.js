export let currentLanguage = 'en';
let languageFile;
export let languageIconsClicked = false;

export function setlanguageIconsClicked(value) {
    languageIconsClicked = value;
}

export function setCurrentLanguage(value) {
    currentLanguage = value;
}

fetch('../../static/html/languages.json')
.then(response => response.json())
.then(data => {
    languageFile = data;
})
.catch(error => {
    console.error('Error fetching language data:', error);
});

export function getTranslatedText(key) {
    if (languageFile) {
        if (languageFile[currentLanguage])
        return languageFile[currentLanguage][key];
    else console.error('Current language ' + currentLanguage + 'not found in language file');
    }
}

const userlistText = document.getElementById('userlistText');
const arenaTitleText = document.getElementById('arenaTitleText');
const powerupsText = document.getElementById('gamemodeText');
const mapsText = document.getElementById('mapsText');
const enabledText = document.getElementById('gamemodeNameText');
const startText = document.getElementById('startText');

const player1Text = document.getElementById('player1Text');
const player2Text = document.getElementById('player2Text');
const player3Text = document.getElementById('player3Text');
const player4Text = document.getElementById('player4Text');
const player5Text = document.getElementById('player5Text');
const player6Text = document.getElementById('player6Text');
const player7Text = document.getElementById('player7Text');
const player8Text = document.getElementById('player8Text');

function translateArenaPageTexts() {
    userlistText.textContent = getTranslatedText('userlist');
    arenaTitleText.textContent = getTranslatedText('arenaTitle');
    player1Text.textContent = getTranslatedText('player1');
    player2Text.textContent = getTranslatedText('player2');
    player3Text.textContent = getTranslatedText('player3');
    player4Text.textContent = getTranslatedText('player4');
    player5Text.textContent = getTranslatedText('player5');
    player6Text.textContent = getTranslatedText('player6');
    player7Text.textContent = getTranslatedText('player7');
    player8Text.textContent = getTranslatedText('player8');

    powerupsText.textContent = getTranslatedText('gamemode');
    mapsText.textContent = getTranslatedText('maps');
    enabledText.textContent = getTranslatedText('gamemodeNameText1');
    startText.textContent = getTranslatedText('start');
}

const loginText = document.getElementById('loginText');
const passwordText = document.getElementById('passwordText');
const enterLogin = document.getElementById('enterLogin');
const enterPassword = document.getElementById('enterPassword');
const loginLanguageText = document.getElementById('loginLanguageText');
const newToTheGame = document.querySelector('.newToTheGame');
const confirmPassword = document.getElementById('confirmPassword');
const SignUpTitle = document.querySelector('.perspective');
const SignUpButton = document.querySelectorAll('.actionCont')[1];
const backToLoginButton = document.querySelector('.backButton');
const signupHereButton = document.querySelector('.actionCont');

function translateLoginPageTexts() {
    loginText.childNodes[0].textContent = '- ' + getTranslatedText('login') + ' -';
    passwordText.childNodes[0].textContent = '- ' + getTranslatedText('password') + ' -';
    loginLanguageText.childNodes[4].textContent = '- ' + getTranslatedText('loginLanguage') + ' -';
    newToTheGame.childNodes[0].textContent = getTranslatedText('newToTheGame');
    signupHereButton.textContent = getTranslatedText('signUpHere');
    SignUpTitle.childNodes[0].textContent = getTranslatedText('signUpTitle');
    SignUpTitle.childNodes[1].textContent = getTranslatedText('createAnAccount');
    enterLogin.childNodes[0].textContent = getTranslatedText('login');
    enterPassword.childNodes[0].textContent = getTranslatedText('password');
    confirmPassword.childNodes[0].textContent = getTranslatedText('confirmPassword');
    backToLoginButton.childNodes[0].textContent = getTranslatedText('backToLogin');
    SignUpButton.childNodes[0].textContent = getTranslatedText('signUpTitle');
}

const pauseTitle = document.querySelector('.pauseTitle');
const EscapeLanguageText = document.getElementById('EscapeLanguageText');
const graphics1 = document.getElementById('graphicsIcon1');
const graphics2 = document.getElementById('graphicsIcon2');
const graphics3 = document.getElementById('graphicsIcon3');
const graphicsTitle = document.getElementById('graphicsText');
const currentlyLoggedAs = document.querySelector('.loggedAs');
const disconnectButton = document.getElementById('disconnectButton');

function translateEscapePageTexts() {
    pauseTitle.childNodes[2].textContent = getTranslatedText('pause');
    EscapeLanguageText.childNodes[4].textContent = getTranslatedText('escapeLanguage');
    graphics1.textContent = getTranslatedText('graphicsText1');
    graphics2.textContent = getTranslatedText('graphicsText2');
    graphics3.textContent = getTranslatedText('graphicsText3');
    currentlyLoggedAs.childNodes[0].textContent = getTranslatedText('loggedAs');
    graphicsTitle.childNodes[4].textContent = getTranslatedText('graphicsTitle');
    disconnectButton.textContent = getTranslatedText('disconnect');
}

export function TranslateAllTexts() {
    translateArenaPageTexts();
    translateLoginPageTexts();
    translateEscapePageTexts();
}