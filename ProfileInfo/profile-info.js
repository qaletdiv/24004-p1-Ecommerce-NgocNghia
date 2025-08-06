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
document.querySelector('.change-info-btn').addEventListener('click', function(e) {
    e.preventDefault();
    const inputs = document.querySelectorAll('#account .form-input, #account .form-textarea');
    const saveBtn = document.querySelector('#account .save-btn');
    
    if (this.textContent.includes('Change')) {
        inputs.forEach(input => {
            if (input.type !== 'email') { // Keep email readonly
                input.removeAttribute('readonly');
                input.style.background = 'white';
            }
        });
        saveBtn.style.display = 'inline-block';
        this.innerHTML = '<i class="fa-solid fa-times"></i> Cancel';
    } else {
        inputs.forEach(input => {
            input.setAttribute('readonly', true);
            input.style.background = '#f8f9fa';
        });
        saveBtn.style.display = 'none';
        this.innerHTML = '<i class="fa-solid fa-edit"></i> Change Profile Information';
    }
});

// Save changes for account tab
document.querySelector('#account .save-btn').addEventListener('click', function(e) {
    e.preventDefault();
    const inputs = document.querySelectorAll('#account .form-input, #account .form-textarea');
    const changeBtn = document.querySelector('.change-info-btn');
    
    inputs.forEach(input => {
        input.setAttribute('readonly', true);
        input.style.background = '#f8f9fa';
    });
    this.style.display = 'none';
    changeBtn.innerHTML = '<i class="fa-solid fa-edit"></i> Change Profile Information';
    
    alert('Profile updated successfully!');
});

// Gender selection
document.querySelectorAll('.gender-option').forEach(option => {
    option.addEventListener('click', function() {

        const parent = this.parentElement;
        parent.querySelectorAll('.radio-input').forEach(radio => {
            radio.classList.remove('checked');
        });

        this.querySelector('.radio-input').classList.add('checked');
    });
});

// Checkbox functionality
document.querySelectorAll('.checkbox-input').forEach(checkbox => {
    checkbox.addEventListener('click', function() {
        this.classList.toggle('checked');
    });
});

// Toggle switch functionality
document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
        console.log(`${this.parentElement.parentElement.querySelector('h4').textContent}: ${this.checked}`);
    });
});

// Profile image edit
document.querySelector('.edit-icon').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Profile image upload feature coming soon!');
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

// Password form toggle
function togglePasswordForm() {
    const form = document.getElementById('password-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Security button handlers
document.querySelectorAll('#security .change-info-btn, #security .add-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const action = this.textContent.trim();
        const parentItem = this.closest('.security-item');
        const title = parentItem.querySelector('h4').textContent;
        
        if (title === 'Password' && action === 'Change') {
            togglePasswordForm();
        } else {
            alert(`${action} ${title} - Feature coming soon!`);
        }
    });
});

// Address actions
document.querySelectorAll('.address-card .btn-small').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const action = this.textContent.trim();
        alert(`${action} address - Feature coming soon!`);
    });
});

// Support actions
document.querySelectorAll('#support .change-info-btn, #support .add-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const action = this.textContent.trim();
        if (action === 'Call Now') {
            window.open('tel:+841234567890');
        } else {
            alert(`${action} - Feature coming soon!`);
        }
    });
});

// Form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formType = this.closest('.tab-content')?.id || 'form';
        alert(`${formType} form submitted successfully!`);
    
        if (this.querySelector('textarea')) {
            this.reset();
        }
        
        if (this.closest('.modal')) {
            closeAddressModal();
        }
        
        if (this.closest('#password-form')) {
            togglePasswordForm();
        }
    });
});

// Save notification preferences
document.querySelector('#notifications .save-btn').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Notification preferences saved successfully!');
});