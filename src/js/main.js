// ============ CHARGEMENT DES COMPOSANTS ============

async function loadComponent(componentName) {
    try {
        // Tous les fichiers HTML sont à la racine, donc on utilise toujours le même chemin
        const basePath = 'src/components/';
        
        const pathname = window.location.pathname;
        console.log(`📍 Chemin actuel: ${pathname}`);
        
        const fullPath = `${basePath}${componentName}.html`;
        console.log(`📦 Tentative de chargement: ${fullPath}`);
        
        const response = await fetch(fullPath);
        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
        }
        
        const html = await response.text();
        console.log(`✅ Composant chargé avec succès: ${componentName}`);
        return html;
    } catch (error) {
        console.error(`❌ Erreur de chargement du composant ${componentName}:`, error);
        return null;
    }
}

async function loadAllComponents() {
    console.log('🔄 Début du chargement des composants...');
    
    try {
        // 1. Charger et insérer le Preloader
        const preloaderHtml = await loadComponent('preloader');
        if (preloaderHtml) {
            const preloaderContainer = document.getElementById('preloader-container');
            if (preloaderContainer) {
                preloaderContainer.innerHTML = preloaderHtml;
                console.log('✅ Preloader inséré dans #preloader-container');
            } else {
                console.warn('⚠️ #preloader-container non trouvé');
            }
        } else {
            console.warn('⚠️ Preloader HTML non chargé');
        }
        
        // 2. Charger et insérer la Navbar
        const navbarHtml = await loadComponent('navbar');
        if (navbarHtml) {
            const navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                navbarContainer.innerHTML = navbarHtml;
                console.log('✅ Navbar insérée dans #navbar-container');
            } else {
                console.warn('⚠️ #navbar-container non trouvé');
            }
        } else {
            console.warn('⚠️ Navbar HTML non chargé');
        }
        
        // 3. Charger et insérer le Footer
        const footerHtml = await loadComponent('footer');
        if (footerHtml) {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = footerHtml;
                console.log('✅ Footer inséré dans #footer-container');
            } else {
                console.warn('⚠️ #footer-container non trouvé');
            }
        } else {
            console.warn('⚠️ Footer HTML non chargé');
        }
        
        console.log('✅ Tous les composants ont été traités');
        return true;
    } catch (error) {
        console.error('❌ Erreur globale lors du chargement:', error);
        return false;
    }
}

// ============ FONCTIONS UTILITAIRES ============

function isMobile() {
    return window.innerWidth <= 768;
}

// ============ INITIALISATION DE L'APPLICATION ============

async function initializeApp() {
    console.log('🚀 Initialisation de l\'application CIP SARLU...');
    console.log('📍 URL actuelle:', window.location.href);
    console.log('📍 Pathname:', window.location.pathname);
    
    // 0. Charger les composants D'ABORD
    console.log('\n--- ÉTAPE 1: Chargement des composants ---');
    await loadAllComponents();
    
    // Attendre un peu pour que le DOM soit à jour
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log('\n--- ÉTAPE 2: Initialisation des fonctionnalités ---');
    
    // 1. Initialiser AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            disable: isMobile()
        });
        console.log('✅ AOS initialisé');
    } else {
        console.warn('⚠️ AOS non disponible');
    }
    
    // 2. Initialiser toutes les fonctionnalités
    initializePreloader();
    initializeCustomCursor();
    initializeParticles();
    initializeTopBar();
    initializeNavigation();
    initializeCarousel();
    initializeForm();
    initializeScrollTop();
    initializeEventListeners();
    
    console.log('\n✅ Application complètement initialisée!');
}

// ============ PRÉLOADER ============

function initializePreloader() {
    const hidePreloader = () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
                console.log('✅ Preloader caché');
            }, 500);
        } else {
            console.warn('⚠️ .preloader non trouvé');
        }
    };
    
    // Cacher le preloader après le chargement
    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 800);
    });
    
    // Sécurité: cacher le preloader après 5 secondes même s'il y a une erreur
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader && preloader.style.display !== 'none') {
            console.warn('⚠️ Forçage du masquage du preloader après 5 secondes');
            hidePreloader();
        }
    }, 5000);
}

// ============ CURSEUR PERSONNALISÉ ============

function initializeCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) {
        console.warn('⚠️ Curseur personnalisé non trouvé');
        return;
    }
    
    if (!isMobile()) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 100);
        });
        
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
        console.log('✅ Curseur personnalisé activé');
    } else {
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
        console.log('✅ Curseur désactivé (mobile)');
    }
}

// ============ PARTICULES ANIMÉES ============

function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    
    if (!particlesContainer) {
        console.warn('⚠️ Conteneur de particules non trouvé');
        return;
    }
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particlesContainer.appendChild(particle);
    }
    
    console.log('✅ Particules créées (30)');
}

// ============ TOP BAR (SCROLL ET LANGUE) ============

function initializeTopBar() {
    const topBar = document.querySelector('.top-bar');
    const nav = document.getElementById('nav');
    
    if (!topBar) {
        console.warn('⚠️ Top bar non trouvée');
        return;
    }
    
    // Comportement au scroll - cacher la top bar
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            topBar.classList.add('hidden');
            if (nav) nav.style.top = '0';
        } else {
            topBar.classList.remove('hidden');
            if (nav) nav.style.top = '40px';
        }
        
        lastScroll = currentScroll;
    });
    
    // Gestion du changement de langue
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            
            // Mettre à jour les classes actives
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Sauvegarder la préférence
            localStorage.setItem('cip-language', lang);
            
            // Ici vous pouvez ajouter la logique de traduction
            console.log(`🌐 Langue changée: ${lang.toUpperCase()}`);
            
            // Afficher une notification
            showLanguageNotification(lang);
        });
    });
    
    // Charger la langue sauvegardée
    const savedLang = localStorage.getItem('cip-language') || 'fr';
    const savedBtn = document.querySelector(`.lang-btn[data-lang="${savedLang}"]`);
    if (savedBtn) {
        langButtons.forEach(b => b.classList.remove('active'));
        savedBtn.classList.add('active');
    }
    
    console.log('✅ Top bar initialisée');
}

