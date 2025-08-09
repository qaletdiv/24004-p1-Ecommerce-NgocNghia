import { products } from '../Statics/mock-data.js';

// Initialize variables
let orderData = null;
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

// Get order data from URL parameters or localStorage
function getOrderData() {
    // First try to get from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get('orderNumber');
    
    if (orderNumber) {
        // Get from orders history
        const orders = getFromStorage('orders', []);
        const order = orders.find(o => o.orderNumber === orderNumber);
        if (order) {
            return order;
        }
    }
    
    // Fallback to latest order in localStorage
    const orders = getFromStorage('orders', []);
    if (orders.length > 0) {
        return orders[orders.length - 1]; // Get the latest order
    }
    
    return null;
}

// Navigation functions
function goToShop() {
    window.location.href = '../ShopPage/shop-page.html';
}

function goToLogin() {
    window.location.href = '../LoginPage/login-page.html';
}

function viewOrders() {
    // Redirect to orders page (to be created)
    showNotification('Redirecting to your orders...', 'info');
    // window.location.href = '../OrdersPage/orders-page.html';
}

function printOrder() {
    window.print();
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
        window.location.href = '../LoginPage/login-page.html';
        return;
    }
    window.location.href = '../ProfileInfo/profile-info.html';
}

function handleLogout() {
    // Clear user-specific data
    removeFromStorage('currentUser');

    // Clear user's cart and checkout data
    if (currentUser) {
        const cartKey = `cart_of_${currentUser.name}`;
        removeFromStorage(cartKey);
    }
    removeFromStorage('checkoutData');

    // Reset local variables
    currentUser = null;

    // Update UI
    updateProfileImage();
    updateProfileDropdown();

    showNotification('Successfully logged out', 'info');
    setTimeout(() => goToLogin(), 2000);
}

function toggleDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Get payment method display name
function getPaymentMethodName(method) {
    const methods = {
        'credit-card': 'Credit/Debit Card',
        'paypal': 'PayPal',
        'bank-transfer': 'Bank Transfer',
        'cod': 'Cash on Delivery'
    };
    return methods[method] || method;
}

// Format currency
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '₫';
}

// Load order details
function loadOrderDetails() {
    const orderDetailsContent = document.getElementById('order-details-content');
    const customerEmail = document.getElementById('customer-email');
    
    if (!orderData || !orderDetailsContent) {
        console.error('Order data or container not found');
        return;
    }

    // Format delivery date
    const deliveryDate = new Date(orderData.estimatedDelivery).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Format order date
    const orderDate = new Date(orderData.orderDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Build order details HTML
    orderDetailsContent.innerHTML = `
        <div class="order-info">
            <div class="info-row">
                <div class="info-label">
                    <i class="fa-solid fa-hashtag"></i>
                    Order Number:
                </div>
                <div class="info-value">
                    <span class="order-number">${orderData.orderNumber}</span>
                </div>
            </div>
            
            <div class="info-row">
                <div class="info-label">
                    <i class="fa-solid fa-calendar"></i>
                    Order Date:
                </div>
                <div class="info-value">${orderDate}</div>
            </div>
            
            <div class="info-row">
                <div class="info-label">
                    <i class="fa-solid fa-credit-card"></i>
                    Payment Method:
                </div>
                <div class="info-value">${getPaymentMethodName(orderData.payment.method)}</div>
            </div>
            
            <div class="info-row">
                <div class="info-label">
                    <i class="fa-solid fa-truck"></i>
                    Estimated Delivery:
                </div>
                <div class="info-value">${deliveryDate}</div>
            </div>
            
            <div class="info-row">
                <div class="info-label">
                    <i class="fa-solid fa-map-marker-alt"></i>
                    Delivery Address:
                </div>
                <div class="info-value">
                    <div class="delivery-address">
                        ${orderData.shipping.firstName} ${orderData.shipping.lastName}<br>
                        ${orderData.shipping.address}<br>
                        ${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.zipCode}<br>
                        ${orderData.shipping.country}
                    </div>
                </div>
            </div>
            
            <div class="info-row">
                <div class="info-label">
                    <i class="fa-solid fa-dollar-sign"></i>
                    Total Amount:
                </div>
                <div class="info-value">
                    <strong style="font-size: 1.2em; color: #667eea;">${formatCurrency(orderData.totals.total)}</strong>
                </div>
            </div>
        </div>
    `;

    // Update customer email
    if (customerEmail && orderData.shipping.email) {
        customerEmail.textContent = orderData.shipping.email;
    }
}

// Load order items
function loadOrderItems() {
    const orderItemsContent = document.getElementById('order-items-content');
    
    if (!orderData || !orderItemsContent) {
        console.error('Order data or items container not found');
        return;
    }

    // Build items HTML
    const itemsHTML = orderData.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return '';

        const itemTotal = parseFloat(product.price.replace(/[^\d]/g, '')) * item.quantity;

        return `
            <div class="order-item">
                <img src="${product.image}" alt="${product.name}" class="item-image">
                <div class="item-info">
                    <div class="item-name">${product.name}</div>
                    <div class="item-details">
                        <span>Quantity: ${item.quantity}</span>
                        <span> • </span>
                        <span>Unit Price: ${product.price}</span>
                    </div>
                </div>
                <div class="item-price">${formatCurrency(itemTotal)}</div>
            </div>
        `;
    }).join('');

    // Build order summary
    const orderSummaryHTML = `
        <div class="order-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>${formatCurrency(orderData.totals.subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (10%):</span>
                <span>${formatCurrency(orderData.totals.tax)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>${orderData.totals.shippingFree ? 'FREE' : formatCurrency(orderData.totals.shipping)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>${formatCurrency(orderData.totals.total)}</span>
            </div>
        </div>
    `;

    orderItemsContent.innerHTML = `
        <div class="items-list">
            ${itemsHTML}
        </div>
        ${orderSummaryHTML}
    `;
}

