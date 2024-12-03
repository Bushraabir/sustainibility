// Custom Cursor Animation
const customCursor = document.querySelector('.custom-cursor');

// Update cursor position
document.addEventListener('mousemove', (e) => {
    customCursor.style.left = `${e.pageX}px`;
    customCursor.style.top = `${e.pageY}px`;
});

// Add hover effect for links and buttons to enlarge cursor
const interactiveElements = document.querySelectorAll('a, .cta-button');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        customCursor.style.transform = 'scale(1.5)';
    });

    element.addEventListener('mouseleave', () => {
        customCursor.style.transform = 'scale(1)';
    });
});

// Smooth Scrolling for Anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 70, // Adjust for navbar height
            behavior: 'smooth'
        });
    });
});
