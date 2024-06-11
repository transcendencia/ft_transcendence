import { getCookie, getProfileInfo } from './loginPage.js';

var submitChangeButton = document.querySelector(".submitChangeButton");
submitChangeButton.addEventListener("click", handleChangeInfoForm);

function handleChangeInfoForm(event) {
  event.preventDefault();

  var form = document.getElementById("userInfoForm");
  var formData = new FormData(form);

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

var deleteAccountButton = document.querySelector(".deleteAccountButton");
deleteAccountButton.addEventListener("click", deleteAccount);

function deleteAccount() {
    // rediriger vers la page d'acceuil
    // deconnecter tout les guest
    // delete account dans la db
    document.querySelector(".validateDelete").classList.toggle("showRectangle");

    document.getElementById("deleteAccountCancel").addEventListener("click", function() {
      document.querySelector(".validateDelete").classList.toggle("showRectangle");
    })

    document.getElementById("deleteAccountConfirmation").addEventListener("click", function() {
		const token = localStorage.getItem('host_auth_token');
		fetch('delete_account/', {
		  method: 'POST',
		  headers: {
			'Authorization': `Token ${token}`,
			'X-CRSFToken': getCookie('crsftoken')
		  },
		})
		.then(response => {
		  return response.json();
		})
		.catch(error => {
		  console.error('There was a problem with the delete_account:', error);
		});
    })
}
