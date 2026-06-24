const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const messageBox = document.getElementById("messageBox");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        messageBox.innerText = "Please enter username and password.";
        messageBox.style.color = "red";
        return;
    }

    loginBtn.disabled = true;
    loginBtn.innerText = "Logging in...";
    messageBox.innerText = "";

    try {
        const response = await fetch("http://127.0.0.1:5000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem("user", JSON.stringify(data.user));

            messageBox.innerText = "Login successful!";
            messageBox.style.color = "green";

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 700);

        } else {
            messageBox.innerText = data.message || "Login failed.";
            messageBox.style.color = "red";
        }

    } catch (error) {
        messageBox.innerText = "Backend server is not running.";
        messageBox.style.color = "red";

    } finally {
        loginBtn.disabled = false;
        loginBtn.innerText = "Login";
    }
});