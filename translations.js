// Current language state
let currentLanguage = 'pt';
let targetLanguage = 'en';

// App configuration
let appConfig = {
    dialogues: {},
    currentDialogue: 'booking_flight',
    currentAudio: null,
    isPlaying: false,
    currentPhraseIndex: 0,
    audioElements: [],
    phraseDurations: [],
    totalDuration: 0,
    highlightInterval: null,
    data: null,
    themesPerLine: 4,
    visibleThemes: 4
};

// DOM Elements
const domElements = {
    dialogueContent: document.getElementById('dialogue-content'),
    themeContainer: document.getElementById('theme-container'),
    playBtn: document.getElementById('play-btn'),
    pauseBtn: document.getElementById('pause-btn'),
    stopBtn: document.getElementById('stop-btn'),
    progressBar: document.getElementById('progress-bar'),
    currentTimeDisplay: document.getElementById('current-time'),
    totalTimeDisplay: document.getElementById('total-time'),
    dialogueTitle: document.getElementById('dialogue-title-text'),
    loadMoreBtn: document.getElementById('load-more-btn'),
    showLessBtn: document.getElementById('show-less-btn')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initLanguageSelectors();
    loadAppData();
    setupEventListeners();
});

// Initialize language selectors
function initLanguageSelectors() {
    const langDropdown = document.querySelector('.language-dropdown');
    const targetLangDropdown = document.querySelector('.target-language-dropdown');
    
    // Populate language selector with all available languages
    langDropdown.innerHTML = `
        <div class="language-option" data-lang="pt">
            <img src="https://flagcdn.com/w20/br.png" class="language-flag" alt="Português">
            <span>Português</span>
        </div>
        <div class="language-option" data-lang="es">
            <img src="https://flagcdn.com/w20/es.png" class="language-flag" alt="Español">
            <span>Español</span>
        </div>
        <div class="language-option" data-lang="en">
            <img src="https://flagcdn.com/w20/us.png" class="language-flag" alt="English">
            <span>English</span>
        </div>
        <div class="language-option" data-lang="ja">
            <img src="https://flagcdn.com/w20/jp.png" class="language-flag" alt="日本語">
            <span>日本語</span>
        </div>
    `;
    
    // Populate target language selector (excluding current target language)
    updateTargetLanguageDropdown();
}

// Update target language dropdown
function updateTargetLanguageDropdown() {
    const targetLangDropdown = document.querySelector('.target-language-dropdown');
    targetLangDropdown.innerHTML = `
        <div class="language-option" data-target-lang="pt">
            <img src="https://flagcdn.com/w20/br.png" class="language-flag" alt="Português">
            <span>Português</span>
        </div>
        <div class="language-option" data-target-lang="es">
            <img src="https://flagcdn.com/w20/es.png" class="language-flag" alt="Español">
            <span>Español</span>
        </div>
        <div class="language-option" data-target-lang="en">
            <img src="https://flagcdn.com/w20/us.png" class="language-flag" alt="English">
            <span>English</span>
        </div>
        <div class="language-option" data-target-lang="ja">
            <img src="https://flagcdn.com/w20/jp.png" class="language-flag" alt="日本語">
            <span>日本語</span>
        </div>
    `.replace(`data-target-lang="${targetLanguage}"`, 'style="display:none"');
}

