// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initSmoothScrolling();
    initPriceChart();
    initMarketDataAnimation();
    initFormHandling();
    initScrollAnimations();
    initParticleEffects();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animated price chart
function initPriceChart() {
    const canvas = document.getElementById('priceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Generate sample price data
    const data = generatePriceData(50);
    
    // Chart configuration
    const config = {
        width: canvas.width,
        height: canvas.height,
        padding: 20,
        data: data
    };

    // Draw chart
    drawPriceChart(ctx, config);

    // Animate chart updates
    setInterval(() => {
        updatePriceChart(ctx, config);
    }, 3000);
}

function generatePriceData(points) {
    const data = [];
    let price = 43250;
    
    for (let i = 0; i < points; i++) {
        const change = (Math.random() - 0.5) * 200;
        price += change;
        data.push({
            x: i,
            y: price
        });
    }
    
    return data;
}

function drawPriceChart(ctx, config) {
    const { width, height, padding, data } = config;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Find min/max values
    const prices = data.map(d => d.y);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    // Calculate scales
    const xScale = (width - 2 * padding) / (data.length - 1);
    const yScale = (height - 2 * padding) / priceRange;
    
    // Draw grid
    drawGrid(ctx, width, height, padding);
    
    // Draw price line
    ctx.beginPath();
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    
    data.forEach((point, index) => {
        const x = padding + point.x * xScale;
        const y = height - padding - (point.y - minPrice) * yScale;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 212, 255, 0.0)');
    
    ctx.beginPath();
    ctx.fillStyle = gradient;
    
    data.forEach((point, index) => {
        const x = padding + point.x * xScale;
        const y = height - padding - (point.y - minPrice) * yScale;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.lineTo(padding + (data.length - 1) * xScale, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fill();
}

function drawGrid(ctx, width, height, padding) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let i = 0; i <= 4; i++) {
        const x = padding + (width - 2 * padding) * (i / 4);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= 4; i++) {
        const y = padding + (height - 2 * padding) * (i / 4);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
}

function updatePriceChart(ctx, config) {
    // Add new data point
    const lastPoint = config.data[config.data.length - 1];
    const newPrice = lastPoint.y + (Math.random() - 0.5) * 100;
    
    config.data.push({
        x: lastPoint.x + 1,
        y: newPrice
    });
    
    // Remove oldest point if too many
    if (config.data.length > 50) {
        config.data.shift();
    }
    
    // Redraw chart
    drawPriceChart(ctx, config);
}

// Market data animation
function initMarketDataAnimation() {
    const dataRows = document.querySelectorAll('.data-row');
    
    dataRows.forEach(row => {
        const priceElement = row.querySelector('.price');
        const changeElement = row.querySelector('.change');
        
        if (priceElement && changeElement) {
            setInterval(() => {
                animatePriceChange(priceElement, changeElement);
            }, Math.random() * 5000 + 3000); // Random interval between 3-8 seconds
        }
    });
}

function animatePriceChange(priceElement, changeElement) {
    const currentPrice = parseFloat(priceElement.textContent.replace(/[$,]/g, ''));
    const change = (Math.random() - 0.5) * 100;
    const newPrice = currentPrice + change;
    const changePercent = (change / currentPrice) * 100;
    
    // Update price with animation
    priceElement.style.transition = 'color 0.3s ease';
    priceElement.textContent = '$' + newPrice.toFixed(2);
    
    // Update change
    changeElement.textContent = (changePercent > 0 ? '+' : '') + changePercent.toFixed(2) + '%';
    
    // Update colors
    if (changePercent > 0) {
        priceElement.className = 'price up';
        changeElement.className = 'change up';
    } else {
        priceElement.className = 'price down';
        changeElement.className = 'change down';
    }
    
    // Reset color transition
    setTimeout(() => {
        priceElement.style.transition = '';
    }, 300);
}

// Form handling
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            
            // Reset form
            this.reset();
        });
    }
    
    // Plan button handlers
    const planButtons = document.querySelectorAll('.plan-btn');
    planButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const planName = this.closest('.pricing-card').querySelector('h3').textContent;
            showNotification(`Redirecting to ${planName} plan...`, 'info');
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1rem;
        color: var(--text-primary);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: var(--shadow-card);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .pricing-card, .hero-content, .hero-visual');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Particle effects
function initParticleEffects() {
    const particlesContainer = document.querySelector('.floating-particles');
    if (!particlesContainer) return;
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 10;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(0, 212, 255, ${Math.random() * 0.5 + 0.1});
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        animation: float ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
        pointer-events: none;
    `;
    
    container.appendChild(particle);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
        }
    }
    
    .feature-card,
    .pricing-card,
    .hero-content,
    .hero-visual {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .feature-card.animate-in,
    .pricing-card.animate-in,
    .hero-content.animate-in,
    .hero-visual.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .navbar.scrolled {
        background: rgba(10, 10, 10, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 70px;
            left: 0;
            width: 100%;
            background: var(--bg-primary);
            border-top: 1px solid var(--border-color);
            padding: 2rem;
            gap: 1rem;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);

// Terminal controls functionality
document.addEventListener('DOMContentLoaded', function() {
    const controls = document.querySelectorAll('.control');
    
    controls.forEach(control => {
        control.addEventListener('click', function() {
            // Add click effect
            this.style.transform = 'scale(0.8)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

// Even Contracts specific animations
function initEvenContractsAnimations() {
    // Add special glow effect to Even Contracts feature card
    const evenContractsCard = document.querySelector('.feature-card:has(h3:contains("Even Contracts"))');
    if (evenContractsCard) {
        evenContractsCard.style.animation = 'even-contracts-glow 2s ease-in-out infinite alternate';
    }
}

// Add Even Contracts specific CSS
const evenContractsStyle = document.createElement('style');
evenContractsStyle.textContent = `
    @keyframes even-contracts-glow {
        0% {
            box-shadow: var(--shadow-card), 0 0 20px rgba(0, 212, 255, 0.2);
        }
        100% {
            box-shadow: var(--shadow-card), 0 0 40px rgba(0, 212, 255, 0.4);
        }
    }
    
    .feature-card h3:contains("Even Contracts") {
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
`;
document.head.appendChild(evenContractsStyle);

// Initialize Even Contracts animations
document.addEventListener('DOMContentLoaded', initEvenContractsAnimations);
