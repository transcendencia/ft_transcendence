const blockchainWindow = document.querySelectorAll(".enterPasswordWindow")[2];
const showTournamentResult = document.getElementById("showTournamentResult");
const blockingPanel = document.getElementById('blockingPanel');

showTournamentResult.addEventListener('click', async function() {
    blockchainWindow.classList.toggle("showRectangle");
	blockingPanel.classList.add("show");
    updateStoredData();

});

const closeBlockchainPanel = document.getElementById("closeBlockchainPanel");

closeBlockchainPanel.addEventListener('click', async function() {
    blockchainWindow.classList.remove("showRectangle");
    blockingPanel.classList.remove('show');
});

// Function to fetch and update stored data
async function updateStoredData() {
    try {
        const response = await fetch('/blockchain/');
        const data = await response.json();
        const storedDataContainer = document.getElementById('storedData');
        storedDataContainer.innerHTML = data.stored_data.map(value => `<p>Value: ${value}</p>`).join('');
    } catch (error) {
        console.error('Failed to fetch stored data:', error);
    }
}

// Function to initialize the page
function initializePage() {
    // Fetch stored data immediately when the page loads
    updateStoredData();

    // Fetch stored data every 5 seconds (adjust as needed)
    setInterval(updateStoredData, 5000);

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
                // Refresh the stored data immediately
                updateStoredData();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Failed to parse JSON:', error);
            alert('Unexpected response from server. Check console for details.');
        }
    });
}

// Call initializePage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializePage);

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