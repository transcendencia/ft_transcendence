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
        else 
            console.error('Current language ' + currentLanguage + 'not found in language file');
    }
}

const userlistText = document.getElementById('userlistText');
const arenaTitleText = document.getElementById('arenaTitleText');
const powerupsText = document.getElementById('gamemodeText');
const mapsText = document.getElementById('mapsText');
const botDifficultyText = document.getElementById('botDifficultyText');
const enabledText = document.getElementById('gamemodeNameText');
const botDifficultyLevelText = document.getElementById('botDifficultyLevelText');
const startText = document.getElementById('startText');
const player1Text = document.getElementById('player1Text');
const player2Text = document.getElementById('player2Text');
const player3Text = document.getElementById('player3Text');
const arenaBackButton = document.getElementById('arenaBackButton');


function translateArenaPageTexts() {
    userlistText.textContent = getTranslatedText('userlist');
    arenaTitleText.textContent = getTranslatedText('arenaTitle');
    player1Text.textContent = getTranslatedText('player') + ' 1';
    player2Text.textContent = getTranslatedText('player') + ' 2';
    player3Text.textContent = getTranslatedText('player') + ' 3';
    powerupsText.textContent = getTranslatedText('gamemode');
    mapsText.textContent = getTranslatedText('maps');
    botDifficultyText.textContent = getTranslatedText('botDifficulty');
    botDifficultyLevelText.textContent = getTranslatedText('botDifficultyMedium');
    enabledText.textContent = getTranslatedText('gamemodeNameText1');
    startText.textContent = getTranslatedText('start');
    arenaBackButton.textContent = getTranslatedText('backButton');
}

const trnmtPlayerTexts = document.getElementsByClassName('playerText');
const trnmtUserlistText = document.getElementById('trnmtUserlistText');
const trnmtTitleText = document.getElementById('trnmtTitleText');
const trnmtPowerupsText = document.getElementById('trnmtGamemodeText');
const trnmtMapsText = document.getElementById('trnmtMapsText');
const trnmtBotDifficultyText = document.getElementById('trnmtBotDifficultyText');
const trnmtEnabledText = document.getElementById('gamemodeNameText2');
const trnmtbotDifficultyLevelText = document.getElementById('trnmtBotDifficultyLevelText');
const trnmtStartText = document.getElementById('launch');
const trnmtThirdPlayerText = document.getElementById('thirdPlayerText');
const trnmtBackButton = document.getElementById('trnmtBackButton');
const trnmtNextMatch = document.getElementById('next-match');
const trnmtLaunchMatch = document.getElementById('launchMatch');


function translateTournamentPageTexts() {
    for (let i = 0; i < trnmtPlayerTexts.length; i++)
        trnmtPlayerTexts[i].textContent = getTranslatedText('player') + ' ' + (i + 1);

    trnmtUserlistText.textContent = getTranslatedText('userlist');
    trnmtTitleText.textContent = getTranslatedText('tournamentTitle');
    trnmtPowerupsText.textContent = getTranslatedText('gamemode');
    trnmtMapsText.textContent = getTranslatedText('maps');
    trnmtBotDifficultyText.textContent = getTranslatedText('botDifficulty');
    trnmtbotDifficultyLevelText.textContent = getTranslatedText('botDifficultyMedium');
    trnmtEnabledText.textContent = getTranslatedText('gamemodeNameText1');
    trnmtStartText.textContent = getTranslatedText('start');
    trnmtThirdPlayerText.textContent = getTranslatedText('thirdPlayer');
    trnmtBackButton.textContent = getTranslatedText('backButton');
    trnmtNextMatch.textContent = getTranslatedText('nextMatch');
    trnmtLaunchMatch.textContent = getTranslatedText('launchMatch');
}

const loginText = document.getElementById('loginText');
const passwordText = document.getElementById('passwordText');
const enterLogin = document.getElementById('enterLogin');
const enterPassword = document.getElementById('enterPassword');
const loginLanguageText = document.getElementById('loginLanguageText');
const newToTheGame = document.querySelector('.newToTheGame');
const confirmPassword = document.getElementById('confirmPassword');
const signUpTitle = document.getElementById('signUpTitle');
const createAccountText = document.getElementById('createAccountText');
const SignUpButton = document.querySelectorAll('.actionCont')[1];
const backToLoginButton = document.querySelector('.backButton');
const signupHereButton = document.querySelector('.actionCont');

