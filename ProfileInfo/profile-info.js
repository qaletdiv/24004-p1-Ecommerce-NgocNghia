// Tab switching functionality
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        const tabContent = document.getElementById(tabId);
        if (tabContent) {
            tabContent.classList.add('active');
        }
    });
});

// Edit functionality for account tab
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('change-info-btn') || e.target.closest('.change-info-btn')) {
        e.preventDefault();
        const button = e.target.classList.contains('change-info-btn') ? e.target : e.target.closest('.change-info-btn');
        const inputs = document.querySelectorAll('#account .form-input, #account .form-textarea');
        const saveBtn = document.querySelector('#account .save-btn');
        
        if (button.textContent.includes('Change')) {
            inputs.forEach(input => {
                if (input.type !== 'email') { // Keep email readonly
                    input.removeAttribute('readonly');
                    input.style.background = 'white';
                }
            });
            saveBtn.style.display = 'inline-block';
            button.innerHTML = '<i class="fa-solid fa-times"></i> Cancel';
        } else {
            inputs.forEach(input => {
                input.setAttribute('readonly', true);
                input.style.background = '#f8f9fa';
            });
            saveBtn.style.display = 'none';
            button.innerHTML = '<i class="fa-solid fa-edit"></i> Change Profile Information';
        }
    }
});

/// Save changes for account tab
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('save-btn') && e.target.closest('#account')) {
        e.preventDefault();
        const inputs = document.querySelectorAll('#account .form-input, #account .form-textarea');
        const changeBtn = document.querySelector('.change-info-btn');
        
        inputs.forEach(input => {
            input.setAttribute('readonly', true);
            input.style.background = '#f8f9fa';
        });
        e.target.style.display = 'none';
        changeBtn.innerHTML = '<i class="fa-solid fa-edit"></i> Change Profile Information';
        
        alert('Profile updated successfully!');
    }
});

/// Check Mode For Gender
function isEditMode() {
    const saveBtn = document.querySelector('#account .save-btn');
    return saveBtn && window.getComputedStyle(saveBtn).display !== 'none';
}

/// Gender selection
document.addEventListener('click', function(e) {

    /// Set as default can check whenever
    if (e.target.classList.contains('set-default-checkbox')) {
        e.target.classList.toggle('checked');
        return;
    }

    if (e.target.closest('.gender-option')) {
        if (!isEditMode()) {
            return;
        }

        const option = e.target.closest('.gender-option');
        const parent = option.parentElement;
        parent.querySelectorAll('.radio-input').forEach(radio => {
            radio.classList.remove('checked');
        });
        option.querySelector('.radio-input').classList.add('checked');
    }
});

// Toggle switch functionality
document.addEventListener('change', function(e) {
    if (e.target.matches('.toggle-switch input')) {
        console.log(`${e.target.parentElement.parentElement.querySelector('h4').textContent}: ${e.target.checked}`);
    }
});

// Profile image edit
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-icon')) {
        e.preventDefault();
    }
});

// Address modal functions
function openAddressModal() {
    document.getElementById('addressModal').style.display = 'block';
}

function closeAddressModal() {
    document.getElementById('addressModal').style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('addressModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Address actions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-small') && e.target.closest('.address-card')) {
        e.preventDefault();
        const action = e.target.textContent.trim();
    }
});

// Support actions
document.addEventListener('click', function(e) {
    if ((e.target.classList.contains('change-info-btn') || e.target.classList.contains('add-btn')) 
        && e.target.closest('#support')) {
        e.preventDefault();
        const action = e.target.textContent.trim();
        if (action === 'Call Now') {
            window.open('tel:+841234567890');
        } else {
            alert(`${action} - Feature coming soon!`);
        }
    }
});

// Form submissions
document.addEventListener('submit', function(e) {
    e.preventDefault();
    const formType = e.target.closest('.tab-content')?.id || 'form';
    alert(`${formType} form submitted successfully!`);

    if (e.target.querySelector('textarea')) {
        e.target.reset();
    }
    
    if (e.target.closest('.modal')) {
        closeAddressModal();
    }
    
    if (e.target.closest('#password-form')) {
        togglePasswordForm();
    }
});

