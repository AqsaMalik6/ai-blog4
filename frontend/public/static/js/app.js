let currentChatId = null;
window.aiSources = {};

document.addEventListener('DOMContentLoaded', () => {
    loadChats();
    setupTextarea();

    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chat_id');
    if (chatId) {
        loadChat(parseInt(chatId));
    }
});

function setupTextarea() {
    const textarea = document.getElementById('topicInput');
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateBlog();
        }
    });
}

function setTopic(topic) {
    const input = document.getElementById('topicInput');
    input.value = topic;
    input.style.height = 'auto';
    input.style.height = (input.scrollHeight) + 'px';
    input.focus();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');

    // Update tooltip/title for all toggle buttons
    const btns = document.querySelectorAll('.toggle-sidebar-btn');
    const isCollapsed = sidebar.classList.contains('collapsed');
    btns.forEach(btn => {
        btn.setAttribute('title', isCollapsed ? 'Open side bar' : 'Close side bar');
    });
}

async function loadChats() {
    try {
        const response = await fetch('/api/chats');
        const chats = await response.json();
        const chatList = document.getElementById('chatList');
        chatList.innerHTML = '';
        chats.forEach(chat => {
            const div = document.createElement('div');
            div.className = `chat-item ${chat.id === currentChatId ? 'active' : ''}`;
            div.innerHTML = `
                <div class="chat-item-title" onclick="loadChat(${chat.id})">${chat.title}</div>
                <button class="delete-btn" onclick="deleteChat(${chat.id}, event)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                    </svg>
                </button>
            `;
            chatList.appendChild(div);
        });
    } catch (e) {
        console.error(e);
    }
}

async function loadChat(id) {
    currentChatId = id;
    try {
        const response = await fetch(`/api/chats/${id}/messages`);
        const messages = await response.json();

        const welcome = document.getElementById('welcomeScreen');
        if (welcome) welcome.style.display = 'none';

        const display = document.getElementById('chatMessages');
        display.innerHTML = '';
        messages.forEach(msg => {
            addMessageToUI(msg.role, msg.content, msg.image_url, msg.id);
        });
        loadChats();
        scrollToBottom();
    } catch (e) { console.error(e); }
}

async function deleteChat(id, e) {
    e.stopPropagation();
    const modalMsg = document.getElementById('modalMsg');
    modalMsg.innerText = "Are you sure you want to delete this project? This cannot be undone.";

    showConfirmModal(async () => {
        try {
            await fetch(`/api/chats/${id}`, { method: 'DELETE' });
            if (currentChatId === id) createNewChat();
            loadChats();
        } catch (e) { console.error(e); }
    });
}

function createNewChat() {
    currentChatId = null;
    document.getElementById('welcomeScreen').style.display = 'block';
    document.getElementById('chatMessages').innerHTML = '';
    document.getElementById('topicInput').value = '';
    loadChats();
}

async function generateBlog() {
    const input = document.getElementById('topicInput');
    const topic = input.value.trim();
    if (!topic || input.disabled) return;

    input.value = '';
    input.style.height = 'auto';
    input.disabled = true;
    document.getElementById('sendBtn').disabled = true;

    // Remove welcome screen
    const welcome = document.getElementById('welcomeScreen');
    if (welcome) welcome.style.display = 'none';

    // We don't have the user message ID yet, so we'll add it temporarily
    const userWrapper = addMessageToUI('user', topic);
    showLoading();

    try {
        const res = await fetch('/api/generate-blog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic,
                user_id: 1,
                chat_id: currentChatId
            })
        });
        const data = await res.json();
        console.log("Backend Response:", data);
        removeLoading();

        if (data.success) {
            // Update user message ID
            if (userWrapper) userWrapper.dataset.id = data.user_message_id;

            addMessageToUI('assistant', data.content, data.image_url, data.assistant_message_id);
            if (!currentChatId) {
                currentChatId = data.chat_id;
            }
            loadChats();
        } else {
            let errorMsg = "Unable to process request.";
            if (data.detail) {
                errorMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
            }
            addMessageToUI('assistant', "**System Error**: " + errorMsg);
        }
    } catch (err) {
        removeLoading();
        addMessageToUI('assistant', "**Connection Error**: Please check if the server is running.");
    } finally {
        input.disabled = false;
        document.getElementById('sendBtn').disabled = false;
        input.focus();
    }
}

