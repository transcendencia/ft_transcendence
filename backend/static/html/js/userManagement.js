import { getCookie } from './loginPage.js';
import { getTranslatedText} from "./translatePages.js";
import { setHostAsPlayerOne} from "./arenaPage.js";

export async function updateUserStatus(status, token) {
    try {
        const response = await fetch('/user/status/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ status: status }),
            keepalive: true,
        });

        if (!response.ok) {
            throw new Error('Erreur lors du logout');
        } else {
            const data = await response.json();
            console.log(`User ${data.user_id} status updated to ${data.status}`);
        }
    } catch (error) {
        console.error('Erreur :', error);
    }
}

export function getUserStatus(userId) {
    const token = sessionStorage.getItem('host_auth_token');
    return fetch(`/user/status/${userId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => {
        if (!response.ok) {
            // console.log(response.user_status);
            throw new Error('Erreur HTTP ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        return data.user_status;
    })
    .catch(error => {
        console.error('Erreur lors de la récupération du status :', error.message);
    });
}

export function get_user_list() {
    const token = sessionStorage.getItem('host_auth_token');
    // console.log(token);
    fetch('get_user_list/', {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            // 'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
    })
    .catch(error => {
        console.error('Error:', error);
        throw error;
    });
};

export function populateProfileInfos(data) {
    document.getElementById('username').textContent = data.profile_info.username;
    document.getElementById('alias').textContent = data.profile_info.alias;
    document.getElementById('profile_pic').src = data.profile_info.profile_picture;
    document.getElementById('changeUsernameInput').value = data.profile_info.username;
    document.getElementById('changeAliasInput').value = data.profile_info.alias;

    const basicStats = document.getElementById('winLoseTexts1');
    basicStats.innerHTML = `
        <div class="basicStats"> ${getTranslatedText('winLoseText1')} : ${data.profile_info.nbr_match}</div>
        <div class="basicStats"> ${getTranslatedText('winLoseText2')} : ${data.profile_info.nbr_match_win}</div>
        <div class="basicStats"> ${getTranslatedText('winLoseText3')} : ${data.profile_info.nbr_match_lost}</div>
        <div class="basicStats"> ${getTranslatedText('winLoseText4')} : ${data.profile_info.nbr_goals}</div>
    `;
    setHostAsPlayerOne(data.profile_info, 'Tournament');
    setHostAsPlayerOne(data.profile_info, 'Arena');
}

export function getProfileInfo(userId) {
    // console.log("userId:", userId);
    const token = sessionStorage.getItem('host_auth_token');
    return fetch(`user_info/${userId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error lors de la recuperation des donnees');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
}

// FRIEND REQUEST
export function send_request(id) {

    const token = sessionStorage.getItem('host_auth_token');
    fetch('friend_request/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ receiver_id: id })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la friendrequest');
        }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
}

export async function accept_friend_request(id) {
    const token = sessionStorage.getItem('host_auth_token');
    console.log("id", id);
    await fetch('friend_request/', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({request_id:  id})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la modification de la langue');
         }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
  }

export async function delete_friend_request(id) {
    const token = sessionStorage.getItem('host_auth_token');
    await fetch('friend_request/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({request_id:  id})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la modification de la langue');
         }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
}

export async function get_friends_list() {
    const token = sessionStorage.getItem('host_auth_token');
    
    try {
        const response = await fetch('friends_list/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// UPDATE
// Passer en requete PATCH
export function updateUserGraphicMode(graphicMode) {
	const token = sessionStorage.getItem('host_auth_token');
    return fetch('user/graphic_mode/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ graphicMode: graphicMode })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du changement graphique');
        }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
}

// Passer en requete PATCH
export function updateUserLanguage(new_language) {
    const token = sessionStorage.getItem('host_auth_token');
    fetch('user/language/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ language: new_language })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la modification de la langue');
        }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
}
export function test_back() {
    console.log("test back");
    // SIGN UP
    // document.getElementById('usernameLoginInput').value = 67890;
    // document.getElementById('passwordLoginInput').value = 'q';
    // document.getElementById('confirmPasswordSignUpInput').value = 'q';
    // document.getElementById("submitSignUp").click();

    // LOGIN
    // document.getElementById('usernameLoginInput').value = 67890;
    // document.getElementById('passwordLoginInput').value = 'q';
    // document.getElementById("loginButton").click();

    // GET PROFILE INFO
    // getProfileInfo(3);
}