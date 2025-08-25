// shop-page.js - Updated with filter functionality using localStorage

// Filter state management
let currentFilters = {
    category: 'all',
    priceRange: 'all',
    searchTerm: ''
};

// Pagination state
let currentPage = 1;
const productsPerPage = 6;

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

// Load filters from localStorage
function loadFiltersFromStorage() {
    const savedFilters = localStorage.getItem('shopFilters');
    if (savedFilters) {
        try {
            currentFilters = { ...currentFilters, ...JSON.parse(savedFilters) };
        } catch (error) {
            console.error('Error loading filters from storage:', error);
        }
    }
    
    // Load saved page
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
        currentPage = parseInt(savedPage) || 1;
    }
}

// Save pagination state
function savePaginationToStorage() {
    try {
        localStorage.setItem('currentPage', currentPage.toString());
    } catch (error) {
        console.error('Error saving page to storage:', error);
    }
}

// Save filters to localStorage
function saveFiltersToStorage() {
    try {
        localStorage.setItem('shopFilters', JSON.stringify(currentFilters));
    } catch (error) {
        console.error('Error saving filters to storage:', error);
    }
}

// Get products from localStorage
function getProductsFromStorage() {
    try {
        const storedProducts = localStorage.getItem('products');
        return storedProducts ? JSON.parse(storedProducts) : [];
    } catch (error) {
        console.error('Error loading products from storage:', error);
        return [];
    }
}

// Filter products based on current filters
function filterProducts() {
    const allProducts = getProductsFromStorage();
    const filterCategory = currentFilters.category.toLowerCase();
    return allProducts.filter(product => {
        if (currentFilters.category !== 'all') {
            const productCategory = product.category?.toLowerCase() || '';
            const filterCategory = currentFilters.category.toLowerCase();
            if (!productCategory.includes(filterCategory)) {
                return false;
            }
        }

        // Price range filter
        if (currentFilters.priceRange !== 'all') {
            const priceValue = parseFloat(product.price?.replace(/[^\d]/g, '')) || 0;
            
            switch (currentFilters.priceRange) {
                case 'under-3m':
                    if (priceValue >= 3000000) return false;
                    break;
                case '3m-6m':
                    if (priceValue < 3000000 || priceValue >= 6000000) return false;
                    break;
                case '6m-10m':
                    if (priceValue < 6000000 || priceValue >= 10000000) return false;
                    break;
                case 'over-10m':
                    if (priceValue < 10000000) return false;
                    break;
            }
        }

        // Search term filter
        if (currentFilters.searchTerm) {
            const searchLower = currentFilters.searchTerm.toLowerCase();
            const productName = product.name?.toLowerCase() || '';
            const productDescription = product.description?.toLowerCase() || '';
            
            if (!productName.includes(searchLower) && !productDescription.includes(searchLower)) {
                return false;
            }
        }

        return true;
    });
}

// Render filtered products
function renderProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    const filteredProducts = filterProducts();
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h3 style="color: #666; font-size: 1.5rem; margin-bottom: 1rem;">No products found</h3>
                <p style="color: #999;">Try adjusting your filters or search terms.</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}" style="cursor: pointer;">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price}</p>
                <button class="add-to-cart-btn" onclick="addToCart(event, ${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');

    // Re-bind click events for product cards
    bindProductCardEvents();
}

// Add to cart functionality
function addToCart(event, productId) {
    event.stopPropagation(); // Prevent card click when button is clicked
    
    const allProducts = getProductsFromStorage();
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found');
        return;
    }

    // Get current user and cart
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cartKey = currentUser ? `cart_of_${currentUser.name}` : 'cart_guest';
    
    let cart = [];
    try {
        const storedCart = localStorage.getItem(cartKey);
        cart = storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
    }

    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Save updated cart
    try {
        localStorage.setItem(cartKey, JSON.stringify(cart));
        
        // Update button appearance
        const button = event.target;
        const originalText = button.textContent;
        const originalBackground = button.style.background;
        
        button.style.background = 'linear-gradient(45deg, #27ae60, #20bf6b)';
        button.textContent = 'Added!';
        
        setTimeout(() => {
            button.style.background = originalBackground || 'linear-gradient(45deg, #667eea, #764ba2)';
            button.textContent = originalText;
        }, 2000);

        // Update cart badge
        updateCartBadge();
        triggerCartUpdate();
        
    } catch (error) {
        console.error('Error saving to cart:', error);
    }
}

// Bind events to product cards
function bindProductCardEvents() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(event) {
            // Don't navigate if button was clicked
            if (event.target.classList.contains('add-to-cart-btn')) {
                return;
            }
            
            const productId = this.getAttribute('data-product-id');
            localStorage.setItem('selectedProduct', productId);
            window.location.href = `../ProductsPage/products-page.html`;
        });
    });
}

