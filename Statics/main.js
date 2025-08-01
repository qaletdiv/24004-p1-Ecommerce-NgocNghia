import { products } from './mock-data.js';
/// Initialize products in localStorage if not already present
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
    console.log('Products initialized in localStorage.');
} else {
    console.log('Products already exist in localStorage.');
}           
        /// Local Storage
        if (!localStorage.getItem('products')) {
            localStorage.setItem('products', JSON.stringify(products));
            console.log('Products initialized in localStorage.');
        } else {
            console.log('Products already exist in localStorage.');
        }