import { products } from '../Statics/mock-data.js';
import { accounts as defaultAccounts } from '../Statics/mock-data.js';

// Initialize variables
let cart = [];
let currentUser = null;

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

function setToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
}

function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing ${key} from localStorage:`, error);
    }
}

// Get cart key - consistent with product-page.js
function getCartKey(user) {
    return user ? `cart_of_${user.name}` : 'cart_guest';
}

// Initialize data from localStorage
function initializeData() {
    currentUser = getFromStorage('currentUser');

    const cartKey = getCartKey(currentUser);
    cart = getFromStorage(cartKey, []);

    console.log('Initialized cart:', cart); 
    console.log('Cart key used:', cartKey); 

    return { currentUser, cart };
}

// Save cart to localStorage
function saveCart() {
    const cartKey = getCartKey(currentUser);
    setToStorage(cartKey, cart);
    console.log('Cart saved:', cart); 
}

// Check if user is logged in
function checkLoginRequired() {
    const user = getFromStorage('currentUser');
    return user !== null;
}

// Navigation functions
function goToShop() {
    window.location.href = '../ShopPage/shop-page.html';
}

function goToLogin() {
    showNotification('Redirecting to login page...', 'info');
    window.location.href = '../LoginPage/login-page.html';
}

// Remove item from cart
function removeFromCart(productId) {
    console.log('Removing product:', productId); 
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
    updateCartDisplay();
    showNotification('Item removed from cart', 'info');
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    console.log('Updating quantity:', productId, newQuantity); 

    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartDisplay();
        showNotification('Quantity updated', 'success');
    }
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
        showNotification('Cart cleared', 'info');
    }
}

// Get product details by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Calculate cart totals
function calculateTotals() {
    let subtotal = 0;
    let itemCount = 0;

    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (product) {
            const priceStr = product.price.replace(/[₫đ,.]/g, '');
            const price = parseFloat(priceStr);

            if (!isNaN(price)) {
                subtotal += price * item.quantity;
                itemCount += item.quantity;
            }
        }
    });

    const tax = subtotal * 0.1; 
    const shipping = subtotal > 500000 ? 0 : 50000; 
    const total = subtotal + tax + shipping;

    return {
        subtotal: Math.round(subtotal).toLocaleString('vi-VN'),
        tax: Math.round(tax).toLocaleString('vi-VN'),
        shipping: Math.round(shipping).toLocaleString('vi-VN'),
        total: Math.round(total).toLocaleString('vi-VN'),
        itemCount,
        shippingFree: subtotal > 500000,
        rawSubtotal: subtotal,
        rawTotal: total
    };
}

// Update cart display
function updateCartDisplay() {
    const container = document.getElementById('cart-container');

    if (!container) {
        console.warn('Cart container not found');
        return;
    }

    console.log('Updating cart display, cart:', cart);
    // Check if user is logged in
    if (!checkLoginRequired()) {
        container.innerHTML = `
            <div class="login-required" style="text-align: center; padding: 3rem; background: white; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); margin: 2rem auto; max-width: 500px;">
                <i class="fa-solid fa-lock" style="font-size: 3rem; color: #667eea; margin-bottom: 1rem;"></i>
                <h3 style="color: #333; margin-bottom: 1rem;">Login Required</h3>
                <p style="color: #666; margin-bottom: 2rem;">You need to be logged in to view your shopping cart.<br>Please sign in to continue with your purchase.</p>
                <button onclick="goToLogin()" class="login-btn" style="background: #667eea; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                    <i class="fa-solid fa-sign-in-alt"></i> Sign In
                </button>
            </div>
        `;
        return;
    }

    const totals = calculateTotals();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart" style="text-align: center; padding: 3rem; background: white; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); margin: 2rem auto; max-width: 500px;">
                <i class="fa-solid fa-cart-shopping" style="font-size: 4rem; color: #ddd; margin-bottom: 1rem;"></i>
                <h3 style="color: #333; margin-bottom: 1rem;">Your cart is empty</h3>
                <p style="color: #666; margin-bottom: 2rem;">Looks like you haven't added anything to your cart yet</p>
                <button onclick="goToShop()" class="continue-shopping" style="background: #667eea; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; cursor: pointer; text-decoration: none; transition: all 0.3s ease;">
                    Start Shopping
                </button>
            </div>
        `;
        return;
    }

    const cartItems = cart.map(item => {
        const product = getProductById(item.productId);
        if (!product) {
            console.warn('Product not found for ID:', item.productId);
            return '';
        }


        return `
<div class="cart-item" data-product-id="${product.id}" style="display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 1rem;">
    <img src="${product.image}" alt="${product.name}" class="item-image" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
    <div class="item-info" style="flex: 1;">
        <h4 style="margin: 0 0 0.5rem 0; color: #333;">${product.name}</h4>
        <div class="category" style="color: #666; font-size: 0.9rem;">${product.category}</div>
        <div class="added-date" style="color: #999; font-size: 0.8rem; margin-top: 0.25rem;">Added: ${new Date(item.addedAt || new Date()).toLocaleDateString()}</div>
    </div>
    <div class="item-price" style="font-weight: 600; color: #e74c3c; margin: 0 1rem;">${product.price}</div>
    <div class="quantity-controls" style="display: flex; align-items: center; gap: 0.5rem;">
        <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''} style="background: ${item.quantity <= 1 ? '#ccc' : '#667eea'}; color: white; border: none; width: 30px; height: 30px; border-radius: 5px; cursor: ${item.quantity <= 1 ? 'not-allowed' : 'pointer'}; font-weight: bold;">-</button>
        <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity(${product.id}, parseInt(this.value) || 1)" style="width: 50px; text-align: center; border: 1px solid #ddd; border-radius: 5px; padding: 5px;">
        <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${item.quantity + 1})" style="background: #667eea; color: white; border: none; width: 30px; height: 30px; border-radius: 5px; cursor: pointer; font-weight: bold;">+</button>
    </div>
    <button class="remove-btn" onclick="removeFromCart(${product.id})" style="background: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; margin-left: 1rem;" title="Remove from cart">
        <i class="fa-solid fa-trash"></i>
    </button>
</div>
`;
    }).join('');

    container.innerHTML = `
<div style="max-width: 1200px; margin: 0 auto; padding: 2rem; display: flex; gap: 2rem;">
<div class="cart-items" style="flex: 1; ">
    <div class="cart-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2 style="color: #333;">Shopping Cart (${totals.itemCount} items)</h2>
        <button class="clear-cart-btn" onclick="clearCart()" style="background: #e74c3c; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
            <i class="fa-solid fa-trash"></i> Clear Cart
        </button>
    </div>
    ${cartItems}
</div>

<div class="cart-summary" style="background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); min-width: 400px; max-width: 450x;">
    <div class="summary-header" style="margin-bottom: 1.5rem;">
        <h3 style="color: #333; margin: 0;">Order Summary</h3>
    </div>
    <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 1rem; color: #666;">
        <span>Subtotal:</span>
        <span>${totals.subtotal}₫</span>
    </div>
    <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 1rem; color: #666;">
        <span>Tax (10%):</span>
        <span>${totals.tax}₫</span>
    </div>
    <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 1rem; color: #666;">
        <span>Shipping:</span>
        <span>${totals.shippingFree ? 'FREE' : totals.shipping + '₫'}</span>
    </div>
    <hr style="margin: 1rem 0; border: none; border-top: 1px solid #eee;">
    <div class="summary-row total" style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem; color: #333; margin-bottom: 2rem;">
        <span>Total:</span>
        <span>${totals.total}₫</span>
    </div>
    <button class="checkout-btn" onclick="proceedToCheckout()" ${cart.length === 0 ? 'disabled' : ''} style="width: 100%; background: #27ae60; color: white; border: none; padding: 15px; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; margin-bottom: 1rem; transition: all 0.3s ease;">
        <i class="fa-solid fa-lock"></i> Secure Checkout
    </button>
    <button onclick="goToShop()" class="continue-shopping" style="width: 100%; background: transparent; color: #667eea; border: 2px solid #667eea; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
        <i class="fa-solid fa-arrow-left"></i> Continue Shopping
    </button>
</div>
</div>
`;
}


