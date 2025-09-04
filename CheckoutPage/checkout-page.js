import { products } from '../Statics/mock-data.js';

// Initialize variables
let checkoutData = null;
let currentUser = null;
let currentStep = 2;

// Helper functions for localStorage management (same as cart-page.js)
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

// Navigation functions
function goToCart() {
    window.location.href = '../CartPage/cart-page.html';
}

function goToShop() {
    window.location.href = '../ShopPage/shop-page.html';
}

function goToLogin() {
    showNotification('Redirecting to login page...', 'info');
    window.location.href = '../LoginPage/login-page.html';
}

function viewOrders() {
    // Redirect to orders page (to be created)
    showNotification('Redirecting to your orders...', 'info');
    // window.location.href = '../OrdersPage/orders-page.html';
}

// Initialize checkout data
function initializeCheckout() {
    currentUser = getFromStorage('currentUser');
    checkoutData = getFromStorage('checkoutData');

    if (!currentUser) {
        showNotification('Please login to proceed with checkout', 'error');
        setTimeout(() => goToLogin(), 2000);
        return false;
    }

    if (!checkoutData || !checkoutData.cart || checkoutData.cart.length === 0) {
        showNotification('No items in cart. Redirecting to shop...', 'warning');
        setTimeout(() => goToShop(), 2000);
        return false;
    }

    return true;
}

// Update progress bar
function updateProgress(step) {
    currentStep = step;
    const steps = document.querySelectorAll('.step');
    const progressFill = document.querySelector('.progress-fill');

    steps.forEach((stepEl, index) => {
        if (index < step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });

    const progressPercent = ((step - 1) / (steps.length - 1)) * 100;
    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
    }
}

// Load order summary
function loadOrderSummary() {
    const summaryItems = document.getElementById('summary-items');
    const summaryTotals = document.getElementById('summary-totals');

    if (!summaryItems || !summaryTotals || !checkoutData) return;

    // Load items
    const itemsHTML = checkoutData.cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return '';

        return `
            <div class="summary-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="summary-item-info">
                    <h4>${product.name}</h4>
                    <div class="quantity">Qty: ${item.quantity}</div>
                </div>
                <div class="summary-item-price">${product.price}</div>
            </div>
        `;
    }).join('');

    summaryItems.innerHTML = itemsHTML;

    // Load totals
    const totals = checkoutData.totals;
    summaryTotals.innerHTML = `
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>${totals.subtotal}₫</span>
        </div>
        <div class="summary-row">
            <span>Tax (10%):</span>
            <span>${totals.tax}₫</span>
        </div>
        <div class="summary-row">
            <span>Shipping:</span>
            <span>${totals.shippingFree ? 'FREE' : totals.shipping + '₫'}</span>
        </div>
        <div class="summary-row total">
            <span>Total:</span>
            <span>${totals.total}₫</span>
        </div>
    `;
}

// Form validation
function validateForm() {
    const form = document.getElementById('checkout-form');
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        const errorMessage = field.parentElement.querySelector('.error-message');
        
        if (!field.value.trim()) {
            field.classList.add('error');
            if (errorMessage) {
                errorMessage.textContent = 'This field is required';
            }
            isValid = false;
        } else {
            field.classList.remove('error');
            if (errorMessage) {
                errorMessage.textContent = '';
            }
        }
    });

    // Email validation
    const emailField = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField.value && !emailRegex.test(emailField.value)) {
        emailField.classList.add('error');
        const errorMessage = emailField.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = 'Please enter a valid email address';
        }
        isValid = false;
    }

    // Phone validation
    const phoneField = document.getElementById('phone');
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (phoneField.value && !phoneRegex.test(phoneField.value.replace(/\s/g, ''))) {
        phoneField.classList.add('error');
        const errorMessage = phoneField.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = 'Please enter a valid phone number';
        }
        isValid = false;
    }

    // Payment method validation
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentMethod) {
        showNotification('Please select a payment method', 'error');
        isValid = false;
    } else if (paymentMethod.value === 'credit-card') {
        isValid = validateCreditCard() && isValid;
    }

    return isValid;
}

