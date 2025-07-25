function toggleDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('show');
}

/// Click to drop down
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('profile-dropdown');
    const profileImg = document.querySelector('.profile-img');
    
    if (!dropdown.contains(event.target) && !profileImg.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

/// Check login and signup
let isLoginMode = true;

        function switchToSignup() {
            if (isLoginMode) {
                const loginForm = document.getElementById('loginForm');
                const signupForm = document.getElementById('signupForm');
                const leftPanel = document.getElementById('leftPanel');

                loginForm.classList.add('hidden');
                signupForm.classList.remove('hidden');
                leftPanel.classList.remove('login-mode');
                leftPanel.classList.add('signup-mode');

                isLoginMode = false;
            }
        }

        function switchToLogin() {
            if (!isLoginMode) {
                const loginForm = document.getElementById('loginForm');
                const signupForm = document.getElementById('signupForm');
                const leftPanel = document.getElementById('leftPanel');

                signupForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                leftPanel.classList.remove('signup-mode');
                leftPanel.classList.add('login-mode');

                isLoginMode = true;
            }
        }

        // Handle form submissions
        document.getElementById('login-form-element').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            console.log('Login attempt:', { email, password });
            alert('Login functionality would be implemented here!');
        });

        document.getElementById('signup-form-element').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            console.log('Signup attempt:', { name, email, password });
            alert('Signup functionality would be implemented here!');
        });