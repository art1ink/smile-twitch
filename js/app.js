// Состояние приложения
const app = {
    emotes: [],
    currentSize: 28,
    isDarkTheme: false
};

// Значки для предпросмотра
const badges = {
    subscriber: '🔷',
    moderator: '⚔️',
    vip: '💎',
    partner: '✓'
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initUpload();
    initSizeControls();
    initThemeToggle();
    initBadgeControls();
    loadSavedEmotes();
});

// Загрузка файлов
function initUpload() {
    const uploadInput = document.getElementById('emoteUpload');
    
    uploadInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => handleFileUpload(file));
    });

    // Drag & drop
    const uploadLabel = document.querySelector('.upload-label');
    
    uploadLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadLabel.style.borderColor = 'var(--twitch-purple)';
    });

    uploadLabel.addEventListener('dragleave', () => {
        uploadLabel.style.borderColor = 'var(--border-color)';
    });

    uploadLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadLabel.style.borderColor = 'var(--border-color)';
        
        const files = Array.from(e.dataTransfer.files);
        files.forEach(file => handleFileUpload(file));
    });
}

// Обработка загрузки файла
function handleFileUpload(file) {
    if (!file.type.match('image.*')) {
        alert('Пожалуйста, загрузите изображение');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const emote = {
                id: Date.now() + Math.random(),
                name: file.name.split('.')[0],
                src: e.target.result,
                width: img.width,
                height: img.height,
                size: file.size
            };
            
            app.emotes.push(emote);
            saveEmotes();
            renderEmotes();
        };
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

// Управление размером
function initSizeControls() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            app.currentSize = parseInt(btn.dataset.size);
            updateEmoteSize();
        });
    });
}

// Обновление размера смайлов
function updateEmoteSize() {
    const emoteImages = document.querySelectorAll('.emote-in-chat');
    emoteImages.forEach(img => {
        img.style.height = app.currentSize + 'px';
    });
}

// Переключение темы
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    const themeIcon = themeBtn.querySelector('.theme-icon');
    const themeText = themeBtn.querySelector('.theme-text');
    
    themeBtn.addEventListener('click', () => {
        app.isDarkTheme = !app.isDarkTheme;
        document.body.classList.toggle('dark-theme');
        
        if (app.isDarkTheme) {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Светлая тема';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Темная тема';
        }
        
        localStorage.setItem('theme', app.isDarkTheme ? 'dark' : 'light');
    });

    // Загрузка сохраненной темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        themeBtn.click();
    }
}

// Отрисовка смайлов
function renderEmotes() {
    const grid = document.getElementById('emotesGrid');
    
    if (app.emotes.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1 / -1;">Загрузите смайлы для тестирования</p>';
        return;
    }
    
    grid.innerHTML = app.emotes.map(emote => `
        <div class="emote-card" data-id="${emote.id}">
            <div class="emote-preview">
                <img src="${emote.src}" alt="${emote.name}" class="emote-img" style="height: ${app.currentSize}px;">
            </div>
            <strong>${emote.name}</strong>
            <div class="emote-info">
                ${emote.width}x${emote.height}px | ${formatFileSize(emote.size)}
            </div>
            <div class="emote-actions">
                <button class="btn-preview" onclick="previewEmote('${emote.id}')">
                    Вставить в чат
                </button>
                <button class="btn-delete" onclick="deleteEmote('${emote.id}')">
                    Удалить
                </button>
            </div>
        </div>
    `).join('');
}

