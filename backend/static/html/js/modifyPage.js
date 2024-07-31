import { togglePlanet, checkEach5Sec } from './enterPlanet.js';
import { returnToHost } from './userPage.js';
import { toggleLobbyStart, createUserBadge } from './main.js';
import { spaceShip, spaceShipInt } from './objs.js';
import { showPage } from "./showPages.js";
import { getCookie, logoutUser } from './loginPage.js';
import { getProfileInfo, updateUserStatus, populateProfileInfos } from './userManagement.js';
import { getTranslatedText } from "./translatePages.js";
import { guestLoggedIn } from './arenaPage.js';
import { resetTournament, toggleThirdPlayerMode, changeTournamentStatus } from '../../tournament/js/newTournament.js';
import { changeColorMessage } from './signUpPage.js';
import { clearHostValuesFromSessionStorage } from './loginPage.js';

let isInfosShow = false;
let anonymousStatus = false;

var submitChangeButton = document.querySelector(".submitChangeButton");
submitChangeButton.addEventListener("click", handleChangeInfoForm);

function handleChangeInfoForm(event) {
  event.preventDefault();

  var form = document.getElementById("userInfoForm");
  var formData = new FormData(form);
  formData.append('anonymousStatus', anonymousStatus)

  var changeInfoMessage = document.getElementById('changeInfoMessage');
  changeInfoMessage.innerText = '';

  const token = sessionStorage.getItem('host_auth_token');
  fetch('user_info/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: formData,
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => Promise.reject(err));
    }
    return response.json();
  })
  .then(data => {
    getProfileInfo(sessionStorage.getItem("host_id"))
    .then(data => {
        //reset user in Matcjh
        populateProfileInfos(data);
        createUserBadge(data, "playersConnHostBadge");
      })
    changeColorMessage('.changeInfoMessage', 'success')
    changeInfoMessage.innerText = getTranslatedText(data.msg_code);
    resetModifyPageField(true);
  })
  .catch(error => {
    changeColorMessage('.changeInfoMessage', 'failure');
    changeInfoMessage.innerText = getTranslatedText(error.msg_code);
  });
}

const deleteAccountButton = document.querySelector(".deleteAccountButton");
const deleteBlockingPanel = document.getElementById('deleteBlockingPanel');

document.getElementById('profile-pic').addEventListener('change', function() {
  let fileName = this.files[0] ? this.files[0].name : 'Aucun fichier sélectionné';
  document.getElementById('LinkPicture').textContent = fileName;
});

// Add the event listeners for cancel and confirmation buttons once
document.getElementById('deleteAccountCancel').addEventListener("click", function() {
  document.getElementById("validateDelete").classList.remove("showRectangle");
  deleteBlockingPanel.classList.remove('show');
});

function returnToLoginPageInSpaceship() {
  console.log("returnToLoginPageInSpaceship");
  spaceShip.position.set(0, 0, -1293.5);
  spaceShip.rotation.set(0, 0, 0);

  setTimeout(() => {
      toggleLobbyStart(true);
      spaceShipInt.visible = true;
      showPage('loginPage');
  }, 25);
}

document.getElementById('deleteAccountConfirmation').addEventListener("click", function() {
  const token = sessionStorage.getItem('host_auth_token');
  document.getElementById("validateDelete").classList.remove("showRectangle");

  fetch('delete_account/', {
      method: 'POST',
      headers: {
          'Authorization': `Token ${token}`,
          'X-CRSFToken': getCookie('crsftoken')
      },
  })
  .then(response => {
      deleteBlockingPanel.classList.remove('show');
      if (guestLoggedIn.length > 0) {
        guestLoggedIn.forEach(user => {
            logoutUser(user[1]);
        });
      }
      guestLoggedIn.splice(0, guestLoggedIn.length);
      clearInterval(checkEach5Sec);
      clearHostValuesFromSessionStorage();
      sessionStorage.removeItem('hostLoggedIn');
      sessionStorage.removeItem('host_auth_token');
      sessionStorage.removeItem('host_id');
      return response.json();
  })
  .catch(error => {
      error;
  });

  document.getElementById("validateDelete").classList.remove("showRectangle");
  changeTournamentStatus(2);
  resetTournament();
  togglePlanet(/* toggleRsContainer: */ false);
  returnToHost(/* updateStats: */ false);
  returnToLoginPageInSpaceship();
});

