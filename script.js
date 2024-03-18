let conversationHistory = [];

function sendMessage() {
    var userInput = document.getElementById("user-input").value;
    var apiKey = document.getElementById("api-key-input").value;
    
    // Store the API key in sessionStorage
    sessionStorage.setItem('api_key', apiKey);
    
    addMessage(userInput, 'user');
    generateResponse(userInput);
    document.getElementById("user-input").value = '';
}

function addMessage(message, sender) {
    var chatContainer = document.getElementById("chat-container");
    var messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message");

    var messageText = document.createElement("div");
    messageText.classList.add(sender + "-message");
    messageText.innerText = message;

    messageDiv.appendChild(messageText);
    chatContainer.appendChild(messageDiv);

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function generateResponse(userInput) {
    addMessage("Generating response...", 'bot');

    // Retrieve the API key from sessionStorage
    var apiKey = sessionStorage.getItem('api_key');

    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey, // Use the retrieved API key
        },
        body: JSON.stringify({
            model: 'text-davinci-002', // You can change the model if needed
            prompt: conversationHistory.join('\n') + '\nUser: ' + userInput + '\nAI:',
            max_tokens: 150, // Adjust the number of tokens as needed
            temperature: 0.7, // Adjust the temperature for diversity
            stop: '\nUser:' // Stop generation at user prompts
        })
    });

    const data = await response.json();
    const botResponse = data.choices[0].text.trim();

    conversationHistory.push('User: ' + userInput);
    conversationHistory.push('AI: ' + botResponse);
    
    addMessage(botResponse, 'bot');
}