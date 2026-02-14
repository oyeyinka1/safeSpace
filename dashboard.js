// Affirmations array - using "I" statements
const affirmations = [
    "I am not defined by my past. God's grace is making all things new in me — even now, even here.",
    "I have survived 100% of my worst days. I am stronger than I know.",
    "I deserve peace, healing, and love. I deserve to be here.",
    "Every day is a new opportunity for me to choose myself and my healing.",
    "My worth is not determined by what others think. I am enough, exactly as I am.",
    "I am allowed to take up space. My voice matters.",
    "My healing is not linear, and that's okay. I'm doing better than I think.",
    "I am brave for facing my pain. My strength is real.",
    "I will be gentle with myself. I'm doing the best I can.",
    "My feelings are valid. My pain is real, and so is my strength.",
    "I am worthy of love, even when I don't feel like it.",
    "This moment is temporary. I will get through this.",
    "I am capable of change and growth.",
    "I choose to believe in myself today.",
    "I am healing, one day at a time."
];

const userName = 'Michael';
const storageKeys = {
    profileImage: 'safeSpace_profileImage',
    messages: 'safeSpace_messages',
    inboxMessages: 'safeSpace_inboxMessages'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadProfileImage();
    loadAffirmation();
    loadMessages();
    updateInboxBadge();
    attachEventListeners();
    scrollToBottom();
});

// Profile Image Management
function attachEventListeners() {
    // Profile dropdown
    const profileBtn = document.getElementById('profileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const photoInput = document.getElementById('photoInput');

    profileBtn.addEventListener('click', () => {
        dropdownMenu.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.profile-menu')) {
            dropdownMenu.classList.remove('active');
        }
    });

    changePhotoBtn.addEventListener('click', () => {
        photoInput.click();
        dropdownMenu.classList.remove('active');
    });

    photoInput.addEventListener('change', handlePhotoUpload);

    logoutBtn.addEventListener('click', () => {
        alert('Logout functionality would redirect to login page.');
        dropdownMenu.classList.remove('active');
    });

    // Inbox functionality
    const inboxBtn = document.getElementById('inboxBtn');
    const inboxModal = document.getElementById('inboxModal');
    const closeInboxBtn = document.getElementById('closeInboxBtn');

    inboxBtn.addEventListener('click', openInbox);
    closeInboxBtn.addEventListener('click', closeInbox);

    // Close inbox when clicking outside modal
    inboxModal.addEventListener('click', (e) => {
        if (e.target === inboxModal) {
            closeInbox();
        }
    });

    // Chat functionality
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');

    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target.result;
            localStorage.setItem(storageKeys.profileImage, imageData);
            displayProfileImage(imageData);
        };
        reader.readAsDataURL(file);
    }
}

function loadProfileImage() {
    const savedImage = localStorage.getItem(storageKeys.profileImage);
    if (savedImage) {
        displayProfileImage(savedImage);
    }
}

function displayProfileImage(imageData) {
    const profileImage = document.getElementById('profileImage');
    const profileInitial = document.getElementById('profileInitial');

    profileImage.src = imageData;
    profileImage.classList.add('active');
    profileInitial.classList.add('hidden');
}

// Affirmation Management - Changes daily based on day of year
function loadAffirmation() {
    const affirmation = getAffirmationForToday();
    document.getElementById('affirmationText').textContent = `"${affirmation}"`;
}

function getAffirmationForToday() {
    // Get day of the year (0-364)
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((today - startOfYear) / 86400000); // milliseconds in a day
    
    // Use day number to select affirmation
    const index = dayOfYear % affirmations.length;
    return affirmations[index];
}

// Inbox Management
function openInbox() {
    const inboxModal = document.getElementById('inboxModal');
    inboxModal.classList.add('active');
    loadInboxMessages();
}

function closeInbox() {
    const inboxModal = document.getElementById('inboxModal');
    inboxModal.classList.remove('active');
}