// Update filter UI with current values
function updateFilterUI() {
    const categorySelect = document.getElementById('category');
    const priceSelect = document.getElementById('price');
    const searchInput = document.querySelector('.search-input');

    if (categorySelect) categorySelect.value = currentFilters.category;
    if (priceSelect) priceSelect.value = currentFilters.priceRange;
    if (searchInput) searchInput.value = currentFilters.searchTerm;
}

// Handle search functionality
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        currentFilters.searchTerm = searchInput.value.trim();
        currentPage = 1; // Reset to first page when searching
        saveFiltersToStorage();
        savePaginationToStorage();
        renderProducts();
    }
}

// Clear all filters
function clearFilters() {
    currentFilters = {
        category: 'all',
        priceRange: 'all',
        searchTerm: ''
    };
    currentPage = 1; // Reset to first page
    saveFiltersToStorage();
    savePaginationToStorage();
    updateFilterUI();
    renderProducts();
}

// Initialize filters when DOM is loaded
function initializeFilters() {
    loadFiltersFromStorage();
    
    /// Category Filter
    document.getElementById('category').addEventListener('change', function () {
        currentFilters.category = this.value;
        saveFiltersToStorage();
        renderProducts();
        console.log('Category filter:', this.value);
    });

    /// Price Filter
    document.getElementById('price').addEventListener('change', function () {
        currentFilters.priceRange = this.value;
        saveFiltersToStorage();
        renderProducts();
        console.log('Price filter:', this.value);
    });

    // Search functionality
    document.querySelector('.search-btn').addEventListener('click', handleSearch);
    
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });

        // Optional: Real-time search (uncomment if desired)
        // searchInput.addEventListener('input', function() {
        //     currentFilters.searchTerm = this.value.trim();
        //     saveFiltersToStorage();
        //     renderProducts();
        // });
    }

    // Initial render
    updateFilterUI();
    renderProducts();
}

// Pages functionality - Remove old static pagination
// document.querySelectorAll('.pagination button').forEach(button => {
//     button.addEventListener('click', function () {
//         document.querySelector('.pagination button.active')?.classList.remove('active');
//         this.classList.add('active');
//     });
// });

/// See the product details 
document.querySelectorAll('.product-card').forEach(card => {
    card.style.cursor = 'pointer';

    card.addEventListener('click', function () {
        const productId = this.getAttribute('data-product-id');
        localStorage.setItem('selectedProduct', productId);
        window.location.href = `../ProductsPage/products-page.html`;
    });
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

/// Profile Info 
function goToProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Get current page path to determine correct relative path
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

    // Navigate to profile page based on current location
    const currentPath = window.location.pathname;
    if (currentPath.includes('/ProfileInfo/')) {
        window.location.reload();
    } else if (currentPath.includes('home.html') || currentPath === '/') {
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

// Get products from localStorage
function getProductsFromStorage() {
    return getFromStorage('products', []);
}

// Filter products based on current filters
function filterProducts() {
    const allProducts = getProductsFromStorage();
    
    return allProducts.filter(product => {
        // Category filter
        if (currentFilters.category !== 'all') {
            const productCategory = product.category?.toLowerCase() || '';
            const filterCategory = currentFilters.category.toLowerCase();
            if (!productCategory.includes(filterCategory)) {
                return false;
            }
        }

        // Price range filter
        if (currentFilters.priceRange !== 'all') {
            const priceValue = parseFloat(product.price?.replace(/[^\d]/g, '')) || 0;
            
            switch (currentFilters.priceRange) {
                case 'under-3m':
                    if (priceValue >= 3000000) return false;
                    break;
                case '3m-6m':
                    if (priceValue < 3000000 || priceValue >= 6000000) return false;
                    break;
                case '6m-10m':
                    if (priceValue < 6000000 || priceValue >= 10000000) return false;
                    break;
                case 'over-10m':
                    if (priceValue < 10000000) return false;
                    break;
            }
        }

        // Search term filter
        if (currentFilters.searchTerm) {
            const searchLower = currentFilters.searchTerm.toLowerCase();
            const productName = product.name?.toLowerCase() || '';
            const productDescription = product.description?.toLowerCase() || '';
            
            if (!productName.includes(searchLower) && !productDescription.includes(searchLower)) {
                return false;
            }
        }

        return true;
    });
}

// Render filtered products to the page
function renderProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    const filteredProducts = filterProducts();
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h3 style="color: #666; font-size: 1.5rem; margin-bottom: 1rem;">No products found</h3>
                <p style="color: #999;">Try adjusting your filters or search terms.</p>
                <button onclick="clearFilters()" style="margin-top: 1rem; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 25px; cursor: pointer;">Clear Filters</button>
            </div>
        `;
        renderPagination(0);
        return;
    }

    // Calculate pagination
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    
    // Ensure current page is valid
    if (currentPage > totalPages) {
        currentPage = 1;
        savePaginationToStorage();
    }
    
    // Get products for current page
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-product-id="${product.id}" style="cursor: pointer;">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price}</p>
                <button class="add-to-cart-btn" onclick="addToCart(event, ${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');

    // Re-bind click events for product cards
    bindProductCardEvents();
    
    // Render pagination
    renderPagination(totalPages);
}

// Render pagination controls
function renderPagination(totalPages) {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
            « Previous
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        // Show first page, last page, current page, and pages around current
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button onclick="goToPage(${i})" ${i === currentPage ? 'class="active"' : ''}>
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span style="padding: 10px; color: #666;">...</span>';
        }
    }
    
    // Next button
    paginationHTML += `
        <button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
            Next »
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Navigate to specific page
function goToPage(pageNumber) {
    const filteredProducts = filterProducts();
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    currentPage = pageNumber;
    savePaginationToStorage();
    renderProducts();
    
    // Scroll to top of products section
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add to cart functionality
function addToCart(event, productId) {
    event.stopPropagation(); // Prevent card click when button is clicked
    
    const allProducts = getProductsFromStorage();
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found');
        return;
    }

    // Get current user and cart
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cartKey = currentUser ? `cart_of_${currentUser.name}` : 'cart_guest';
    
    let cart = getFromStorage(cartKey, []);

    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Save updated cart
    try {
        localStorage.setItem(cartKey, JSON.stringify(cart));
        
        // Update button appearance
        const button = event.target;
        const originalText = button.textContent;
        const originalBackground = button.style.background;
        
        button.style.background = 'linear-gradient(45deg, #27ae60, #20bf6b)';
        button.textContent = 'Added!';
        
        setTimeout(() => {
            button.style.background = originalBackground || 'linear-gradient(45deg, #667eea, #764ba2)';
            button.textContent = originalText;
        }, 2000);

        // Update cart badge
        updateCartBadge();
        triggerCartUpdate();
        
    } catch (error) {
        console.error('Error saving to cart:', error);
    }
}

// Bind events to product cards
function bindProductCardEvents() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(event) {
            // Don't navigate if button was clicked
            if (event.target.classList.contains('add-to-cart-btn')) {
                return;
            }
            
            const productId = this.getAttribute('data-product-id');
            localStorage.setItem('selectedProduct', productId);
            window.location.href = `../ProductsPage/products-page.html`;
        });
    });
}

