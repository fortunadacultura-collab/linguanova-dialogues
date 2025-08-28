// Navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Setup mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            
            // Fechar os menus de idiomas se estiverem abertos
            const languageSelectors = document.querySelectorAll('.language-selector');
            languageSelectors.forEach(selector => {
                if (selector.classList.contains('active')) {
                    selector.classList.remove('active');
                }
            });
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-links a, .dropdown-item').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-links') && !event.target.closest('.mobile-menu-toggle') && navLinks.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Toggle dropdown menus on mobile
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                const dropdown = this.parentElement;
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Seletor de idiomas para Learning
    const learningLanguageSelector = document.querySelector('#learning-language').closest('.language-selector');
    const learningSelectedLanguage = document.getElementById('learning-language');
    const learningLanguageOptions = document.getElementById('learning-language-options');
    
    if (learningLanguageSelector && learningSelectedLanguage && learningLanguageOptions) {
        // Abrir/fechar o menu de idiomas
        learningSelectedLanguage.addEventListener('click', function(e) {
            e.stopPropagation();
            learningLanguageSelector.classList.toggle('active');
            
            // Fechar o outro seletor se estiver aberto
            const userLanguageSelector = document.querySelector('#user-language').closest('.language-selector');
            if (userLanguageSelector && userLanguageSelector.classList.contains('active')) {
                userLanguageSelector.classList.remove('active');
            }
        });
        
        // Selecionar um idioma
        learningLanguageOptions.querySelectorAll('li').forEach(option => {
            option.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const flag = this.getAttribute('data-flag');
                const text = this.querySelector('span').textContent;
                
                // Atualizar o idioma selecionado
                learningSelectedLanguage.querySelector('img').src = `https://flagcdn.com/w20/${flag}.png`;
                learningSelectedLanguage.querySelector('span').textContent = text;
                
                // Marcar como selecionado
                learningLanguageOptions.querySelectorAll('li').forEach(li => {
                    li.classList.remove('selected');
                });
                this.classList.add('selected');
                
                // Fechar o menu
                learningLanguageSelector.classList.remove('active');
                
                // Disparar evento de mudança
                const event = new Event('change');
                document.getElementById('learning-language').dispatchEvent(event);
            });
        });
    }
    
    // Seletor de idiomas para User
    const userLanguageSelector = document.querySelector('#user-language').closest('.language-selector');
    const userSelectedLanguage = document.getElementById('user-language');
    const userLanguageOptions = document.getElementById('user-language-options');
    
    if (userLanguageSelector && userSelectedLanguage && userLanguageOptions) {
        // Abrir/fechar o menu de idiomas
        userSelectedLanguage.addEventListener('click', function(e) {
            e.stopPropagation();
            userLanguageSelector.classList.toggle('active');
            
            // Fechar o outro seletor se estiver aberto
            const learningLanguageSelector = document.querySelector('#learning-language').closest('.language-selector');
            if (learningLanguageSelector && learningLanguageSelector.classList.contains('active')) {
                learningLanguageSelector.classList.remove('active');
            }
        });
        
        // Selecionar um idioma
        userLanguageOptions.querySelectorAll('li').forEach(option => {
            option.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const flag = this.getAttribute('data-flag');
                const text = this.querySelector('span').textContent;
                
                // Atualizar o idioma selecionado
                userSelectedLanguage.querySelector('img').src = `https://flagcdn.com/w20/${flag}.png`;
                userSelectedLanguage.querySelector('span').textContent = text;
                
                // Marcar como selecionado
                userLanguageOptions.querySelectorAll('li').forEach(li => {
                    li.classList.remove('selected');
                });
                this.classList.add('selected');
                
                // Fechar o menu
                userLanguageSelector.classList.remove('active');
                
                // Disparar evento de mudança
                const event = new Event('change');
                document.getElementById('user-language').dispatchEvent(event);
            });
        });
    }
    
    // Fechar os menus ao clicar fora
    document.addEventListener('click', function(event) {
        const languageSelectors = document.querySelectorAll('.language-selector');
        languageSelectors.forEach(selector => {
            if (!event.target.closest('.language-selector') && selector.classList.contains('active')) {
                selector.classList.remove('active');
            }
        });
        
        // Fechar dropdowns ao clicar fora
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            if (!event.target.closest('.dropdown') && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
            }
        });
    });
    
    // Prevenir que o clique nos menus propague para o documento
    const languageOptions = document.querySelectorAll('.language-options');
    languageOptions.forEach(options => {
        options.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // Prevenir que o clique nos dropdowns propague para o documento
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    dropdownMenus.forEach(menu => {
        menu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
});

// Logout function
function logout() {
    // In a real app, this would handle logout
    console.log('Logging out');
    alert('Funcionalidade de logout');
}