// Load app data
async function loadAppData() {
    try {
        // Load sample dialogue
        appConfig.dialogues['booking_flight'] = {
            title: {
                pt: "Reservando um Voo",
                es: "Reservando un Vuelo",
                en: "Booking a Flight",
                ja: "飛行機の予約"
            },
            lines: [
                {
                    speaker: {
                        pt: "Agente de Viagens",
                        es: "Agente de Viajes",
                        en: "Travel Agent",
                        ja: "旅行代理店"
                    },
                    text: "Good afternoon! How can I help you today?",
                    translations: {
                        pt: "Boa tarde! Como posso ajudá-lo hoje?",
                        es: "¡Buenas tardes! ¿Cómo puedo ayudarle hoy?",
                        en: "Good afternoon! How can I help you today?",
                        ja: "こんにちは！今日はどのようなご用件でしょうか？"
                    }
                },
                {
                    speaker: {
                        pt: "Cliente",
                        es: "Cliente",
                        en: "Customer",
                        ja: "顧客"
                    },
                    text: "I'd like to book a flight to New York, please.",
                    translations: {
                        pt: "Gostaria de reservar um voo para Nova York, por favor.",
                        es: "Me gustaría reservar un vuelo a Nueva York, por favor.",
                        en: "I'd like to book a flight to New York, please.",
                        ja: "ニューヨーク行きの飛行機を予約したいのですが。"
                    }
                },
                {
                    speaker: {
                        pt: "Agente de Viagens",
                        es: "Agente de Viajes",
                        en: "Travel Agent",
                        ja: "旅行代理店"
                    },
                    text: "Certainly. When would you like to travel?",
                    translations: {
                        pt: "Certamente. Quando você gostaria de viajar?",
                        es: "Por supuesto. ¿Cuándo le gustaría viajar?",
                        en: "Certainly. When would you like to travel?",
                        ja: "かしこまりました。いつご旅行されますか？"
                    }
                },
                {
                    speaker: {
                        pt: "Cliente",
                        es: "Cliente",
                        en: "Customer",
                        ja: "顧客"
                    },
                    text: "Next Friday, if possible. Returning the following Sunday.",
                    translations: {
                        pt: "Próxima sexta-feira, se possível. Voltando no domingo seguinte.",
                        es: "El próximo viernes, si es posible. Regresando el domingo siguiente.",
                        en: "Next Friday, if possible. Returning the following Sunday.",
                        ja: "可能であれば来週の金曜日です。次の日曜日に帰ります。"
                    }
                }
            ]
        };

        // Load themes data
        appConfig.data = {
            themes: [
                {
                    title: {
                        pt: "Viagem",
                        es: "Viaje",
                        en: "Travel",
                        ja: "旅行"
                    },
                    topics: [
                        { id: "booking_flight", name: {
                            pt: "Reservando um Voo",
                            es: "Reservando un Vuelo",
                            en: "Booking a Flight",
                            ja: "飛行機の予約"
                        }},
                        { id: "airport", name: {
                            pt: "No Aeroporto",
                            es: "En el Aeropuerto",
                            en: "At the Airport",
                            ja: "空港で"
                        }},
                        { id: "hotel_checkin", name: {
                            pt: "Check-in no Hotel",
                            es: "Registro en el Hotel",
                            en: "Hotel Check-in",
                            ja: "ホテルのチェックイン"
                        }},
                        { id: "directions", name: {
                            pt: "Pedindo Direções",
                            es: "Pidiendo Direcciones",
                            en: "Asking for Directions",
                            ja: "道を尋ねる"
                        }}
                    ]
                },
                {
                    title: {
                        pt: "Vida Diária",
                        es: "Vida Diaria",
                        en: "Daily Life",
                        ja: "日常生活"
                    },
                    topics: [
                        { id: "morning_routine", name: {
                            pt: "Rotina Matinal",
                            es: "Rutina Matutina",
                            en: "Morning Routine",
                            ja: "朝のルーティン"
                        }},
                        { id: "grocery_shopping", name: {
                            pt: "Compras no Supermercado",
                            es: "Compras de Comestibles",
                            en: "Grocery Shopping",
                            ja: "食料品の買い物"
                        }},
                        { id: "eating_out", name: {
                            pt: "Comer Fora",
                            es: "Comer Fuera",
                            en: "Eating Out",
                            ja: "外食"
                        }},
                        { id: "weekend_plans", name: {
                            pt: "Planos de Fim de Semana",
                            es: "Planes de Fin de Semana",
                            en: "Weekend Plans",
                            ja: "週末の予定"
                        }}
                    ]
                },
                {
                    title: {
                        pt: "Trabalho",
                        es: "Trabajo",
                        en: "Work",
                        ja: "仕事"
                    },
                    topics: [
                        { id: "job_interview", name: {
                            pt: "Entrevista de Emprego",
                            es: "Entrevista de Trabajo",
                            en: "Job Interview",
                            ja: "就職面接"
                        }},
                        { id: "office_talk", name: {
                            pt: "Conversa de Escritório",
                            es: "Conversación de Oficina",
                            en: "Office Small Talk",
                            ja: "職場の雑談"
                        }},
                        { id: "work_meetings", name: {
                            pt: "Reuniões de Trabalho",
                            es: "Reuniones de Trabajo",
                            en: "Work Meetings",
                            ja: "仕事の会議"
                        }},
                        { id: "career_goals", name: {
                            pt: "Objetivos de Carreira",
                            es: "Objetivos Profesionales",
                            en: "Career Goals",
                            ja: "キャリア目標"
                        }}
                    ]
                },
                {
                    title: {
                        pt: "Tecnologia",
                        es: "Tecnología",
                        en: "Technology",
                        ja: "テクノロジー"
                    },
                    topics: [
                        { id: "new_phone", name: {
                            pt: "Comprando um Novo Telefone",
                            es: "Comprando un Teléfono Nuevo",
                            en: "Buying a New Phone",
                            ja: "新しい電話を買う"
                        }},
                        { id: "tech_issues", name: {
                            pt: "Problemas Tecnológicos",
                            es: "Problemas Tecnológicos",
                            en: "Troubleshooting Tech Issues",
                            ja: "技術的な問題の解決"
                        }},
                        { id: "social_media", name: {
                            pt: "Tendências em Mídias Sociais",
                            es: "Tendencias en Redes Sociales",
                            en: "Social Media Trends",
                            ja: "ソーシャルメディアのトレンド"
                        }},
                        { id: "online_security", name: {
                            pt: "Segurança Online",
                            es: "Seguridad en Línea",
                            en: "Online Security",
                            ja: "オンラインセキュリティ"
                        }}
                    ]
                }
            ],
            translations: {
                pt: {
                    "navHome": "Home",
                    "navDialogues": "Diálogos",
                    "navStories": "Histórias",
                    "navFlashcards": "Flashcards",
                    "learningLabel": "Aprendendo:",
                    "btnLogin": "Login",
                    "btnSignup": "Cadastrar",
                    "chooseTheme": "Escolha Seu Próximo Tema",
                    "loadMore": "Carregar Mais",
                    "showLess": "Mostrar Menos",
                    "startLearning": "Comece a Aprender Agora!"
                },
                es: {
                    "navHome": "Inicio",
                    "navDialogues": "Diálogos",
                    "navStories": "Historias",
                    "navFlashcards": "Tarjetas",
                    "learningLabel": "Aprendiendo:",
                    "btnLogin": "Iniciar sesión",
                    "btnSignup": "Registrarse",
                    "chooseTheme": "Elija Su Próximo Tema",
                    "loadMore": "Cargar Más",
                    "showLess": "Mostrar Menos",
                    "startLearning": "Empiece a Aprender Ahora!"
                },
                en: {
                    "navHome": "Home",
                    "navDialogues": "Dialogues",
                    "navStories": "Stories",
                    "navFlashcards": "Flashcards",
                    "learningLabel": "Learning:",
                    "btnLogin": "Login",
                    "btnSignup": "Sign Up",
                    "chooseTheme": "Choose Your Next Theme",
                    "loadMore": "Load More",
                    "showLess": "Show Less",
                    "startLearning": "Start Learning Now!"
                },
                ja: {
                    "navHome": "ホーム",
                    "navDialogues": "対話",
                    "navStories": "物語",
                    "navFlashcards": "フラッシュカード",
                    "learningLabel": "学習中:",
                    "btnLogin": "ログイン",
                    "btnSignup": "サインアップ",
                    "chooseTheme": "次のテーマを選択",
                    "loadMore": "もっと読み込む",
                    "showLess": "減らす",
                    "startLearning": "今すぐ学習を始めましょう！"
                }
            }
        };

        // Initial render
        loadDialogue(appConfig.currentDialogue);
        renderThemeCards();
        translatePage(currentLanguage);
    } catch (error) {
        console.error('Error loading app data:', error);
    }
}

