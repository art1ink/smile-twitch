// Состояние приложения
const app = {
    emotes: [],
    currentSize: 28,
    isDarkTheme: false,
    currentLanguage: 'en',
    selectedBadge: null
};

// Переводы
const translations = {
    ru: {
        title: 'Twitch Emote Tester',
        subtitle: 'Протестируйте свои смайлы на светлом и темном фоне',
        upload_files: 'Выбрать файлы',
        upload_hint: 'PNG, GIF или JPEG',
        emote_size: 'Размер смайла:',
        your_nickname: 'Ваш ник:',
        placeholder_username: 'TestUser',
        dark_theme: 'Темная тема',
        light_theme: 'Светлая тема',
        twitch_chat: 'Twitch Chat',
        discord_chat: 'Discord Chat',
        chat_message_1: 'Привет чат! Как дела?',
        chat_message_2: 'Отлично!',
        chat_message_3: 'Добро пожаловать!',
        chat_message_4: 'Спасибо!',
        badge_settings: 'Настройки значков',
        select_badge: 'Выберите значок',
        badge_subscriber: 'Подписчик',
        badge_moderator: 'Модератор',
        badge_vip: 'VIP',
        badge_partner: 'Партнер',
        preview_button: 'Предпросмотр',
        clear_button: 'Очистить',
        insert_to_chat: 'Вставить в чат',
        delete: 'Удалить',
        no_emotes: 'Загрузите смайлы для тестирования',
        upload_image: 'Пожалуйста, загрузите изображение',
        confirm_delete: 'Удалить этот смайл?',
        select_badge_alert: 'Выберите значок',
        checking_emote: 'Проверяем смайл',
        testing_emote: 'Тест смайла',
        message_with_badge: 'Сообщение со значком'
    },
    en: {
        title: 'Twitch Emote Tester',
        subtitle: 'Test your emotes on light and dark backgrounds',
        upload_files: 'Select files',
        upload_hint: 'PNG, GIF or JPEG',
        emote_size: 'Emote size:',
        your_nickname: 'Your nickname:',
        placeholder_username: 'TestUser',
        dark_theme: 'Dark theme',
        light_theme: 'Light theme',
        twitch_chat: 'Twitch Chat',
        discord_chat: 'Discord Chat',
        chat_message_1: 'Hey chat! How are you?',
        chat_message_2: 'Great!',
        chat_message_3: 'Welcome!',
        chat_message_4: 'Thanks!',
        badge_settings: 'Badge Settings',
        select_badge: 'Select badge',
        badge_subscriber: 'Subscriber',
        badge_moderator: 'Moderator',
        badge_vip: 'VIP',
        badge_partner: 'Partner',
        preview_button: 'Preview',
        clear_button: 'Clear',
        insert_to_chat: 'Insert to chat',
        delete: 'Delete',
        no_emotes: 'Upload emotes for testing',
        upload_image: 'Please upload an image',
        confirm_delete: 'Delete this emote?',
        select_badge_alert: 'Select a badge',
        checking_emote: 'Checking emote',
        testing_emote: 'Testing emote',
        message_with_badge: 'Message with badge'
    }
};

// Значки для предпросмотра (используем HTML для лучшего отображения)
const badges = {
    subscriber: '<span style="display: inline-block; width: 18px; height: 18px; background: #8b44f7; border-radius: 2px; text-align: center; line-height: 18px; color: white; font-size: 10px; font-weight: bold; margin-right: 4px;">★</span>',
    moderator: '<span style="display: inline-block; width: 18px; height: 18px; background: #00ad03; border-radius: 2px; text-align: center; line-height: 18px; color: white; font-size: 12px; font-weight: bold; margin-right: 4px;">⚔</span>',
    vip: '<span style="display: inline-block; width: 18px; height: 18px; background: #e005b9; border-radius: 2px; text-align: center; line-height: 18px; color: white; font-size: 10px; font-weight: bold; margin-right: 4px;">◆</span>',
    partner: '<span style="display: inline-block; width: 18px; height: 18px; background: #9147ff; border-radius: 2px; text-align: center; line-height: 18px; color: white; font-size: 12px; font-weight: bold; margin-right: 4px;">✓</span>'
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initUpload();
    initSizeControls();
    initThemeToggle();
    initBadgeControls();
    initLanguage();
    loadSavedEmotes();
});

// Инициализация языка
function initLanguage() {
    const languageSelect = document.getElementById('languageSelect');
    
    // Загрузка сохраненного языка или установка английского по умолчанию
    const savedLang = localStorage.getItem('language') || 'en';
    app.currentLanguage = savedLang;
    languageSelect.value = savedLang;
    updateLanguage(savedLang);
    
    // Обработчик смены языка
    languageSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        app.currentLanguage = newLang;
        localStorage.setItem('language', newLang);
        updateLanguage(newLang);
    });
}