// Предпросмотр смайла в чате
function previewEmote(emoteId) {
    const emote = app.emotes.find(e => e.id == emoteId);
    if (!emote) return;
    
    const twitchChat = document.getElementById('twitchChat');
    const discordChat = document.getElementById('discordChat');
    
    const emoteHtml = `<img src="${emote.src}" alt="${emote.name}" class="emote-in-chat" style="height: ${app.currentSize}px; vertical-align: middle; margin: 0 2px;">`;
    
    // Добавление в Twitch чат
    const twitchMsg = document.createElement('div');
    twitchMsg.className = 'chat-message';
    twitchMsg.innerHTML = `
        <span class="username" style="color: #FFB347;">TestUser:</span>
        <span class="message">Проверяем смайл ${emoteHtml} ${emote.name}</span>
    `;
    twitchChat.appendChild(twitchMsg);
    
    // Добавление в Discord чат
    const discordMsg = document.createElement('div');
    discordMsg.className = 'chat-message';
    discordMsg.innerHTML = `
        <span class="username" style="color: #F47FFF;">Tester</span>
        <span class="message">Тест смайла ${emoteHtml} ${emote.name}</span>
    `;
    discordChat.appendChild(discordMsg);
    
    // Автоскролл
    twitchChat.scrollTop = twitchChat.scrollHeight;
    discordChat.scrollTop = discordChat.scrollHeight;
}

// Удаление смайла
function deleteEmote(emoteId) {
    if (confirm('Удалить этот смайл?')) {
        app.emotes = app.emotes.filter(e => e.id != emoteId);
        saveEmotes();
        renderEmotes();
    }
}

// Управление значками
function initBadgeControls() {
    const badgeSelect = document.getElementById('badgeSelect');
    const previewBtn = document.getElementById('previewBadge');
    const clearBtn = document.getElementById('clearBadges');
    
    previewBtn.addEventListener('click', () => {
        const badge = badgeSelect.value;
        if (!badge) {
            alert('Выберите значок');
            return;
        }
        
        addBadgeToChat(badge);
    });
    
    clearBtn.addEventListener('click', () => {
        const twitchChat = document.getElementById('twitchChat');
        const discordChat = document.getElementById('discordChat');
        
        twitchChat.innerHTML = `
            <div class="chat-message">
                <span class="username" style="color: #FF6B6B;">Streamer:</span>
                <span class="message">Привет чат! Как дела?</span>
            </div>
            <div class="chat-message">
                <span class="username" style="color: #4ECDC4;">Viewer123:</span>
                <span class="message">Отлично! <span class="emote-placeholder">Смайл</span></span>
            </div>
        `;
        
        discordChat.innerHTML = `
            <div class="chat-message">
                <span class="username" style="color: #7289DA;">Moderator</span>
                <span class="message">Добро пожаловать!</span>
            </div>
            <div class="chat-message">
                <span class="username" style="color: #43B581;">User456</span>
                <span class="message">Спасибо! <span class="emote-placeholder">Смайл</span></span>
            </div>
        `;
    });
}

// Добавление значка в чат
function addBadgeToChat(badgeType) {
    const twitchChat = document.getElementById('twitchChat');
    const badgeIcon = badges[badgeType];
    
    const msg = document.createElement('div');
    msg.className = 'chat-message';
    msg.innerHTML = `
        <span class="badge-icon">${badgeIcon}</span>
        <span class="username" style="color: #9147FF;">${badgeType.charAt(0).toUpperCase() + badgeType.slice(1)}User:</span>
        <span class="message">Сообщение со значком ${badgeIcon}</span>
    `;
    
    twitchChat.appendChild(msg);
    twitchChat.scrollTop = twitchChat.scrollHeight;
}

// Форматирование размера файла
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Сохранение смайлов в localStorage
function saveEmotes() {
    try {
        localStorage.setItem('emotes', JSON.stringify(app.emotes));
    } catch (e) {
        console.error('Ошибка сохранения:', e);
    }
}

// Загрузка сохраненных смайлов
function loadSavedEmotes() {
    try {
        const saved = localStorage.getItem('emotes');
        if (saved) {
            app.emotes = JSON.parse(saved);
            renderEmotes();
        }
    } catch (e) {
        console.error('Ошибка загрузки:', e);
    }
}