// Save notification preferences
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('save-btn') && e.target.closest('#notifications')) {
        e.preventDefault();
        alert('Notification preferences saved successfully!');
    }
});

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

/// Profile navigation function
function goToProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../LoginPage/login-page.html';
        return;
    }
    window.location.href = '../ProfileInfo/profile-info.html';
}

/// Log out 
function handleLogout() {
    localStorage.removeItem('currentUser');
    updateProfileImage();
    updateProfileDropdown();
    console.log('User logged out');
    window.location.href = '../home.html';
}

// Helper functions for order history
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
}

function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '₫';
}

function getOrderStatusBadge(status) {
    const statusColors = {
        'pending': { color: '#f39c12', text: 'Pending', icon: 'clock' },
        'confirmed': { color: '#3498db', text: 'Confirmed', icon: 'check-circle' },
        'processing': { color: '#9b59b6', text: 'Processing', icon: 'cog' },
        'shipped': { color: '#e67e22', text: 'Shipped', icon: 'truck' },
        'delivered': { color: '#27ae60', text: 'Delivered', icon: 'check-double' },
        'cancelled': { color: '#e74c3c', text: 'Cancelled', icon: 'times-circle' },
        'refunded': { color: '#95a5a6', text: 'Refunded', icon: 'undo' }
    };
    
    const statusInfo = statusColors[status] || statusColors['pending'];
    
    return `
        <span class="order-status-badge" style="
            background: ${statusInfo.color}; 
            color: white; 
            padding: 4px 12px; 
            border-radius: 15px; 
            font-size: 0.8rem; 
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        ">
            <i class="fa-solid fa-${statusInfo.icon}"></i>
            ${statusInfo.text}
        </span>
    `;
}

function getUserOrders() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return [];
    
    const allOrders = getFromStorage('orders', []);
    // Filter orders for current user
    return allOrders.filter(order => 
        order.customerEmail === currentUser.email || 
        order.shipping.email === currentUser.email ||
        (order.userId && order.userId === currentUser.email)
    ).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
}

