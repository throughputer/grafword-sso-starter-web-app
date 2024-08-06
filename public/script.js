const clientId = 'CLIENT_ID';
const grafwordDomain = 'GRAFWORD_DOMAIN';

var currentHost = window.location.protocol + '//' + window.location.host;
var redirectUri = encodeURIComponent(currentHost + '/profile');

// Function to construct the authorization URL
function getAuthUrl() {
    return `https://${grafwordDomain}/oauth2/v1/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=id_token%20token&scope=openid%20profile%20email&prompt=none&nonce=n-0S6_WzA2Mj&state=Af0ifjslDkj`;
}

// index
const authenticate = document.getElementById('authenticate');
if (authenticate) {
    authenticate.addEventListener('click', function () {
        window.location.href = getAuthUrl();
    });
}

// profile
const applicationLink = document.getElementById('applicationLink');
if (applicationLink) {
    applicationLink.href = getAuthUrl();
}

var hash = window.location.hash.slice(1);
var params = new URLSearchParams(hash);
var id_token = params.get('id_token');

if (id_token) {
    try {
        var payload = id_token.split('.')[1]; // Get the Payload part
        var decoded = atob(payload); // Base64-decode
        var user_info = JSON.parse(decoded); // Parse JSON

        // Display the navbar and user information
        document.querySelector('.navbar').classList.remove('hidden');
        document.getElementById('profileContent').innerHTML += "<p>Name: " + (user_info.name || "User") + "</p>";
        document.getElementById('profileContent').innerHTML += "<p>Email: " + (user_info.email || "User") + "</p>";
        document.getElementById('profileContent').classList.remove('hidden');
    } catch (e) {
        console.error('Error decoding token:', e);
        document.getElementById('profileContent').innerHTML = "<p>Error processing user information</p>";
        document.getElementById('profileContent').classList.remove('hidden');
    }
} else {
    const noToken = document.getElementById('noToken');
    if (noToken) {
        noToken.classList.remove('d-none');
    }
}

function logout() {
    // Redirect to the login page or any other page
    window.location.href = '/';
}

// Add event listener to the logout button
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}
