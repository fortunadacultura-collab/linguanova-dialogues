// App configuration and data
let appConfig = {
  dialogues: {},
  currentLanguage: 'pt',
  currentDialogue: 'morning_routine',
  currentAudio: null,
  isPlaying: false,
  currentPhraseIndex: 0,
  audioElements: [],
  phraseDurations: [],
  totalDuration: 0,
  highlightInterval: null,
  data: null,
  initialThemes: 4,
  visibleThemes: 4,
  themesPerLine: 4,
  currentLine: 1
};

// DOM Elements cache
const domElements = {
  dialogueContent: document.getElementById('dialogue-content'),
  themeContainer: document.getElementById('theme-container'),
  playBtn: document.getElementById('play-btn'),
  pauseBtn: document.getElementById('pause-btn'),
  stopBtn: document.getElementById('stop-btn'),
  progressBar: document.getElementById('progress-bar'),
  currentTimeDisplay: document.getElementById('current-time'),
  totalTimeDisplay: document.getElementById('total-time'),
  langButtons: document.querySelectorAll('.lang-btn'),
  dialogueTitle: document.getElementById('dialogue-title-text'),
  mainTitle: document.querySelector('h1'),
  subtitle: document.querySelector('.subtitle'),
  chooseThemeText: document.getElementById('choose-theme-text'),
  startLearningText: document.getElementById('start-learning-text'),
  studyLabels: document.querySelectorAll('.study-label'),
  targetLanguage: document.getElementById('current-target-language'),
  levelName: document.querySelector('.level-name')
};

// Initialize the application
async function init() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Failed to load configuration');
    appConfig.data = await response.json();
    
    // Calculate initial themes per line
    appConfig.themesPerLine = calculateThemesPerLine();
    appConfig.initialThemes = appConfig.themesPerLine;
    appConfig.visibleThemes = appConfig.themesPerLine;
    
    // Set modern icons for player controls
    setModernIcons();
    
    // Set morning_routine as default dialogue
    await loadDialogue('morning_routine');
    renderThemeCards();
    setupEventListeners();
    updateUITexts(appConfig.currentLanguage);
    
    // Setup mobile button behavior
    setupMobileButtonBehavior();
  } catch (error) {
    console.error('Initialization error:', error);
    showErrorToUser('initialization');
  }
}

// Set modern icons for media player
function setModernIcons() {
  if (domElements.playBtn) {
    domElements.playBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    `;
  }
  
  if (domElements.pauseBtn) {
    domElements.pauseBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    `;
  }
  
  if (domElements.stopBtn) {
    domElements.stopBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="4" width="16" height="16"></rect>
      </svg>
    `;
  }
}

// Setup mobile button behavior
function setupMobileButtonBehavior() {
  // Check if we're on a mobile device
  const isMobile = window.innerWidth <= 768;
  
  // Hide button text on mobile
  if (isMobile) {
    const messageButtons = document.querySelectorAll('.message-btn');
    messageButtons.forEach(button => {
      const btnText = button.querySelector('.btn-text');
      if (btnText) {
        btnText.style.display = 'none';
      }
    });
  }
  
  // Add touch events for mobile
  const messageButtons = document.querySelectorAll('.message-btn');
  messageButtons.forEach(button => {
    button.addEventListener('touchstart', function() {
      this.classList.add('active');
    });
    
    button.addEventListener('touchend', function() {
      setTimeout(() => {
        this.classList.remove('active');
      }, 300);
    });
  });
}

// Dialogue functions
async function loadDialogue(dialogueId) {
  if (!appConfig.dialogues[dialogueId]) {
    appConfig.dialogues[dialogueId] = await loadDialogueTxt(dialogueId);
  }

  const dialogue = appConfig.dialogues[dialogueId];
  if (!dialogue) return;

  appConfig.currentDialogue = dialogueId;
  domElements.dialogueTitle.textContent = dialogue.title;
  domElements.dialogueContent.innerHTML = '';
  
  let currentTime = new Date();
  currentTime.setHours(10, 0, 0);

  dialogue.lines.forEach((line, index) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${index % 2 === 0 ? 'other' : 'user'}`;
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'message-info';
    
    const senderSpan = document.createElement('span');
    senderSpan.className = 'message-sender';
    senderSpan.textContent = line.speaker;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.style.display = 'none';

    infoDiv.appendChild(senderSpan);
    infoDiv.appendChild(timeSpan);
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = line.text;
    
    const translationDiv = document.createElement('div');
    translationDiv.className = 'translation-text';
    translationDiv.setAttribute('data-lang', appConfig.currentLanguage);
    translationDiv.textContent = line.translations[appConfig.currentLanguage] || '';
    translationDiv.style.display = 'none';
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'message-actions';
    
    // Botão de play
    const playButton = document.createElement('button');
    playButton.className = 'message-btn play-btn';
    playButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      <span class="btn-text">${appConfig.data.translations[appConfig.currentLanguage]['Play'] || 'Ouvir'}</span>
    `;
    playButton.onclick = () => playPhrase(index);
    
    // Botão de tradução
    const translateButton = document.createElement('button');
    translateButton.className = 'message-btn';
    translateButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        <path d="M2 2l7.586 7.586"></path>
        <circle cx="11" cy="11" r="2"></circle>
      </svg>
      <span class="btn-text">${appConfig.data.translations[appConfig.currentLanguage]['Traduzir'] || 'Traduzir'}</span>
    `;
    translateButton.onclick = function() {
      toggleTranslation(this);
    };
    
    actionsDiv.appendChild(playButton);
    actionsDiv.appendChild(translateButton);
    
    messageDiv.appendChild(infoDiv);
    messageDiv.appendChild(textDiv);
    messageDiv.appendChild(translationDiv);
    messageDiv.appendChild(actionsDiv);
    
    domElements.dialogueContent.appendChild(messageDiv);
  });

  // Hide button text on mobile after rendering
  if (window.innerWidth <= 768) {
    const btnTexts = document.querySelectorAll('.btn-text');
    btnTexts.forEach(text => {
      text.style.display = 'none';
    });
  }

  preloadAudios();
  calculateDurations();
  stopDialogue();
  renderThemeCards();
}

