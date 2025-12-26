<?php
session_start();

// Обработка загрузки файлов
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['emote'])) {
    $uploadDir = 'uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $file = $_FILES['emote'];
    $fileName = time() . '_' . basename($file['name']);
    $targetPath = $uploadDir . $fileName;
    
    $allowedTypes = ['image/png', 'image/gif', 'image/jpeg'];
    if (in_array($file['type'], $allowedTypes)) {
        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $response = ['success' => true, 'path' => $targetPath];
        } else {
            $response = ['success' => false, 'error' => 'Ошибка загрузки'];
        }
    } else {
        $response = ['success' => false, 'error' => 'Недопустимый формат файла'];
    }
    
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Twitch Emote Tester</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>🎮 Twitch Emote Tester</h1>
            <p>Протестируйте свои смайлы на светлом и темном фоне</p>
        </header>

        <div class="upload-section">
            <div class="upload-box">
                <input type="file" id="emoteUpload" accept="image/png,image/gif,image/jpeg" multiple>
                <label for="emoteUpload" class="upload-label">
                    <span class="upload-icon">📁</span>
                    <span>Выбрать файлы</span>
                    <span class="upload-hint">PNG, GIF или JPEG</span>
                </label>
            </div>
        </div>

        <div class="controls">
            <div class="size-controls">
                <label>Размер смайла:</label>
                <button class="size-btn active" data-size="28">28px</button>
                <button class="size-btn" data-size="56">56px</button>
                <button class="size-btn" data-size="112">112px</button>
            </div>
            
            <div class="theme-toggle">
                <button id="themeToggle" class="theme-btn">
                    <span class="theme-icon">🌙</span>
                    <span class="theme-text">Темная тема</span>
                </button>
            </div>
        </div>

        <div class="preview-container">
            <div class="preview-section">
                <h2>Twitch Chat</h2>
                <div class="chat-preview" id="twitchChat">
                    <div class="chat-message">
                        <span class="username" style="color: #FF6B6B;">Streamer:</span>
                        <span class="message">Привет чат! Как дела?</span>
                    </div>
                    <div class="chat-message">
                        <span class="username" style="color: #4ECDC4;">Viewer123:</span>
                        <span class="message">Отлично! <span class="emote-placeholder">Смайл</span></span>
                    </div>
                </div>
            </div>

            <div class="preview-section">
                <h2>Discord Chat</h2>
                <div class="chat-preview discord" id="discordChat">
                    <div class="chat-message">
                        <span class="username" style="color: #7289DA;">Moderator</span>
                        <span class="message">Добро пожаловать!</span>
                    </div>
                    <div class="chat-message">
                        <span class="username" style="color: #43B581;">User456</span>
                        <span class="message">Спасибо! <span class="emote-placeholder">Смайл</span></span>
                    </div>
                </div>
            </div>
        </div>

        <div class="emotes-grid" id="emotesGrid"></div>

        <div class="badge-controls">
            <h3>Настройки значков</h3>
            <div class="badge-options">
                <select id="badgeSelect" class="badge-select">
                    <option value="">Выберите значок</option>
                    <option value="subscriber">Подписчик</option>
                    <option value="moderator">Модератор</option>
                    <option value="vip">VIP</option>
                    <option value="partner">Партнер</option>
                </select>
                <button id="previewBadge" class="btn-preview">Предпросмотр</button>
                <button id="clearBadges" class="btn-clear">Очистить</button>
            </div>
        </div>
    </div>

    <script src="js/app.js"></script>
</body>
</html>