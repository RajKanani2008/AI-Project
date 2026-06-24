const sendBtn = document.getElementById("sendBtn");
const message = document.getElementById("message");
const chatContainer = document.getElementById("chatContainer");

const newChatBtn = document.getElementById("newChatBtn");
const searchChatBtn = document.getElementById("searchChatBtn");
const libraryBtn = document.getElementById("libraryBtn");
const appsBtn = document.getElementById("appsBtn");
const deepSearchBtn = document.getElementById("deepSearchBtn");
const historyBtn = document.getElementById("historyBtn");
const premiumBtn = document.getElementById("premiumBtn");
const profileBtn = document.getElementById("profileBtn");
const accountBtn = document.getElementById("accountBtn");
const settingsBtn = document.getElementById("settingsBtn");
const logoutBtn = document.getElementById("logoutBtn");
const welcomeText = document.getElementById("welcomeText");

let currentChat = [];
let deepSearchEnabled = false;

function getUser() {
    try {
        return JSON.parse(localStorage.getItem("user")) || {};
    } catch (error) {
        return {};
    }
}

function addMessage(text, type) {
    const msg = document.createElement("div");

    if (type === "user") {
        msg.classList.add("user-message");
    } else {
        msg.classList.add("bot-message");
    }

    msg.innerText = text;
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function saveHistory() {
    localStorage.setItem("chatHistory", JSON.stringify(currentChat));
}

function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem("chatHistory")) || [];
    } catch (error) {
        return [];
    }
}

async function sendMessage() {
    const text = message.value.trim();

    if (text === "") return;

    addMessage(text, "user");

    currentChat.push({
        role: "user",
        text: text,
        time: new Date().toLocaleString()
    });

    saveHistory();

    message.value = "";
    sendBtn.disabled = true;

    const loadingMsg = document.createElement("div");
    loadingMsg.classList.add("bot-message");
    loadingMsg.innerText = "AI is typing...";
    chatContainer.appendChild(loadingMsg);

    try {
        const finalMessage = deepSearchEnabled
            ? "Give a detailed answer: " + text
            : text;

        const response = await fetch("http://127.0.0.1:5000/chat/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: finalMessage
            })
        });

        const data = await response.json();

        loadingMsg.remove();

        const reply = data.reply || "No reply received.";

        addMessage(reply, "bot");

        currentChat.push({
            role: "bot",
            text: reply,
            time: new Date().toLocaleString()
        });

        saveHistory();

    } catch (error) {
        loadingMsg.remove();
        addMessage("Server Error. Please check whether Ollama is running.", "bot");
    }

    sendBtn.disabled = false;
    message.focus();
}

sendBtn.addEventListener("click", sendMessage);

message.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

newChatBtn.addEventListener("click", function () {
    currentChat = [];
    localStorage.removeItem("chatHistory");

    chatContainer.innerHTML = "";
    addMessage("Hello Raj 👋 How can I help you today?", "bot");
});

searchChatBtn.addEventListener("click", function () {
    const keyword = prompt("Search your chat history:");

    if (!keyword) return;

    const history = loadHistory();

    const results = history.filter(function (item) {
        return item.text.toLowerCase().includes(keyword.toLowerCase());
    });

    if (results.length === 0) {
        alert("No chat found.");
        return;
    }

    chatContainer.innerHTML = "";

    results.forEach(function (item) {
        addMessage(item.text, item.role);
    });
});

libraryBtn.addEventListener("click", function () {
    const history = loadHistory();

    const replies = history
        .filter(function (item) {
            return item.role === "bot";
        })
        .slice(-5)
        .map(function (item) {
            return item.text;
        });

    if (replies.length === 0) {
        alert("Library is empty.");
        return;
    }

    alert("Library:\n\n" + replies.join("\n\n----------------\n\n"));
});

appsBtn.addEventListener("click", function () {
    alert(
        "AI Apps\n\n" +
        "1. AI Chat\n" +
        "2. Code Helper\n" +
        "3. English Helper\n" +
        "4. Resume Helper"
    );
});

deepSearchBtn.addEventListener("click", function () {
    deepSearchEnabled = !deepSearchEnabled;

    deepSearchBtn.classList.toggle("active");

    if (deepSearchEnabled) {
        alert("Deep Search is ON.");
    } else {
        alert("Deep Search is OFF.");
    }
});

historyBtn.addEventListener("click", function () {
    const history = loadHistory();

    if (history.length === 0) {
        alert("No chat history found.");
        return;
    }

    chatContainer.innerHTML = "";

    history.forEach(function (item) {
        addMessage(item.text, item.role);
    });

    currentChat = history;
});

premiumBtn.addEventListener("click", function () {
    const plan = prompt(
        "Premium Plans\n\n" +
        "1 = Free\n" +
        "2 = Pro\n" +
        "3 = Premium\n\n" +
        "Enter plan number:"
    );

    if (plan === "1") {
        localStorage.setItem("plan", "Free");
        alert("Free Plan selected.");
    }

    if (plan === "2") {
        localStorage.setItem("plan", "Pro");
        alert("Pro Plan selected.");
    }

    if (plan === "3") {
        localStorage.setItem("plan", "Premium");
        alert("Premium Plan selected.");
    }
});

profileBtn.addEventListener("click", function () {
    const user = getUser();

    const username = user.username || "Raj";
    const email = user.email || "Email not available";
    const plan = localStorage.getItem("plan") || "Free";

    alert(
        "User Profile\n\n" +
        "Name: " + username + "\n" +
        "Email: " + email + "\n" +
        "Plan: " + plan
    );
});

accountBtn.addEventListener("click", function () {
    const option = prompt(
        "Account Menu\n\n" +
        "1 = User Profile\n" +
        "2 = Logout\n\n" +
        "Enter an option:"
    );

    if (option === "1") profileBtn.click();
    if (option === "2") logoutBtn.click();
});

settingsBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("darkMode", isDark ? "true" : "false");
});

logoutBtn.addEventListener("click", function () {
    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
        localStorage.removeItem("user");
        window.location.href = "login.html";
    }
});

if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
}

const user = getUser();

if (user.username && welcomeText) {
    welcomeText.innerText = "Welcome " + user.username + " 👋";
}


// ===============================
// EXTRA ADVANCED FEATURES
// Add this code at the END of dashboard.js
// ===============================

// Redirect user to login page if not logged in
if (!localStorage.getItem("user")) {
    window.location.href = "login.html";
}

// Load saved chat history automatically after page refresh
window.addEventListener("load", function () {
    const savedHistory = loadHistory();

    if (savedHistory.length > 0) {
        currentChat = savedHistory;

        chatContainer.innerHTML = "";

        savedHistory.forEach(function (item) {
            addMessage(item.text, item.role);
        });
    }
});

// Show selected plan in browser title
const selectedPlan = localStorage.getItem("plan") || "Free";
document.title = "AI Assistant - " + selectedPlan + " Plan";

// Save Enter key chat history safely
window.addEventListener("beforeunload", function () {
    saveHistory();
});