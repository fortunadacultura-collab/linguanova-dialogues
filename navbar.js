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
    
    // Seletor de idiomas para Learning (agora com ícone)
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
                
                // Atualizar o idioma selecionado
                learningSelectedLanguage.querySelector('img').src = `https://flagcdn.com/w20/${flag}.png`;
                
                // Marcar como selecionado
                learningLanguageOptions.querySelectorAll('li').forEach(li => {
                    li.classList.remove('selected');
                });
                this.classList.add('selected');
                
                // Fechar o menu
                learningLanguageSelector.classList.remove('active');
                
                // Redirecionar para a página de estudo do idioma selecionado
                window.location.href = `study-${value}.html`;
            });
        });
    }
    
    // Seletor de idiomas para User (agora com ícone)
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
                
                // Atualizar o idioma selecionado
                userSelectedLanguage.querySelector('img').src = `https://flagcdn.com/w20/${flag}.png`;
                
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
    
    // Adicionar evento de clique para o menu do usuário
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', function() {
            // Em uma aplicação real, isso abriria um menu de perfil
            console.log('Abrir menu do usuário');
            alert('Menu do usuário clicado');
        });
    }
});

// Logout function
function logout() {
    // In a real app, this would handle logout
    console.log('Logging out');
    alert('Funcionalidade de logout');
    // Redirecionar para a página de login
    // window.location.href = 'login.html';
}

// Função para atualizar textos da UI
function updateUITexts(langCode) {
    // Esta função seria preenchida com as traduções reais
    const translations = {
        'pt': {
            'navHome': 'Início',
            'navDialogues': 'Diálogos',
            'navStories': 'Histórias',
            'navFlashcards': 'Flashcards',
            'navMyDecks': 'Meus Decks',
            'navCommunity': 'Comunidade',
            'navCreateDeck': 'Criar Deck',
            'navStatistics': 'Estatísticas',
            'learningLabel': 'Aprendendo',
            'userLanguageLabel': 'Meu idioma',
            'userName': 'Usuário',
            'logoutButton': 'Sair',
            'pageTitle': 'Diálogos',
            'chooseTheme': 'Escolha Seu Próximo Tema:',
            'loadMore': 'Carregar Mais Temas',
            'showLess': 'Mostrar Menos',
            'startLearning': 'Comece a Aprender Agora!',
            'Play': 'Ouvir',
            'Traduzir': 'Traduzir'
        },
        'en': {
            'navHome': 'Home',
            'navDialogues': 'Dialogues',
            'navStories': 'Stories',
            'navFlashcards': 'Flashcards',
            'navMyDecks': 'My Decks',
            'navCommunity': 'Community',
            'navCreateDeck': 'Create Deck',
            'navStatistics': 'Statistics',
            'learningLabel': 'Learning',
            'userLanguageLabel': 'My language',
            'userName': 'User',
            'logoutButton': 'Logout',
            'pageTitle': 'Dialogues',
            'chooseTheme': 'Choose Your Next Theme:',
            'loadMore': 'Load More Themes',
            'showLess': 'Show Less',
            'startLearning': 'Start Learning Now!',
            'Play': 'Play',
            'Traduzir': 'Translate'
        },
        'es': {
            'navHome': 'Inicio',
            'navDialogues': 'Diálogos',
            'navStories': 'Historias',
            'navFlashcards': 'Flashcards',
            'navMyDecks': 'Mis Barajas',
            'navCommunity': 'Comunidad',
            'navCreateDeck': 'Crear Baraja',
            'navStatistics': 'Estadísticas',
            'learningLabel': 'Aprendiendo',
            'userLanguageLabel': 'Mi idioma',
            'userName': 'Usuario',
            'logoutButton': 'Salir',
            'pageTitle': 'Diálogos',
            'chooseTheme': 'Elija Su Próximo Tema:',
            'loadMore': 'Cargar Más Temas',
            'showLess': 'Mostrar Menos',
            'startLearning': '¡Comience a Aprender Ahora!',
            'Play': 'Escuchar',
            'Traduzir': 'Traducir'
        }
    };
    
    const selectedTranslations = translations[langCode] || translations['pt'];
    
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (selectedTranslations[key]) {
            element.textContent = selectedTranslations[key];
        }
    });
    
    // Atualizar botões de tradução nos diálogos
    updateDialogueButtons(langCode, selectedTranslations);
}

// Atualizar botões de tradução nos diálogos
function updateDialogueButtons(langCode, translations) {
    const selectedTranslations = translations || {};
    
    document.querySelectorAll('.message-btn').forEach((button, index) => {
        if (index % 2 === 0) {
            // Botão de play/ouvir
            const btnText = button.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = selectedTranslations['Play'] || 'Ouvir';
            }
        } else {
            // Botão de traduzir
            const btnText = button.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = selectedTranslations['Traduzir'] || 'Traduzir';
            }
        }
    });
}

// Inicializar tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('.icon-tooltip');
    
    tooltipElements.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.querySelector('.tooltip-text');
            if (tooltipText) {
                tooltipText.style.visibility = 'visible';
                tooltipText.style.opacity = '1';
            }
        });
        
        tooltip.addEventListener('mouseleave', function() {
            const tooltipText = this.querySelector('.tooltip-text');
            if (tooltipText) {
                tooltipText.style.visibility = 'hidden';
                tooltipText.style.opacity = '0';
            }
        });
    });
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    initTooltips();
    
    // Configurar evento de mudança para o idioma do usuário
    const userLanguage = document.getElementById('user-language');
    if (userLanguage) {
        userLanguage.addEventListener('change', function() {
            const selectedOption = document.querySelector('#user-language-options li.selected');
            if (selectedOption) {
                const langCode = selectedOption.getAttribute('data-value');
                if (window.updateUITexts) {
                    window.updateUITexts(langCode);
                }
            }
        });
    }
});

// Adicionar função global para acesso externo
window.updateUITexts = updateUITexts;

// Função para simular o carregamento de um diálogo
function loadDialogue(dialogueId) {
    console.log('Carregando diálogo:', dialogueId);
    // Em uma aplicação real, isso carregaria o diálogo do servidor
    // e atualizaria a interface do usuário
}

// Função para simular a reprodução de áudio
function playAudio(audioUrl) {
    console.log('Reproduzindo áudio:', audioUrl);
    // Em uma aplicação real, isso reproduziria o áudio
}

// Função para simular a tradução de texto
function translateText(text, targetLang) {
    console.log('Traduzindo texto:', text, 'para', targetLang);
    // Em uma aplicação real, isso traduziria o texto
    return text + ' (traduzido)';
}