// Proceed to checkout
function proceedToCheckout() {
    if (!checkLoginRequired()) {
        showNotification('Please login to proceed with checkout', 'warning');
        return;
    }

    if (cart.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }

    const totals = calculateTotals();
    showNotification(`Proceeding to checkout with ${totals.itemCount} items. Total: ${totals.total}₫`, 'info');

    // Save checkout data for next page
    setToStorage('checkoutData', {
        cart: cart,
        totals: totals,
        timestamp: new Date().toISOString()
    });

    // Here you could redirect to a checkout page
    // window.location.href = '../CheckoutPage/checkout-page.html';
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Style the notification
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.success};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 1000;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Profile management functions
function updateProfileImage() {
    currentUser = getFromStorage('currentUser');
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

function updateProfileDropdown() {
    currentUser = getFromStorage('currentUser');
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

function goToProfile() {
    currentUser = getFromStorage('currentUser');
    if (!currentUser) {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/ProfileInfo/')) {
            window.location.href = '../LoginPage/login-page.html';
        } else if (currentPath.includes('home.html') || currentPath === '/') {
            window.location.href = './LoginPage/login-page.html';
        } else {
            window.location.href = '../LoginPage/login-page.html';
        }
        return;
    }

    const currentPath = window.location.pathname;
    if (currentPath.includes('/ProfileInfo/')) {
        window.location.reload();
    } else if (currentPath.includes('home.html') || currentPath === '/') {
        window.location.href = './ProfileInfo/profile-info.html';
    } else {
        window.location.href = '../ProfileInfo/profile-info.html';
    }
}

function handleLogout() {
    // Clear user-specific data
    removeFromStorage('currentUser');

    // Clear user's cart
    if (currentUser) {
        const cartKey = getCartKey(currentUser);
        removeFromStorage(cartKey);
    }

    // Reset local variables
    currentUser = null;
    cart = [];

    // Update UI
    updateProfileImage();
    updateProfileDropdown();
    updateCartDisplay();

    showNotification('Successfully logged out', 'info');
    console.log('User logged out');
}

function toggleDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Click outside to close dropdown
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('profile-dropdown');
    const profileImg = document.querySelector('.profile-img');

    if (dropdown && profileImg && !dropdown.contains(event.target) && !profileImg.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing cart page');

    // Initialize data from localStorage
    initializeData();

    // Update UI
    updateProfileImage();
    updateProfileDropdown();
    updateCartDisplay();

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .quantity-btn:hover:not(:disabled) {
            background: #5a6fd8 !important;
            transform: scale(1.05);
        }
        
        .checkout-btn:hover:not(:disabled) {
            background: #219a52 !important;
            transform: translateY(-2px);
        }
        
        .continue-shopping:hover {
            background: #667eea !important;
            color: white !important;
        }
        
        .remove-btn:hover {
            background: #c0392b !important;
            transform: scale(1.05);
        }
        
        .cart-item {
            transition: all 0.3s ease;
        }
        
        .cart-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
        }
    `;
    document.head.appendChild(style);
});

// Export functions to global scope
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;
window.toggleDropdown = toggleDropdown;
window.goToProfile = goToProfile;
window.handleLogout = handleLogout;
window.goToLogin = goToLogin;
window.goToShop = goToShop;