// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initUIInteractions();
    initTestimonialSlider();
    initContactForm();
});

// Initialize all UI interactions
function initUIInteractions() {
    initMobileMenu();
    initScrollAnimations();
    init3DButtonEffects();
    initParallaxEffect();
    initRewardProgress();
    initTestimonialSlider();
    initDynamicStatCounters();
    initSmoothScroll();
    initActiveSectionHighlight();
    initLightbox();
    initScrollProgressBar();
    initAdvancedLoadingAnimations();
    initMouseParallaxEffect();
    initParticles();
    animateParticles();
}

// 1. Mobile Menu Toggle with Smooth Transition
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('open');
        overlay.classList.toggle('visible');
        document.body.classList.toggle('menu-open');
    });

    overlay.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.classList.remove('menu-open');
    });
}

// 2. Scroll-triggered Animations with Smooth Fade-In Effects
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.feature-card, .testimonial, .hero-content h1, .hero-content p, .stat h3'
    );

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
}

// 3. Interactive 3D Button Effects
function init3DButtonEffects() {
    document.querySelectorAll('.cta-button, .btn-link').forEach((button) => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            button.style.setProperty('--x', `${x}px`);
            button.style.setProperty('--y', `${y}px`);
        });

        button.addEventListener('mouseleave', () => {
            button.style.setProperty('--x', `50%`);
            button.style.setProperty('--y', `50%`);
        });
    });
}

// 4. Enhanced Parallax Effect for Hero and Elements
function initParallaxEffect() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        parallaxLayers.forEach((layer, index) => {
            const depth = (index + 1) * 0.15;
            layer.style.transform = `translateY(${scrollY * depth}px)`;
        });
    });
}

// 5. Testimonial Slider with Momentum-Based Scrolling
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    let startX = 0;
    let scrollLeft = 0;
    let isDragging = false;

    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        scrollLeft = slider.scrollLeft;
        slider.classList.add('dragging');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - startX;
        slider.scrollLeft = scrollLeft - x;
    });

    slider.addEventListener('mouseup', () => {
        isDragging = false;
        slider.classList.remove('dragging');
    });

    slider.addEventListener('mouseleave', () => {
        isDragging = false;
        slider.classList.remove('dragging');
    });
}

// 6. Dynamic Stat Counters with Bouncy Animations
function initDynamicStatCounters() {
    const stats = document.querySelectorAll('.stat h3');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    stats.forEach((stat) => {
        const value = parseInt(stat.innerText, 10);
        stat.setAttribute('data-target', value);
        stat.innerText = '0';
        observer.observe(stat);
    });
}

function animateCounter(stat) {
    const target = +stat.getAttribute('data-target');
    const increment = target / 100;
    let current = 0;

    function updateCounter() {
        current += increment;
        if (current < target) {
            stat.innerText = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            stat.innerText = target;
            stat.classList.add('bounce');
        }
    }

    updateCounter();
}

// 7. Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// 8. Highlight Active Section in Navbar
function initActiveSectionHighlight() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// 9. Lightbox with Zoom and Fade-In Effects
function initLightbox() {
    const lightbox = document.querySelector('#lightbox');
    const lightboxImage = document.querySelector('#lightboxImage');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            lightboxImage.src = item.src;
            lightbox.classList.add('visible');
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('visible');
    });
}

// 10. Scroll Progress Bar with Dynamic Growth
function initScrollProgressBar() {
    const progressBar = document.getElementById('progressBar');

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
        progressBar.style.width = `${scrollPercentage}%`;
    });
}

