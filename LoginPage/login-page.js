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

// Make functions global so they can be called from HTML
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;

// Handle form submissions
document.addEventListener('DOMContentLoaded', function() {

    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmSignupPassword');
    
    /// Confirm password
    function validatePasswords() {
        if (confirmPassword.value === '') {
            confirmPassword.style.borderColor = '#e1e5e9';
            return;
        }
        
        if (signupPassword.value === confirmPassword.value) {
            confirmPassword.style.borderColor = '#28a745';
            confirmPassword.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
        } else {
            confirmPassword.style.borderColor = '#dc3545';
            confirmPassword.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
        }
    }
    
    // Add event listeners for real-time validation
    signupPassword.addEventListener('input', validatePasswords);
    confirmPassword.addEventListener('input', validatePasswords);
    // Login form handler
    document.getElementById('login-form-element').addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Get accounts from localStorage 
        const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
        console.log('Stored accounts:', storedAccounts);
        
        const account = storedAccounts.find(acc => acc.email === email && acc.password === password);
        console.log('Found account:', account);

        if (account) {
            localStorage.setItem('currentUser', JSON.stringify(account));
            console.log('Current user saved:', account);
            window.location.href = '../home.html';
        } else {
            alert('Invalid email or password. Please try again.');
        }
    });

    // Signup form handler
    document.getElementById('signup-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPasswordValue = document.getElementById('confirmSignupPassword').value;

        // Validate that passwords are not empty
        if (password === '' || confirmPasswordValue === '') {
            alert('Please enter both password fields.');
            return;
        }

        // Validate password confirmation for mismatch
        if (password !== confirmPasswordValue) {
            alert('Passwords do not match. Please enter the same password in both fields.');
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
        const existingAccount = storedAccounts.find(acc => acc.email === email);

        if (existingAccount) {
            alert('Email already exists. Please use a different email.');
            return;
        }

        const newAccount = {
            name: name,
            email: email,
            password: password,
            profileImg: "https://www.meowbox.com/cdn/shop/articles/Screen_Shot_2024-03-15_at_10.53.41_AM.png?v=1710525250"
        };

        storedAccounts.push(newAccount);
        localStorage.setItem('accounts', JSON.stringify(storedAccounts));

        localStorage.setItem('currentUser', JSON.stringify(newAccount));
        
        alert(`Account created successfully! Welcome, ${name}!`);
        window.location.href = '../home.html';
    });
});