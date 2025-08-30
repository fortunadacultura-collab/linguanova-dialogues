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
            
            // Fechar dropdowns abertos
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                if (dropdown.classList.contains('active')) {
                    dropdown.classList.remove('active');
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
    
    // Inicializar dropdowns
    initDropdowns();
    
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
            
            // Fechar dropdowns abertos
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                if (dropdown.classList.contains('active')) {
                    dropdown.classList.remove('active');
                }
            });
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
                
                // Atualizar a página com o novo idioma
                if (window.updateUITexts) {
                    window.updateUITexts(value);
                }
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
            
            // Fechar dropdowns abertos
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                if (dropdown.classList.contains('active')) {
                    dropdown.classList.remove('active');
                }
            });
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
                
                // Atualizar a página com o novo idioma
                if (window.updateUITexts) {
                    window.updateUITexts(value);
                }
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
        
        // Fechar dropdowns ao clicar fora (apenas para desktop)
        if (window.innerWidth > 900) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                if (!event.target.closest('.dropdown') && dropdown.classList.contains('active')) {
                    dropdown.classList.remove('active');
                }
            });
        }
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

// Função para inicializar os dropdowns - CORRIGIDA
function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        const dropdown = toggle.parentElement;
        
        // Comportamento para desktop (hover)
        toggle.addEventListener('mouseenter', function() {
            if (window.innerWidth > 900) {
                closeAllDropdowns();
                dropdown.classList.add('active');
            }
        });
        
        // Manter dropdown aberto quando o mouse está sobre ele
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 900) {
                this.classList.add('active');
            }
        });
        
        // Fechar dropdown quando o mouse sai
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 900) {
                this.classList.remove('active');
            }
        });
        
        // Comportamento para mobile (click)
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                e.stopPropagation();
                
                // Fechar todos os outros dropdowns
                closeAllDropdownsExcept(dropdown);
                
                // Alternar o dropdown atual
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Fechar dropdowns ao clicar fora deles
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });
    
    // Fechar dropdowns ao tocar fora (mobile)
    document.addEventListener('touchstart', function(event) {
        if (!event.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });
}

// Função para fechar todos os dropdowns
function closeAllDropdowns() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

// Função para fechar todos os dropdowns exceto um específico
function closeAllDropdownsExcept(exceptDropdown) {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        if (dropdown !== exceptDropdown) {
            dropdown.classList.remove('active');
        }
    });
}

// Logout function
function logout() {
    // In a real app, this would handle logout
    console.log('Logging out');
    alert('Funcionalidade de logout');
}

// Função para atualizar textos da UI (APENAS NAVBAR)
function updateNavbarTexts(langCode) {
    // Verificar se o appConfig existe e tem traduções
    const translations = window.appConfig && window.appConfig.data && window.appConfig.data.translations 
        ? window.appConfig.data.translations[langCode] || window.appConfig.data.translations['pt']
        : {};

    // Atualizar apenas os textos específicos da navbar
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}

// Atualizar botões de tradução nos diálogos (função auxiliar para navbar)
function updateDialogueButtons(langCode) {
    // Verificar se o appConfig existe e tem traduções
    const translations = window.appConfig && window.appConfig.data && window.appConfig.data.translations 
        ? window.appConfig.data.translations[langCode] || window.appConfig.data.translations['pt']
        : {};
    
    document.querySelectorAll('.message-btn').forEach((button, index) => {
        if (index % 2 === 0) {
            // Botão de play/ouvir
            const btnText = button.querySelector('.btn-text');
            if (btnText && translations['Play']) {
                btnText.textContent = translations['Play'];
            }
        } else {
            // Botão de traduzir
            const btnText = button.querySelector('.btn-text');
            if (btnText && translations['Traduzir']) {
                btnText.textContent = translations['Traduzir'];
            }
        }
    });
}

// Adicionar função global para atualizar UI (se não existir)
if (typeof window.updateUITexts === 'undefined') {
    window.updateUITexts = function(langCode) {
        // Esta função será sobrescrita pelo app.js, mas serve como fallback
        updateNavbarTexts(langCode);
    };
}

// Debug function para verificar se o dropdown está funcionando
function debugDropdowns() {
    console.log('=== DEBUG DROPDOWNS ===');
    
    const dropdowns = document.querySelectorAll('.dropdown');
    console.log(`Número de dropdowns encontrados: ${dropdowns.length}`);
    
    dropdowns.forEach((dropdown, index) => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        console.log(`Dropdown ${index}:`);
        console.log(' - Elemento:', dropdown);
        console.log(' - Toggle:', toggle);
        console.log(' - Menu:', menu);
        console.log(' - Menu visível:', menu ? window.getComputedStyle(menu).display : 'N/A');
        console.log(' - Classe active:', dropdown.classList.contains('active'));
        console.log('---');
    });
}

// Inicializar debug (opcional - remover em produção)
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        debugDropdowns();
    }, 1000);
});