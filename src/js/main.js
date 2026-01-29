// ============ FONCTIONS UTILITAIRES ============

function isMobile() {
    return window.innerWidth <= 768;
}

// ============ INITIALISATION DE L'APPLICATION ============

async function initializeApp() {
    console.log('Initialisation de l\'application CIP SARLU...');
    
    // 1. Initialiser AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        disable: isMobile()
    });
    
    // 2. Initialiser toutes les fonctionnalités
    initializePreloader();
    initializeCustomCursor();
    initializeParticles();
    initializeNavigation();
    initializeCarousel();
    initializeForm();
    initializeScrollTop();
    initializeEventListeners();
    
    console.log('Application initialisée avec succès!');
}

// ============ PRÉLOADER ============

function initializePreloader() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.classList.add('hidden');
                preloader.style.display = 'none';
            }
        }, 1000);
    });
}

// ============ CURSEUR PERSONNALISÉ ============

function initializeCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Vérifier si les éléments de curseur existent et si ce n'est pas mobile
    if (!isMobile() && cursor && cursorFollower) {
        // Suivre le mouvement de la souris
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Délai pour l'effet de suivi
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 100);
        });
        
        // Effet au survol des éléments interactifs
        document.querySelectorAll('a, button, .project-card, .service-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.backgroundColor = 'rgba(41, 219, 25, 0.2)';
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.2)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'transparent';
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    } else if (cursor && cursorFollower) {
        // Masquer le curseur personnalisé sur mobile
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
        document.body.classList.add('mobile-device');
    }
}

// ============ PARTICULES ANIMÉES ============

function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    
    if (!particlesContainer) return;
    
    // Créer 30 particules animées
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particlesContainer.appendChild(particle);
    }
}

// ============ NAVIGATION (EFFET SCROLL) ============

function initializeNavigation() {
    const nav = document.getElementById('nav');
    
    if (!nav) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// ============ CARROUSEL DE SERVICES ============

let currentSlide = 0;
let autoPlayInterval;

function initializeCarousel() {
    const track = document.getElementById('carouselTrack');
    
    if (!track) return;
    
    const slides = document.querySelectorAll('.service-card');
    const totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    // === CRÉER LES INDICATEURS ===
    const indicatorsContainer = document.getElementById('indicators');
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            if (i === 0) indicator.classList.add('active');
            indicator.setAttribute('aria-label', `Aller au slide ${i + 1}`);
            indicator.setAttribute('aria-current', i === 0 ? 'true' : 'false');
            indicator.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    // === BOUTONS DE NAVIGATION ===
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // === MISE À JOUR INITIALE ===
    updateCarousel();
    
    // === AUTO-PLAY ===
    startAutoPlay();
    
    // === PAUSE/REPRISE AU SURVOL ===
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carouselWrapper.addEventListener('mouseleave', startAutoPlay);
        
        // === GESTION DU SWIPE (MOBILE) ===
        if (isMobile()) {
            let touchStartX = 0;
            let touchEndX = 0;
            
            track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                clearInterval(autoPlayInterval);
            });
            
            track.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoPlay();
            });
            
            function handleSwipe() {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
            }
        }
    }
    
    // === NAVIGATION AU CLAVIER ===
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    const indicators = document.querySelectorAll('.indicator');
    
    if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
        indicator.setAttribute('aria-current', index === currentSlide ? 'true' : 'false');
    });
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.service-card');
    if (slides.length === 0) return;
    
    currentSlide = (index + slides.length) % slides.length;
    updateCarousel();
}

function nextSlide() {
    const slides = document.querySelectorAll('.service-card');
    if (slides.length === 0) return;
    
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
}

function prevSlide() {
    const slides = document.querySelectorAll('.service-card');
    if (slides.length === 0) return;
    
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
}

function startAutoPlay() {
    clearInterval(autoPlayInterval);
    const interval = isMobile() ? 8000 : 6000; // 8s sur mobile, 6s sur desktop
    autoPlayInterval = setInterval(nextSlide, interval);
}

// ============ FORMULAIRE DE CONTACT ============

function initializeForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // === REGEX DE VALIDATION ===
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+\d\s\-\(\)]{10,}$/;
    
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    // === VALIDATION EN TEMPS RÉEL ===
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            this.style.borderColor = emailRegex.test(this.value) ? '#28a745' : '#dc3545';
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.style.borderColor = phoneRegex.test(this.value) ? '#28a745' : '#dc3545';
        });
    }
    
    // === SOUMISSION DU FORMULAIRE ===
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les valeurs
        const name = document.getElementById('name')?.value?.trim() || '';
        const email = document.getElementById('email')?.value || '';
        const phone = document.getElementById('phone')?.value || '';
        const service = document.getElementById('service')?.value || '';
        const message = document.getElementById('message')?.value?.trim() || '';
        
        // === VALIDATION ===
        let isValid = true;
        const validations = [
            { id: 'name', valid: name.length > 0, required: true },
            { id: 'email', valid: emailRegex.test(email), required: true },
            { id: 'phone', valid: phoneRegex.test(phone), required: true },
            { id: 'service', valid: service.length > 0, required: true },
            { id: 'message', valid: message.length > 0, required: true }
        ];
        
        // Appliquer la validation visuelle
        validations.forEach(validation => {
            const element = document.getElementById(validation.id);
            if (element) {
                element.style.borderColor = validation.valid ? '#28a745' : '#dc3545';
                if (!validation.valid) isValid = false;
            }
        });
        
        if (!isValid) {
            alert('Veuillez corriger les erreurs dans le formulaire.');
            return;
        }
        
        // === SIMULATION D'ENVOI ===
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Message de succès
            alert('✅ Merci ! Votre message a été envoyé avec succès.\nNous vous contacterons très bientôt.');
            
            // Réinitialiser le formulaire
            contactForm.reset();
            
            // Réinitialiser les bordures
            document.querySelectorAll('.form-control').forEach(input => {
                input.style.borderColor = '';
            });
            
            // Restaurer le bouton
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Optionnel : Scroller vers le haut
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1500);
    });
}

// ============ BOUTON SCROLL TO TOP ============

function initializeScrollTop() {
    const scrollTop = document.getElementById('scrollTop');
    
    if (!scrollTop) return;
    
    // Afficher/masquer le bouton selon le scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });
    
    // Action au clic
    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============ ÉVÉNEMENTS GÉNÉRAUX ============

function initializeEventListeners() {
    // === SCROLL FLUIDE POUR ANCRES ===
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        
        if (!anchor || anchor.getAttribute('href') === '#') return;
        
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            
            // Calculer la position en tenant compte de la navbar
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Fermer le menu mobile si ouvert
            if (isMobile()) {
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            }
        }
    });
    
    // === GESTION DES IMAGES EN ERREUR ===
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            this.style.display = 'none';
            const parent = this.parentElement;
            
            const isServiceImage = parent.classList.contains('service-image');
            const isProjectImage = parent.classList.contains('project-image');
            const isAboutImage = parent.classList.contains('about-image-main');
            
            if (isServiceImage || isProjectImage || isAboutImage) {
                parent.style.background = 'linear-gradient(135deg, #29db19, #00d4ff)';
                parent.style.display = 'flex';
                parent.style.alignItems = 'center';
                parent.style.justifyContent = 'center';
                parent.style.color = 'white';
                parent.style.fontWeight = 'bold';
                parent.style.textAlign = 'center';
                parent.style.padding = '20px';
                parent.style.minHeight = '300px';
                
                let typeText = 'Image';
                if (isServiceImage) typeText = 'Service';
                if (isProjectImage) typeText = 'Projet';
                if (isAboutImage) typeText = 'À Propos';
                
                parent.innerHTML = `
                    <div>
                        <div style="font-size: 24px; margin-bottom: 10px;">
                            <i class="fas fa-image"></i>
                        </div>
                        <div>Image non disponible</div>
                        <small style="opacity: 0.8;">${typeText} - CIP SARLU</small>
                    </div>
                `;
            }
        };
    });
    
    // === GESTION DU REDIMENSIONNEMENT ===
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const track = document.getElementById('carouselTrack');
            if (track) {
                updateCarousel();
                clearInterval(autoPlayInterval);
                startAutoPlay();
            }
        }, 250);
    });
}

// ============ POINT D'ENTRÉE ============

// Démarrer l'application quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeApp, 100);
    });
} else {
    // Si le DOM est déjà chargé
    setTimeout(initializeApp, 100);
}