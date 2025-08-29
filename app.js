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

// Calculate how many themes fit per line based on screen size
function calculateThemesPerLine() {
  const grid = document.querySelector('.theme-grid');
  if (!grid) return 4;
  
  const gridWidth = grid.offsetWidth;
  const cardWidth = 280;
  const gap = 32;
  
  return Math.max(1, Math.floor(gridWidth / (cardWidth + gap)));
}

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
    updateUITexts();
    
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
    
    // Modern play button
    const playButton = document.createElement('button');
    playButton.className = 'message-btn play-btn';
    playButton.setAttribute('aria-label', appConfig.data.translations[appConfig.currentLanguage]['Play'] || 'Play');
    playButton.onclick = () => playPhrase(index);
    playButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      <span class="btn-text">${appConfig.data.translations[appConfig.currentLanguage]['Play'] || 'Ouvir'}</span>
    `;
    
    // Modern translate button
    const translateButton = document.createElement('button');
    translateButton.className = 'message-btn';
    translateButton.setAttribute('aria-label', appConfig.data.translations[appConfig.currentLanguage]['Traduzir'] || 'Translate');
    translateButton.onclick = (e) => toggleTranslation(e.currentTarget);
    translateButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        <path d="M2 2l7.586 7.586"></path>
        <circle cx="11" cy="11" r="2"></circle>
      </svg>
      <span class="btn-text">${appConfig.data.translations[appConfig.currentLanguage]['Traduzir'] || 'Traduzir'}</span>
    `;
    
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
  renderThemeCards(); // Update theme cards to highlight current dialogue
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
  const translation = messageElement.querySelector(`.translation-text[data-lang="${appConfig.currentLanguage}"]`);
  
  if (translation.style.display === 'block') {
    translation.style.display = 'none';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        <path d="M2 2l7.586 7.586"></path>
        <circle cx="11" cy="11" r="2"></circle>
      </svg>
      <span class="btn-text">${appConfig.data.translations[appConfig.currentLanguage]['Traduzir'] || 'Traduzir'}</span>
    `;
  } else {
    document.querySelectorAll('.translation-text').forEach(el => {
      el.style.display = 'none';
    });
    
    document.querySelectorAll('.message-btn').forEach((btn, index) => {
      if (index % 2 !== 0) {
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
            <path d="M2 2l7.586 7.586"></path>
            <circle cx="11" cy="11" r="2"></circle>
          </svg>
          <span class="btn-text">${appConfig.data.translations[appConfig.currentLanguage]['Traduzir'] || 'Traduzir'}</span>
        `;
      }
    });
    
    translation.style.display = 'block';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        <path d="M2 2l7.586 7.586"></path>
        <circle cx="11" cy="11" r="2"></circle>
      </svg>
      <span class="btn-text">${appConfig.data.translations[appConfig.currentLanguage]['Ocultar'] || 'Ocultar'}</span>
    `;
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
      updateUITexts();
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

function updateActiveLanguageButton() {
  domElements.langButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === appConfig.currentLanguage);
  });
}

function updateUITexts() {
  if (domElements.mainTitle) {
    domElements.mainTitle.textContent = 
      appConfig.data.translations[appConfig.currentLanguage]["Diálogos"] || 
      "Diálogos";
  }
  
  if (domElements.subtitle) {
    domElements.subtitle.textContent = 
      appConfig.data.translations[appConfig.currentLanguage]["Aprenda diálogos reais em inglês americano sobre os tópicos most relevantes"] || 
      "Aprenda diálogos reais em inglês americano sobre os tópicos mais relevantes";
  }
  
  if (domElements.chooseThemeText) {
    domElements.chooseThemeText.textContent = 
      appConfig.data.translations[appConfig.currentLanguage]["Escolha Seu Próximo Tema"] || 
      "Escolha Seu Próximo Tema";
  }
  
  if (domElements.startLearningText) {
    domElements.startLearningText.textContent = 
      appConfig.data.translations[appConfig.currentLanguage]["Comece a Aprender Agora"] || 
      "Comece a Aprender Agora";
  }
  
  if (domElements.studyLabels && domElements.studyLabels.length >= 2) {
    domElements.studyLabels[0].textContent = 
      appConfig.data.translations[appConfig.currentLanguage]["IDIOMA EM ESTUDO:"] || 
      "IDIOMA EM ESTUDO:";
    domElements.studyLabels[1].textContent = 
      appConfig.data.translations[appConfig.currentLanguage]["NÍVEL:"] || 
      "NÍVEL:";
  }
  
  if (domElements.targetLanguage) {
    domElements.targetLanguage.textContent = 
      appConfig.data.translations[appConfig.currentLanguage]["INGLÊS AMERICANO"] || 
      "INGLÊS AMERICANO";
  }
  
  if (domElements.levelName) {
    domElements.levelName.textContent = 
      appConfig.data.translations[appConfig.currentLanguage]["INTERMEDIÁRIO (B1-B2)"] || 
      "INTERMEDIÁRIO (B1-B2)";
  }
  
  updateThemeControls();
}

function updateThemeControls() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const showLessBtn = document.getElementById('show-less-btn');
    
    if (!loadMoreBtn || !showLessBtn) return;
    
    loadMoreBtn.querySelector('span').textContent = 
        appConfig.data.translations[appConfig.currentLanguage]['load_more'] || 'Carregar Mais';
    showLessBtn.querySelector('span').textContent = 
        appConfig.data.translations[appConfig.currentLanguage]['show_less'] || 'Mostrar Menos';
    
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