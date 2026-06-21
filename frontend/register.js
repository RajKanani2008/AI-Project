document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.querySelector('input[name="username"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const response = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            email,
            password
        })
    });

    const data = await response.json();

    alert(data.message);

    if (data.success) {
        window.location.href = "login.html";
    }
});