// Обновление языка
function updateLanguage(lang) {
    const t = translations[lang];
    
    // Обновление всех элементов с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                // Сохраняем HTML внутри элемента (для смайлов)
                if (el.querySelector('.emote-placeholder')) {
                    el.childNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            node.textContent = t[key];
                        }
                    });
                } else {
                    el.textContent = t[key];
                }
            }
        }
    });
    
    // Обновление placeholder отдельно
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });
    
    // Обновление текста кнопки темы
    updateThemeButtonText();
    
    // Перерисовка сетки смайлов
    renderEmotes();
}

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
    const t = translations[app.currentLanguage];
    
    if (!file.type.match('image.*')) {
        alert(t.upload_image);
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
    
    themeBtn.addEventListener('click', () => {
        app.isDarkTheme = !app.isDarkTheme;
        document.body.classList.toggle('dark-theme');
        
        updateThemeButtonText();
        
        localStorage.setItem('theme', app.isDarkTheme ? 'dark' : 'light');
    });

    // Загрузка сохраненной темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        themeBtn.click();
    }
}

// Обновление текста кнопки темы
function updateThemeButtonText() {
    const themeBtn = document.getElementById('themeToggle');
    const themeIcon = themeBtn.querySelector('.theme-icon');
    const themeText = themeBtn.querySelector('.theme-text');
    const t = translations[app.currentLanguage];
    
    if (app.isDarkTheme) {
        themeIcon.textContent = '☀️';
        themeText.textContent = t.light_theme;
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = t.dark_theme;
    }
}

// Отрисовка смайлов
function renderEmotes() {
    const grid = document.getElementById('emotesGrid');
    const t = translations[app.currentLanguage];
    
    if (app.emotes.length === 0) {
        grid.innerHTML = `<p style="text-align: center; color: var(--text-secondary); grid-column: 1 / -1;">${t.no_emotes}</p>`;
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
                    ${t.insert_to_chat}
                </button>
                <button class="btn-delete" onclick="deleteEmote('${emote.id}')">
                    ${t.delete}
                </button>
            </div>
        </div>
    `).join('');
}

// Предпросмотр смайла в чате
function previewEmote(emoteId) {
    const emote = app.emotes.find(e => e.id == emoteId);
    if (!emote) return;
    
    const t = translations[app.currentLanguage];
    const username = document.getElementById('usernameInput').value.trim() || t.placeholder_username;
    
    const twitchChat = document.getElementById('twitchChat');
    const discordChat = document.getElementById('discordChat');
    
    const emoteHtml = `<img src="${emote.src}" alt="${emote.name}" class="emote-in-chat" style="height: ${app.currentSize}px; vertical-align: middle; margin: 0 2px;">`;
    
    // Получение значка, если выбран
    const badgeHtml = app.selectedBadge ? badges[app.selectedBadge] : '';
    
    // Добавление в Twitch чат
    const twitchMsg = document.createElement('div');
    twitchMsg.className = 'chat-message';
    twitchMsg.innerHTML = `
        ${badgeHtml}
        <span class="username" style="color: #FFB347;">${username}:</span>
        <span class="message">${t.checking_emote} ${emoteHtml}</span>
    `;
    twitchChat.appendChild(twitchMsg);
    
    // Добавление в Discord чат
    const discordMsg = document.createElement('div');
    discordMsg.className = 'chat-message';
    discordMsg.innerHTML = `
        <span class="username" style="color: #F47FFF;">${username}</span>
        <span class="message">${t.testing_emote} ${emoteHtml}</span>
    `;
    discordChat.appendChild(discordMsg);
    
    // Автоскролл
    twitchChat.scrollTop = twitchChat.scrollHeight;
    discordChat.scrollTop = discordChat.scrollHeight;
}

// Удаление смайла
function deleteEmote(emoteId) {
    const t = translations[app.currentLanguage];
    
    if (confirm(t.confirm_delete)) {
        app.emotes = app.emotes.filter(e => e.id != emoteId);
        saveEmotes();
        renderEmotes();
    }
}

// Управление значками
function initBadgeControls() {
    const badgeBtns = document.querySelectorAll('.badge-btn[data-badge]');
    const clearBtn = document.getElementById('clearBadges');
    
    badgeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const badgeType = btn.getAttribute('data-badge');
            
            // Снять выделение со всех кнопок
            badgeBtns.forEach(b => b.classList.remove('active'));
            
            // Если кликнули по уже выбранному значку, отменяем выбор
            if (app.selectedBadge === badgeType) {
                app.selectedBadge = null;
            } else {
                // Иначе выбираем новый значок
                app.selectedBadge = badgeType;
                btn.classList.add('active');
            }
        });
    });
    
    clearBtn.addEventListener('click', () => {
        const t = translations[app.currentLanguage];
        const twitchChat = document.getElementById('twitchChat');
        const discordChat = document.getElementById('discordChat');
        
        // Снять выделение со всех значков
        badgeBtns.forEach(b => b.classList.remove('active'));
        app.selectedBadge = null;
        
        twitchChat.innerHTML = `
            <div class="chat-message">
                <span class="username" style="color: #FF6B6B;">Streamer:</span>
                <span class="message">${t.chat_message_1}</span>
            </div>
            <div class="chat-message">
                <span class="username" style="color: #4ECDC4;">Viewer123:</span>
                <span class="message">${t.chat_message_2}</span>
            </div>
        `;
        
        discordChat.innerHTML = `
            <div class="chat-message">
                <span class="username" style="color: #7289DA;">Moderator</span>
                <span class="message">${t.chat_message_3}</span>
            </div>
            <div class="chat-message">
                <span class="username" style="color: #43B581;">User456</span>
                <span class="message">${t.chat_message_4}</span>
            </div>
        `;
    });
}

// Удалена функция addBadgeToChat, так как теперь не используется

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