function showLanguageNotification(lang) {
    const messages = {
        'fr': 'Langue française sélectionnée',
        'en': 'English language selected'
    };
    
    // Supprimer notification existante
    const existingNotif = document.querySelector('.lang-notification');
    if (existingNotif) existingNotif.remove();
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = 'lang-notification';
    notification.innerHTML = `<i class="fas fa-globe"></i> ${messages[lang] || messages['fr']}`;
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Supprimer après 2 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ============ NAVIGATION (EFFET SCROLL) ============

function initializeNavigation() {
    const nav = document.getElementById('nav');
    
    if (!nav) {
        console.warn('⚠️ Navbar (#nav) non trouvée - vérifiez que navbar.html contient id="nav"');
        return;
    }
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    console.log('✅ Navigation scroll activée');
}

// ============ CARROUSEL DE SERVICES ============

let currentSlide = 0;
let autoPlayInterval;

function initializeCarousel() {
    const track = document.getElementById('carouselTrack');
    
    if (!track) {
        console.warn('⚠️ Carrousel non trouvé');
        return;
    }
    
    const slides = document.querySelectorAll('.service-card');
    const totalSlides = slides.length;
    
    console.log(`📊 Carrousel: ${totalSlides} slides trouvés`);
    
    if (totalSlides === 0) {
        console.warn('⚠️ Aucune slide trouvée');
        return;
    }
    
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
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    updateCarousel();
    startAutoPlay();
    
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carouselWrapper.addEventListener('mouseleave', startAutoPlay);
        
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
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    console.log('✅ Carrousel initialisé');
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
    const interval = isMobile() ? 8000 : 6000;
    autoPlayInterval = setInterval(nextSlide, interval);
}

// ============ FORMULAIRE DE CONTACT ============

function initializeForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.warn('⚠️ Formulaire de contact non trouvé');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+\d\s\-\(\)]{10,}$/;
    
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
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
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Ajouter la classe was-validated pour afficher les messages d'erreur
        contactForm.classList.add('was-validated');
        
        const name = document.getElementById('name')?.value?.trim() || '';
        const email = document.getElementById('email')?.value || '';
        const phone = document.getElementById('phone')?.value || '';
        const service = document.getElementById('service')?.value || '';
        const message = document.getElementById('message')?.value?.trim() || '';
        
        let isValid = true;
        const validations = [
            { id: 'name', valid: name.length > 0, required: true },
            { id: 'email', valid: emailRegex.test(email), required: true },
            { id: 'phone', valid: phoneRegex.test(phone), required: true },
            { id: 'service', valid: service.length > 0, required: true },
            { id: 'message', valid: message.length > 0, required: true }
        ];
        
        validations.forEach(validation => {
            const element = document.getElementById(validation.id);
            if (element) {
                if (validation.valid) {
                    element.classList.remove('is-invalid');
                    element.style.borderColor = '#28a745';
                } else {
                    element.classList.add('is-invalid');
                    element.style.borderColor = '#dc3545';
                    isValid = false;
                }
            }
        });
        
        if (!isValid) {
            // Afficher toast d'erreur si disponible, sinon ne rien faire (le formulaire HTML gère)
            const existingToast = document.querySelector('.error-toast');
            if (!existingToast) {
                const toast = document.createElement('div');
                toast.className = 'error-toast';
                toast.innerHTML = '<i class="fas fa-exclamation-circle"></i> Veuillez corriger les erreurs dans le formulaire.';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 4000);
            }
            return;
        }
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Afficher le modal de succès si disponible (page contact)
            const successModal = document.getElementById('successModal');
            if (successModal && typeof bootstrap !== 'undefined') {
                const modal = new bootstrap.Modal(successModal);
                modal.show();
            }
            
            contactForm.reset();
            contactForm.classList.remove('was-validated');
            
            document.querySelectorAll('.form-control').forEach(input => {
                input.style.borderColor = '';
                input.classList.remove('is-invalid');
            });
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
    
    console.log('✅ Formulaire initialisé');
}

// ============ BOUTON SCROLL TO TOP ============

function initializeScrollTop() {
    const scrollTop = document.getElementById('scrollTop');
    
    if (!scrollTop) {
        console.warn('⚠️ Bouton scroll to top non trouvé');
        return;
    }
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });
    
    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    console.log('✅ Scroll to top initialisé');
}

// ============ ÉVÉNEMENTS GÉNÉRAUX ============

function initializeEventListeners() {
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        
        if (!anchor || anchor.getAttribute('href') === '#') return;
        
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
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
    
    console.log('✅ Event listeners initialisés');
}

// ============ POINT D'ENTRÉE ============

console.log('\n' + '='.repeat(60));
console.log('🚀 CIP SARLU - Démarrage de l\'application');
console.log('='.repeat(60));

if (document.readyState === 'loading') {
    console.log('⏳ Document en cours de chargement...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ DOM Content Loaded');
        setTimeout(initializeApp, 100);
    });
} else {
    console.log('✅ DOM déjà chargé');
    setTimeout(initializeApp, 100);
}