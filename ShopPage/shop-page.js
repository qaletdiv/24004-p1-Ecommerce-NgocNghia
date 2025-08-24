// Enhanced shop-page.js - Improved filtering and pagination using localStorage

// Configuration constants
const PRODUCTS_PER_PAGE = 6;
const STORAGE_KEYS = {
    PRODUCTS: 'products',
    CURRENT_USER: 'currentUser',
    SHOP_FILTERS: 'shopFilters',
    CURRENT_PAGE: 'currentPage',
    SELECTED_PRODUCT: 'selectedProduct'
};

// Global state management
let state = {
    filters: {
        category: 'all',
        priceRange: 'all',
        searchTerm: '',
        sortBy: 'name-asc'
    },
    pagination: {
        currentPage: 1,
        totalPages: 0,
        totalProducts: 0
    },
    products: {
        all: [],
        filtered: []
    },
    isLoading: false
};

// Utility functions
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
}

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
        return false;
    }
}

// State management functions
function loadState() {
    // Load filters from storage
    const savedFilters = getFromStorage(STORAGE_KEYS.SHOP_FILTERS);
    if (savedFilters) {
        state.filters = { ...state.filters, ...savedFilters };
    }
    
    // Load current page
    const savedPage = getFromStorage(STORAGE_KEYS.CURRENT_PAGE);
    if (savedPage && savedPage > 0) {
        state.pagination.currentPage = savedPage;
    }
    
    // Load products
    state.products.all = getFromStorage(STORAGE_KEYS.PRODUCTS, []);
}

function saveState() {
    saveToStorage(STORAGE_KEYS.SHOP_FILTERS, state.filters);
    saveToStorage(STORAGE_KEYS.CURRENT_PAGE, state.pagination.currentPage);
}

// Product filtering and sorting
function applyFilters() {
    let filtered = [...state.products.all];
    
    // Category filter
    if (state.filters.category !== 'all') {
        const filterCategory = state.filters.category.toLowerCase();
        filtered = filtered.filter(product => {
            const productCategory = (product.category || '').toLowerCase();
            return productCategory.includes(filterCategory);
        });
    }
    
    // Price range filter
    if (state.filters.priceRange !== 'all') {
        filtered = filtered.filter(product => {
            const priceValue = parseFloat((product.price || '0').replace(/[^\d]/g, '')) || 0;
            
            switch (state.filters.priceRange) {
                case 'under-3m':
                    return priceValue < 3000000;
                case '3m-6m':
                    return priceValue >= 3000000 && priceValue < 6000000;
                case '6m-10m':
                    return priceValue >= 6000000 && priceValue < 10000000;
                case 'over-10m':
                    return priceValue >= 10000000;
                default:
                    return true;
            }
        });
    }
    
    // Search filter
    if (state.filters.searchTerm) {
        const searchTerm = state.filters.searchTerm.toLowerCase().trim();
        filtered = filtered.filter(product => {
            const name = (product.name || '').toLowerCase();
            const description = (product.description || '').toLowerCase();
            const category = (product.category || '').toLowerCase();
            
            return name.includes(searchTerm) || 
                   description.includes(searchTerm) || 
                   category.includes(searchTerm);
        });
    }
    
    // Apply sorting
    filtered = applySorting(filtered);
    
    state.products.filtered = filtered;
    updatePaginationInfo();
}

function applySorting(products) {
    const [field, order] = state.filters.sortBy.split('-');
    
    return products.sort((a, b) => {
        let aVal, bVal;
        
        switch (field) {
            case 'price':
                aVal = parseFloat((a.price || '0').replace(/[^\d]/g, '')) || 0;
                bVal = parseFloat((b.price || '0').replace(/[^\d]/g, '')) || 0;
                break;
            case 'name':
            default:
                aVal = (a.name || '').toLowerCase();
                bVal = (b.name || '').toLowerCase();
                break;
        }
        
        if (order === 'desc') {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        } else {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
    });
}

function updatePaginationInfo() {
    state.pagination.totalProducts = state.products.filtered.length;
    state.pagination.totalPages = Math.ceil(state.pagination.totalProducts / PRODUCTS_PER_PAGE);
    
    // Validate current page
    if (state.pagination.currentPage > state.pagination.totalPages) {
        state.pagination.currentPage = Math.max(1, state.pagination.totalPages);
    }
}

// Render functions
function renderProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    // Show loading state
    if (state.isLoading) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <div class="loading-spinner" style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 1rem; color: #666;">Loading products...</p>
            </div>
        `;
        return;
    }
    
    // No products found
    if (state.products.filtered.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                <h3 style="color: #666; font-size: 1.5rem; margin-bottom: 1rem;">No products found</h3>
                <p style="color: #999; margin-bottom: 2rem;">Try adjusting your filters or search terms.</p>
                <button onclick="clearAllFilters()" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;">
                    <i class="fas fa-refresh"></i> Clear All Filters
                </button>
            </div>
        `;
        renderPagination();
        renderProductStats();
        return;
    }
    
    // Calculate products for current page
    const startIndex = (state.pagination.currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const productsToShow = state.products.filtered.slice(startIndex, endIndex);
    
    // Render products
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-product-id="${product.id}" style="cursor: pointer;">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price}</p>
                <button class="add-to-cart-btn" onclick="addToCart(event, ${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
    
    // Add click events to product cards
    bindProductCardEvents();
    renderPagination();
    renderProductStats();
}

function renderPagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    
    if (state.pagination.totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    const currentPage = state.pagination.currentPage;
    const totalPages = state.pagination.totalPages;
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button onclick="goToPage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''} 
                class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}">
            <i class="fas fa-chevron-left"></i> Previous
        </button>
    `;
    
    // Page numbers with smart pagination
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page and ellipsis
    if (startPage > 1) {
        paginationHTML += `<button onclick="goToPage(1)" class="pagination-btn">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    
    // Visible page numbers
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button onclick="goToPage(${i})" 
                    class="pagination-btn ${i === currentPage ? 'active' : ''}">
                ${i}
            </button>
        `;
    }
    
    // Last page and ellipsis
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
        paginationHTML += `<button onclick="goToPage(${totalPages})" class="pagination-btn">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button onclick="goToPage(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''} 
                class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}">
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

function renderProductStats() {
    // Update products count display
    const startIndex = (state.pagination.currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, state.pagination.totalProducts);
    
    // Create or update stats display
    let statsElement = document.querySelector('.product-stats');
    if (!statsElement) {
        statsElement = document.createElement('div');
        statsElement.className = 'product-stats';
        
        const filterSection = document.querySelector('.filter-section');
        if (filterSection) {
            filterSection.appendChild(statsElement);
        }
    }
    
    if (state.pagination.totalProducts > 0) {
        statsElement.innerHTML = `
            <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 8px; margin-top: 1rem;">
                <p style="color: #666; font-size: 0.9rem;">
                    Showing ${startIndex + 1}-${endIndex} of ${state.pagination.totalProducts} products
                    ${hasActiveFilters() ? ' (filtered)' : ''}
                </p>
            </div>
        `;
    } else {
        statsElement.innerHTML = '';
    }
}

// Event handlers
function handleCategoryChange(value) {
    state.filters.category = value;
    resetPagination();
    applyFiltersAndRender();
}

function handlePriceChange(value) {
    state.filters.priceRange = value;
    resetPagination();
    applyFiltersAndRender();
}

function handleSortChange(value) {
    state.filters.sortBy = value;
    applyFiltersAndRender();
}

function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        state.filters.searchTerm = searchInput.value.trim();
        resetPagination();
        applyFiltersAndRender();
    }
}

function goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > state.pagination.totalPages) return;
    
    state.pagination.currentPage = pageNumber;
    renderProducts();
    saveState();
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function resetPagination() {
    state.pagination.currentPage = 1;
}

function applyFiltersAndRender() {
    state.isLoading = true;
    renderProducts();
    
    // Simulate processing time for better UX
    setTimeout(() => {
        state.isLoading = false;
        applyFilters();
        renderProducts();
        saveState();
    }, 300);
}

// Helper functions
function hasActiveFilters() {
    return state.filters.category !== 'all' || 
           state.filters.priceRange !== 'all' || 
           state.filters.searchTerm.trim() !== '';
}

function clearAllFilters() {
    state.filters = {
        category: 'all',
        priceRange: 'all',
        searchTerm: '',
        sortBy: 'name-asc'
    };
    resetPagination();
    updateFilterUI();
    applyFiltersAndRender();
}

function updateFilterUI() {
    const categorySelect = document.getElementById('category');
    const priceSelect = document.getElementById('price');
    const sortSelect = document.getElementById('sortBy');
    const searchInput = document.querySelector('.search-input');
    
    if (categorySelect) categorySelect.value = state.filters.category;
    if (priceSelect) priceSelect.value = state.filters.priceRange;
    if (sortSelect) sortSelect.value = state.filters.sortBy;
    if (searchInput) searchInput.value = state.filters.searchTerm;
}

// Product interaction functions
function bindProductCardEvents() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(event) {
            if (event.target.classList.contains('add-to-cart-btn') || 
                event.target.closest('.add-to-cart-btn')) {
                return;
            }
            
            const productId = this.getAttribute('data-product-id');
            saveToStorage(STORAGE_KEYS.SELECTED_PRODUCT, productId);
            window.location.href = `../ProductsPage/products-page.html`;
        });
    });
}

