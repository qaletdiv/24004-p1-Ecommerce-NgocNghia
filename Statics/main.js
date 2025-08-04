import { products } from './mock-data.js';
import { accounts as defaultAccounts} from './mock-data.js';

if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
    console.log('Products initialized in localStorage.');
} else {
    console.log('Products already exist in localStorage.');
}

let localAccounts = JSON.parse(localStorage.getItem('accounts')) || [];

if (localAccounts.length === 0) {
    localAccounts = defaultAccounts;
    localStorage.setItem('accounts', JSON.stringify(localAccounts));
} else {
    let accountsUpdated = false;
    localAccounts = localAccounts.map(acc => {
        const defaultAcc = defaultAccounts.find(a => a.email === acc.email);
        if (defaultAcc) {
            const mergedAccount = { ...defaultAcc, ...acc };
            if (JSON.stringify(mergedAccount) !== JSON.stringify(acc)) {
                accountsUpdated = true;
            }
            return mergedAccount;
        }
        return acc;
    });
    
    if (accountsUpdated) {
        localStorage.setItem('accounts', JSON.stringify(localAccounts));
        console.log('Accounts updated with missing fields.');
    }
}

///update profile image
function updateProfileImage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const profileLogo = document.querySelector('.profile-img');

    if (!profileLogo) return;

    if (currentUser && currentUser.profileImg) {
        profileLogo.src = currentUser.profileImg;
        profileLogo.alt = `${currentUser.name}'s profile`;
    } else {
        profileLogo.src = "https://www.svgrepo.com/show/343494/profile-user-account.svg";
        profileLogo.alt = "Default profile";
    }
}

/// update menu dropdown
function updateProfileDropdown() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const dropdown = document.getElementById('profile-dropdown');

    if (!dropdown) return;

    if (currentUser) {
        dropdown.innerHTML = `
            <ul>
                <li class="user-greeting">
                    <span style="color: #ffd700; font-weight: 600; font-size: 0.95rem; padding: 12px 20px; display: block; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                        Hello, ${currentUser.name}!
                    </span>
                </li>
                <li><a href="../home.html">HOME</a></li>
                <li><a href="../AboutPage/about-page.html">ABOUT</a></li>
                <li><a href="../ShopPage/shop-page.html">SHOP</a></li>
                <li><a href="../ContactPage/contact-page.html">CONTACT</a></li>
                <li><a href="#" class="logout-btn" onclick="handleLogout()">LOGOUT</a></li>
            </ul>
        `;
    } else {
        dropdown.innerHTML = `
            <ul>
                <li><a href="../home.html">HOME</a></li>
                <li><a href="../AboutPage/about-page.html">ABOUT</a></li>
                <li><a href="../ShopPage/shop-page.html">SHOP</a></li>
                <li><a href="../ContactPage/contact-page.html">CONTACT</a></li>
                <li><a href="../LoginPage/login-page.html" class="sign-in">SIGN IN</a></li>
            </ul>
        `;
    }
}

/// Log out 
function handleLogout() {
    localStorage.removeItem('currentUser');
    updateProfileImage();
    updateProfileDropdown();
    console.log('User logged out');
}

document.addEventListener('DOMContentLoaded', () => {
    updateProfileImage();
    updateProfileDropdown();
});

window.handleLogout = handleLogout;