function loadInboxMessages() {
    const inboxMessagesList = document.getElementById('inboxMessagesList');
    const inboxMessages = JSON.parse(localStorage.getItem(storageKeys.inboxMessages) || '[]');

    inboxMessagesList.innerHTML = '';

    if (inboxMessages.length === 0) {
        inboxMessagesList.innerHTML = `
            <div class="inbox-empty">
                <div class="inbox-empty-icon">📭</div>
                <p>No messages yet. Your admin will reach out soon.</p>
            </div>
        `;
        return;
    }

    // Display messages in reverse order (newest first)
    inboxMessages.reverse().forEach((message, index) => {
        const messageElement = document.createElement('div');
        messageElement.className = `inbox-message-item ${message.isRead ? '' : 'unread'}`;

        messageElement.innerHTML = `
            <div class="inbox-message-sender">🛡️ Safe Space Admin</div>
            <p class="inbox-message-text">${escapeHtml(message.text)}</p>
            <div class="inbox-message-time">${message.time}</div>
        `;

        inboxMessagesList.appendChild(messageElement);

        // Mark as read when viewing
        if (!message.isRead) {
            message.isRead = true;
            const allMessages = JSON.parse(localStorage.getItem(storageKeys.inboxMessages) || '[]');
            // Find and mark the original message as read
            const originalIndex = allMessages.findIndex(m => m.time === message.time && m.text === message.text);
            if (originalIndex !== -1) {
                allMessages[originalIndex].isRead = true;
                localStorage.setItem(storageKeys.inboxMessages, JSON.stringify(allMessages));
            }
        }
    });

    updateInboxBadge();
}

function saveInboxMessage(message) {
    const inboxMessages = JSON.parse(localStorage.getItem(storageKeys.inboxMessages) || '[]');
    inboxMessages.push({
        ...message,
        isRead: false
    });
    localStorage.setItem(storageKeys.inboxMessages, JSON.stringify(inboxMessages));
    updateInboxBadge();
}

function updateInboxBadge() {
    const inboxMessages = JSON.parse(localStorage.getItem(storageKeys.inboxMessages) || '[]');
    const unreadCount = inboxMessages.filter(msg => !msg.isRead).length;
    
    const badge = document.getElementById('inboxBadge');
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// Chat Management
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();

    if (messageText === '') return;

    // Create message object
    const message = {
        type: 'user',
        text: messageText,
        time: getCurrentTime()
    };

    // Add to messages
    addMessageToUI(message);
    saveMessage(message);

    // Clear input
    messageInput.value = '';
    messageInput.focus();

    // Simulate admin response after a delay
    setTimeout(() => {
        const adminMessage = {
            type: 'admin',
            text: 'Thank you for sharing. I\'m listening and here to support you.',
            time: getCurrentTime()
        };
        addMessageToUI(adminMessage);
        saveMessage(adminMessage);

        // Save admin message to inbox as well
        saveInboxMessage({
            text: adminMessage.text,
            time: adminMessage.time
        });
    }, 1500);
}

function addMessageToUI(message) {
    const messagesArea = document.getElementById('messagesArea');
    const messageElement = document.createElement('div');
    
    const messageClass = message.type === 'user' ? 'user-message' : 'admin-message';
    messageElement.className = `message ${messageClass}`;

    messageElement.innerHTML = `
        <p class="message-text">${escapeHtml(message.text)}</p>
        <span class="message-time">${message.time}</span>
    `;

    messagesArea.appendChild(messageElement);
    scrollToBottom();
}

function scrollToBottom() {
    const messagesArea = document.getElementById('messagesArea');
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

function saveMessage(message) {
    const messages = JSON.parse(localStorage.getItem(storageKeys.messages) || '[]');
    messages.push(message);
    localStorage.setItem(storageKeys.messages, JSON.stringify(messages));
}

function loadMessages() {
    const messagesArea = document.getElementById('messagesArea');
    const savedMessages = JSON.parse(localStorage.getItem(storageKeys.messages) || '[]');

    // Clear existing messages
    messagesArea.innerHTML = '';
    
    // Load all saved messages
    savedMessages.forEach(msg => addMessageToUI(msg));
}

function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Utility function to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}