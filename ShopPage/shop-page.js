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
/// Filter
document.getElementById('category').addEventListener('change', function () {
    console.log('Category filter:', this.value);
});

/// Price
document.getElementById('price').addEventListener('change', function () {
    console.log('Price filter:', this.value);
});

document.querySelector('.search-btn').addEventListener('click', function () {
    const searchTerm = document.querySelector('.search-input').value;
    console.log('Search term:', searchTerm);
});

// Pages
document.querySelectorAll('.pagination button').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelector('.pagination button.active').classList.remove('active');
        this.classList.add('active');
    });
});

// Add to cart
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function () {
        this.style.background = 'linear-gradient(45deg, #27ae60, #20bf6b)';
        this.textContent = 'Added!';

        setTimeout(() => {
            this.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
            this.textContent = 'Add to Cart';
        }, 2000);
    });
});

/// See the product details 
document.querySelectorAll('.product-card').forEach(card => {
    card.style.cursor = 'pointer';

    card.addEventListener('click', function () {
        const productId = this.getAttribute('data-product-id');
        localStorage.setItem('selectedProduct', productId);
        window.location.href = `../ProductsPage/products-page.html`;
    });
});