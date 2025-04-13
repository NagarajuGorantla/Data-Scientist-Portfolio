// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        disable: window.innerWidth < 768
    });
});

// Smooth scrolling for navigation links
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

// Navbar background change on scroll with throttling
const handleScroll = throttle(() => {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        navbar.style.backgroundColor = 'rgba(52, 58, 64, 0.95)';
    } else {
        navbar.style.backgroundColor = 'var(--dark-color)';
    }
}, 100);

window.addEventListener('scroll', handleScroll);

// Contact form handling
const contactForm = document.getElementById('contactForm');
const successAlert = document.getElementById('successAlert');
const errorAlert = document.getElementById('errorAlert');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            const formData = new FormData(contactForm);
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message')
                })
            });

            const data = await response.json();

            if (response.ok) {
                successAlert.classList.remove('d-none');
                errorAlert.classList.add('d-none');
                contactForm.reset();
                successAlert.scrollIntoView({ behavior: 'smooth' });
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (error) {
            errorAlert.classList.remove('d-none');
            successAlert.classList.add('d-none');
            errorAlert.scrollIntoView({ behavior: 'smooth' });
            console.error('Error:', error);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// Add active class to current section in navigation with throttling
const handleSectionScroll = throttle(() => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, 100);

window.addEventListener('scroll', handleSectionScroll);

// Optimize image loading with Intersection Observer
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loading');
            
            if (img.complete) {
                img.classList.remove('loading');
            } else {
                img.addEventListener('load', function() {
                    this.classList.remove('loading');
                });
                
                img.addEventListener('error', function() {
                    this.classList.remove('loading');
                    this.classList.add('error');
                    this.alt = 'Failed to load image';
                });
            }
            
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px 0px',
    threshold: 0.1
});

document.querySelectorAll('img').forEach(img => {
    imageObserver.observe(img);
});

// Add hover effect to project cards with debouncing
const projectCards = document.querySelectorAll('.card');
const handleCardHover = debounce((card, isEnter) => {
    if (isEnter) {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    } else {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    }
}, 50);

projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => handleCardHover(card, true));
    card.addEventListener('mouseleave', () => handleCardHover(card, false));
});

// Add scroll to top button with throttling
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.className = 'scroll-to-top';
document.body.appendChild(scrollToTopBtn);

const handleScrollToTop = throttle(() => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'block';
        scrollToTopBtn.style.opacity = '1';
    } else {
        scrollToTopBtn.style.opacity = '0';
        setTimeout(() => {
            if (window.pageYOffset <= 300) {
                scrollToTopBtn.style.display = 'none';
            }
        }, 300);
    }
}, 100);

window.addEventListener('scroll', handleScrollToTop);

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}); 