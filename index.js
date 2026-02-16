// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const menuOverlay = document.getElementById('menu-overlay');

function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}

// Click hamburger button to toggle menu
hamburger.addEventListener('click', toggleMenu);

// Click menu overlay to close menu
menuOverlay.addEventListener('click', toggleMenu);

// Close menu when a nav link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
});

// Handle navigation color changes on scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