// Load dialogue
function loadDialogue(dialogueId) {
    const dialogue = appConfig.dialogues[dialogueId];
    if (!dialogue) return;

    appConfig.currentDialogue = dialogueId;
    domElements.dialogueTitle.textContent = dialogue.title[currentLanguage] || dialogue.title['en'];
    domElements.dialogueContent.innerHTML = '';
    
    dialogue.lines.forEach((line, index) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${index % 2 === 0 ? 'other' : 'user'}`;
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'message-info';
        
        const senderSpan = document.createElement('span');
        senderSpan.className = 'message-sender';
        senderSpan.textContent = line.speaker[currentLanguage] || line.speaker['en'];
        
        infoDiv.appendChild(senderSpan);
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = line.text;
        
        const translationDiv = document.createElement('div');
        translationDiv.className = 'translation-text';
        translationDiv.setAttribute('data-lang', currentLanguage);
        translationDiv.textContent = line.translations[currentLanguage] || '';
        translationDiv.style.display = 'none';
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';
        
        const playButton = document.createElement('button');
        playButton.className = 'message-btn play-btn';
        playButton.onclick = () => playPhrase(index);
        playButton.innerHTML = `<i class="fas fa-play"></i> ${appConfig.data.translations[currentLanguage]['Play'] || 'Play'}`;
        
        const translateButton = document.createElement('button');
        translateButton.className = 'message-btn';
        translateButton.onclick = (e) => toggleTranslation(e.currentTarget);
        translateButton.innerHTML = `<i class="fas fa-language"></i> ${appConfig.data.translations[currentLanguage]['Traduzir'] || 'Translate'}`;
        
        actionsDiv.appendChild(playButton);
        actionsDiv.appendChild(translateButton);
        
        messageDiv.appendChild(infoDiv);
        messageDiv.appendChild(textDiv);
        messageDiv.appendChild(translationDiv);
        messageDiv.appendChild(actionsDiv);
        
        domElements.dialogueContent.appendChild(messageDiv);
    });

    preloadAudios();
    calculateDurations();
    stopDialogue();
    renderThemeCards();
}

// Audio functions
function preloadAudios() {
    appConfig.audioElements.forEach(audio => {
        audio.pause();
        audio.src = '';
        audio.remove();
    });
    
    appConfig.audioElements = [];
    const dialogue = appConfig.dialogues[appConfig.currentDialogue];
    if (!dialogue) return;
    
    dialogue.lines.forEach((_, index) => {
        const audio = new Audio();
        audio.preload = 'none';
        appConfig.audioElements.push(audio);
    });
}

function calculateDurations() {
    appConfig.phraseDurations = [];
    appConfig.totalDuration = 0;
    
    appConfig.audioElements.forEach((audio, index) => {
        const text = appConfig.dialogues[appConfig.currentDialogue].lines[index].text;
        const wordCount = text.split(' ').length;
        const duration = Math.max(1, wordCount * 0.6);
        appConfig.phraseDurations.push(duration);
        appConfig.totalDuration += duration;
    });
    
    domElements.totalTimeDisplay.textContent = formatTime(appConfig.totalDuration);
}

// Player control functions
function playPhrase(index) {
    stopCurrentAudio();
    
    if (index >= appConfig.audioElements.length) return;
    
    const audio = appConfig.audioElements[index];
    appConfig.currentAudio = audio;
    appConfig.currentPhraseIndex = index;
    
    highlightCurrentPhrase();
    
    audio.onended = () => {
        document.querySelectorAll('.message')[appConfig.currentPhraseIndex].classList.remove('highlighted');
    };
    
    // Simulate audio playback for demo
    setTimeout(() => {
        document.querySelectorAll('.message')[appConfig.currentPhraseIndex].classList.remove('highlighted');
        if (appConfig.currentPhraseIndex < appConfig.audioElements.length - 1) {
            playPhrase(appConfig.currentPhraseIndex + 1);
        }
    }, appConfig.phraseDurations[index] * 1000);
}

function playDialogue() {
    if (appConfig.isPlaying) return;
    
    const dialogue = appConfig.dialogues[appConfig.currentDialogue];
    if (!dialogue || !appConfig.audioElements.length) return;
    
    if (appConfig.currentPhraseIndex >= dialogue.lines.length) {
        appConfig.currentPhraseIndex = 0;
    }
    
    appConfig.isPlaying = true;
    updatePlayerControls();
    startProgressTracking();
    playCurrentPhrase();
}

function playCurrentPhrase() {
    if (!appConfig.isPlaying || appConfig.currentPhraseIndex >= appConfig.audioElements.length) {
        stopDialogue();
        return;
    }
    
    const audio = appConfig.audioElements[appConfig.currentPhraseIndex];
    appConfig.currentAudio = audio;
    
    highlightCurrentPhrase();
    
    // Simulate audio playback for demo
    setTimeout(() => {
        appConfig.currentPhraseIndex++;
        playCurrentPhrase();
    }, appConfig.phraseDurations[appConfig.currentPhraseIndex] * 1000);
}

function pauseDialogue() {
    if (!appConfig.isPlaying) return;
    
    appConfig.isPlaying = false;
    clearInterval(appConfig.highlightInterval);
    updatePlayerControls();
}

function stopDialogue() {
    appConfig.isPlaying = false;
    appConfig.currentPhraseIndex = 0;
    clearInterval(appConfig.highlightInterval);
    removeAllHighlights();
    updateProgress(0);
    updatePlayerControls();
}

function stopCurrentAudio() {
    removeAllHighlights();
}

// UI functions
function highlightCurrentPhrase() {
    removeAllHighlights();
    
    const messages = document.querySelectorAll('.message');
    if (appConfig.currentPhraseIndex < messages.length) {
        messages[appConfig.currentPhraseIndex].classList.add('highlighted');
        messages[appConfig.currentPhraseIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function removeAllHighlights() {
    document.querySelectorAll('.message').forEach(msg => {
        msg.classList.remove('highlighted');
    });
}

function startProgressTracking() {
    clearInterval(appConfig.highlightInterval);
    
    appConfig.highlightInterval = setInterval(() => {
        if (!appConfig.isPlaying) return;
        updateProgress(getCurrentPlaybackTime());
    }, 200);
}

function getCurrentPlaybackTime() {
    if (!appConfig.isPlaying || appConfig.currentPhraseIndex >= appConfig.audioElements.length) return 0;
    
    let time = 0;
    for (let i = 0; i < appConfig.currentPhraseIndex; i++) {
        time += appConfig.phraseDurations[i];
    }
    
    return time;
}

function updateProgress(currentTime) {
    const progressPercent = (currentTime / appConfig.totalDuration) * 100;
    domElements.progressBar.style.setProperty('--progress', `${progressPercent}%`);
    updateTimeDisplay(currentTime, appConfig.totalDuration);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateTimeDisplay(current, total) {
    domElements.currentTimeDisplay.textContent = formatTime(current);
    domElements.totalTimeDisplay.textContent = formatTime(total);
}

function updatePlayerControls() {
    domElements.playBtn.disabled = appConfig.isPlaying;
    domElements.pauseBtn.disabled = !appConfig.isPlaying;
    domElements.stopBtn.disabled = !appConfig.isPlaying && appConfig.currentPhraseIndex === 0;
}

function toggleTranslation(button) {
    const messageElement = button.parentElement.parentElement;
    const translation = messageElement.querySelector(`.translation-text[data-lang="${currentLanguage}"]`);
    
    if (translation.style.display === 'block') {
        translation.style.display = 'none';
        button.innerHTML = `<i class="fas fa-language"></i> ${appConfig.data.translations[currentLanguage]['Traduzir'] || 'Translate'}`;
    } else {
        document.querySelectorAll('.translation-text').forEach(el => {
            el.style.display = 'none';
        });
        
        document.querySelectorAll('.message-btn').forEach((btn, index) => {
            if (index % 2 !== 0) {
                btn.innerHTML = `<i class="fas fa-language"></i> ${appConfig.data.translations[currentLanguage]['Traduzir'] || 'Translate'}`;
            }
        });
        
        translation.style.display = 'block';
        button.innerHTML = `<i class="fas fa-eye-slash"></i> ${appConfig.data.translations[currentLanguage]['Ocultar'] || 'Hide'}`;
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Theme functions
function renderThemeCards() {
    const themeContainer = domElements.themeContainer;
    themeContainer.innerHTML = '';
    
    appConfig.data.themes.slice(0, appConfig.visibleThemes).forEach(theme => {
        const themeCard = document.createElement('div');
        themeCard.className = 'theme-card';
        themeCard.innerHTML = `
            <h3>${theme.title[currentLanguage] || theme.title['en']}</h3>
            <ul>
                ${theme.topics.map(topic => `
                    <li onclick="loadDialogue('${topic.id}')" 
                        data-id="${topic.id}"
                        ${appConfig.currentDialogue === topic.id ? 'class="active"' : ''}>
                        ${topic.name[currentLanguage] || topic.name['en']}
                    </li>
                `).join('')}
            </ul>
        `;
        themeContainer.appendChild(themeCard);
    });
    
    updateThemeControls();
}

function loadMoreThemes() {
    appConfig.visibleThemes = Math.min(
        appConfig.visibleThemes + appConfig.themesPerLine,
        appConfig.data.themes.length
    );
    
    renderThemeCards();
    
    setTimeout(() => {
        const cards = document.querySelectorAll('.theme-card');
        if (cards.length > 0) {
            cards[appConfig.visibleThemes - appConfig.themesPerLine].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, 100);
}

function showLessThemes() {
    appConfig.visibleThemes = appConfig.themesPerLine;
    renderThemeCards();
    
    document.querySelector('.content-container').scrollIntoView({
        behavior: 'smooth'
    });
}

function updateThemeControls() {
    if (appConfig.visibleThemes >= appConfig.data.themes.length) {
        domElements.loadMoreBtn.style.display = 'none';
    } else {
        domElements.loadMoreBtn.style.display = 'flex';
    }
    
    if (appConfig.visibleThemes > appConfig.themesPerLine) {
        domElements.showLessBtn.style.display = 'flex';
    } else {
        domElements.showLessBtn.style.display = 'none';
    }
}

// Language functions
function translatePage(langCode) {
    document.documentElement.lang = langCode;
    currentLanguage = langCode;
    
    // Update UI texts
    const translations = appConfig.data.translations[langCode] || appConfig.data.translations['en'];
    
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
    
    // Update current language display in navbar
    const currentLanguageElement = document.querySelector('.current-language');
    if (currentLanguageElement) {
        const flag = langCode === 'en' ? 'us' : langCode === 'ja' ? 'jp' : langCode;
        currentLanguageElement.innerHTML = `
            <img src="https://flagcdn.com/w20/${flag}.png" class="language-flag" alt="${langCode}">
            <span>${langCode.toUpperCase()}</span>
        `;
    }
    
    // Reload current dialogue with new translations
    if (appConfig.currentDialogue) {
        loadDialogue(appConfig.currentDialogue);
    }
}

function changeTargetLanguage(langCode) {
    targetLanguage = langCode;
    updateTargetLanguageSelector();
}

function updateTargetLanguageSelector() {
    const selector = document.querySelector('.target-language-selector strong');
    if (selector) {
        const langName = {
            'pt': 'Português',
            'es': 'Español',
            'en': 'English',
            'ja': '日本語'
        }[langCode] || 'English';
        selector.textContent = langName;
        
        // Update flag
        const flag = document.querySelector('.target-language-selector .language-flag');
        if (flag) {
            const flagCode = langCode === 'en' ? 'us' : langCode === 'ja' ? 'jp' : langCode;
            flag.src = `https://flagcdn.com/w20/${flagCode}.png`;
            flag.alt = langName;
        }
    }
    updateTargetLanguageDropdown();
}

