import { accounts } from '../Statics/mock-data.js';

/// Check login and signup
let isLoginMode = true;

        function switchToSignup() {
            if (isLoginMode) {
                const loginForm = document.getElementById('loginForm');
                const signupForm = document.getElementById('signupForm');
                const leftPanel = document.getElementById('leftPanel');
                
                /// Login Mode 
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

                /// Sign Up Mode
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
            
            const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
            const account = storedAccounts.find(acc => acc.email === email && acc.password === password);
            
            if (account) {
                alert(`Welcome back, ${account.name}!`);
                // Redirect to home page or dashboard
                window.location.href = '../home.html';
            } else {
                alert('Invalid email or password. Please try again.');
            }
        });

        document.getElementById('signup-form').addEventListener('submit', function(e) {
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