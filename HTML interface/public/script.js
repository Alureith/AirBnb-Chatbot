const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");

let userMessage;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    chatLi.innerHTML = `<p>${message}</p>`;
    return chatLi;
};

const generateResponse = (incomingChatLi) => {
    // We'll call our server endpoint at /api/chat
    const API_URL = "/api/chat";
    const messageElement = incomingChatLi.querySelector("p");

    // Build a simple request body that the server expects
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: userMessage
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then(data => {
            // Make sure we have a valid response from OpenAI
            if (data.choices && data.choices.length > 0) {
                messageElement.textContent = data.choices[0].message.content;
            } else {
                messageElement.classList.add("error");
                messageElement.textContent = "No valid response from OpenAI.";
            }
        })
        .catch((error) => {
            console.error("Error in client fetch:", error);
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again!";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) {
        return;
    }
    // Add the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "chat-outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Show a "Thinking..." message
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "chat-incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

// Send message on button click
sendChatBtn.addEventListener("click", handleChat);

// Optional: close/cancel function
function cancel() {
    let chatbotcomplete = document.querySelector(".chatBot");
    if (chatbotcomplete && chatbotcomplete.style.display !== 'none') {
        chatbotcomplete.style.display = "none";
        let lastMsg = document.createElement("p");
        lastMsg.textContent = 'Thanks for using our Chatbot!';
        lastMsg.classList.add('lastMessage');
        document.body.appendChild(lastMsg);
    }
}