// Credit card validation
function validateCreditCard() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    const cardName = document.getElementById('cardName');
    let isValid = true;

    // Card number validation (simple Luhn algorithm)
    const cardNumberValue = cardNumber.value.replace(/\s/g, '');
    if (cardNumberValue && !isValidCardNumber(cardNumberValue)) {
        cardNumber.classList.add('error');
        const errorMessage = cardNumber.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = 'Please enter a valid card number';
        }
        isValid = false;
    } else {
        cardNumber.classList.remove('error');
        const errorMessage = cardNumber.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    }

    // Expiry date validation
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (expiryDate.value && !expiryRegex.test(expiryDate.value)) {
        expiryDate.classList.add('error');
        const errorMessage = expiryDate.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = 'Please enter a valid expiry date (MM/YY)';
        }
        isValid = false;
    } else if (expiryDate.value && isExpiredCard(expiryDate.value)) {
        expiryDate.classList.add('error');
        const errorMessage = expiryDate.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = 'Card has expired';
        }
        isValid = false;
    } else {
        expiryDate.classList.remove('error');
        const errorMessage = expiryDate.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    }

    // CVV validation
    const cvvRegex = /^\d{3,4}$/;
    if (cvv.value && !cvvRegex.test(cvv.value)) {
        cvv.classList.add('error');
        const errorMessage = cvv.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = 'Please enter a valid CVV';
        }
        isValid = false;
    } else {
        cvv.classList.remove('error');
        const errorMessage = cvv.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    }

    // Card name validation
    if (!cardName.value.trim()) {
        cardName.classList.add('error');
        const errorMessage = cardName.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = 'Please enter the name on the card';
        }
        isValid = false;
    } else {
        cardName.classList.remove('error');
        const errorMessage = cardName.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    }

    return isValid;
}

// Luhn algorithm for card validation
function isValidCardNumber(cardNumber) {
    if (!/^\d+$/.test(cardNumber) || cardNumber.length < 13 || cardNumber.length > 19) {
        return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

// Check if card is expired
function isExpiredCard(expiryDate) {
    const [month, year] = expiryDate.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month));
    const now = new Date();
    return expiry < now;
}

// Format credit card input
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
    input.value = formattedValue.substr(0, 19); // Max 16 digits + 3 spaces
}

function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

// Handle payment method change
function handlePaymentMethodChange() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const paymentForms = document.querySelectorAll('.payment-form');

    paymentMethods.forEach(method => {
        method.addEventListener('change', () => {
            paymentForms.forEach(form => {
                form.style.display = 'none';
                form.classList.remove('active');
            });

            const selectedForm = document.getElementById(`${method.value}-form`);
            if (selectedForm) {
                selectedForm.style.display = 'block';
                selectedForm.classList.add('active');
            }
        });
    });
}

/// Place order
function placeOrder() {
    if (!validateForm()) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }

    const placeOrderBtn = document.getElementById('place-order-btn');
    placeOrderBtn.classList.add('loading');
    placeOrderBtn.disabled = true;

    // Simulate order processing
    setTimeout(() => {
        const orderData = collectOrderData();
        const orderNumber = generateOrderNumber();

        // Save order to localStorage
        const orders = getFromStorage('orders', []);
        const newOrder = {
            orderNumber,
            ...orderData,
            status: 'confirmed',
            orderDate: new Date().toISOString(),
            estimatedDelivery: getEstimatedDelivery()
        };
        orders.push(newOrder);
        setToStorage('orders', orders);

        // Clear cart and checkout data
        const cartKey = `cart_of_${currentUser.name}`;
        removeFromStorage(cartKey);
        removeFromStorage('checkoutData');

        // Update progress
        updateProgress(4);

        placeOrderBtn.classList.remove('loading');
        placeOrderBtn.disabled = false;

        showNotification('Order placed successfully! Redirecting...', 'success');

        // Redirect to order confirmation page with order number
        setTimeout(() => {
            window.location.href = `../OrderConfirm/order-confirm.html?orderNumber=${orderNumber}`;
        }, 1500);

    }, 2000);
}

// Collect order data from form
function collectOrderData() {
    const form = document.getElementById('checkout-form');
    const formData = new FormData(form);
    const orderData = {
        customer: currentUser,
        items: checkoutData.cart,
        totals: checkoutData.totals,
        shipping: {},
        payment: {},
        instructions: formData.get('instructions') || ''
    };

    // Collect shipping information
    ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'].forEach(field => {
        orderData.shipping[field] = formData.get(field);
    });

    // Collect payment information
    const paymentMethod = formData.get('paymentMethod');
    orderData.payment.method = paymentMethod;

    if (paymentMethod === 'credit-card') {
        orderData.payment.cardLast4 = formData.get('cardNumber').replace(/\s/g, '').slice(-4);
        orderData.payment.cardName = formData.get('cardName');
    }

    return orderData;
}