function addToCart(event, productId) {
    event.stopPropagation();
    
    const product = state.products.all.find(p => p.id == productId);
    if (!product) {
        console.error('Product not found');
        return;
    }
    
    const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
    const cartKey = currentUser ? `cart_of_${currentUser.name}` : 'cart_guest';
    
    let cart = getFromStorage(cartKey, []);
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveToStorage(cartKey, cart);
    
    // Visual feedback
    const button = event.target.closest('.add-to-cart-btn');
    const originalHTML = button.innerHTML;
    
    button.style.background = 'linear-gradient(45deg, #27ae60, #20bf6b)';
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    
    setTimeout(() => {
        button.style.background = '';
        button.innerHTML = originalHTML;
    }, 2000);
    
    updateCartBadge();
    triggerCartUpdate();
}

// Cart functions
function getCartFromStorage() {
    const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
    const cartKey = currentUser ? `cart_of_${currentUser.name}` : 'cart_guest';
    return getFromStorage(cartKey, []);
}

function updateCartBadge() {
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;
    
    const cartData = getCartFromStorage();
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
        badge.textContent = totalItems > 99 ? '99+' : totalItems;
        badge.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            background: #ff4757;
            color: white;
            border-radius: 50%;
            min-width: 20px;
            height: 20px;
            font-size: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            animation: pulse 2s infinite;
        `;
        cartIcon.style.position = 'relative';
        cartIcon.appendChild(badge);
    }
}

function triggerCartUpdate() {
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
}

function goToCartPage() {
    window.location.href = '../CartPage/cart-page.html';
}

// Profile functions
function toggleDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function updateProfileImage() {
    const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
    const profileImg = document.querySelector('.profile-img');
    
    if (profileImg) {
        if (currentUser && currentUser.profileImg) {
            profileImg.src = currentUser.profileImg;
            profileImg.alt = `${currentUser.name}'s profile`;
        } else {
            profileImg.src = "https://www.svgrepo.com/show/343494/profile-user-account.svg";
            profileImg.alt = "Default profile";
        }
    }
}

function updateProfileDropdown() {
    const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
    const dropdown = document.getElementById('profile-dropdown');
    
    if (!dropdown) return;
    
    if (currentUser) {
        dropdown.innerHTML = `
            <ul>
                <li><a href="#" onclick="goToProfile()" style="color: #ffd700; font-weight: 600;">${currentUser.name}</a></li>
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
    const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
    if (!currentUser) {
        window.location.href = '../LoginPage/login-page.html';
        return;
    }
    window.location.href = '../ProfileInfo/profile-info.html';
}

function handleLogout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    updateProfileImage();
    updateProfileDropdown();
    updateCartBadge();
}

// Initialize everything
function initializeApp() {
    // Load initial state
    loadState();
    applyFilters();
    
    // Update UI
    updateFilterUI();
    updateProfileImage();
    updateProfileDropdown();
    updateCartBadge();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial render
    renderProducts();
}

function setupEventListeners() {
    // Filter event listeners
    const categorySelect = document.getElementById('category');
    const priceSelect = document.getElementById('price');
    const sortSelect = document.getElementById('sortBy');
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => handleCategoryChange(e.target.value));
    }
    
    if (priceSelect) {
        priceSelect.addEventListener('change', (e) => handlePriceChange(e.target.value));
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => handleSortChange(e.target.value));
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    // Profile dropdown
    document.addEventListener('click', (event) => {
        const dropdown = document.getElementById('profile-dropdown');
        const profileImg = document.querySelector('.profile-img');
        
        if (dropdown && profileImg && 
            !dropdown.contains(event.target) && 
            !profileImg.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    });
    
    // Storage change listener
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEYS.PRODUCTS) {
            state.products.all = getFromStorage(STORAGE_KEYS.PRODUCTS, []);
            applyFilters();
            renderProducts();
        } else if (e.key && e.key.includes('cart_')) {
            updateCartBadge();
        }
    });
}

// CSS for loading spinner and improved styling
const additionalCSS = `
<style>
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.pagination-btn {
    background: white;
    border: 2px solid #ddd;
    color: #333;
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 0 3px;
    font-size: 0.9rem;
}

.pagination-btn:hover:not(.disabled) {
    background: #667eea;
    color: white;
    border-color: #667eea;
    transform: translateY(-1px);
}

.pagination-btn.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.pagination-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.pagination-ellipsis {
    padding: 10px 5px;
    color: #666;
}

.filter-section {
    position: sticky;
    top: 0;
    z-index: 100;
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.add-to-cart-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}
</style>
`;

// Inject additional CSS
if (document.head) {
    document.head.insertAdjacentHTML('beforeend', additionalCSS);
}

// Global functions
window.handleCategoryChange = handleCategoryChange;
window.handlePriceChange = handlePriceChange;
window.handleSortChange = handleSortChange;
window.handleSearch = handleSearch;
window.goToPage = goToPage;
window.clearAllFilters = clearAllFilters;
window.addToCart = addToCart;
window.goToCartPage = goToCartPage;
window.toggleDropdown = toggleDropdown;
window.goToProfile = goToProfile;
window.handleLogout = handleLogout;
window.updateCartBadge = updateCartBadge;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);