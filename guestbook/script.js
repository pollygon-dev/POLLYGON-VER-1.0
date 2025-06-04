const API_URL = 'https://guestbook.tokonatsuwave.workers.dev';

// Date display functionality
function updateDateDisplay() {
    const now = new Date();
    const currentDay = now.getDay();
    const diff = currentDay - 1;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const mondayMonth = months[monday.getMonth()];
    const sundayMonth = months[sunday.getMonth()];
    const mondayDate = monday.getDate();
    const sundayDate = sunday.getDate();
    
    let dateRange;
    if (mondayMonth === sundayMonth) {
        dateRange = `${mondayMonth} ${mondayDate}-${sundayDate}`;
    } else {
        dateRange = `${mondayMonth} ${mondayDate}-${sundayMonth} ${sundayDate}`;
    }
    
    document.getElementById('week-range').textContent = dateRange;
    document.getElementById('current-year').textContent = now.getFullYear();
}

// Character counter
document.getElementById('message').addEventListener('input', function(e) {
    const count = e.target.value.length;
    document.querySelector('.char-counter').textContent = `${count}/500`;
});

// Image preview
document.getElementById('image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('preview-image');
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

// Show toast message
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Format text
function formatText(type, param = '') {
    const textarea = document.getElementById('message');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let replacement = '';

    switch(type) {
        case 'b':
            replacement = `[b]${selectedText}[/b]`;
            break;
        case 'i':
            replacement = `[i]${selectedText}[/i]`;
            break;
        case 'align':
            replacement = `[align=center]${selectedText}[/align]`;
            break;
        case 'font':
            replacement = `[font=Arial]${selectedText}[/font]`;
            break;
        case 'size':
            replacement = `[size=16]${selectedText}[/size]`;
            break;
        case 'code':
            replacement = `[code]${selectedText}[/code]`;
            break;
        case 'emoji':
            replacement = selectedText + param;
            break;
    }
    
    textarea.value = textarea.value.substring(0, start) + 
                    replacement + 
                    textarea.value.substring(end);
    textarea.focus();
}

// Format message
function formatMessage(message) {
    if (!message) return '';
    return message
        .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>')
        .replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>')
        .replace(/\[align=(left|center|right)\](.*?)\[\/align\]/g, '<div style="text-align: $1">$2</div>')
        .replace(/\[size=(\d+)\](.*?)\[\/size\]/g, '<span style="font-size: $1px">$2</span>')
        .replace(/\[font=([^\]]+)\](.*?)\[\/font\]/g, '<span style="font-family: $1">$2</span>')
        .replace(/\[code\](.*?)\[\/code\]/g, '<code>$1</code>')
        .replace(/\[color=([^\]]+)\](.*?)\[\/color\]/g, '<span style="color: $1">$2</span>');
}

// Toggle reply form
function toggleReplyForm(entryId) {
    const form = document.getElementById(`reply-form-${entryId}`);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Submit reply
async function submitReply(event, entryId) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const website = form.querySelector('input[type="url"]').value;
    const message = form.querySelector('textarea').value;
    
    try {
        console.log('Submitting reply...', { entryId, name, website });
        const response = await fetch(`${API_URL}/entries/${entryId}/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify({ name, website, message })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Reply error response:', errorText);
            throw new Error(`Failed to send reply: ${response.status}`);
        }

        const result = await response.json();
        console.log('Reply result:', result);
        
        form.reset();
        form.style.display = 'none';
        await loadMessages();
        showToast('Reply sent!');
    } catch (error) {
        console.error('Failed to send reply:', error);
        showToast(`Failed to send reply: ${error.message}`);
    }
}

// Add reaction
async function addReaction(button, entryId, reactionType) {
    try {
        console.log('Adding reaction...', { entryId, reactionType });
        const response = await fetch(`${API_URL}/reactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify({ entry_id: entryId, reaction_type: reactionType })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Reaction error response:', errorText);
            throw new Error(`Failed to add reaction: ${response.status}`);
        }

        const result = await response.json();
        console.log('Reaction result:', result);

        const emoji = reactionType === 'heart' ? '❤️' : '✨';
        button.textContent = `${emoji} ${result.count}`;
        showToast('Reaction added!');
    } catch (error) {
        console.error('Failed to add reaction:', error);
        showToast(`Failed to add reaction: ${error.message}`);
    }
}

