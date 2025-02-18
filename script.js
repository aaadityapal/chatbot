let isChatOpen = false;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for Enter key
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    const chatToggle = document.getElementById('chatToggle');
    
    isChatOpen = !isChatOpen;
    
    if (isChatOpen) {
        chatWidget.style.display = 'block';
        chatToggle.style.display = 'none';
    } else {
        chatWidget.style.display = 'none';
        chatToggle.style.display = 'block';
    }
}

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatBody = document.getElementById('chatBody');
    
    if (!userInput || !chatBody) return;
    
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Add user message to chat
    appendMessage('user', message);
    userInput.value = '';
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        
        // Check if we have an error in the response
        if (data.error) {
            throw new Error(data.error.message || 'API Error');
        }

        // Extract the response text
        let aiResponse = 'Sorry, I could not generate a response.';
        if (data.candidates && 
            data.candidates[0] && 
            data.candidates[0].content && 
            data.candidates[0].content.parts && 
            data.candidates[0].content.parts[0]) {
            aiResponse = data.candidates[0].content.parts[0].text;
        }
        
        // Add AI response to chat
        appendMessage('bot', aiResponse);
    } catch (error) {
        console.error('Error:', error);
        appendMessage('bot', `Error: ${error.message}`);
    }
}

function appendMessage(sender, message) {
    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = message;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
} 