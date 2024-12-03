// Custom Cursor Effect
const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    cursor.style.left = `${mouseX - cursor.offsetWidth / 2}px`;
    cursor.style.top = `${mouseY - cursor.offsetHeight / 2}px`;
});

document.addEventListener('mouseenter', () => {
    cursor.classList.add('hovered');
});

document.addEventListener('mouseleave', () => {
    cursor.classList.remove('hovered');
});

// Adding smooth scrolling for anchor links
const scrollLinks = document.querySelectorAll('a[href^="#"]');
scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        window.scrollTo({
            top: targetElement.offsetTop - 60, // Adjust for header height
            behavior: 'smooth'
        });
    });
});

// Form Validation for Sign-Up
const signupForm = document.querySelector('form');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm_password');
const usernameInput = document.getElementById('username');

signupForm.addEventListener('submit', (e) => {
    let isValid = true;
    let errorMessages = [];

    // Clear previous errors
    const errorMessageElements = document.querySelectorAll('.error-message');
    errorMessageElements.forEach(msg => msg.remove());

    // Validate Username
    if (usernameInput.value.trim() === '') {
        isValid = false;
        errorMessages.push("Username is required.");
    }

    // Validate Password Length
    if (passwordInput.value.length < 8) {
        isValid = false;
        errorMessages.push("Password must be at least 8 characters long.");
    }

    // Validate Confirm Password
    if (passwordInput.value !== confirmPasswordInput.value) {
        isValid = false;
        errorMessages.push("Passwords do not match.");
    }

    if (!isValid) {
        e.preventDefault(); // Prevent form submission
        errorMessages.forEach(msg => {
            const errorElement = document.createElement('p');
            errorElement.classList.add('error-message');
            errorElement.style.color = 'red';
            errorElement.textContent = msg;
            signupForm.insertBefore(errorElement, signupForm.firstChild);
        });
    }
});

// Fade-in effect for form when page is loaded
window.addEventListener('load', () => {
    const formContainer = document.querySelector('.signup-section .container');
    setTimeout(() => {
        formContainer.classList.add('visible');
    }, 100);
});

// Form Input Focus Effect
const formInputs = document.querySelectorAll('.signup-section input');
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.style.borderColor = 'var(--highlight-color)';
        input.style.boxShadow = '0 0 10px rgba(245, 201, 44, 0.3)';
    });

    input.addEventListener('blur', () => {
        input.style.borderColor = '#444';
        input.style.boxShadow = 'none';
    });
});