deleteAccountButton.addEventListener("click", deleteAccount);

function deleteAccount() {
  document.getElementById("validateDelete").classList.toggle("showRectangle");
  deleteBlockingPanel.classList.add('show');
}

const toggleSwitch = document.getElementById('toggleSwitch');
let oldUsername;
let toggleSwitchClicked = false;

toggleSwitch.addEventListener('click', function() {
    this.classList.toggle('active');
    if (this.classList.contains('active')) {
      anonymousStatus = true;
      console.log("toggleSwitchClicked: ", toggleSwitchClicked);
      if (!toggleSwitchClicked) {
        toggleSwitchClicked = true;
        oldUsername = document.getElementById('changeUsernameInput').value;
      }
      getRandomUsername();
    }
    else {
      anonymousStatus = false;
      document.getElementById('changeUsernameInput').value = oldUsername;
    }
});

const thirdPlayerToggleSwitch = document.getElementById('thirdPlayertoggleSwitch');
thirdPlayerToggleSwitch.addEventListener('click', function() {
    this.classList.toggle('active');
    toggleThirdPlayerMode();
});


export function getRandomUsername() {
  const token = sessionStorage.getItem('host_auth_token');
  fetch('generate_unique_username/', {
      method: 'GET',
      headers: {
          'Authorization': `Token ${token}`
      }
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => Promise.reject(err));
    }
    return response.json();})
  .then(data => {
    document.getElementById('changeUsernameInput').value = data.username;
  })
  .catch(error => {
      var changeInfoMessage = document.getElementById('changeInfoMessage');
      changeInfoMessage.innerText = getTranslatedText(error.msg_code);
  });
};

const RGPDPage = document.getElementById('RGPDPage');
const RGPDPolicy = document.getElementById('RGPDPolicyInUserPage');
RGPDPolicy.addEventListener('click', function() {
  deleteBlockingPanel.classList.add('show');
  showPage('rgpdPage', 'default', /*changeHash:*/ false);
  RGPDPage.classList.add("noPerspective");
  RGPDPage.classList.remove("holoPerspective");
});

const RGPDBack = document.getElementById('RGPDBack');
RGPDBack.addEventListener('click', function() {
  deleteBlockingPanel.classList.remove('show');
});

const infoButton = document.getElementById("infoButton");
infoButton.addEventListener("mouseenter", displayAnonymousMode);
infoButton.addEventListener("mouseleave", hideAnonymousMode);

function displayAnonymousMode() {
  isInfosShow = !isInfosShow;
  document.getElementById("displayAnonymousMode").classList.add("showRectangle");
}

function hideAnonymousMode() {
  isInfosShow = false;
  document.getElementById("displayAnonymousMode").classList.remove("showRectangle");
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape')
    return;
    if (isInfosShow == true) {
      isInfosShow = false;
      document.getElementById("displayAnonymousMode").classList.toggle("showRectangle");
    }
});

const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", downloadFile);
function downloadFile() {
  console.log("Initiating file download");
  const token = sessionStorage.getItem('host_auth_token');
  fetch('generateDataFile/', {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.blob().then(blob => ({ blob, response }));
  })
  .then(({ blob, response }) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    const contentDisposition = response.headers.get('Content-Disposition');
    console.log("file name = " + contentDisposition);
    const filename = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || 'user_data.txt';
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    console.log("File download initiated");
  })
  .catch(error => {
    error;
    alert('Une erreur est survenue lors du téléchargement du fichier. Veuillez réessayer.');
  });
}

export function resetModifyPageField(success = false) {
  getProfileInfo(sessionStorage.getItem('host_id'))
  .then(data => {
      populateProfileInfos(data);
  })
  .catch(error => {
      error;
  });
  document.getElementById('changePasswordInput').value = '';
  document.getElementById('changeConfirmPasswordInput').value = '';
  document.getElementById('profile-pic').value = '';
  if (success === false) {
    document.getElementById('changeInfoMessage').innerText = '';
  }
  document.getElementById('LinkPicture').innerText = '';
  toggleSwitchClicked = false;
  anonymousStatus = false;
  const toggleSwitch = document.getElementById('toggleSwitch');
  toggleSwitch.classList.remove('active');
}