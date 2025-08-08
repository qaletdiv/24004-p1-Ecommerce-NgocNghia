import { products } from '../Statics/mock-data.js';

const productId = parseInt(localStorage.getItem('selectedProduct'));

let currentProduct = null;
let currentQuantity = 1;
let cart = [];

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

// Initialize cart data
function initializeCart() {
    const currentUser = getFromStorage('currentUser');
    const cartKey = currentUser ? `cart_of_${currentUser.name}` : 'cart_guest';
    cart = getFromStorage(cartKey, []);
}

// Save cart to localStorage
function saveCart() {
    const currentUser = getFromStorage('currentUser');
    const cartKey = currentUser ? `cart_of_${currentUser.name}` : 'cart_guest';
    setToStorage(cartKey, cart);
}

// Check if user is logged in
function checkLoginRequired() {
    const user = getFromStorage('currentUser');
    return user !== null;
}

// Navigation to cart page
function goToCartPage() {
    if (!checkLoginRequired()) {
        showNotification('Please login to view your cart', 'warning');
        setTimeout(() => {
            window.location.href = '../LoginPage/login-page.html';
        }, 1500);
        return;
    }
    window.location.href = '../CartPage/cart-page.html';
}

function changeQuantity(change) {
    currentQuantity = Math.max(1, currentQuantity + change);
    document.getElementById('quantity').value = currentQuantity;
}

function addToCart() {
    // Check if user is logged in
    if (!checkLoginRequired()) {
        showNotification('Please login to add items to cart', 'warning');
        setTimeout(() => {
            window.location.href = '../LoginPage/login-page.html';
        }, 1500);
        return;
    }

    if (!currentProduct) {
        showNotification('Product not found', 'error');
        return;
    }

    // Get current quantity from input
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput.value) || 1;

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.productId === currentProduct.id);
    
    if (existingItem) {
        // Update quantity if item exists
        existingItem.quantity += quantity;
        showNotification(`Updated ${currentProduct.name} quantity in cart!`, 'success');
    } else {
        // Add new item to cart
        cart.push({
            productId: currentProduct.id,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
        showNotification(`Added ${quantity} ${currentProduct.name} to cart!`, 'success');
    }

    // Save cart to localStorage
    saveCart();
    
    // Update cart icon badge if it exists
    updateCartBadge();
}

function buyNow() {
    // Check if user is logged in
    if (!checkLoginRequired()) {
        showNotification('Please login to proceed with purchase', 'warning');
        setTimeout(() => {
            window.location.href = '../LoginPage/login-page.html';
        }, 1500);
        return;
    }

    if (!currentProduct) {
        showNotification('Product not found', 'error');
        return;
    }

    // Get current quantity
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput.value) || 1;

    // Add to cart first
    const existingItem = cart.find(item => item.productId === currentProduct.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: currentProduct.id,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }

    // Save cart
    saveCart();
    
    // Show notification and redirect to checkout/cart
    showNotification(`Proceeding to checkout with ${quantity} ${currentProduct.name}`, 'info');
    
    // Redirect to cart page after a short delay
    setTimeout(() => {
        window.location.href = '../CartPage/cart-page.html';
    }, 1500);
}

