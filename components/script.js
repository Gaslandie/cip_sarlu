// Fonction pour charger les composants
async function loadComponents() {
    try {
        // Charger le preloader
        const preloaderResponse = await fetch('components/preloader.html');
        const preloaderHTML = await preloaderResponse.text();
        
        // Charger la navbar
        const navbarResponse = await fetch('components/navbar.html');
        const navbarHTML = await navbarResponse.text();
        
        // Charger le footer
        const footerResponse = await fetch('components/footer.html');
        const footerHTML = await footerResponse.text();
        
        // Insérer les composants dans le body
        document.body.insertAdjacentHTML('afterbegin', preloaderHTML);
        document.body.insertAdjacentHTML('afterbegin', navbarHTML);
        document.body.insertAdjacentHTML('beforeend', footerHTML);
        
        // Initialiser les événements après chargement
        initializeEvents();
        
        // Cacher le preloader après 1 seconde
        setTimeout(() => {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.classList.add('hidden');
            }
        }, 1000);
        
    } catch (error) {
        console.error('Erreur lors du chargement des composants:', error);
        
        // Insérer des composants de secours si le chargement échoue
        const fallbackHTML = `
            <nav class="navbar navbar-expand-lg navbar-dark" id="nav">
                <div class="container">
                    <a class="navbar-brand" href="index.html">
                        <div class="logo">CIP</div>
                        <div class="logo-text">CIP SARLU</div>
                    </a>
                </div>
            </nav>
            
            <div class="preloader hidden">
                <div class="loader"></div>
            </div>
            
            <footer class="section-dark">
                <div class="container">
                    <p>© 2024 CIP SARLU</p>
                </div>
            </footer>
            
            <div class="scroll-top" id="scrollTop">
                <i class="fas fa-arrow-up"></i>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', fallbackHTML);
    }
}

// Fonction pour initialiser les événements
function initializeEvents() {
    // ============ NAVIGATION SCROLL ============
    const nav = document.getElementById('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }
    
    // ============ SCROLL TO TOP ============
    const scrollTop = document.getElementById('scrollTop');
    if (scrollTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTop.classList.add('visible');
            } else {
                scrollTop.classList.remove('visible');
            }
        });
        
        scrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // ============ SMOOTH SCROLL POUR ANCRES ============
    document.addEventListener('click', function(e) {
        if (e.target.closest('a[href^="#"]')) {
            const targetId = e.target.closest('a[href^="#"]').getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fermer le menu mobile si ouvert
                if (window.innerWidth <= 768) {
                    const navbarCollapse = document.getElementById('navbarNav');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) bsCollapse.hide();
                    }
                }
            }
        }
    });
    
    // ============ GESTION DES IMAGES EN ERREUR ============
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            this.style.display = 'none';
            const parent = this.parentElement;
            if (parent.classList.contains('service-image') || 
                parent.classList.contains('project-image') ||
                parent.classList.contains('about-image-main')) {
                
                parent.style.background = 'linear-gradient(135deg, var(--primary-green), var(--primary-blue))';
                parent.style.display = 'flex';
                parent.style.alignItems = 'center';
                parent.style.justifyContent = 'center';
                parent.style.color = 'white';
                parent.style.fontWeight = 'bold';
                parent.style.textAlign = 'center';
                parent.style.padding = '20px';
                
                if (parent.classList.contains('service-image')) {
                    parent.innerHTML = '<div>Image non disponible<br><small>Service CIP SARLU</small></div>';
                } else if (parent.classList.contains('project-image')) {
                    parent.innerHTML = '<div>Image non disponible<br><small>Projet CIP SARLU</small></div>';
                } else {
                    parent.innerHTML = '<div>Image non disponible<br><small>CIP SARLU</small></div>';
                }
            }
        };
    });
}

// Charger les composants lorsque la page est prête
document.addEventListener('DOMContentLoaded', loadComponents);