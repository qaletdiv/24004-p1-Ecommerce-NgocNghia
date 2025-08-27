J&N Figure Store
A modern e-commerce website for anime and collectible figures built with vanilla HTML, CSS, and JavaScript.
🚀 Features

Responsive Design: Mobile-first approach with smooth animations
Search Functionality: Real-time search across all products
Premium Product Display: Showcases high-value items on the homepage
Local Storage Integration: Client-side data persistence
Interactive UI: Hover effects, dropdown menus, and smooth transitions
Cart System: Shopping cart functionality
User Authentication: Login/logout system with profile management

🛠 Technologies Used

Frontend: HTML5, CSS3, JavaScript (ES6+)
Icons: Font Awesome 6.7.2
Storage: Browser Local Storage
Styling: Custom CSS with modern design patterns

📁 Project Structure

J&N-Figure-Store/
        ├── home.html              # Main homepage
        ├── style.css             # Global stylesheet
        ├── Statics/
               └── main.js   
               └── mock-data.js  
               └── admin.js          
        ├── AboutPage/
               └── about-page.html
               └── about-page.css 
               └── about-page.js  
        ├── ShopPage/
               └── shop-page.html
               └── shop-page.css  
               └── shop-page.js  
        ├── ContactPage/
               └── contact-page.html
               └── contact-page.css 
               └── contact-page.js  
        ├── LoginPage/
               └── login-page.html
               └── login-page.css  
               └── login-page.js  
        ├── CartPage/
               └── cart-page.html
               └── cart-page.css
               └── cart-page.js  
        └── ProductsPage/
            └── products-page.html
            └── products-page.css  
            └── products-page.js  

💾 Local Storage Usage
The application uses browser Local Storage for several key functionalities:
1. Product Data Storage
javascriptlocalStorage.setItem('products', JSON.stringify(productsArray));

Stores complete product catalog
Includes: name, price, description, image URLs, categories
Used for search functionality and product display

2. Shopping Cart Management
javascriptlocalStorage.setItem('cart', JSON.stringify(cartItems));

Persists cart items across browser sessions
Maintains product quantities and selections

3. User Authentication
javascriptlocalStorage.setItem('currentUser', JSON.stringify(userData));

Stores logged-in user information
Manages authentication state

4. Selected Product Navigation
javascriptlocalStorage.setItem('selectedProduct', productId);

Handles product selection for detail pages
Enables seamless navigation between pages

Profile Management

Dropdown menu: Toggleable user profile menu
Authentication state: Dynamic UI based on login status
Click outside to close: Enhanced user experience

🎨 Design Features

Modern UI: Clean, contemporary design with smooth animations
Color Scheme: Professional palette with gold accents
Responsive Grid: CSS Grid for product layouts
Interactive Elements: Hover effects and transitions
Typography: Readable fonts with proper hierarchy

🔍 Search Functionality
The search feature includes:

Instant results: Real-time filtering as you type
Comprehensive search: Matches product names, descriptions, and categories
Visual feedback: Shows search result count and status
Keyboard support: Enter key submission
Empty state handling: Returns to premium products view

🛒 Cart Integration

Add to cart: Direct integration with cart system
Persistent storage: Cart maintains state across sessions
Visual indicators: Cart icon with item count
Seamless navigation: Direct links to cart page

📱 Responsive Design
The website is fully responsive with breakpoints at:

Desktop: 1200px+ (3-column grid)
Tablet: 768px-1199px (2-column grid)
Mobile: <768px (single column)

🚦 Browser Compatibility

Chrome: 80+
Firefox: 75+
Safari: 13+
Edge: 80+

Local Storage is supported in all modern browsers.