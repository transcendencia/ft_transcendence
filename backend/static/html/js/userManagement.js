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
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ status: status }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error while updating user status');
        }
    })
    .catch(error => {
        error;
    });
}

export function getUserStatus(userId) {
    const token = sessionStorage.getItem('host_auth_token');
    if (!userId)
        return;
    return fetch(`/user/status/${userId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`
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
        error;
    });
}

export function getProfileInfo(userId) {
    const token = sessionStorage.getItem('host_auth_token');
    if (!userId || !token)
        return;
    return fetch(`user_info/${userId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error retrieving user profile information');
        }
        return response.json();
    })
    .catch(error => {
        error;
    });
}

export function populateProfileInfos(data) {
    document.getElementById('username').textContent = data.profile_info.username;
    document.getElementById('alias').textContent = data.profile_info.alias;

    const base64Image = data.profile_info.profile_picture;

    document.getElementById('profile_pic').src = `data:image/png;base64,${base64Image}`;
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
    if (!receiver_id)
        return;
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
    });
}

export async function accept_friend_request(request_id) {
    const token = sessionStorage.getItem('host_auth_token');
    if (!request_id)
        return;
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
    });
}

export async function delete_friend_request(request_id) {
    const token = sessionStorage.getItem('host_auth_token');
    if (!request_id)
        return;
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
    });
}

export async function get_friends_list() {
    const token = sessionStorage.getItem('host_auth_token');
    if (!token)
        return;
    try {
        const response = await fetch('friends_list/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to retrieve users list');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        error;
    }
}

/*UPDATE USER INFO*/
export function updateUserGraphicMode(graphicMode) {
	const token = sessionStorage.getItem('host_auth_token');
    if (!graphicMode)
        return;
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
        error;
    });
}

export function updateUserLanguage(new_language) {
    const token = sessionStorage.getItem('host_auth_token');
    if (!new_language)
        return;
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
        error;
    });
}
