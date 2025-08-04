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
    // Login form handler
    document.getElementById('login-form-element').addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Get accounts from localStorage (đã được sync từ main.js)
        const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
        console.log('Stored accounts:', storedAccounts);
        
        // Tìm account khớp với email và password
        const account = storedAccounts.find(acc => acc.email === email && acc.password === password);
        console.log('Found account:', account);

        if (account) {
            // Lưu thông tin user hiện tại vào localStorage
            localStorage.setItem('currentUser', JSON.stringify(account));
            console.log('Current user saved:', account);
            
            alert(`Welcome back, ${account.name}!`);
            
            // Redirect về home page
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

        // Kiểm tra email đã tồn tại chưa
        const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
        const existingAccount = storedAccounts.find(acc => acc.email === email);

        if (existingAccount) {
            alert('Email already exists. Please use a different email.');
            return;
        }

        // Tạo account mới với default profile image
        const newAccount = {
            name: name,
            email: email,
            password: password,
            profileImg: "https://www.meowbox.com/cdn/shop/articles/Screen_Shot_2024-03-15_at_10.53.41_AM.png?v=1710525250"
        };

        // Thêm vào danh sách accounts
        storedAccounts.push(newAccount);
        localStorage.setItem('accounts', JSON.stringify(storedAccounts));

        // Tự động login sau khi đăng ký thành công
        localStorage.setItem('currentUser', JSON.stringify(newAccount));
        
        alert(`Account created successfully! Welcome, ${name}!`);
        window.location.href = '../home.html';
    });
});