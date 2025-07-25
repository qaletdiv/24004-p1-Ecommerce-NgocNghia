function toggleDropdown() {
    const dropDown = document.getElementById('profile-dropdown');
    dropDown.classList.toggle('show');
}

document.addEventListener('click', function(event) {
    const dropDown = document.getElementById('profile-dropdown');
    const profileImg = document.querySelector('.profile-img');

    if (!profileImg.contains(event.target) && !dropDown.contains(event.target)) {
        dropDown.classList.remove('show');
    }
});