// Update cart badge (if you have a cart icon with badge)
function updateCartBadge() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        // Calculate total items in cart
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
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

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add different colors for different types
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
        border-radius: 10px;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function loadProduct(productId) {
    const container = document.getElementById('product-container');
    
    if (!productId || !container) {
        if (container) {
            container.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 2rem; color: #e74c3c;">
                    <h3>Product not found</h3>
                    <p>Please select a product from the shop page.</p>
                    <a href="../ShopPage/shop-page.html" style="color: #667eea;">Return to Shop</a>
                </div>
            `;
        }
        return;
    }

    currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) {
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 2rem; color: #e74c3c;">
                <h3>Product not found</h3>
                <p>The requested product could not be found.</p>
                <a href="../ShopPage/shop-page.html" style="color: #667eea;">Return to Shop</a>
            </div>
        `;
        return;
    }

    const breadcrumb = document.getElementById('breadcrumb-product');
    if (breadcrumb) {
        breadcrumb.textContent = currentProduct.name;
    }

    container.innerHTML = `
        <div class="product-layout">
            <div class="image-section">
                <img src="${currentProduct.image}" alt="${currentProduct.name}" class="main-image">
                <div class="image-badge">NEW</div>
            </div>
            <div class="details-section">
                <div class="product-category">${currentProduct.category}</div>
                <h1 class="product-title">${currentProduct.name}</h1>
                <div class="product-price">${currentProduct.price}</div>
                
                <div class="product-meta">
                    <div class="meta-item">
                        <i class="fa-solid fa-truck"></i>
                        <span>Free Shipping</span>
                    </div>
                    <div class="meta-item">
                        <i class="fa-solid fa-shield-halved"></i>
                        <span>2 Year Warranty</span>
                    </div>
                    <div class="meta-item status-available">
                        <i class="fa-solid fa-check-circle"></i>
                        <span>In Stock</span>
                    </div>
                </div>
                
                <div class="rating">
                    <div class="stars">
                        ★★★★★
                    </div>
                    <span>5.0 (${Math.floor(Math.random() * 50) + 10} reviews)</span>
                </div>
                
                <p class="product-description">${currentProduct.description}</p>
                
                <div class="purchase-section">
                    <div class="quantity-selector">
                        <span class="quantity-label">Quantity:</span>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                            <input type="number" id="quantity" class="quantity-input" value="1" min="1" onchange="currentQuantity = parseInt(this.value) || 1">
                            <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="addToCart()">
                            <i class="fa-solid fa-cart-plus"></i>
                            Add to Cart
                        </button>
                        <button class="btn btn-secondary" onclick="buyNow()">
                            <i class="fa-solid fa-bolt"></i>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadRelatedProducts() {
    const relatedGrid = document.getElementById('related-grid');
    if (!relatedGrid || !currentProduct) return;
    
    // Get products from same category or random products, excluding current product
    const relatedProducts = products
        .filter(p => p.id !== currentProduct.id)
        .slice(0, 4); // Show max 4 related products

    relatedGrid.innerHTML = relatedProducts.map(product => `
        <div class="related-card" onclick="selectProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}">
            <div class="related-card-info">
                <h4>${product.name}</h4>
                <div class="price">${product.price}</div>
            </div>
        </div>
    `).join('');
}

// Function to select a new product and reload page
function selectProduct(productId) {
    setToStorage('selectedProduct', productId);
    window.location.reload();
}

// Profile management functions (same as before)
function updateProfileImage() {
    const currentUser = getFromStorage('currentUser');
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
    const currentUser = getFromStorage('currentUser');
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
    const currentUser = getFromStorage('currentUser');
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
    // Clear user data
    localStorage.removeItem('currentUser');
    
    // Clear user's cart
    const currentUser = getFromStorage('currentUser');
    if (currentUser) {
        const cartKey = `cart_of_${currentUser.name}`;
        localStorage.removeItem(cartKey);
    }
    
    // Reset cart
    cart = [];
    
    // Update UI
    updateProfileImage();
    updateProfileDropdown();
    updateCartBadge();
    
    showNotification('Successfully logged out', 'info');
    console.log('User logged out');
}

function toggleDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    // Initialize cart data
    initializeCart();
    
    // Load product and related products
    loadProduct(productId);
    loadRelatedProducts();
    
    // Update profile UI
    updateProfileImage();
    updateProfileDropdown();
    
    // Update cart badge
    updateCartBadge();
});

// Make functions available globally
window.changeQuantity = changeQuantity;
window.addToCart = addToCart;
window.buyNow = buyNow;
window.selectProduct = selectProduct;
window.goToProfile = goToProfile;
window.handleLogout = handleLogout;
window.updateProfileDropdown = updateProfileDropdown;
window.updateProfileImage = updateProfileImage;
window.toggleDropdown = toggleDropdown;
window.goToCartPage = goToCartPage;