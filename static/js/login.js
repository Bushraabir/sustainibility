// Custom Cursor Effect (Advanced Custom Cursor)
const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.pageX - cursor.offsetWidth / 2}px`;
    cursor.style.top = `${e.pageY - cursor.offsetHeight / 2}px`;
});

document.addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
        cursor.classList.add('hovered');
    } else {
        cursor.classList.remove('hovered');
    }
});

// Smooth Scroll for Anchor Links
const scrollLinks = document.querySelectorAll('a[href^="#"]');

scrollLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for navigation height
                behavior: 'smooth',
            });
        }
    });
});

// Form Input Focus Effect with Animations
const formInputs = document.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Add Interactive Placeholder Text
formInputs.forEach(input => {
    const placeholderText = input.getAttribute('placeholder');
    input.addEventListener('focus', () => {
        input.setAttribute('data-placeholder', placeholderText);
        input.setAttribute('placeholder', '');
    });

    input.addEventListener('blur', () => {
        input.setAttribute('placeholder', input.getAttribute('data-placeholder'));
        input.removeAttribute('data-placeholder');
    });
});

// Form Validation with Enhanced Feedback
const loginForm = document.querySelector('form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let isValid = true;

    // Validate Username
    if (username.trim() === '') {
        showValidationError('username', 'Username cannot be empty');
        isValid = false;
    } else {
        hideValidationError('username');
    }

    // Validate Password
    if (password.trim() === '') {
        showValidationError('password', 'Password cannot be empty');
        isValid = false;
    } else if (password.length < 6) {
        showValidationError('password', 'Password must be at least 6 characters');
        isValid = false;
    } else {
        hideValidationError('password');
    }

    if (isValid) {
        loginForm.submit();
    }
});

function showValidationError(inputId, message) {
    const inputField = document.getElementById(inputId);
    const errorMessage = document.createElement('span');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = message;
    
    if (!inputField.parentElement.querySelector('.error-message')) {
        inputField.parentElement.appendChild(errorMessage);
    }
}

function hideValidationError(inputId) {
    const inputField = document.getElementById(inputId);
    const errorMessage = inputField.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Interactive Hover Effect for the Submit Button (Enhanced with Animation)
const submitButton = document.querySelector('button[type="submit"]');
submitButton.addEventListener('mouseenter', () => {
    submitButton.classList.add('hover-effect');
});

submitButton.addEventListener('mouseleave', () => {
    submitButton.classList.remove('hover-effect');
});

// Animated Transition for the Login Section
const loginSection = document.querySelector('.login-section');
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const loginPosition = loginSection.offsetTop;

    if (scrollPosition + window.innerHeight > loginPosition) {
        loginSection.classList.add('visible');
    } else {
        loginSection.classList.remove('visible');
    }
});

// CSS Class for the 'visible' animation on scroll
document.styleSheets[0].insertRule(`
    .login-section.visible .container {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
`, 0);

// Additional Form Placeholder Animation with Custom CSS
document.styleSheets[0].insertRule(`
    .form-group.focused input, .form-group.focused textarea {
        border-color: var(--highlight-color);
        box-shadow: 0 0 10px rgba(245, 201, 44, 0.3);
    }
`, 0);

// Custom Cursor Hover Effect
document.styleSheets[0].insertRule(`
    .custom-cursor.hovered {
        background-color: var(--highlight-color);
        width: 20px;
        height: 20px;
        border-radius: 50%;
        transform: scale(1.5);
        transition: all 0.2s ease;
    }
`, 0);

// Animation for Custom Cursor on hover
document.styleSheets[0].insertRule(`
    .custom-cursor {
        position: fixed;
        width: 15px;
        height: 15px;
        background-color: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        transition: transform 0.2s ease, background-color 0.2s ease;
    }
`, 0);
