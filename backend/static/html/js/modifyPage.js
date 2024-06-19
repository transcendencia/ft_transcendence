import { togglePanelDisplay, togglePlanet } from './enterPlanet.js';
import { returnToHost } from './userPage.js';
import { resetOutline } from './planetIntersection.js';
import { toggleBlurDisplay, toggleLobbyStart } from './main.js';
import { spaceShip, spaceShipInt } from './objs.js';
import { showPage } from "./showPages.js";
import { getCookie } from './loginPage.js';
import { getProfileInfo } from './userManagement.js';
import { toggleThirdPlayerMode } from '../../tournament/js/newTournament.js';

let anonymousStatus;

var submitChangeButton = document.querySelector(".submitChangeButton");
submitChangeButton.addEventListener("click", handleChangeInfoForm);

function handleChangeInfoForm(event) {
  event.preventDefault();

  var form = document.getElementById("userInfoForm");
  var formData = new FormData(form);
  formData.append('anonymousStatus', anonymousStatus)

  const token = localStorage.getItem('host_auth_token');
  fetch('change_profile_info/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
      'X-CRSFToken': getCookie('crsftoken')
    },
    body: formData,
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    var changeInfoMessage = document.querySelector('.changeInfoMessage');
    if (data.status === "succes")
      getProfileInfo();
    else 
      changeInfoMessage.classList.toggle("errorMessage");
    document.getElementById('changeInfoMessage').innerText = data.message;
    // document.getElementById('changeInfoMessage').innerText = getTranslatedText(data.msg_code);
  })
  .catch(error => {
    console.error('There was a problem with the change_profile_info:', error);
  });
}

const deleteAccountButton = document.querySelector(".deleteAccountButton");
deleteAccountButton.addEventListener("click", deleteAccount);
const blockingPanel = document.getElementById('blockingPanel');

function deleteAccount() {
    // rediriger vers la page d'acceuil
    // deconnecter tout les guest
    // delete account dans la db
    document.querySelector(".validateDelete").classList.toggle("showRectangle");
    blockingPanel.style.visibility = 'visible';

    document.getElementById('deleteAccountCancel').addEventListener("click", function() {
		  document.querySelector(".validateDelete").classList.toggle("showRectangle");
		  blockingPanel.style.visibility = 'hidden';
    })

    document.getElementById('deleteAccountConfirmation').addEventListener("click", function() {
		  const token = localStorage.getItem('host_auth_token');
		  fetch('delete_account/', {
		    method: 'POST',
		    headers: {
			  'Authorization': `Token ${token}`,
			  'X-CRSFToken': getCookie('crsftoken')
		    },
		  })
		  .then(response => {
		    blockingPanel.style.visibility = 'hidden';
		    return response.json();
		  })
		  .catch(error => {
		    console.error('There was a problem with the delete_account:', error);
		});
    // resetting ui to loginPage
    document.querySelector(".validateDelete").classList.toggle("showRectangle");
    togglePlanet();
    returnToHost();
    spaceShip.position.set(0, 0, -1293.5);
    spaceShip.rotation.set(0, 0, 0);

    setTimeout(() => {
        resetOutline();
        spaceShipInt.visible = true;
        showPage('loginPage');
        toggleLobbyStart();
    }, 25);
    })

}

document.addEventListener('DOMContentLoaded', (event) => {
  const toggleSwitch = document.getElementById('toggleSwitch');

  toggleSwitch.addEventListener('click', function() {
      this.classList.toggle('active');
      if (this.classList.contains('active'))
        anonymousStatus = true;
      else anonymousStatus = false;
  });
});

document.addEventListener('DOMContentLoaded', (event) => {
  const thirdPlayerToggleSwitch = document.getElementById('thirdPlayertoggleSwitch');
  thirdPlayerToggleSwitch.addEventListener('click', function() {
      this.classList.toggle('active');
      toggleThirdPlayerMode();
  });
});