function addMessageToUI(role, content, imageUrl = null, messageId = null) {
    console.log(`Adding message UI [${role}]:`, { hasImage: !!imageUrl });
    const display = document.getElementById('chatMessages');
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${role === 'user' ? 'user' : 'ai'}`;
    if (messageId) wrapper.dataset.id = messageId;

    const label = role === 'user' ? 'You' : 'AI Assistant';
    const avatar = role === 'user'
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>`;

    let imageHtml = '';
    if (imageUrl) {
        imageHtml = `
            <div class="image-msg-container">
                <a href="${imageUrl}" download="generated-image.png" class="download-link" title="Download Image">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </a>
                <img src="${imageUrl}" class="generated-image" alt="AI Generated Image" onerror="this.src='/static/images/fallback.png'; console.error('Image load failed:', this.src);">
            </div>
        `;
    }

    const isUser = role === 'user';
    const editBtn = isUser ? `
                <button class="action-btn" title="Edit" onclick="editMessage(this)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>` : '';
    const deleteBtn = isUser ? `
                <button class="action-btn" title="Delete" onclick="deleteMessage(this)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>` : '';

    wrapper.innerHTML = `
        <div class="message-header">
            <div class="avatar-icon">${avatar}</div>
            <span>${label}</span>
        </div>
        <div class="message-bubble">
            <div class="message-text">${formatMarkdown(content)}</div>
            ${imageHtml}
            <div class="message-actions">
                <button class="action-btn" title="Copy" onclick="copyMessage(this)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>
                </button>
                ${editBtn}
                ${deleteBtn}
            </div>
        </div>
    `;
    display.appendChild(wrapper);
    scrollToBottom();
    return wrapper;
}
function copyMessage(btn) {
    const text = btn.closest('.message-bubble').querySelector('.message-text').innerText;
    navigator.clipboard.writeText(text);
    showToast("Copied!", btn);
}

function showToast(msg, anchor) {
    const existing = anchor.querySelector('.toast-notif');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notif';
    toast.innerText = msg;
    anchor.style.position = 'relative';
    anchor.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function showConfirmModal(callback) {
    const modal = document.getElementById('confirmModal');
    const confirmBtn = document.getElementById('modalConfirmBtn');

    modal.classList.add('active');

    confirmBtn.onclick = () => {
        callback();
        closeModal();
    };
}

function closeModal() {
    document.getElementById('confirmModal').classList.remove('active');
}

async function deleteMessage(btn) {
    const modalMsg = document.getElementById('modalMsg');
    modalMsg.innerText = "Do you really want to delete this message? (The AI response will also be removed)";

    showConfirmModal(async () => {
        const wrapper = btn.closest('.message-wrapper');
        const id = wrapper.dataset.id;

        // If it's a user message, find the next AI message and delete it too
        if (wrapper.classList.contains('user')) {
            const nextMsg = wrapper.nextElementSibling;
            if (nextMsg && nextMsg.classList.contains('ai')) {
                const nextId = nextMsg.dataset.id;
                if (nextId) {
                    try { await fetch(`/api/messages/${nextId}`, { method: 'DELETE' }); } catch (e) { }
                }
                nextMsg.remove();
            }
        }

        if (id) {
            try {
                await fetch(`/api/messages/${id}`, { method: 'DELETE' });
            } catch (e) { console.error(e); }
        }
        wrapper.remove();

        // If chat is empty, show welcome screen
        const display = document.getElementById('chatMessages');
        if (display.children.length === 0) {
            document.getElementById('welcomeScreen').style.display = 'block';
        }

        showToast("Deleted!", document.body);
    });
}

function editMessage(btn) {
    const wrapper = btn.closest('.message-wrapper');
    const msgText = wrapper.querySelector('.message-text');
    const originalText = msgText.innerText;

    // Create smart inline editor
    const editContainer = document.createElement('div');
    editContainer.className = 'edit-container';
    editContainer.innerHTML = `
        <textarea class="edit-textarea">${originalText}</textarea>
        <div class="edit-actions">
            <button class="e-btn e-cancel">Cancel</button>
            <button class="e-btn e-send">Send</button>
        </div>
    `;

    // Hide original bubble
    wrapper.style.display = 'none';
    // Insert edit box after the user message (which is before AI)
    wrapper.parentNode.insertBefore(editContainer, wrapper.nextSibling);

    const textarea = editContainer.querySelector('textarea');
    textarea.focus();
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });

    editContainer.querySelector('.e-cancel').onclick = () => {
        wrapper.style.display = 'flex';
        editContainer.remove();
    };

    editContainer.querySelector('.e-send').onclick = async () => {
        const newText = textarea.value.trim();
        if (newText && newText !== originalText) {
            const id = wrapper.dataset.id;
            if (id) {
                try {
                    await fetch(`/api/messages/${id}?content=${encodeURIComponent(newText)}`, { method: 'PATCH' });
                } catch (e) { console.error(e); }
            }
            msgText.innerHTML = formatMarkdown(newText);
            showToast("Updated!", btn);
        }
        wrapper.style.display = 'flex';
        editContainer.remove();
    };
}

