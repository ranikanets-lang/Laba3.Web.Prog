const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showError("email", !email ? "Введите email" : "");
        showError("password", !password ? "Введите пароль" : "");
        return;
    }

    clearError("email");
    clearError("password");

    try {
        const response = await fetch("http://localhost:3000/users");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            showError("email", "Неверный email или пароль");
            showError("password", "Неверный email или пароль");
            return;
        }

        const currentUserData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        };

        if (user.email === "admin@mail.com" || user.role === "admin") {
            sessionStorage.setItem("currentUser", JSON.stringify(currentUserData));
            window.location.href = "admin.html";
        } else {
            localStorage.setItem("currentUser", JSON.stringify(currentUserData));
            window.location.href = "index.html";
        }

    } catch (error) {
        console.error("Login error:", error);
        alert("Ошибка подключения к серверу. Проверьте, запущен ли JSON Server.");
    }
});

function showError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + "Error");
    const inputEl = document.getElementById(fieldId);

    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = message ? "block" : "none";
    }

    if (inputEl && message) {
        inputEl.classList.add("form-input--error");
    } else if (inputEl) {
        inputEl.classList.remove("form-input--error");
    }
}

function clearError(fieldId) {
    const errorEl = document.getElementById(fieldId + "Error");
    const inputEl = document.getElementById(fieldId);

    if (errorEl) {
        errorEl.textContent = "";
        errorEl.style.display = "none";
    }

    if (inputEl) {
        inputEl.classList.remove("form-input--error");
    }
}

document.getElementById("email").addEventListener("input", () => clearError("email"));
document.getElementById("password").addEventListener("input", () => clearError("password"));