// 11. Mouse-based Parallax Effect
function initMouseParallaxEffect() {
    const layers = document.querySelectorAll('.parallax-layer');

    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;

        layers.forEach((layer) => {
            layer.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// 12. Particle Effect Enhancements
const canvas = document.querySelector('.particle-canvas');
const ctx = canvas.getContext('2d');
const particles = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, size, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
}

function initParticles() {
    for (let i = 0; i < 150; i++) {
        const size = Math.random() * 3 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const color = `rgba(255, 255, 255, ${Math.random()})`;
        const speedX = Math.random() * 2 - 1;
        const speedY = Math.random() * 2 - 1;

        particles.push(new Particle(x, y, size, color, speedX, speedY));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

//13.Cursor
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    let currentHoverElement = null;

    // Smoothly update cursor position
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    // Add hover effects to interactive elements
    const buttons = document.querySelectorAll('.cta-button, .btn-link');
    buttons.forEach((button) => {
        button.addEventListener('mouseenter', () => {
            currentHoverElement = button;
            cursor.classList.add('enraging');
            graduallyExpandCursor(button);
        });

        button.addEventListener('mouseleave', () => {
            currentHoverElement = null;
            cursor.classList.add('shrinking');
            cursor.classList.remove('enraging');
            resetCursorSize();
            setTimeout(() => cursor.classList.remove('shrinking'), 300);
        });

        button.addEventListener('mousemove', (e) => {
            if (currentHoverElement === button) {
                dynamicallyAdjustCursorSize(e, button);
            }
        });
    });

    function graduallyExpandCursor(button) {
        const rect = button.getBoundingClientRect();
        const maxDistance = Math.hypot(rect.width / 2, rect.height / 2);
        const sizeIncrement = 5;

        let size = 20;
        const interval = setInterval(() => {
            if (!currentHoverElement) {
                clearInterval(interval);
                return;
            }

            size += sizeIncrement;
            cursor.style.width = `${size}px`;
            cursor.style.height = `${size}px`;

            if (size >= maxDistance) {
                clearInterval(interval);
            }
        }, 10);
    }

    function dynamicallyAdjustCursorSize(e, button) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distX = Math.abs(e.clientX - centerX);
        const distY = Math.abs(e.clientY - centerY);
        const distance = Math.sqrt(distX ** 2 + distY ** 2);

        const maxDistance = Math.hypot(rect.width / 2, rect.height / 2);
        const sizeFactor = Math.max(0, 1 - distance / maxDistance);

        const size = 20 + sizeFactor * 100; // Base size + growth factor
        cursor.style.width = `${size}px`;
        cursor.style.height = `${size}px`;
    }

    function resetCursorSize() {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
    }
});



function initRewardProgress() {
    const progressBars = document.querySelectorAll('.progress-fill');
    const rewardData = [
        { element: progressBars[0], target: 40 }, // Eco Warrior: 40%
        { element: progressBars[1], target: 70 }, // Green Leader: 70%
        { element: progressBars[2], target: 20 }, // Community Hero: 20%
    ];

    rewardData.forEach((reward) => {
        animateProgress(reward.element, reward.target);
    });
}

function animateProgress(element, target) {
    let width = 0;
    const speed = 20; // Adjust for smoother/slower animation
    const interval = setInterval(() => {
        if (width >= target) {
            clearInterval(interval);
        } else {
            width++;
            element.style.width = `${width}%`;
        }
    }, speed);
}







// 14. Testimonial Slider with Autoplay and Navigation
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentIndex = 0;

    // Show the active testimonial
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (i === index) {
                testimonial.classList.add('active');
            }
        });
    }

    // Navigate to the next testimonial
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }

    // Navigate to the previous testimonial
    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentIndex);
    }

    // Add event listeners to navigation buttons
    nextButton.addEventListener('click', nextTestimonial);
    prevButton.addEventListener('click', prevTestimonial);

    // Autoplay functionality
    setInterval(nextTestimonial, 5000); // Change slide every 5 seconds
}








//14. validation and feed back
function initContactForm() {
    const form = document.querySelector('.contact-form');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const emailError = emailInput.nextElementSibling;
    const messageError = messageInput.nextElementSibling;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        // Validate email
        if (!validateEmail(emailInput.value)) {
            emailError.style.display = 'block';
            emailInput.classList.add('error');
            valid = false;
        } else {
            emailError.style.display = 'none';
            emailInput.classList.remove('error');
        }

        // Validate message
        if (messageInput.value.trim() === '') {
            messageError.style.display = 'block';
            messageInput.classList.add('error');
            valid = false;
        } else {
            messageError.style.display = 'none';
            messageInput.classList.remove('error');
        }

        if (valid) {
            form.reset();
            alert('Thank you! Your message has been sent.');
        }
    });
}

// Helper function to validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}