function formatMarkdown(text) {
    // Basic formatting
    text = text.replace(/^# (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^## (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Handle Tables
    if (text.includes('|')) {
        const lines = text.split('\n');
        let inTable = false;
        let tableHtml = '<div class="table-wrapper"><table>';

        const processedLines = lines.map(line => {
            if (line.trim().startsWith('|')) {
                if (!inTable) {
                    inTable = true;
                    return 'TABLE_START' + line;
                }
                return line;
            } else {
                if (inTable) {
                    inTable = false;
                    return 'TABLE_END' + line;
                }
                return line;
            }
        });

        let finalHtml = '';
        let tableBuffer = [];

        processedLines.forEach(line => {
            if (line.startsWith('TABLE_START')) {
                tableBuffer.push(line.replace('TABLE_START', ''));
            } else if (line.startsWith('TABLE_END')) {
                finalHtml += renderTable(tableBuffer);
                tableBuffer = [];
                finalHtml += line.replace('TABLE_END', '') + '\n';
            } else if (inTable || tableBuffer.length > 0) {
                tableBuffer.push(line);
            } else {
                finalHtml += line + '\n';
            }
        });
        if (tableBuffer.length > 0) finalHtml += renderTable(tableBuffer);
        text = finalHtml;
    }

    text = text.replace(/\n\n/g, '<br><br>');
    text = text.replace(/\n/g, '<br>');
    return text;
}

function renderTable(rows) {
    if (rows.length < 2) return rows.join('\n');
    let html = '<div class="table-wrapper"><table><thead>';

    // Header
    const headers = rows[0].split('|').filter(c => c.trim() !== '');
    html += '<tr>' + headers.map(h => `<th>${h.trim()}</th>`).join('') + '</tr></thead><tbody>';

    // Data (skip separator row if it exists)
    const dataRows = rows.slice(1).filter(r => !r.includes('---'));
    dataRows.forEach(row => {
        const cols = row.split('|').filter(c => c.trim() !== '');
        if (cols.length > 0) {
            html += '<tr>' + cols.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
        }
    });

    html += '</tbody></table></div>';
    return html;
}

function showLoading() {
    const display = document.getElementById('chatMessages');
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper ai loading-msg';
    wrapper.innerHTML = `
        <div class="message-header">
            <div class="avatar-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg></div>
            <span>AI Assistant</span>
        </div>
        <div class="loading-row">
            <div class="dot"></div><div class="dot"></div><div class="dot"></div>
        </div>
    `;
    display.appendChild(wrapper);
    scrollToBottom();
}

function removeLoading() {
    const loader = document.querySelector('.loading-msg');
    if (loader) loader.remove();
}

function scrollToBottom() {
    const container = document.getElementById('chatContainer');
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
}