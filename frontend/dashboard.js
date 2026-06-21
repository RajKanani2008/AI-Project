console.log("Dashboard JS Loaded");

const sendBtn = document.getElementById("sendBtn");
const message = document.getElementById("message");
const chatContainer = document.getElementById("chatContainer");

const historyPanel = document.getElementById("historyPanel");
const settingsPanel = document.getElementById("settingsPanel");

const newChatBtn = document.getElementById("newChatBtn");
const searchChatsBtn = document.getElementById("searchChatsBtn");
const libraryBtn = document.getElementById("libraryBtn");
const appsBtn = document.getElementById("appsBtn");
const deepSearchBtn = document.getElementById("deepSearchBtn");
const historyBtn = document.getElementById("historyBtn");
const premiumBtn = document.getElementById("premiumBtn");
const profileBtn = document.getElementById("profileBtn");
const accountBtn = document.getElementById("accountBtn");
const settingsBtn = document.getElementById("settingsBtn");
const logoutBtn = document.getElementById("logoutBtn");

let chatHistory =
JSON.parse(localStorage.getItem("allChats")) || [];

async function sendMessage() {

    const text = message.value.trim();

    if (!text) return;

    const userMsg = document.createElement("div");
    userMsg.className = "user-message";
    userMsg.innerText = text;
    chatContainer.appendChild(userMsg);

    message.value = "";

    const typingMsg = document.createElement("div");
    typingMsg.className = "bot-message";
    typingMsg.innerText = "AI is typing...";
    chatContainer.appendChild(typingMsg);

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/chat/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: text
                })
            }
        );

        const data = await response.json();

        typingMsg.remove();

        const botMsg = document.createElement("div");
        botMsg.className = "bot-message";
        botMsg.innerText = data.reply;

        chatContainer.appendChild(botMsg);

        chatHistory.push({
            user: text,
            bot: data.reply,
            time: new Date().toLocaleString()
        });

        localStorage.setItem(
            "allChats",
            JSON.stringify(chatHistory)
        );

        chatContainer.scrollTop =
            chatContainer.scrollHeight;

    } catch (error) {

        typingMsg.remove();

        const botMsg = document.createElement("div");
        botMsg.className = "bot-message";
        botMsg.innerText =
            "Backend Error / Ollama Not Running";

        chatContainer.appendChild(botMsg);

        console.error(error);
    }
}

sendBtn.addEventListener("click", sendMessage);

message.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

newChatBtn.addEventListener("click", () => {

    const chatName =
        "Chat " + (conversations.length + 1);

    conversations.push({

        title: chatName,

        content: `
        <div class="bot-message">
            New Chat Started 🚀
        </div>
        `
    });

    localStorage.setItem(
        "conversations",
        JSON.stringify(conversations)
    );

    renderChats();

    chatContainer.innerHTML = `
        <div class="bot-message">
            New Chat Started 🚀
        </div>
    `;
});


historyBtn.addEventListener("click", () => {

    let html = "<h3>Chat History</h3>";

    chatHistory.forEach((chat, index) => {
        html += `
        <div style="margin-bottom:10px">
            <b>${index + 1}. ${chat.user}</b>
            <br>
            <small>${chat.time}</small>
        </div>
        <hr>
        `;
    });

    if (conversations.length > 0) {

    conversations[
        conversations.length - 1
    ].content = chatContainer.innerHTML;

    localStorage.setItem(
        "conversations",
        JSON.stringify(conversations)
    );
}

    const chatList = document.getElementById("chatList");

let conversations =
JSON.parse(localStorage.getItem("conversations")) || [];

function renderChats() {

    if (!chatList) return;

    chatList.innerHTML = "";

    conversations.forEach((chat, index) => {

        const div = document.createElement("div");

        div.className = "chat-item";

        div.innerText = chat.title;

        div.onclick = () => {

            chatContainer.innerHTML = chat.content;

        };

        chatList.appendChild(div);

    });

}

    historyPanel.innerHTML = html;
    historyPanel.classList.toggle("show");
});

searchChatsBtn.addEventListener("click", () => {

    const keyword = prompt("Search Chat");

    if (!keyword) return;

    const results = chatHistory.filter(chat =>
        chat.user.toLowerCase()
        .includes(keyword.toLowerCase())
    );

    alert("Found " + results.length + " chats");
});

settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("show");
});

document.addEventListener("click", (e) => {

    if (e.target.id === "darkModeBtn") {
        document.body.classList.toggle("dark-mode");
    }

});

profileBtn.addEventListener("click", () => {
    alert("Raj - AI Assistant User");
});

libraryBtn.addEventListener("click", () => {
    alert("Library");
});

appsBtn.addEventListener("click", () => {
    alert("Apps");
});

deepSearchBtn.addEventListener("click", () => {
    alert("Deep Search");
});

premiumBtn.addEventListener("click", () => {
    alert("Premium Plans");
});

accountBtn.addEventListener("click", () => {
    alert("Account Menu");
});

logoutBtn.addEventListener("click", () => {
    if (confirm("Logout?")) {
        location.reload();
    }
});