// Load messages with improved error handling and data processing
async function loadMessages() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = `
        <div class="loading">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    try {
        const response = await fetch(`${API_URL}/entries`, {
            headers: {
                'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'omit'
        });

        // Log the raw response for debugging
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        const text = await response.text();
        console.log('Raw response text:', text);

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('JSON parse error:', e);
            throw new Error('Server returned invalid JSON');
        }

        if (!response.ok) {
            throw new Error(data.error || `Server error: ${response.status}`);
        }

        if (data.error) {
            throw new Error(data.error);
        }

        // Ensure data is an array
        if (!Array.isArray(data)) {
            console.error('Expected array but got:', typeof data);
            throw new Error('Invalid data format received from server');
        }

        if (data.length === 0) {
            messagesDiv.innerHTML = '<div class="message">No messages yet. Be the first to write something!</div>';
            return;
        }
                
        messagesDiv.innerHTML = data.map(entry => {
            // Initialize empty arrays if reactions/replies are undefined
            const reactions = entry.reactions || [];
            const replies = entry.replies || [];

            // Use reaction_type instead of type in the find operation
            const heartCount = reactions.find(r => r.reaction_type === 'heart')?.count || 0;
            const sparkleCount = reactions.find(r => r.reaction_type === 'sparkle')?.count || 0;

            return `
                <div class="message">
                    <div class="message-header">
                        <div>
                            <strong>${entry.name || ''}</strong>
                            ${entry.website ? 
                                `<a href="${entry.website}" target="_blank" rel="noopener noreferrer">(website)</a>` 
                                : ''
                            }
                        </div>
                        <div class="timestamp">${entry.created_at ? new Date(entry.created_at).toLocaleString() : ''}</div>
                    </div>
                    <div class="message-content">${formatMessage(entry.message || '')}</div>
                    ${entry.image_id ? 
                        `<img src="${API_URL}/images/${entry.image_id}" class="message-image" alt="User uploaded image">` 
                        : ''
                    }
                    <div class="reaction-buttons">
                        <button class="reaction-button" onclick="addReaction(this, ${entry.id}, 'heart')">❤️ ${heartCount}</button>
                        <button class="reaction-button" onclick="addReaction(this, ${entry.id}, 'sparkle')">✨ ${sparkleCount}</button>
                    </div>
                    <div class="reply-section">
                        <button onclick="toggleReplyForm(${entry.id})" class="reply-button">Reply</button>
                        <form id="reply-form-${entry.id}" class="reply-form" style="display: none" onsubmit="submitReply(event, ${entry.id})">
                            <label>Name:</label>
                            <input type="text" required placeholder="Your name">
                            
                            <label>Website (optional):</label>
                            <input type="url" placeholder="https://your-site.com">
                            
                            <label>Reply:</label>
                            <textarea required placeholder="Write your reply..." rows="4"></textarea>
                            
                            <button type="submit">Send Reply</button>
                        </form>
                    </div>
                    <div class="replies">
                        ${replies.map(reply => `
                            <div class="reply">
                                <div class="reply-header">
                                    <div>
                                        <strong>${reply.name || ''}</strong>
                                        ${reply.website ? 
                                            `<a href="${reply.website}" target="_blank" rel="noopener noreferrer">(website)</a>` 
                                            : ''
                                        }
                                    </div>
                                    <div class="timestamp">${reply.created_at ? new Date(reply.created_at).toLocaleString() : ''}</div>
                                </div>
                                <div class="reply-content">${formatMessage(reply.message || '')}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Failed to load messages:', error);
        messagesDiv.innerHTML = `
            <div class="error">
                Failed to load messages: ${error.message}
                <br>
                <button onclick="loadMessages()" class="retry-button">Retry</button>
                <br>
                <pre class="error-details">${error.stack || ''}</pre>
            </div>
        `;
    }
}

// Submit main entry form
document.getElementById('guestbook-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    const name = document.getElementById('name').value;
    const website = document.getElementById('website').value;
    const message = document.getElementById('message').value;
    
    formData.append('name', name);
    formData.append('website', website);
    formData.append('message', message);
    
    const imageFile = document.getElementById('image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch(`${API_URL}/entries`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Entry error response:', errorText);
            throw new Error(`Failed to submit message: ${response.status}`);
        }

        const result = await response.json();
        console.log('Entry result:', result);

        document.getElementById('guestbook-form').reset();
        document.getElementById('preview-image').style.display = 'none';
        document.querySelector('.char-counter').textContent = '0/500';
        await loadMessages();
        showToast('Message sent successfully!');
    } catch (error) {
        console.error('Failed to submit message:', error);
        showToast(`Failed to send message: ${error.message}`);
    }
});

// Initialize
updateDateDisplay();
setInterval(updateDateDisplay, 60000);
loadMessages();