// Função para atualizar os botões de tradução
function updateTranslationButtons(playButton, translateButton, langCode) {
  const translations = appConfig.data.translations[langCode] || appConfig.data.translations['pt'];
  
  playButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
    <span class="btn-text">${translations['Play'] || 'Ouvir'}</span>
  `;
  
  translateButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
      <path d="M2 2l7.586 7.586"></path>
      <circle cx="11" cy="11" r="2"></circle>
    </svg>
    <span class="btn-text">${translations['Traduzir'] || 'Traduzir'}</span>
  `;
}

async function loadDialogueTxt(dialogueId) {
  try {
    const response = await fetch(`${appConfig.data.settings.paths.dialogues}${dialogueId}.txt`);
    if (!response.ok) throw new Error('Diálogo não encontrado');
    const content = await response.text();
    return await parseDialogueTxt(content);
  } catch (error) {
    console.error('Erro ao carregar diálogo:', error);
    return null;
  }
}

async function parseDialogueTxt(content) {
  const lines = content.split('\n');
  const dialogue = {
    title: '',
    lines: []
  };
  
  let currentLine = {};
  const txtFormat = appConfig.data.settings.dialogueTemplates.txtFormat;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    if (trimmedLine.startsWith(txtFormat.titlePrefix)) {
      dialogue.title = trimmedLine.replace(txtFormat.titlePrefix, '').trim();
    } 
    else if (trimmedLine.startsWith(txtFormat.speakerPrefix)) {
      if (currentLine.text) {
        dialogue.lines.push(currentLine);
        currentLine = {};
      }
      currentLine.speaker = trimmedLine.replace(txtFormat.speakerPrefix, '').trim();
    }
    else if (trimmedLine.startsWith(txtFormat.textPrefix)) {
      currentLine.text = trimmedLine.replace(txtFormat.textPrefix, '').trim();
      currentLine.translations = {};
    }
    else if (trimmedLine.startsWith(txtFormat.translationPrefixes.pt)) {
      currentLine.translations.pt = trimmedLine.replace(txtFormat.translationPrefixes.pt, '').trim();
    }
    else if (trimmedLine.startsWith(txtFormat.translationPrefixes.es)) {
      currentLine.translations.es = trimmedLine.replace(txtFormat.translationPrefixes.es, '').trim();
    }
    else if (trimmedLine.startsWith(txtFormat.translationPrefixes.en)) {
      currentLine.translations.en = trimmedLine.replace(txtFormat.translationPrefixes.en, '').trim();
    }
  }
  
  if (currentLine.text) {
    dialogue.lines.push(currentLine);
  }
  
  return dialogue;
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
    if (audio.duration && !isNaN(audio.duration)) {
      appConfig.phraseDurations.push(audio.duration);
      appConfig.totalDuration += audio.duration;
    } else {
      const text = appConfig.dialogues[appConfig.currentDialogue].lines[index].text;
      const wordCount = text.split(' ').length;
      const duration = Math.max(
        appConfig.data.settings.audioSettings.fallbackDuration.baseSeconds,
        wordCount * appConfig.data.settings.audioSettings.fallbackDuration.secondsPerWord
      );
      appConfig.phraseDurations.push(duration);
      appConfig.totalDuration += duration;
    }
  });
  
  domElements.totalTimeDisplay.textContent = formatTime(appConfig.totalDuration);
}