// Generate order number
function generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `JN${timestamp.slice(-6)}${random}`;
}

// Get estimated delivery date
function getEstimatedDelivery() {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 days from now
    return deliveryDate.toISOString();
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

// Close modal
function closeModal() {
    const modal = document.getElementById('order-modal');
    modal.classList.remove('show');
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

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Profile management functions (same as cart-page.js)
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

function goToProfile() {
    currentUser = getFromStorage('currentUser');
    if (!currentUser) {
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

    const currentPath = window.location.pathname;
    if (currentPath.includes('/ProfileInfo/')) {
        window.location.reload();
    } else if (currentPath.includes('index.html') || currentPath === '/') {
        window.location.href = './ProfileInfo/profile-info.html';
    } else {
        window.location.href = '../ProfileInfo/profile-info.html';
    }
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
    checkoutData = null;

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

// Pre-fill form with user data
function prefillForm() {
    if (!currentUser) return;

    const firstNameField = document.getElementById('firstName');
    const lastNameField = document.getElementById('lastName');
    const emailField = document.getElementById('email');

    // Split user name if available
    if (currentUser.name && firstNameField && lastNameField) {
        const nameParts = currentUser.name.split(' ');
        firstNameField.value = nameParts[0] || '';
        lastNameField.value = nameParts.slice(1).join(' ') || '';
    }

    // Set email if available
    if (currentUser.email && emailField) {
        emailField.value = currentUser.email;
    }
}

// Add input formatting
function addInputFormatting() {
    const cardNumberField = document.getElementById('cardNumber');
    const expiryDateField = document.getElementById('expiryDate');
    const cvvField = document.getElementById('cvv');

    if (cardNumberField) {
        cardNumberField.addEventListener('input', (e) => formatCardNumber(e.target));
    }

    if (expiryDateField) {
        expiryDateField.addEventListener('input', (e) => formatExpiryDate(e.target));
    }

    if (cvvField) {
        cvvField.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// Add real-time validation
function addRealTimeValidation() {
    const form = document.getElementById('checkout-form');
    const inputs = form.querySelectorAll('input, select');

    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            const errorMessage = input.parentElement.querySelector('.error-message');
            
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'This field is required';
                }
            } else {
                input.classList.remove('error');
                if (errorMessage) {
                    errorMessage.textContent = '';
                }
            }
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error') && input.value.trim()) {
                input.classList.remove('error');
                const errorMessage = input.parentElement.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.textContent = '';
                }
            }
        });
    });
}

// Click outside to close modal and dropdown
document.addEventListener('click', function (event) {
    // Close dropdown
    const dropdown = document.getElementById('profile-dropdown');
    const profileImg = document.querySelector('.profile-img');

    if (dropdown && profileImg && !dropdown.contains(event.target) && !profileImg.contains(event.target)) {
        dropdown.classList.remove('show');
    }

    // Close modal
    const modal = document.getElementById('order-modal');
    if (modal && event.target === modal) {
        closeModal();
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing checkout page');

    // Initialize checkout
    if (!initializeCheckout()) {
        return;
    }

    // Update UI
    updateProfileImage();
    updateProfileDropdown();
    updateProgress(currentStep);
    loadOrderSummary();
    prefillForm();

    // Set up form interactions
    handlePaymentMethodChange();
    addInputFormatting();
    addRealTimeValidation();

    // Set up event listeners
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            transform: translateY(-1px) !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
        }
        
        .payment-option label:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
        }
        
        .place-order-btn:hover:not(:disabled) {
            transform: translateY(-3px) !important;
            box-shadow: 0 10px 30px rgba(39, 174, 96, 0.6) !important;
        }
        
        .back-to-cart-btn:hover {
            transform: translateY(-2px) !important;
        }
        
        .summary-item {
            transition: all 0.3s ease;
        }
        
        .summary-item:hover {
            transform: translateX(5px);
            background: rgba(102, 126, 234, 0.02);
        }
        
        .loading {
            position: relative;
            pointer-events: none;
            opacity: 0.7;
        }
        
        .loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border: 2px solid #ffffff;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    console.log('Checkout page initialized successfully');
});

// Export functions to global scope
window.toggleDropdown = toggleDropdown;
window.goToProfile = goToProfile;
window.handleLogout = handleLogout;
window.goToCart = goToCart;
window.goToShop = goToShop;
window.viewOrders = viewOrders;
window.closeModal = closeModal;
window.placeOrder = placeOrder;