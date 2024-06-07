import { getCookie } from './loginPage.js';

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