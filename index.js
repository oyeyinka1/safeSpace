
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const icon = menuToggle.querySelector('i');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    menuToggle.classList.toggle('open');

if (navLinks.classList.contains('show')){
    icon.classList.replace('fa-bars-staggered', 'fa-xmark');
}else{
    icon.classList.replace('fa-xmark', 'fa-bars-staggered');
}
});