// Clear all filters
function clearFilters() {
    currentFilters = {
        category: 'all',
        priceRange: 'all',
        searchTerm: ''
    };
    saveFiltersToStorage();
    updateFilterUI();
    renderProducts();
}

// Handle search functionality
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        currentFilters.searchTerm = searchInput.value.trim();
        saveFiltersToStorage();
        renderProducts();
    }
}

// Update filter UI with current values
function updateFilterUI() {
    const categorySelect = document.getElementById('category');
    const priceSelect = document.getElementById('price');
    const searchInput = document.querySelector('.search-input');

    if (categorySelect) categorySelect.value = currentFilters.category;
    if (priceSelect) priceSelect.value = currentFilters.priceRange;
    if (searchInput) searchInput.value = currentFilters.searchTerm;
}

// Initialize filters
function initializeFilters() {
    loadFiltersFromStorage();
    
    // Category filter
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        categorySelect.addEventListener('change', function () {
            currentFilters.category = this.value;
            currentPage = 1; // Reset to first page when filter changes
            saveFiltersToStorage();
            savePaginationToStorage();
            renderProducts();
            console.log('Category filter:', this.value);
        });
    }

    // Price filter
    const priceSelect = document.getElementById('price');
    if (priceSelect) {
        priceSelect.addEventListener('change', function () {
            currentFilters.priceRange = this.value;
            currentPage = 1; // Reset to first page when filter changes
            saveFiltersToStorage();
            savePaginationToStorage();
            renderProducts();
            console.log('Price filter:', this.value);
        });
    }

    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Initial render
    updateFilterUI();
    renderProducts();
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
    
    // Check if products were updated
    if (e.key === 'products') {
        renderProducts();
    }
    
    // Check if filters were updated
    if (e.key === 'shopFilters') {
        loadFiltersFromStorage();
        updateFilterUI();
        renderProducts();
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

function goToCartPage() {
    window.location.href = '../CartPage/cart-page.html';
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize profile and cart
    updateProfileImage();
    updateProfileDropdown();
    updateCartBadge();
    
    // Initialize filters with a small delay to ensure DOM is ready
    setTimeout(() => {
        initializeFilters();
    }, 100);
});

// Make functions available globally
window.updateCartBadge = updateCartBadge;
window.refreshCartBadge = refreshCartBadge;
window.triggerCartUpdate = triggerCartUpdate;
window.getCartFromStorage = getCartFromStorage;
window.goToProfile = goToProfile;
window.handleLogout = handleLogout;
window.updateProfileDropdown = updateProfileDropdown;
window.updateProfileImage = updateProfileImage;
window.addToCart = addToCart;
window.clearFilters = clearFilters;
window.goToPage = goToPage;