function translateLoginPageTexts() {
    loginText.childNodes[0].textContent = '- ' + getTranslatedText('login') + ' -';
    passwordText.childNodes[0].textContent = '- ' + getTranslatedText('password') + ' -';
    loginLanguageText.childNodes[4].textContent = '- ' + getTranslatedText('loginLanguage') + ' -';
    newToTheGame.childNodes[0].textContent = getTranslatedText('newToTheGame');
    signupHereButton.textContent = getTranslatedText('signUpHere');
    signUpTitle.textContent = getTranslatedText('signUpTitle');
    createAccountText.textContent = getTranslatedText('createAnAccount');
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

const RGPDTitle = document.getElementById('RGPDTitle');
const RGPDTexte = document.getElementById('RGPDTexte');
const RGPDCreate = document.getElementById('RGPDCreate');
const RGPDPolicy = document.getElementById('RGPDPolicy');
const RGPDBack = document.getElementById('RGPDBack');

function translateRGPDTexts() {
    RGPDTitle.textContent = getTranslatedText('RGPDTitle');
    RGPDTexte.textContent = getTranslatedText('RGPDTexte');
    RGPDCreate.textContent = getTranslatedText('RGPDCreate');
    RGPDPolicy.textContent = getTranslatedText('RGPDPolicy');
    RGPDBack.textContent = getTranslatedText('RGPDBack');
}
const friendlistText = document.getElementById('friendListText');
const historyText = document.getElementById('historyText');
const historyText2 = document.getElementById('historyText2');
const searchBarText = document.getElementById('searchInput');
const profileTitleText = document.getElementById('profileTitleText');
const statisticsText = document.getElementById('statisticsText');
const statisticsText2 = document.getElementById('statisticsText2');
const backButton = document.getElementById('userBackButton');


function translateUserPageTexts() {
    friendlistText.textContent = getTranslatedText('friendlist');
    historyText.textContent = getTranslatedText('history');
    historyText2.textContent = getTranslatedText('history');
    searchBarText.placeholder = getTranslatedText('searchInput');
    profileTitleText.textContent = getTranslatedText('profileTitle');
    statisticsText.textContent = getTranslatedText('statisticsText');
    statisticsText2.textContent = getTranslatedText('statisticsText');
    backButton.textContent = getTranslatedText('backButton');   
}

const changeInfo = document.getElementById('changeInfo');
const changeUsernameInput = document.getElementById('changeUsernameInput');
const changeAliasInput = document.getElementById('changeAliasInput');
const changePasswordInput = document.getElementById('changePasswordInput');
const changeConfirmPasswordInput = document.getElementById('changeConfirmPasswordInput');
const changeProfilePicture = document.getElementById('changeProfilePicture');
const AnonymousMode = document.getElementById('AnonymousMode');
const chooseProfilePic = document.getElementById('chooseProfilePic');
const deleteAccountButton = document.getElementById('deleteAccountButton');
const submitInfoButton = document.getElementById('submitInfoButton');
const validateDeleteAccountText = document.getElementById('validateDeleteAccountText');
const deleteAccountConfirmation = document.getElementById('deleteAccountConfirmation');
const deleteAccountCancel = document.getElementById('deleteAccountCancel');
const RGPDPolicyInUserPage = document.getElementById('RGPDPolicyInUserPage');
const infoBack = document.getElementById('infoBack');
const textAnonymous = document.getElementById('textAnonymous');


function translateModifyPageTexts(){
    changeInfo.textContent = getTranslatedText('changeInfo');
    changeUsernameInput.placeholder = getTranslatedText('changeUsernameInput');
    changeAliasInput.placeholder =  getTranslatedText('changeAliasInput');  
    changePasswordInput.placeholder = getTranslatedText('changePasswordInput');
    changeConfirmPasswordInput.placeholder = getTranslatedText('changeConfirmPasswordInput');
    changeProfilePicture.textContent = getTranslatedText('changeProfilePicture');
    AnonymousMode.textContent = getTranslatedText('AnonymousMode');
    chooseProfilePic.textContent = getTranslatedText('chooseProfilePic');
    deleteAccountButton.textContent = getTranslatedText('deleteAccountButton');
    submitInfoButton.textContent = getTranslatedText('submitInfoButton');
    validateDeleteAccountText.textContent = getTranslatedText('validateDeleteAccountText');
    deleteAccountConfirmation.textContent = getTranslatedText('deleteAccountConfirmation');
    deleteAccountCancel.textContent = getTranslatedText('deleteAccountCancel');
    RGPDPolicyInUserPage.textContent = getTranslatedText('RGPDPolicyInUserPage');
    infoBack.textContent = getTranslatedText('infoBack');
    textAnonymous.textContent = getTranslatedText('textAnonymous');
     
}

export function TranslateAllTexts() {
    translateArenaPageTexts();
    translateTournamentPageTexts();
    translateLoginPageTexts();
    translateEscapePageTexts();
    translateRGPDTexts();
    translateUserPageTexts();
    translateModifyPageTexts()
}