// Player control functions
function playPhrase(index) {
  stopCurrentAudio();
  
  if (index >= appConfig.audioElements.length) return;
  
  const audio = appConfig.audioElements[index];
  if (!audio.src) {
    audio.src = `${appConfig.data.settings.paths.audios}${appConfig.currentDialogue}/line_${index}.mp3`;
    audio.load();
    
    // Add loading visual
    const playButton = document.querySelectorAll('.message-btn.play-btn')[index];
    if (playButton) {
      playButton.classList.add('loading');
      
      audio.addEventListener('canplaythrough', () => {
        playButton.classList.remove('loading');
      }, { once: true });
    }
  }
  
  appConfig.currentAudio = audio;
  appConfig.currentPhraseIndex = index;
  
  highlightCurrentPhrase();
  
  audio.onended = () => {
    document.querySelectorAll('.message')[appConfig.currentPhraseIndex].classList.remove('highlighted');
  };
  
  audio.play().catch(e => {
    console.error("Error playing audio:", e);
    showErrorToUser('audio-playback');
  });
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
  if (!audio.src) {
    audio.src = `${appConfig.data.settings.paths.audios}${appConfig.currentDialogue}/line_${appConfig.currentPhraseIndex}.mp3`;
    audio.load();
  }
  
  highlightCurrentPhrase();
  appConfig.currentAudio = audio;
  
  audio.onended = () => {
    appConfig.currentPhraseIndex++;
    playCurrentPhrase();
  };
  
  audio.onerror = () => {
    console.error("Error playing audio, skipping to next phrase");
    appConfig.currentPhraseIndex++;
    playCurrentPhrase();
  };
  
  audio.play().catch(e => {
    console.error("Audio play failed:", e);
    setTimeout(() => {
      appConfig.currentPhraseIndex++;
      playCurrentPhrase();
    }, 300);
  });
}

function pauseDialogue() {
  if (!appConfig.isPlaying) return;
  
  appConfig.isPlaying = false;
  
  if (appConfig.currentAudio) {
    appConfig.currentAudio.pause();
  }
  
  clearInterval(appConfig.highlightInterval);
  updatePlayerControls();
}

function stopDialogue() {
  appConfig.isPlaying = false;
  appConfig.currentPhraseIndex = 0;
  
  if (appConfig.currentAudio) {
    appConfig.currentAudio.pause();
    appConfig.currentAudio.currentTime = 0;
    appConfig.currentAudio = null;
  }
  
  clearInterval(appConfig.highlightInterval);
  removeAllHighlights();
  updateProgress(0);
  updatePlayerControls();
}

