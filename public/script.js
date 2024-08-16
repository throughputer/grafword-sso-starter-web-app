let clientId;
let grafwordDomain;
let profileRedirectUri;

// Fetch configuration from the server
fetch('/config')
    .then(response => response.json())
    .then(config => {
        clientId = config.clientId;
        grafwordDomain = config.grafwordDomain;

        var currentHost = window.location.protocol + '//' + window.location.host;
        profileRedirectUri = encodeURIComponent(currentHost + '/profile');


        // index
        const authenticate = document.getElementById('authenticate');
        if (authenticate) {
            authenticate.addEventListener('click', function () {
                window.location.href = profileAuth();
            });
        }

        // profile
        const goToProfileButton = document.getElementById('goToProfile');
        if (goToProfileButton) {
            goToProfileButton.href = profileAuth();
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

                // Save token in localStorage
                localStorage.setItem('id_token', id_token);

            } catch (e) {
                console.error('Error decoding token:', e);
                document.getElementById('profileContent').innerHTML = "<p>Error processing user information</p>";
                document.getElementById('profileContent').classList.remove('hidden');
            }
        } else {
            const noToken = document.getElementById('noToken');
            if (noToken) {
                noToken.classList.remove('d-none');
                localStorage.removeItem('id_token');
                localStorage.removeItem('access_token');
            }
        }

        function logout() {
            localStorage.removeItem('id_token');
            // Redirect to the login page or any other page
            window.location.href = '/';
        }

        // Add event listener to the logout button
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', logout);
        }

    })
    .catch(error => {
        console.error('Error fetching config:', error);
    });

// Function to construct the authorization URL
function profileAuth() {
    return `https://${grafwordDomain}/oauth2/v1/authorize?client_id=${clientId}&redirect_uri=${profileRedirectUri}&response_type=id_token%20token&scope=openid%20profile%20email&prompt=none&nonce=n-0S6_WzA2Mj&state=Af0ifjslDkj`;
}
