document.addEventListener('DOMContentLoaded', () => {

    // 1. Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // 2. Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active nav link highlighting
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 85) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });


    // 3. Typewriter effect for the hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        element.style.minHeight = 'auto'; // Reset min-height before typing

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                 element.style.borderRight = 'none'; // Remove cursor after typing
            }
        }
        type();
    }

    const heroTitle = document.querySelector('#hero h1');
    if(heroTitle) {
        // Add a blinking cursor effect
        heroTitle.style.borderRight = '3px solid var(--indigo)';
        heroTitle.style.display = 'inline-block';
        heroTitle.style.paddingRight = '5px';
        typeWriter(heroTitle, 'Исследуйте галактику');
    }

    // 4. Animated counters
    function animateCounter(element) {
        const target = +element.dataset.target;
        const duration = 2000;
        let start = 0;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // 5. Testimonials slider
    class Slider {
        constructor(container) {
            this.container = container;
            if (!this.container) return;
            this.slides = this.container.querySelectorAll('.slide');
            this.dotsContainer = this.container.querySelector('.slider-dots');
            this.nextBtn = this.container.querySelector('.next');
            this.prevBtn = this.container.querySelector('.prev');
            this.currentIndex = 0;
            this.autoplayInterval = null;

            this.init();
        }

        init() {
            if (this.slides.length === 0) return;
            this.createDots();
            this.showSlide(0);
            this.startAutoplay();
            this.addEventListeners();
        }

        createDots() {
            this.slides.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                dot.addEventListener('click', () => this.showSlide(i));
                this.dotsContainer.appendChild(dot);
            });
        }

        showSlide(index, direction = 'next') {
            const currentSlide = this.slides[this.currentIndex];
            const nextSlide = this.slides[index];

            // Handle transition direction
            if (direction === 'next') {
                currentSlide.classList.add('exiting');
                nextSlide.classList.add('active');
            } else {
                nextSlide.classList.add('active', 'instant');
                currentSlide.classList.add('exiting-prev');
            }
            
            // Clean up classes after transition
            setTimeout(() => {
                currentSlide.classList.remove('active', 'exiting', 'exiting-prev');
                nextSlide.classList.remove('instant');
            }, 500); // Match CSS transition duration

            this.currentIndex = index;
            this.updateDots();
            this.resetAutoplay();
        }

        next() {
            const nextIndex = (this.currentIndex + 1) % this.slides.length;
            this.showSlide(nextIndex, 'next');
        }

        prev() {
            const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
            this.showSlide(prevIndex, 'prev');
        }

        updateDots() {
            const dots = this.dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentIndex);
            });
        }

        startAutoplay() {
            this.autoplayInterval = setInterval(() => this.next(), 5000);
        }

        stopAutoplay() {
            clearInterval(this.autoplayInterval);
        }
        
        resetAutoplay() {
            this.stopAutoplay();
            this.startAutoplay();
        }

        addEventListeners() {
            this.nextBtn.addEventListener('click', () => this.next());
            this.prevBtn.addEventListener('click', () => this.prev());
        }
    }

    new Slider(document.querySelector('.slider-container'));

    // 6. Form validation
    class FormValidator {
        constructor(form) {
            this.form = form;
            if (!this.form) return;
            this.fields = {
                name: { regex: /^[а-яА-ЯёЁa-zA-Z\s]{2,}$/, error: 'Минимум 2 буквы' },
                email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: 'Некорректный email' },
                phone: { regex: /^[\d\s\-\+\(\)]{10,}$/, error: 'Некорректный телефон' }
            };
            this.init();
        }

        init() {
            Object.keys(this.fields).forEach(fieldName => {
                const input = this.form.querySelector(`[name="${fieldName}"]`);
                if(input) {
                    input.addEventListener('blur', () => this.validateField(fieldName));
                    input.addEventListener('input', () => this.clearError(fieldName));
                }
            });
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        validateField(fieldName) {
            const input = this.form.querySelector(`[name="${fieldName}"]`);
            const value = input.value.trim();
            const field = this.fields[fieldName];

            if (!field.regex.test(value)) {
                this.showError(input, field.error);
                return false;
            }
            this.showSuccess(input);
            return true;
        }

        showError(input, message) {
            input.classList.add('error');
            input.classList.remove('success');
            const errorDiv = input.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('error-message')) {
                errorDiv.textContent = message;
            }
        }

        showSuccess(input) {
            input.classList.remove('error');
            input.classList.add('success');
            const errorDiv = input.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('error-message')) {
                errorDiv.textContent = '';
            }
        }

        clearError(fieldName) {
            const input = this.form.querySelector(`[name="${fieldName}"]`);
            input.classList.remove('error');
            const errorDiv = input.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('error-message')) {
                errorDiv.textContent = '';
            }
        }

        handleSubmit(e) {
            e.preventDefault();
            let isValid = true;
            Object.keys(this.fields).forEach(fieldName => {
                if (!this.validateField(fieldName)) {
                    isValid = false;
                }
            });

            const agreement = this.form.querySelector('#agreement');
            if(agreement && !agreement.checked) {
                isValid = false;
                // You might want to show an error for the checkbox as well
                alert('Необходимо согласиться на обработку данных.');
            }

            if (isValid) {
                this.submitForm();
            }
        }

        submitForm() {
            const button = this.form.querySelector('button[type="submit"]');
            button.disabled = true;
            button.innerHTML = '<span class="spinner"></span> Отправка...';

            setTimeout(() => {
                button.innerHTML = '✓ Отправлено!';
                button.style.background = '#10b981';
                this.form.reset();
                document.querySelectorAll('.contact-form input.success').forEach(el => el.classList.remove('success'));

                setTimeout(() => {
                    button.disabled = false;
                    button.innerHTML = 'Отправить';
                    button.style.background = '';
                }, 3000);
            }, 1500);
        }
    }

    new FormValidator(document.querySelector('.contact-form'));

    // 7. Parallax effect
    const parallaxElements = document.querySelectorAll('.parallax');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            el.style.backgroundPositionY = `${scrolled * speed}px`;
        });
    });

    // 8. Pricing toggle
    const pricingToggle = document.querySelector('.pricing-toggle');
    if(pricingToggle) {
        pricingToggle.addEventListener('change', (e) => {
            const isYearly = e.target.checked;
            document.querySelectorAll('.pricing-card').forEach(card => {
                const priceEl = card.querySelector('.price');
                const monthly = priceEl.dataset.monthly;
                const yearly = priceEl.dataset.yearly;

                priceEl.style.opacity = '0';
                setTimeout(() => {
                    priceEl.textContent = isYearly ? yearly : monthly;
                    priceEl.style.opacity = '1';
                }, 200);
            });
        });
    }

    // 9. Burger menu
    const burger = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    if(burger) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    burger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }
    
    // 10. Particle effect for hero section
    const canvas = document.getElementById('particle-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray;

        const mouse = {
            x: null,
            y: null,
            radius: 150
        }

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                
                // check mouse collision
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if(distance < mouse.radius + this.size){
                    if(mouse.x < this.x && this.x < canvas.width - this.size * 10){
                        this.x += 5;
                    }
                     if(mouse.x > this.x && this.x > this.size * 10){
                        this.x -= 5;
                    }
                     if(mouse.y < this.y && this.y < canvas.height - this.size * 10){
                        this.y += 5;
                    }
                     if(mouse.y > this.y && this.y > this.size * 10){
                        this.y -= 5;
                    }
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * .4) - 0.2;
                let directionY = (Math.random() * .4) - 0.2;
                let color = 'rgba(255, 255, 255, 0.6)';

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
        }
        
        initParticles();
        animateParticles();

        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            initParticles();
        });
    }
});
