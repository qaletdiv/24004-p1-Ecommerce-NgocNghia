import { products } from './mock-data.js';
import { accounts } from './mock-data.js';
/// Initialize products in localStorage if not already present      
/// Local Storage
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
    console.log('Products initialized in localStorage.');
} else {
    console.log('Products already exist in localStorage.');
}

if (!localStorage.getItem('accounts')) {
    localStorage.setItem('accounts', JSON.stringify(accounts));
    console.log('Accounts initialized in localStorage.');
} else {
    console.log('Accounts already exist in localStorage.');
}
