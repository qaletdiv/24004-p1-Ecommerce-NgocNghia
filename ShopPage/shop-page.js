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
                    <span style="color: #ffd700; font-weight: 600; font-size: 0.95rem; padding: 12px 20px; display: block; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                        Hello, ${currentUser.name}!
                    </span>
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

window.handleLogout = handleLogout;