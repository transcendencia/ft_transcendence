import { getCookie } from './loginPage.js';
import { getTranslatedText} from "./translatePages.js";
import { setHostAsPlayerOne} from "./arenaPage.js";

export async function updateUserStatus(status, token) {
    if (!token || !status)
        return;

    await fetch('/user/status/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ status: status }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error while updating user status');
        }
    })
    .catch(error => {
        console.error('Error :', error);
    });
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
            throw new Error('Error retrieving status');
        }
        return response.json();
    })
    .then(data => {
        return data.user_status;
    })
    .catch(error => {
        console.error('Error :', error.message);
    });
}

export function getProfileInfo(userId) {
    const token = sessionStorage.getItem('host_auth_token');

    return fetch(`user_info/${userId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error retrieving user profile information');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error :', error);
    });
}

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

/* FRIEND REQUEST MANAGEMENT*/
export function send_friend_request(receiver_id) {
    const token = sessionStorage.getItem('host_auth_token');
    
    fetch('friend_request/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ receiver_id: receiver_id })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error during friend request');
        }
    })
    .catch(error => {
        error;
        // console.error('Error :', error);
    });
}

export async function accept_friend_request(request_id) {
    const token = sessionStorage.getItem('host_auth_token');

    await fetch('friend_request/', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({request_id:  request_id})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to accept friend request');
        }
    })
    .catch(error => {
        error;
        // console.error('Error :', error);
    });
}

export async function delete_friend_request(request_id) {
    const token = sessionStorage.getItem('host_auth_token');
    fetch('friend_request/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({request_id:  request_id})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete friend request');
        }
    })
    .catch(error => {
        error;
        console.error('Error :', error);
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
            throw new Error('Failed to retrieve users list');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

/*UPDATE USER INFO*/
export function updateUserGraphicMode(graphicMode) {
	const token = sessionStorage.getItem('host_auth_token');
    return fetch('user/graphic_mode/', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ graphicMode: graphicMode })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error while changing the graphic mode');
        }
    })
    .catch(error => {
        console.error('Error :', error);
    });
}

export function updateUserLanguage(new_language) {
    const token = sessionStorage.getItem('host_auth_token');
    
    fetch('user/language/', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ language: new_language })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error while changing the language');
        }
    })
    .catch(error => {
        console.error('Error :', error);
    });
}