// Show notification
function showNotification(message, type = 'success') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

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
        max-width: 350px;
    `;

    // Add animation keyframes
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Initialize page
function initializePage() {
    console.log('Initializing order confirmation page');
    
    currentUser = getFromStorage('currentUser');
    orderData = getOrderData();

    // Check if user is logged in
    if (!currentUser) {
        showNotification('Please login to view order details', 'error');
        setTimeout(() => goToLogin(), 2000);
        return false;
    }

    // Check if order data exists
    if (!orderData) {
        showNotification('No order data found. Redirecting to shop...', 'warning');
        setTimeout(() => goToShop(), 2000);
        return false;
    }

    return true;
}

// Hide loading screen and show content
function showContent() {
    const loadingScreen = document.getElementById('loading-screen');
    
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        // Show success animation
        const successIcon = document.querySelector('.success-icon');
        if (successIcon) {
            successIcon.style.animation = 'successPulse 2s ease-in-out infinite alternate';
        }
    }, 1500); // Show loading for 1.5 seconds
}

// Handle click outside dropdown
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('profile-dropdown');
    const profileImg = document.querySelector('.profile-img');

    if (dropdown && profileImg && !dropdown.contains(event.target) && !profileImg.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Handle print styles
function addPrintStyles() {
    const printStyles = `
        @media print {
            body * {
                visibility: hidden;
            }
            
            .confirmation-container,
            .confirmation-container * {
                visibility: visible;
            }
            
            .confirmation-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            
            .action-buttons,
            .security-section,
            .email-notification {
                display: none !important;
            }
            
            .success-section {
                page-break-after: avoid;
            }
            
            .order-card,
            .order-items-card {
                page-break-inside: avoid;
                box-shadow: none;
                border: 1px solid #ddd;
            }
            
            .card-header {
                background: #f8f9fa !important;
                color: #333 !important;
            }
            
            body {
                background: white !important;
            }
            
            .success-section h1 {
                color: #333 !important;
                text-shadow: none !important;
            }
            
            .success-message {
                color: #666 !important;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = printStyles;
    document.head.appendChild(style);
}

// DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing order confirmation page');

    // Initialize page
    if (!initializePage()) {
        return;
    }

    // Update UI
    updateProfileImage();
    updateProfileDropdown();
    
    // Load order data
    loadOrderDetails();
    loadOrderItems();
    
    // Add print styles
    addPrintStyles();
    
    // Show content after loading
    showContent();

    console.log('Order confirmation page initialized successfully');
    console.log('Order data:', orderData);
});

// Export functions to global scope
window.toggleDropdown = toggleDropdown;
window.goToProfile = goToProfile;
window.handleLogout = handleLogout;
window.goToShop = goToShop;
window.viewOrders = viewOrders;
window.printOrder = printOrder;