// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAkul5eqnmmw1pL4Feb8fS_MIuJoAPcDz8",
    authDomain: "rocu-c0a08.firebaseapp.com",
    projectId: "rocu-c0a08",
    storageBucket: "rocu-c0a08.appspot.com",
    messagingSenderId: "609310265342",
    appId: "1:609310265342:web:b60556ef7f47044897faaf"
};

firebase.initializeApp(firebaseConfig);

// Initialize variables
const auth = firebase.auth();
const database = firebase.database();

// Function to log in a user
function login() {
    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value;

    if (!validate_email(email) || !validate_password(password)) {
        alert('Email or Password is not valid!');
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(function() {
            var user = auth.currentUser;
            var database_ref = database.ref('users/' + user.uid);

            // Fetch user data including membership
            database_ref.once('value', function(snapshot) {
                var userData = snapshot.val();
                if (userData && userData.membership) {
                    // Update greeting
                    var greetingElement = document.getElementById('greeting');
                    greetingElement.textContent = `Hello, ${user.email}! Your current membership is: ${userData.membership}`;

                    // Show membership options based on current membership
                    showMembershipOptions(userData.membership);

                    // Select the current membership radio button
                    var membershipRadio = document.querySelector(`input[name="membership"][value="${userData.membership}"]`);
                    if (membershipRadio) {
                        membershipRadio.checked = true;
                    }
                } else {
                    console.log('User data or membership not found.');
                }
            });

            // Update last login timestamp
            var user_data = {
                last_login: Date.now()
            };
            database_ref.update(user_data);

            alert('User Logged In Successfully!');
            // Redirect to membership.html
            window.location.href = 'membership.html';
        })
        .catch(function(error) {
            var errorMessage = error.message;
            alert(errorMessage);
        });
}

// Function to show membership options
function showMembershipOptions(currentMembership) {
    // Hide all membership options
    var membershipOptions = document.querySelectorAll('.membership-option');
    membershipOptions.forEach(option => {
        option.style.display = 'none';
    });

    // Show the selected membership option
    var selectedOption = document.querySelector(`input[name="membership"][value="${currentMembership}"]`).closest('.membership-option');
    selectedOption.style.display = 'flex';

    // Show all other membership options
    var otherOptions = document.querySelectorAll('.membership-option:not(:has(input:checked))');
    otherOptions.forEach(option => {
        option.style.display = 'flex';
    });
}

// Validate email function
function validate_email(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(String(email).toLowerCase());
}

// Validate password function
function validate_password(password) {
    return password.length >= 6;
}