// Event listeners
function setupEventListeners() {
    // Language selector toggle
    const languageSelector = document.querySelector('.language-selector');
    const targetLanguageWrapper = document.querySelector('.target-language-wrapper');
    
    if (languageSelector) {
        languageSelector.addEventListener('click', (e) => {
            e.stopPropagation();
            languageSelector.classList.toggle('active');
            targetLanguageWrapper?.classList.remove('active');
        });
    }
    
    if (targetLanguageWrapper) {
        targetLanguageWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            targetLanguageWrapper.classList.toggle('active');
            languageSelector?.classList.remove('active');
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        languageSelector?.classList.remove('active');
        targetLanguageWrapper?.classList.remove('active');
    });
    
    // Language selection
    document.addEventListener('click', (e) => {
        if (e.target.closest('.language-option[data-lang]')) {
            const option = e.target.closest('.language-option[data-lang]');
            const lang = option.getAttribute('data-lang');
            translatePage(lang);
            languageSelector?.classList.remove('active');
        }
        
        if (e.target.closest('.language-option[data-target-lang]')) {
            const option = e.target.closest('.language-option[data-target-lang]');
            const lang = option.getAttribute('data-target-lang');
            changeTargetLanguage(lang);
            targetLanguageWrapper?.classList.remove('active');
        }
    });
    
    // Player controls
    domElements.playBtn.addEventListener('click', playDialogue);
    domElements.pauseBtn.addEventListener('click', pauseDialogue);
    domElements.stopBtn.addEventListener('click', stopDialogue);
    
    // Theme controls
    domElements.loadMoreBtn.addEventListener('click', loadMoreThemes);
    domElements.showLessBtn.addEventListener('click', showLessThemes);
    
    // Progress bar seeking
    domElements.progressBar.addEventListener('click', (e) => {
        const rect = domElements.progressBar.getBoundingClientRect();
        const seekPercent = (e.clientX - rect.left) / rect.width;
        const seekTime = seekPercent * appConfig.totalDuration;
        
        let accumulatedTime = 0;
        let newPhraseIndex = 0;
        
        for (let i = 0; i < appConfig.phraseDurations.length; i++) {
            if (accumulatedTime + appConfig.phraseDurations[i] > seekTime) {
                newPhraseIndex = i;
                break;
            }
            accumulatedTime += appConfig.phraseDurations[i];
        }
        
        appConfig.currentPhraseIndex = newPhraseIndex;
        updateProgress(seekTime);
        highlightCurrentPhrase();
    });
    
    // Responsive adjustments
    window.addEventListener('resize', () => {
        const newThemesPerLine = calculateThemesPerLine();
        if (newThemesPerLine !== appConfig.themesPerLine) {
            appConfig.themesPerLine = newThemesPerLine;
            renderThemeCards();
        }
    });
}

function calculateThemesPerLine() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 992) return 2;
    if (window.innerWidth < 1200) return 3;
    return 4;
}

// Make functions available globally
window.loadDialogue = loadDialogue;
window.playPhrase = playPhrase;
window.toggleTranslation = toggleTranslation;
window.loadMoreThemes = loadMoreThemes;
window.showLessThemes = showLessThemes;