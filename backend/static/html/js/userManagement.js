import { getCookie } from './loginPage.js';
import { getTranslatedText} from "./translatePages.js";
import { RenderHostMatch, RenderUserTournament, RenderAllUsersInList, RenderAllUsersTournament} from "./arenaPage.js";

export function updateUserGraphicMode(graphicMode) {
	const token = localStorage.getItem('host_auth_token');
    return fetch('change_graphic_mode/', {
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

export function updateUserLanguage(new_language) {
    const token = localStorage.getItem('host_auth_token');
    fetch('change_language/', {
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

export function updateUserStatus(status) {
    const token = localStorage.getItem('host_auth_token');
    return fetch('update_status/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ status: status })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du logout');
        }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
};

// export  function getUserStatus(userId) {
//     return fetch('get_status/${userId}', {
//         method: 'GET',
//         headers: {
//             'Content-Type':
//         }
//     })
// }

export function getUserStatus(userId) {
    const token = localStorage.getItem('host_auth_token');
    fetch(`get_status/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur HTTP ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Utilisateur trouvé :', data.status);
    })
    .catch(error => {
        console.error('Erreur lors de la récupération du status :', error.message);
    });
}

export async function get_friends_list() {
    const token = localStorage.getItem('host_auth_token');
    
    try {
        const response = await fetch('return_friends_list/', {
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
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export function get_user_list() {
    const token = localStorage.getItem('host_auth_token');
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
        RenderAllUsersTournament(data);
    })
    .catch(error => {
        console.error('Error:', error);
        throw error;
    });
};

export function getProfileInfo() {
	const token = localStorage.getItem('host_auth_token');
		fetch('get_profile_info/', {
		    method: 'GET',
			headers: {
				'Authorization': `Token ${token}`,
			}
		})
		.then(response => {
			if (!response.ok)
				throw new Error('Error lors de la recuperation des donne');
				return response.json();
		})
		.then(data=> {
			document.getElementById('username').textContent = data.profile_info.username;
			document.getElementById('bio').textContent = data.profile_info.bio;
			document.getElementById('profile_pic').src = data.profile_info.profile_picture;
            document.getElementById('changeUsernameInput').value = data.profile_info.username;
            document.getElementById('changeBioInput').value = data.profile_info.bio;
            const basicStats = document.getElementById('winLoseTexts1');
            basicStats.innerHTML = `
                <div class="basicStats"> ${getTranslatedText('winLoseText1')} : ${data.profile_info.nbr_match}</div>
                <div class="basicStats"> ${getTranslatedText('winLoseText2')} : ${data.profile_info.nbr_match_win}</div>
                <div class="basicStats"> ${getTranslatedText('winLoseText3')} : ${data.profile_info.nbr_match_lost}</div>
                <div class="basicStats"> ${getTranslatedText('winLoseText4')} : ${data.profile_info.nbr_goals}</div>
            `;
            RenderHostMatch(data.profile_info);
            RenderUserTournament(data.profile_info);
		})
		.catch(error => {
			console.error('Erreur :', error);
		});
}

export function send_request(username) {

    const token = localStorage.getItem('host_auth_token');
    fetch('send_friend_request/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ receiver_name: username })
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
    const token = localStorage.getItem('host_auth_token');
    console.log("id", id);
    await fetch('accept_friend_request/', {
        method: 'POST',
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
    const token = localStorage.getItem('host_auth_token');
    await fetch('reject_friend_request/', {
        method: 'POST',
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