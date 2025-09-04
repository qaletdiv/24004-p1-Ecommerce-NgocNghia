function toggleDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('show');
}

/// Click to drop down
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('profile-dropdown');
    const profileImg = document.querySelector('.profile-img');

    if (!dropdown.contains(event.target) && !profileImg.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

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
                <a href="#" onclick="goToProfile()" style="color: #ffd700; font-weight: 600; font-size: 0.95rem; padding: 12px 20px; display: block; border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: center; cursor: pointer;">
                ${currentUser.name}
                </a>
                </li>
                <li><a href="../index.html">HOME</a></li>
                <li><a href="../AboutPage/about-page.html">ABOUT</a></li>
                <li><a href="../ShopPage/shop-page.html">SHOP</a></li>
                <li><a href="../ContactPage/contact-page.html">CONTACT</a></li>
                <li><a href="#" class="logout-btn" onclick="handleLogout()">LOGOUT</a></li>
            </ul>
        `;
    } else {
        dropdown.innerHTML = `
            <ul>
                <li><a href="../index.html">HOME</a></li>
                <li><a href="../AboutPage/about-page.html">ABOUT</a></li>
                <li><a href="../ShopPage/shop-page.html">SHOP</a></li>
                <li><a href="../ContactPage/contact-page.html">CONTACT</a></li>
                <li><a href="../LoginPage/login-page.html" class="sign-in">SIGN IN</a></li>
            </ul>
        `;
    }
}
/// Profile Info 
function goToProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Get current page path to determine correct relative path
        const currentPath = window.location.pathname;
        if (currentPath.includes('/ProfileInfo/')) {
            window.location.href = '../LoginPage/login-page.html';
        } else if (currentPath.includes('index.html') || currentPath === '/') {
            window.location.href = './LoginPage/login-page.html';
        } else {
            window.location.href = '../LoginPage/login-page.html';
        }
        return;
    }

    // Navigate to profile page based on current location
    const currentPath = window.location.pathname;
    if (currentPath.includes('/ProfileInfo/')) {
        window.location.reload();
    } else if (currentPath.includes('index.html') || currentPath === '/') {
        window.location.href = './ProfileInfo/profile-info.html';
    } else {
        window.location.href = '../ProfileInfo/profile-info.html';
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

// Helper functions for localStorage management
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
}

// Get cart data from localStorage
function getCartFromStorage() {
    const currentUser = getFromStorage('currentUser');
    const cartKey = currentUser ? `cart_of_${currentUser.name}` : 'cart_guest';
    return getFromStorage(cartKey, []);
}

// Updated cart badge function that reads from localStorage
function updateCartBadge() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        // Get cart data from localStorage
        const cartData = getCartFromStorage();

        // Calculate total items in cart
        const totalItems = cartData.reduce((sum, item) => sum + (item.quantity || 0), 0);

        // Remove existing badge
        const existingBadge = cartIcon.querySelector('.cart-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        // Add new badge if there are items
        if (totalItems > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.textContent = totalItems;
            badge.style.cssText = `
            position: absolute;
            top: -2px;
            right: -8px;
            background: #ff4757;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 18px;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
            `;
            cartIcon.style.position = 'relative';
            cartIcon.appendChild(badge);
        }
    }
}

// Function to refresh cart badge (useful for calling from other pages)
function refreshCartBadge() {
    updateCartBadge();
}

// Listen for storage changes (when cart is updated in other tabs)
window.addEventListener('storage', function (e) {
    // Check if a cart-related key was changed
    if (e.key && (e.key.includes('cart_of_') || e.key === 'cart_guest')) {
        updateCartBadge();
    }
});

// Listen for custom cart update events
window.addEventListener('cartUpdated', function () {
    updateCartBadge();
});

// Function to trigger cart update event (call this when cart changes)
function triggerCartUpdate() {
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
}

// Initialize cart badge when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        updateCartBadge();
    }, 100);
});

/// cart page
function goToCartPage() {
    window.location.href = '../CartPage/cart-page.html';
}

// Make functions available globally
window.updateCartBadge = updateCartBadge;
window.refreshCartBadge = refreshCartBadge;
window.triggerCartUpdate = triggerCartUpdate;
window.getCartFromStorage = getCartFromStorage;
window.goToProfile = goToProfile;
window.handleLogout = handleLogout;
window.updateProfileDropdown = updateProfileDropdown;
window.updateProfileImage = updateProfileImage;