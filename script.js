let isChatOpen = false;

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
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Add user message to chat
    appendMessage('user', message);
    userInput.value = '';
    
    try {
        // Replace YOUR_API_ENDPOINT with your actual API endpoint
        const response = await fetch('AIzaSyCLbr0Zvv0OnNRnnnzkaE1tHWEm2RfvMFs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        
        // Add AI response to chat
        appendMessage('bot', data.response);
    } catch (error) {
        console.error('Error:', error);
        appendMessage('bot', 'Sorry, I encountered an error. Please try again.');
    }
}

function appendMessage(sender, message) {
    const chatBody = document.getElementById('chatBody');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = message;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Add event listener for Enter key
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}); 