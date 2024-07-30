document.getElementById('setDataForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch('/blockchain/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: formData
    });
    const text = await response.text();
    console.log('Raw response:', text);
    try {
        const result = JSON.parse(text);
        if (result.status === 'success') {
            alert('Transaction sent: ' + result.transaction_hash);
            // Refresh the stored data
            const storedDataResponse = await fetch('/blockchain/');
            const storedDataHtml = await storedDataResponse.text();
            document.body.innerHTML = storedDataHtml;
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Failed to parse JSON:', error);
        alert('Unexpected response from server. Check console for details.');
    }
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}