import { products } from '../Statics/mock-data.js';
const productId = parseInt(localStorage.getItem('selectedProduct'));


let currentProduct = null;
let currentQuantity = 1;

function changeQuantity(change) {
    currentQuantity = Math.max(1, currentQuantity + change);
    document.getElementById('quantity').value = currentQuantity;
}

function addToCart() {
    showNotification(`Added ${currentQuantity} ${currentProduct.name} to cart!`);
}

function buyNow() {
    showNotification(`Proceeding to checkout with ${currentQuantity} ${currentProduct.name}`, 'info');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function loadProduct(productId) {
    if (!productId) {
        container.innerHTML = `
            <div class="error-message">Product not found.</div>
        `
    }

    currentProduct = products.find(p => p.id === productId) || products[0];
    
    const container = document.getElementById('product-container');
    const breadcrumb = document.getElementById('breadcrumb-product');
    
    breadcrumb.textContent = currentProduct.name;
    
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
                        <span>${currentProduct.availability || 'In Stock'}</span>
                    </div>
                </div>
                
                <div class="rating">
                    <div class="stars">
                        ${'★'.repeat(Math.floor(currentProduct.rating || 5))}${'☆'.repeat(5 - Math.floor(currentProduct.rating || 5))}
                    </div>
                    <span>${currentProduct.rating || 5} (${currentProduct.reviews || 0} reviews)</span>
                </div>
                
                <p class="product-description">${currentProduct.description}</p>
                
                <div class="purchase-section">
                    <div class="quantity-selector">
                        <span class="quantity-label">Quantity:</span>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                            <input type="number" id="quantity" class="quantity-input" value="1" min="1">
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
    const relatedProducts = products.filter(p => p.id !== currentProduct.id);
    
    relatedGrid.innerHTML = relatedProducts.map(product => `
        <div class="related-card" onclick="loadProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}">
            <div class="related-card-info">
                <h4>${product.name}</h4>
                <div class="price">${product.price}</div>
            </div>
        </div>
    `).join('');
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadProduct(productId);
    loadRelatedProducts();
});
