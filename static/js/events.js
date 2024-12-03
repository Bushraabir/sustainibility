// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initEventSignUp();
    initUserProgress();
    initLeaderboard();
    initBadges();
    initFloatingButton();
    initTooltips();
    initFormValidation();
    initCardHoverEffects();
    loadEvents();  // Load events dynamically
});

// Smooth Scroll for anchor links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);
            window.scrollTo({
                top: targetElement.offsetTop - 80,  // Adjust for fixed navbar height
                behavior: "smooth"
            });
        });
    });
}

// Event Sign-Up Form Initialization
function initEventSignUp() {
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleFormSubmit);
    }
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get form values
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const eventSelected = document.querySelector('#event');

    let isValid = true;

    // Simple validation checks
    if (!nameInput.value) {
        highlightError(nameInput);
        isValid = false;
    }
    if (!emailInput.value || !validateEmail(emailInput.value)) {
        highlightError(emailInput);
        isValid = false;
    }
    if (!eventSelected.value) {
        highlightError(eventSelected);
        isValid = false;
    }

    if (isValid) {
        try {
            // Simulate API call to save user data
            await submitFormData(nameInput.value, emailInput.value, eventSelected.value);

            showSignupConfirmation(nameInput.value);  // Show real-time confirmation
            updateUserProgress(20);  // Simulate adding points to the user's progress

            // Reset the form
            event.target.reset();
        } catch (error) {
            showFormError();
            console.error("Form submission error:", error);
        }
    } else {
        showFormError();
    }
}

// Function to highlight invalid input fields
function highlightError(input) {
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    input.style.borderColor = accentColor;
}

// Simple email validation function
function validateEmail(email) {
    // Simple regex for demonstration purposes
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}