function generateOrdersHTML() {
    const userOrders = getUserOrders();
    
    if (userOrders.length === 0) {
        return `
            <div class="empty-state">
                <i class="fa-solid fa-box" style="font-size: 4rem; color: #ddd; margin-bottom: 1rem;"></i>
                <h3 style="color: #666; margin-bottom: 0.5rem;">No orders yet</h3>
                <p style="color: #999; margin-bottom: 2rem;">Your order history will appear here once you make a purchase</p>
                <a href="../ShopPage/shop-page.html" class="primary-btn" style="
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    transition: transform 0.3s ease;
                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <i class="fa-solid fa-shopping-bag"></i>
                    Start Shopping
                </a>
            </div>
        `;
    }

    return `
        <div class="orders-grid" style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${userOrders.map(order => {
                const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const deliveryDate = new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });

                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                
                return `
                    <div class="order-card" style="
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                        overflow: hidden;
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'" 
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
                        
                        <div class="order-header" style="
                            background: linear-gradient(45deg, #667eea, #764ba2);
                            color: white;
                            padding: 1.5rem 2rem;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            flex-wrap: wrap;
                            gap: 1rem;
                        ">
                            <div class="order-basic-info">
                                <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">
                                    Order #${order.orderNumber}
                                </div>
                                <div style="font-size: 0.9rem; opacity: 0.9;">
                                    Placed on ${orderDate}
                                </div>
                            </div>
                            <div class="order-status-info" style="text-align: right;">
                                ${getOrderStatusBadge(order.status || 'confirmed')}
                            </div>
                        </div>

                        <div class="order-body" style="padding: 2rem;">
                            <div class="order-summary" style="
                                display: grid;
                                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                                gap: 1.5rem;
                                margin-bottom: 2rem;
                            ">
                                <div class="summary-item">
                                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">
                                        <i class="fa-solid fa-box" style="color: #667eea; margin-right: 8px;"></i>
                                        Total Items
                                    </div>
                                    <div style="font-size: 1.2rem; font-weight: 600; color: #2c3e50;">
                                        ${totalItems} items
                                    </div>
                                </div>
                                
                                <div class="summary-item">
                                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">
                                        <i class="fa-solid fa-dollar-sign" style="color: #667eea; margin-right: 8px;"></i>
                                        Total Amount
                                    </div>
                                    <div style="font-size: 1.2rem; font-weight: 600; color: #27ae60;">
                                        ${formatCurrency(order.totals.total)}
                                    </div>
                                </div>

                                <div class="summary-item">
                                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">
                                        <i class="fa-solid fa-truck" style="color: #667eea; margin-right: 8px;"></i>
                                        Expected Delivery
                                    </div>
                                    <div style="font-size: 1rem; font-weight: 600; color: #2c3e50;">
                                        ${deliveryDate}
                                    </div>
                                </div>

                                <div class="summary-item">
                                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">
                                        <i class="fa-solid fa-credit-card" style="color: #667eea; margin-right: 8px;"></i>
                                        Payment Method
                                    </div>
                                    <div style="font-size: 1rem; font-weight: 600; color: #2c3e50;">
                                        ${order.payment.method === 'credit-card' ? 'Credit Card' : 
                                          order.payment.method === 'cod' ? 'Cash on Delivery' : 
                                          order.payment.method === 'paypal' ? 'PayPal' : 'Bank Transfer'}
                                    </div>
                                </div>
                            </div>

                            <div class="order-items-preview" style="margin-bottom: 1.5rem;">
                                <h4 style="color: #2c3e50; margin-bottom: 1rem; font-size: 1.1rem;">
                                    <i class="fa-solid fa-list" style="color: #667eea; margin-right: 8px;"></i>
                                    Order Items
                                </h4>
                                <div class="items-preview" style="
                                    display: flex;
                                    gap: 1rem;
                                    overflow-x: auto;
                                    padding-bottom: 0.5rem;
                                ">
                                    ${order.items.slice(0, 4).map(item => {
                                        // Get product details from localStorage products
                                        const products = getFromStorage('products', []);
                                        const product = products.find(p => p.id === item.productId);
                                        
                                        if (!product) return '';
                                        
                                        return `
                                            <div class="item-preview" style="
                                                min-width: 120px;
                                                text-align: center;
                                                background: rgba(102, 126, 234, 0.05);
                                                border-radius: 8px;
                                                padding: 1rem;
                                                position: relative;
                                            ">
                                                <img src="${product.image}" alt="${product.name}" style="
                                                    width: 60px;
                                                    height: 60px;
                                                    object-fit: cover;
                                                    border-radius: 6px;
                                                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                                                    margin-bottom: 0.5rem;
                                                ">
                                                <div style="
                                                    font-size: 0.8rem;
                                                    color: #2c3e50;
                                                    font-weight: 600;
                                                    margin-bottom: 0.25rem;
                                                    line-height: 1.2;
                                                    display: -webkit-box;
                                                    -webkit-line-clamp: 2;
                                                    -webkit-box-orient: vertical;
                                                    overflow: hidden;
                                                ">${product.name}</div>
                                                <div style="
                                                    font-size: 0.75rem;
                                                    color: #666;
                                                ">Qty: ${item.quantity}</div>
                                                ${item.quantity > 1 ? `
                                                    <div style="
                                                        position: absolute;
                                                        top: -5px;
                                                        right: -5px;
                                                        background: #e74c3c;
                                                        color: white;
                                                        width: 20px;
                                                        height: 20px;
                                                        border-radius: 50%;
                                                        display: flex;
                                                        align-items: center;
                                                        justify-content: center;
                                                        font-size: 0.7rem;
                                                        font-weight: bold;
                                                    ">${item.quantity}</div>
                                                ` : ''}
                                            </div>
                                        `;
                                    }).join('')}
                                    ${order.items.length > 4 ? `
                                        <div class="more-items" style="
                                            min-width: 120px;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            background: rgba(102, 126, 234, 0.1);
                                            border-radius: 8px;
                                            color: #667eea;
                                            font-weight: 600;
                                            font-size: 0.9rem;
                                        ">
                                            +${order.items.length - 4} more
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <div class="order-actions" style="
                                display: flex;
                                gap: 1rem;
                                flex-wrap: wrap;
                                justify-content: space-between;
                                align-items: center;
                                padding-top: 1.5rem;
                                border-top: 1px solid #f0f0f0;
                            ">
                                <div class="action-buttons" style="display: flex; gap: 1rem; flex-wrap: wrap;">
                                    <button onclick="viewOrderDetails('${order.orderNumber}')" class="btn-view-details" style="
                                        background: linear-gradient(45deg, #667eea, #764ba2);
                                        color: white;
                                        border: none;
                                        padding: 8px 16px;
                                        border-radius: 6px;
                                        font-size: 0.9rem;
                                        font-weight: 600;
                                        cursor: pointer;
                                        transition: all 0.3s ease;
                                        display: flex;
                                        align-items: center;
                                        gap: 6px;
                                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.4)'" 
                                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                        <i class="fa-solid fa-eye"></i>
                                        View Details
                                    </button>
                                    
                                    ${(order.status === 'pending' || order.status === 'confirmed') ? `
                                        <button onclick="cancelOrder('${order.orderNumber}')" class="btn-cancel" style="
                                            background: white;
                                            color: #e74c3c;
                                            border: 1px solid #e74c3c;
                                            padding: 8px 16px;
                                            border-radius: 6px;
                                            font-size: 0.9rem;
                                            font-weight: 600;
                                            cursor: pointer;
                                            transition: all 0.3s ease;
                                            display: flex;
                                            align-items: center;
                                            gap: 6px;
                                        " onmouseover="this.style.background='#e74c3c'; this.style.color='white'" 
                                           onmouseout="this.style.background='white'; this.style.color='#e74c3c'">
                                            <i class="fa-solid fa-times"></i>
                                            Cancel Order
                                        </button>
                                    ` : ''}
                                    
                                    ${order.status === 'delivered' ? `
                                        <button onclick="reorderItems('${order.orderNumber}')" class="btn-reorder" style="
                                            background: white;
                                            color: #27ae60;
                                            border: 1px solid #27ae60;
                                            padding: 8px 16px;
                                            border-radius: 6px;
                                            font-size: 0.9rem;
                                            font-weight: 600;
                                            cursor: pointer;
                                            transition: all 0.3s ease;
                                            display: flex;
                                            align-items: center;
                                            gap: 6px;
                                        " onmouseover="this.style.background='#27ae60'; this.style.color='white'" 
                                           onmouseout="this.style.background='white'; this.style.color='#27ae60'">
                                            <i class="fa-solid fa-repeat"></i>
                                            Reorder
                                        </button>
                                    ` : ''}
                                </div>
                                
                                <div class="shipping-address" style="
                                    font-size: 0.85rem;
                                    color: #666;
                                    text-align: right;
                                    max-width: 300px;
                                ">
                                    <div style="font-weight: 600; color: #2c3e50; margin-bottom: 2px;">
                                        <i class="fa-solid fa-map-marker-alt" style="color: #667eea; margin-right: 5px;"></i>
                                        Shipping to:
                                    </div>
                                    <div style="line-height: 1.4;">
                                        ${order.shipping.firstName} ${order.shipping.lastName}<br>
                                        ${order.shipping.address}, ${order.shipping.city}<br>
                                        ${order.shipping.state} ${order.shipping.zipCode}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Order action functions
function viewOrderDetails(orderNumber) {
    // Open order details in a modal or redirect to order details page
    window.open(`../OrderConfirm/order-confirm.html?orderNumber=${orderNumber}`, '_blank');
}

function cancelOrder(orderNumber) {
    if (confirm('Are you sure you want to cancel this order?')) {
        // Update order status to cancelled
        const orders = getFromStorage('orders', []);
        const orderIndex = orders.findIndex(order => order.orderNumber === orderNumber);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'cancelled';
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Refresh the orders display
            const ordersTab = document.getElementById('orders');
            if (ordersTab) {
                const contentHeader = ordersTab.querySelector('.content-header');
                const ordersContent = generateOrdersHTML();
                ordersTab.innerHTML = contentHeader.outerHTML + ordersContent;
            }
            
            alert('Order has been cancelled successfully.');
        }
    }
}

function reorderItems(orderNumber) {
    const orders = getFromStorage('orders', []);
    const order = orders.find(o => o.orderNumber === orderNumber);
    
    if (order) {
        // Add order items to cart
        const currentUser = getFromStorage('currentUser');
        const cartKey = currentUser ? `cart_of_${currentUser.name}` : 'cart_guest';
        let cart = getFromStorage(cartKey, []);
        
        order.items.forEach(item => {
            const existingItem = cart.find(cartItem => cartItem.productId === item.productId);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                cart.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    addedDate: new Date().toISOString()
                });
            }
        });
        
        localStorage.setItem(cartKey, JSON.stringify(cart));
        
        // Update cart badge
        if (window.updateCartBadge) {
            window.updateCartBadge();
        }
        
        alert('Items have been added to your cart!');
    }
}

// Load user profile information into the page
function updateProfileInformation() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const profileContainer = document.getElementById('profile-container');

    if (!currentUser || !profileContainer) {
        if (!currentUser) {
            window.location.href = '../LoginPage/login-page.html';
        }
        return;
    }

    profileContainer.innerHTML = `
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="profile-header">
                <h1 class="profile-title">Profile</h1>
                <div class="user-info">
                    <div class="user-avatar">
                        <img src="${currentUser.profileImg || 'https://www.svgrepo.com/show/343494/profile-user-account.svg'}" alt="${currentUser.name}" class="main-image" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover;">
                    </div>
                    <div class="user-details">
                        <h3>Hello</h3>
                        <div class="user-name">${currentUser.name}</div>
                    </div>
                </div>
            </div>
            
            <ul class="nav-menu">
                <li class="nav-item">
                    <a href="#" class="nav-link active" data-tab="account">
                        <i class="fa-solid fa-user"></i>
                        My Account
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" data-tab="addresses">
                        <i class="fa-solid fa-map-marker-alt"></i>
                        Addresses
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" data-tab="orders">
                        <i class="fa-solid fa-box"></i>
                        My Orders
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" data-tab="returns">
                        <i class="fa-solid fa-undo"></i>
                        Returns & Cancel
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" data-tab="reviews">
                        <i class="fa-solid fa-star"></i>
                        My Reviews
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" data-tab="wishlist">
                        <i class="fa-solid fa-heart"></i>
                        My Wishlist
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" data-tab="payment">
                        <i class="fa-solid fa-credit-card"></i>
                        Payment Methods
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" data-tab="notifications">
                        <i class="fa-solid fa-bell"></i>
                        Notifications
                    </a>
                </li>
            </ul>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Account Tab -->
            <div id="account" class="tab-content active">
                <div class="content-header">
                    <h2 class="content-title">Personal Information</h2>
                    <button class="change-info-btn">
                        <i class="fa-solid fa-edit"></i>
                        Change Profile Information
                    </button>
                </div>

                <div class="profile-content">
                    <div class="profile-image-section">
                        <div class="profile-image">
                            <img src="${currentUser.profileImg || 'https://www.svgrepo.com/show/343494/profile-user-account.svg'}" alt="${currentUser.name}" class="main-image" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover;">
                            <div class="edit-icon">
                                <i class="fa-solid fa-edit"></i>
                            </div>
                        </div>
                    </div>

                    <div class="profile-info">
                        <form>
                            <div class="form-group">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-input" value="${currentUser.fullName || currentUser.name}" readonly>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Date Of Birth</label>
                                <div class="date-input">
                                    <input type="text" class="form-input" value="${currentUser.DOB || 'Not specified'}" readonly>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Gender</label>
                                <div class="gender-options">
                                    <div class="gender-option">
                                        <div class="radio-input ${currentUser.gender === 'Male' ? 'checked' : ''}"></div>
                                        <span class="gender-label">Male</span>
                                    </div>
                                    <div class="gender-option">
                                        <div class="radio-input ${currentUser.gender === 'Female' ? 'checked' : ''}"></div>
                                        <span class="gender-label">Female</span>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Phone Number</label>
                                <div class="phone-input-group">
                                    <div class="country-code">
                                        <span class="flag-icon"></span>
                                        <span>+84</span>
                                    </div>
                                    <input type="tel" class="form-input phone-number" value="${currentUser.phoneNumber || 'Not specified'}" readonly>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-input" value="${currentUser.email}" readonly>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Bio</label>
                                <textarea class="form-textarea" placeholder="Tell us about yourself..." readonly>Figure collector and anime enthusiast. Love collecting rare and limited edition figures!</textarea>
                            </div>

                            <button type="button" class="save-btn" style="display: none;">Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Addresses Tab -->
            <div id="addresses" class="tab-content">
                <div class="content-header">
                    <h2 class="content-title">My Addresses</h2>
                    <button class="add-btn" onclick="openAddressModal()">
                        <i class="fa-solid fa-plus"></i>
                        Add New Address
                    </button>
                </div>

                <div class="address-grid">
                    <div class="address-card default">
                        <div class="address-type">
                            <i class="fa-solid fa-home"></i>
                            Home
                            <span class="default-badge">Default</span>
                        </div>
                        <div class="address-details">
                            ${currentUser.name}<br>
                            ${currentUser.home || 'No address specified'}
                        </div>
                        <div class="address-actions">
                            <button class="btn-small btn-edit">Edit</button>
                            <button class="btn-small btn-delete">Delete</button>
                        </div>
                    </div>

                    <div class="address-card">
                        <div class="address-type">
                            <i class="fa-solid fa-building"></i>
                            Office
                        </div>
                        <div class="address-details">
                            ${currentUser.name}<br>
                            ${currentUser.office || 'No office address specified'}
                        </div>
                        <div class="address-actions">
                            <button class="btn-small btn-set-default">Set Default</button>
                            <button class="btn-small btn-edit">Edit</button>
                            <button class="btn-small btn-delete">Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Orders Tab -->
            <div id="orders" class="tab-content">
                <div class="content-header">
                    <h2 class="content-title">My Orders</h2>
                </div>
                ${generateOrdersHTML()}
            </div>

            <!-- Returns Tab -->
            <div id="returns" class="tab-content">
                <div class="content-header">
                    <h2 class="content-title">Returns & Cancellations</h2>
                </div>
                <div class="empty-state">
                    <i class="fa-solid fa-undo"></i>
                    <h3>No returns or cancellations</h3>
                    <p>Your return requests will appear here</p>
                </div>
            </div>

            <!-- Reviews Tab -->
            <div id="reviews" class="tab-content">
                <div class="content-header">
                    <h2 class="content-title">My Reviews</h2>
                </div>
                <div class="empty-state">
                    <i class="fa-solid fa-star"></i>
                    <h3>No reviews yet</h3>
                    <p>Your product reviews will appear here</p>
                </div>
            </div>

            <!-- Wishlist Tab -->
            <div id="wishlist" class="tab-content">
                <div class="content-header">
                    <h2 class="content-title">My Wishlist</h2>
                </div>
                <div class="empty-state">
                    <i class="fa-solid fa-heart"></i>
                    <h3>Your wishlist is empty</h3>
                    <p>Save figures you love for later</p>
                </div>
            </div>

            <!-- Payment Tab -->
            <div id="payment" class="tab-content">
                <div class="content-header">
                    <h2 class="content-title">Payment Methods</h2>
                    <button class="add-btn">
                        <i class="fa-solid fa-plus"></i>
                        Add Payment Method
                    </button>
                </div>
                <div class="empty-state">
                    <i class="fa-solid fa-credit-card"></i>
                    <h3>No payment methods</h3>
                    <p>Add your payment methods for faster checkout</p>
                </div>
            </div>

            <!-- Notifications Tab -->
            <div id="notifications" class="tab-content">
                <div class="content-header">
                    <h2 class="content-title">Notification Preferences</h2>
                </div>

                <div style="padding: 20px 0;">
                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div>
                                <h4 style="color: #333; margin-bottom: 5px;">Email Notifications</h4>
                                <p style="color: #666; font-size: 14px;">Get notified about orders, promotions, and updates</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div>
                                <h4 style="color: #333; margin-bottom: 5px;">SMS Notifications</h4>
                                <p style="color: #666; font-size: 14px;">Receive text messages for order updates</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div>
                                <h4 style="color: #333; margin-bottom: 5px;">Push Notifications</h4>
                                <p style="color: #666; font-size: 14px;">Get browser notifications for important updates</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div>
                                <h4 style="color: #333; margin-bottom: 5px;">Marketing Communications</h4>
                                <p style="color: #666; font-size: 14px;">Receive promotional offers and new product announcements</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div>
                                <h4 style="color: #333; margin-bottom: 5px;">Order Updates</h4>
                                <p style="color: #666; font-size: 14px;">Get notified when your order status changes</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div>
                                <h4 style="color: #333; margin-bottom: 5px;">Wishlist Alerts</h4>
                                <p style="color: #666; font-size: 14px;">Get notified when wishlist items go on sale</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <button type="button" class="save-btn">Save Preferences</button>
                </div>
            </div>
        </main>
    `;
    initializeTabSwitching();
}

function initializeTabSwitching() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
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

// Make functions available globally
window.updateCartBadge = updateCartBadge;
window.refreshCartBadge = refreshCartBadge;
window.triggerCartUpdate = triggerCartUpdate;
window.getCartFromStorage = getCartFromStorage;
window.toggleDropdown = toggleDropdown;
window.updateProfileDropdown = updateProfileDropdown;
window.updateProfileImage = updateProfileImage;
window.goToProfile = goToProfile;
window.handleLogout = handleLogout;
window.openAddressModal = openAddressModal;
window.closeAddressModal = closeAddressModal;
window.viewOrderDetails = viewOrderDetails;
window.cancelOrder = cancelOrder;
window.reorderItems = reorderItems;

document.addEventListener('DOMContentLoaded', () => {
    updateProfileImage();
    updateProfileDropdown();
    updateProfileInformation();
});

// Address Modal HTML (add to the end of the profile container)
const addressModalHTML = `
    <!-- Address Modal -->
    <div id="addressModal" class="modal">
        <div class="modal-content">
            <span class="modal-close" onclick="closeAddressModal()">&times;</span>
            <h2 class="modal-title">Add New Address</h2>
            <form>
                <div class="form-group">
                    <label class="form-label">Address Type</label>
                    <select class="form-select">
                        <option>Home</option>
                        <option>Office</option>
                        <option>Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-input" placeholder="Enter full name">
                </div>
                <div class="form-group">
                    <label class="form-label">Address Line 1</label>
                    <input type="text" class="form-input" placeholder="Street address">
                </div>
                <div class="form-group">
                    <label class="form-label">Address Line 2 (Optional)</label>
                    <input type="text" class="form-input" placeholder="Apartment, suite, etc.">
                </div>
                <div class="form-group">
                    <label class="form-label">City</label>
                    <input type="text" class="form-input" placeholder="City">
                </div>
                <div class="form-group">
                    <label class="form-label">Postal Code</label>
                    <input type="text" class="form-input" placeholder="Postal code">
                </div>
                <div class="form-group">
                    <label class="form-label">Phone Number</label>
                    <input type="tel" class="form-input" placeholder="Phone number">
                </div>
                <div class="form-group">
                    <div class="gender-option">
                        <div class="checkbox-input set-default-checkbox"></div>
                        <span class="gender-label">Set as default address</span>
                    </div>
                </div>
                <button type="submit" class="save-btn">Save Address</button>
                <button type="button" class="delete-btn" onclick="closeAddressModal()">Cancel</button>
            </form>
        </div>
    </div>
`;

/// cart page
function goToCartPage() {
    window.location.href = '../CartPage/cart-page.html';
}

// Add modal to the body when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('addressModal')) {
        document.body.insertAdjacentHTML('beforeend', addressModalHTML);
    }
});