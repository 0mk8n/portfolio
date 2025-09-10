let currentSection = 'home';
let previousSection = 'home';

// Project data

function showSection(sectionId) {
    // Add fade out effect to current section
    const currentActiveSection = document.querySelector('.section.active');
    if (currentActiveSection) {
        currentActiveSection.style.opacity = '0';
        currentActiveSection.style.transform = 'translateY(-20px)';
    }

    setTimeout(() => {
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.opacity = '';
            section.style.transform = '';
        });

        // Show selected section with fade in effect
        const newSection = document.getElementById(sectionId);
        newSection.classList.add('active');
        newSection.style.opacity = '0';
        newSection.style.transform = 'translateY(20px)';
        
        // Animate in
        setTimeout(() => {
            newSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            newSection.style.opacity = '1';
            newSection.style.transform = 'translateY(0)';
        }, 10);

        // Update navigation
        updateNavigation(sectionId);
        
        // Store current section
        previousSection = currentSection;
        currentSection = sectionId;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
}

function updateNavigation(sectionId) {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    // Find and activate the correct button
    const activeBtn = Array.from(navBtns).find(btn => 
        btn.textContent.toLowerCase() === sectionId.toLowerCase() || 
        (sectionId === 'home' && btn.textContent.toLowerCase() === 'thuis') ||
        (sectionId === 'about' && btn.textContent.toLowerCase() === 'over mij') ||
        (sectionId === 'projects' && btn.textContent.toLowerCase() === 'projecten')
    );
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function showProject(projectId) {
    showLoadingAnimation();
    
    setTimeout(() => {
        hideLoadingAnimation();
        showSection(`project-${projectId}`);
    }, 800);
}

function goBack() {
    showSection(previousSection);
}

// Smooth scrolling for endless scroll effect
let isScrolling = false;

window.addEventListener('scroll', function() {
    if (!isScrolling) {
        window.requestAnimationFrame(function() {
            // Add parallax effect to large project items
            const scrolled = window.pageYOffset;
            const parallax = document.querySelectorAll('.project-item.large');
            const speed = 0.5;
            
            parallax.forEach(item => {
                const yPos = -(scrolled * speed);
                item.style.transform = `translateY(${yPos}px)`;
            });
            
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// Add interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    const projectItems = document.querySelectorAll('.project-item, .project-entry');
    
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
        
        // Add click animation
        item.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-2px) scale(0.98)';
        });
        
        item.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
    });
    
    // Add hover effect to navigation buttons
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            }
        });
    });
    
    
    
    // Add staggered animation for project entries
    const projectEntries = document.querySelectorAll('.project-entry');
    projectEntries.forEach((entry, index) => {
        entry.style.opacity = '0';
        entry.style.transform = 'translateY(20px)';
        entry.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    });
    
    // Animate project entries when projects section becomes visible
    const projectsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.id === 'projects') {
                const entries = entry.target.querySelectorAll('.project-entry');
                entries.forEach(projectEntry => {
                    projectEntry.style.opacity = '1';
                    projectEntry.style.transform = 'translateY(0)';
                });
                projectsObserver.unobserve(entry.target);
            }
        });
    });
    
    projectsObserver.observe(document.getElementById('projects'));
    
    
});

// Loading animation functions
function showLoadingAnimation() {
    hideLoadingAnimation(); // Remove any existing loading animation
    
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text">Project laden...</div>
        </div>
    `;
    
    // Add CSS styles
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const spinner = loading.querySelector('.loading-spinner');
    if (spinner) {
        spinner.style.cssText = `
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #333;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 10px;
        `;
    }
    
    const text = loading.querySelector('.loading-text');
    if (text) {
        text.style.cssText = `
            font-size: 16px;
            color: #333;
            font-weight: 500;
        `;
    }
    
    // Add spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loading);
    
    // Fade in
    setTimeout(() => {
        loading.style.opacity = '1';
    }, 10);
}

function hideLoadingAnimation() {
    const loading = document.querySelector('.loading-overlay');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(loading)) {
                document.body.removeChild(loading);
            }
        }, 300);
    }
}

// Particle effect for visual enhancement
function createParticleEffect() {
    const homeSection = document.getElementById('home');
    if (!homeSection) return;
    
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    homeSection.style.position = 'relative';
    homeSection.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    function resizeCanvas() {
        canvas.width = homeSection.offsetWidth;
        canvas.height = homeSection.offsetHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    function initParticles() {
        particles.length = 0;
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        });
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 100, 100, ${particle.opacity})`;
            ctx.fill();
        });
    }
    
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    initParticles();
    animate();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case '1':
            showSection('home');
            break;
        case '2':
            showSection('about');
            break;
        case '3':
            showSection('projects');
            break;
        case '4':
            showSection('contact');
            break;
        case 'Escape':
            if (currentSection === 'project-detail') {
                goBack();
            }
            break;
    }
});

// Add smooth scroll behavior for internal navigation
function smoothScrollTo(targetY, duration = 800) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    const startTime = performance.now();
    
    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeInOutQuart = progress < 0.5 
            ? 8 * progress * progress * progress * progress
            : 1 - 8 * (--progress) * progress * progress * progress;
        
        window.scrollTo(0, startY + diff * easeInOutQuart);
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

// Initialize the page
window.addEventListener('load', function() {
    // Ensure home section is active on load
    showSection('home');
    
    // Add loaded class for any CSS animations
    document.body.classList.add('loaded');
});
let currentPage = 0;

// Function to display the correct page
function showPage(index) {
    const pages = document.querySelectorAll('.page'); // Select all elements with class "page"
    pages.forEach((page, i) => {
        page.classList.remove('active'); // Hide all pages
        if (i === index) {
            page.classList.add('active'); // Show only the page that matches the index
        }
    });
}

// Function to navigate to the previous page
function prevPage() {
    const pages = document.querySelectorAll('.page'); // Select all pages
    if (currentPage > 0) {
        currentPage--; // Move to the previous page
        showPage(currentPage); // Update the displayed page
    }
}

// Function to navigate to the next page
function nextPage() {
    const pages = document.querySelectorAll('.page'); // Select all pages
    if (currentPage < pages.length - 1) {
        currentPage++; // Move to the next page
        showPage(currentPage); // Update the displayed page
    }
}

// Initialize by showing the first page
showPage(currentPage);


let currentPage2 = 0;

// Function to display the correct page
function showPageTwo(index) {
    const pages = document.querySelectorAll('.page2'); // Select all elements with class "page"
    pages.forEach((page, i) => {
        page.classList.remove('active'); // Hide all pages
        if (i === index) {
            page.classList.add('active'); // Show only the page that matches the index
        }
    });
}

// Function to navigate to the previous page
function prevPageTwo() {
    const pages = document.querySelectorAll('.page2'); // Select all pages
    if (currentPage > 0) {
        currentPage--; // Move to the previous page
        showPageTwo(currentPage); // Update the displayed page
    }
}

// Function to navigate to the next page
function nextPageTwo() {
    const pages = document.querySelectorAll('.page2'); // Select all pages
    if (currentPage < pages.length - 1) {
        currentPage++; // Move to the next page
        showPageTwo(currentPage); // Update the displayed page
    }
}



// Initialize by showing the first page
showPageTwo(currentPage);