function stopCurrentAudio() {
  if (appConfig.currentAudio) {
    appConfig.currentAudio.pause();
    appConfig.currentAudio.currentTime = 0;
  }
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
  
  if (appConfig.currentAudio) {
    time += appConfig.currentAudio.currentTime;
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
  const translation = messageElement.querySelector('.translation-text');
  
  // Obter o idioma atual do texto de tradução
  const translationLang = translation.getAttribute('data-lang') || appConfig.currentLanguage;
  const translations = appConfig.data.translations[translationLang] || appConfig.data.translations['pt'];
  
  // Verificar se a tradução está visível
  const isTranslationVisible = translation.style.display === 'block';
  
  if (isTranslationVisible) {
    // Se a tradução está visível, ocultá-la
    translation.style.display = 'none';
    updateTranslateButtonText(button, translations['Traduzir'] || 'Traduzir');
  } else {
    // Se a tradução está oculta, mostrá-la e ocultar outras
    document.querySelectorAll('.translation-text').forEach(el => {
      el.style.display = 'none';
      
      // Atualizar os botões correspondentes para "Traduzir"
      const btn = el.parentElement.querySelector('.message-actions .message-btn:nth-child(2)');
      if (btn && btn !== button) {
        const btnLang = el.getAttribute('data-lang') || appConfig.currentLanguage;
        const btnTranslations = appConfig.data.translations[btnLang] || appConfig.data.translations['pt'];
        updateTranslateButtonText(btn, btnTranslations['Traduzir'] || 'Traduzir');
      }
    });
    
    // Mostrar a tradução atual
    translation.style.display = 'block';
    updateTranslateButtonText(button, translations['Ocultar'] || 'Ocultar');
    
    // Rolagem suave para a mensagem
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  // Hide button text on mobile after toggle
  if (window.innerWidth <= 768) {
    const btnText = button.querySelector('.btn-text');
    if (btnText) {
      btnText.style.display = 'none';
    }
  }
}

// Função auxiliar para atualizar apenas o texto do botão
function updateTranslateButtonText(button, text) {
  const btnText = button.querySelector('.btn-text');
  if (btnText) {
    btnText.textContent = text;
  } else {
    // Se não existe span de texto, criar um
    const newText = document.createElement('span');
    newText.className = 'btn-text';
    newText.textContent = text;
    
    // Manter o ícone SVG e adicionar o novo texto
    const svgIcon = button.querySelector('svg');
    if (svgIcon) {
      // Salvar o evento atual antes de modificar o HTML
      const originalOnclick = button.onclick;
      
      button.innerHTML = '';
      button.appendChild(svgIcon.cloneNode(true));
      button.appendChild(newText);
      
      // Restaurar o evento
      button.onclick = originalOnclick;
    } else {
      // Salvar o evento atual antes de modificar o HTML
      const originalOnclick = button.onclick;
      
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
          <path d="M2 2l7.586 7.586"></path>
          <circle cx="11" cy="11" r="2"></circle>
        </svg>
        <span class="btn-text">${text}</span>
      `;
      
      // Restaurar o evento
      button.onclick = originalOnclick;
    }
  }
}

function renderThemeCards() {
    const themeContainer = domElements.themeContainer;
    themeContainer.innerHTML = '';
    
    appConfig.data.themes.slice(0, appConfig.visibleThemes).forEach(theme => {
        const themeCard = document.createElement('div');
        themeCard.className = 'theme-card';
        themeCard.innerHTML = `
            <h3>${theme.title}</h3>
            <ul>
                ${theme.topics.map(topic => `
                    <li onclick="loadDialogue('${topic.id}')" 
                        data-id="${topic.id}"
                        ${appConfig.currentDialogue === topic.id ? 'class="active"' : ''}>
                        ${topic.name}
                    </li>
                `).join('')}
            </ul>
        `;
        themeContainer.appendChild(themeCard);
    });
    
    updateThemeControls();
}

function loadMoreThemes() {
    appConfig.themesPerLine = calculateThemesPerLine();
    appConfig.currentLine++;
    
    const newVisibleThemes = appConfig.themesPerLine * appConfig.currentLine;
    appConfig.visibleThemes = Math.min(
        newVisibleThemes,
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
    appConfig.currentLine = 1;
    appConfig.visibleThemes = appConfig.themesPerLine;
    renderThemeCards();
    
    document.querySelector('.section-title').scrollIntoView({
        behavior: 'smooth'
    });
}

function setupEventListeners() {
  domElements.langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      appConfig.currentLanguage = btn.dataset.lang;
      updateActiveLanguageButton();
      updateUITexts(appConfig.currentLanguage);
      loadDialogue(appConfig.currentDialogue);
    });
  });

  domElements.playBtn.addEventListener('click', playDialogue);
  domElements.pauseBtn.addEventListener('click', pauseDialogue);
  domElements.stopBtn.addEventListener('click', stopDialogue);
  
  domElements.progressBar.addEventListener('click', (e) => {
    const rect = domElements.progressBar.getBoundingClientRect();
    const seekPercent = (e.clientX - rect.left) / rect.width;
    const seekTime = seekPercent * appConfig.totalDuration;
    
    let accumulatedTime = 0;
    let newPhraseIndex = 0;
    let phraseStartTime = 0;
    
    for (let i = 0; i < appConfig.phraseDurations.length; i++) {
      if (accumulatedTime + appConfig.phraseDurations[i] > seekTime) {
        newPhraseIndex = i;
        phraseStartTime = accumulatedTime;
        break;
      }
      accumulatedTime += appConfig.phraseDurations[i];
    }
    
    const phraseSeekTime = seekTime - phraseStartTime;
    
    if (appConfig.isPlaying) {
      appConfig.currentPhraseIndex = newPhraseIndex;
      if (appConfig.currentAudio) {
        appConfig.currentAudio.pause();
      }
      appConfig.currentAudio = appConfig.audioElements[appConfig.currentPhraseIndex];
      appConfig.currentAudio.currentTime = phraseSeekTime;
      appConfig.currentAudio.play().catch(console.error);
      highlightCurrentPhrase();
    } else {
      appConfig.currentPhraseIndex = newPhraseIndex;
      updateProgress(seekTime);
      highlightCurrentPhrase(false);
    }
  });

  document.getElementById('load-more-btn')?.addEventListener('click', loadMoreThemes);
  document.getElementById('show-less-btn')?.addEventListener('click', showLessThemes);

  window.addEventListener('resize', () => {
    const newThemesPerLine = calculateThemesPerLine();
    if (newThemesPerLine !== appConfig.themesPerLine) {
      appConfig.themesPerLine = newThemesPerLine;
      appConfig.visibleThemes = appConfig.themesPerLine * appConfig.currentLine;
      renderThemeCards();
    }
    
    // Update button text visibility on resize
    const btnTexts = document.querySelectorAll('.btn-text');
    if (window.innerWidth <= 768) {
      btnTexts.forEach(text => {
        text.style.display = 'none';
      });
    } else {
      btnTexts.forEach(text => {
        text.style.display = 'inline';
      });
    }
  });
}

function calculateThemesPerLine() {
  const grid = document.querySelector('.theme-grid');
  if (!grid) return 4;
  
  const gridWidth = grid.offsetWidth;
  const cardWidth = 280;
  const gap = 32;
  
  return Math.max(1, Math.floor(gridWidth / (cardWidth + gap)));
}

function updateActiveLanguageButton() {
  domElements.langButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === appConfig.currentLanguage);
  });
}

function updateUITexts(langCode) {
  // Atualizar o idioma atual na configuração
  appConfig.currentLanguage = langCode;
  
  const translations = appConfig.data.translations[langCode] || appConfig.data.translations['pt'];
  
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[key]) {
      element.textContent = translations[key];
    }
  });
  
  // Atualizar botões de tradução nos diálogos
  updateDialogueButtons(langCode);
  
  // Atualizar botões de carregar mais/menos temas
  updateThemeControls();
  
  // Atualizar traduções dos diálogos
  updateDialogueTranslations(langCode);
}

// Atualizar botões de tradução nos diálogos
function updateDialogueButtons(langCode) {
  const translations = appConfig.data.translations[langCode] || appConfig.data.translations['pt'];
  
  document.querySelectorAll('.message').forEach((messageElement, index) => {
    const playButton = messageElement.querySelector('.message-actions .message-btn.play-btn');
    const translationDiv = messageElement.querySelector('.translation-text');
    const translateButton = messageElement.querySelector('.message-actions .message-btn:not(.play-btn)');
    
    // Atualizar botão de play/ouvir
    if (playButton) {
      updateTranslateButtonText(playButton, translations['Play'] || 'Ouvir');
      
      // Reaplicar o evento de clique
      playButton.onclick = () => playPhrase(index);
    }
    
    // Atualizar botão de traduzir
    if (translationDiv && translateButton) {
      const isVisible = translationDiv.style.display === 'block';
      
      if (isVisible) {
        updateTranslateButtonText(translateButton, translations['Ocultar'] || 'Ocultar');
      } else {
        updateTranslateButtonText(translateButton, translations['Traduzir'] || 'Traduzir');
      }
      
      // Reaplicar o evento de clique
      translateButton.onclick = function() {
        toggleTranslation(this);
      };
    }
  });
}

// Atualizar traduções dos diálogos
function updateDialogueTranslations(langCode) {
  const dialogue = appConfig.dialogues[appConfig.currentDialogue];
  if (!dialogue) return;
  
  const messageElements = document.querySelectorAll('.message');
  messageElements.forEach((messageElement, index) => {
    if (dialogue.lines[index] && dialogue.lines[index].translations[langCode]) {
      const translationDiv = messageElement.querySelector('.translation-text');
      if (translationDiv) {
        translationDiv.textContent = dialogue.lines[index].translations[langCode];
        translationDiv.setAttribute('data-lang', langCode);
        
        // Atualizar também o botão correspondente
        const translateButton = messageElement.querySelector('.message-actions .message-btn:nth-child(2)');
        if (translateButton) {
          const translations = appConfig.data.translations[langCode] || appConfig.data.translations['pt'];
          const isVisible = translationDiv.style.display === 'block';
          
          if (isVisible) {
            updateTranslateButtonText(translateButton, translations['Ocultar'] || 'Ocultar');
          } else {
            updateTranslateButtonText(translateButton, translations['Traduzir'] || 'Traduzir');
          }
        }
      }
    }
  });
}

function updateThemeControls() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const showLessBtn = document.getElementById('show-less-btn');
    
    if (!loadMoreBtn || !showLessBtn) return;
    
    const translations = appConfig.data.translations[appConfig.currentLanguage] || appConfig.data.translations['pt'];
    
    // Atualizar textos dos botões
    const loadMoreText = loadMoreBtn.querySelector('span');
    const showLessText = showLessBtn.querySelector('span');
    
    if (loadMoreText) {
        loadMoreText.textContent = translations['load_more'] || 'Carregar Mais Temas';
    }
    
    if (showLessText) {
        showLessText.textContent = translations['show_less'] || 'Mostrar Menos';
    }
    
    if (appConfig.visibleThemes >= appConfig.data.themes.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'flex';
    }
    
    if (appConfig.visibleThemes > appConfig.initialThemes) {
        showLessBtn.style.display = 'flex';
    } else {
        showLessBtn.style.display = 'none';
    }
}

// Error handling functions
function showErrorToUser(errorType) {
  const errorMessages = {
    'initialization': appConfig.data.translations[appConfig.currentLanguage]['init_error'] || 'Failed to initialize. Please refresh.',
    'audio-permission': appConfig.data.translations[appConfig.currentLanguage]['audio_permission_error'] || 'Please allow audio in browser settings.',
    'audio-playback': appConfig.data.translations[appConfig.currentLanguage]['audio_playback_error'] || 'Audio playback failed. Try again later.'
  };
  
  const existingError = document.querySelector('.global-error');
  if (existingError) existingError.remove();
  
  const errorElement = document.createElement('div');
  errorElement.className = 'global-error';
  errorElement.textContent = errorMessages[errorType] || errorMessages['audio-playback'];
  document.body.prepend(errorElement);
  
  setTimeout(() => errorElement.remove(), 5000);
}

function setupAudioErrorHandling() {
  if (!HTMLAudioElement.prototype.play) return;

  HTMLAudioElement.prototype._nativePlay = HTMLAudioElement.prototype.play;
  
  HTMLAudioElement.prototype.play = function() {
    return this._nativePlay().catch(e => {
      console.error('Audio playback error:', e);
      
      if (e.name === 'NotAllowedError') {
        showErrorToUser('audio-permission');
        return Promise.reject(e);
      }
      
      this.currentTime = 0;
      return new Promise(resolve => {
        setTimeout(() => {
          this._nativePlay().then(resolve).catch(e => {
            console.error('Retry failed:', e);
            showErrorToUser('audio-playback');
            throw e;
          });
        }, 300);
      });
    });
  };
}

function checkAudioCapabilities() {
  const audio = new Audio();
  const canPlayMP3 = audio.canPlayType('audio/mpeg');
  
  if (!canPlayMP3 || canPlayMP3 === 'no') {
    showErrorToUser('audio-format');
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  setupAudioErrorHandling();
  
  init()
    .then(() => {
      console.log('App initialized successfully');
      checkAudioCapabilities();
    })
    .catch(error => {
      console.error('Initialization error:', error);
      showErrorToUser('initialization');
    });
});

// Make functions available globally
window.toggleTranslation = toggleTranslation;
window.loadDialogue = loadDialogue;
window.playPhrase = playPhrase;
window.updateUITexts = updateUITexts;