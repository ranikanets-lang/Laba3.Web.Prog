const form = document.getElementById("registerForm");
const nicknameInput = document.getElementById("nickname");
const generateBtn = document.getElementById("generateNickname");
const registerBtn = document.getElementById("registerBtn");

let nicknameAttempts = 0;

function generateNickname() {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();

    // Берём первые 1-3 буквы имени и фамилии
    const namePart = firstName.slice(0, Math.floor(Math.random() * 3) + 1);
    const lastPart = lastName.slice(0, Math.floor(Math.random() * 3) + 1);
    const num = Math.floor(Math.random() * 990) + 10; // число от 10 до 999

    const suffixes = ["_x", "_pro", "_vip", ""];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    nicknameInput.value = namePart + lastPart + num + suffix;
}

generateBtn.addEventListener("click", () => {
    nicknameAttempts++;

    if (nicknameAttempts >= 5) {
        nicknameInput.removeAttribute("readonly");
        showError("nicknameError", "Лимит генерации исчерпан. Введите никнейм вручную.");
        generateBtn.disabled = true;
        return;
    }

    generateNickname();
});

// ====== ГЕНЕРАЦИЯ ПАРОЛЯ ======
function generatePassword(length = 12) {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const special = "!@#$%^&*";
    const all = upper + lower + digits + special;

    // Гарантируем наличие каждого типа символов
    let password =
        upper[Math.floor(Math.random() * upper.length)] +
        lower[Math.floor(Math.random() * lower.length)] +
        digits[Math.floor(Math.random() * digits.length)] +
        special[Math.floor(Math.random() * special.length)];

    for (let i = 4; i < length; i++) {
        password += all.charAt(Math.floor(Math.random() * all.length));
    }

    // Перемешиваем
    return password.split("").sort(() => Math.random() - 0.5).join("");
}

document.querySelectorAll('input[name="passwordType"]').forEach(radio => {
    radio.addEventListener("change", () => {
        const passwordField = document.getElementById("password");
        const confirmField = document.getElementById("confirmPassword");

        if (radio.value === "auto" && radio.checked) {
            passwordField.value = generatePassword();
            confirmField.value = passwordField.value;
            passwordField.readOnly = true;
            confirmField.readOnly = true;
            clearError("passwordError");
            clearError("confirmPasswordError");
        } else {
            passwordField.readOnly = false;
            confirmField.readOnly = false;
            passwordField.value = "";
            confirmField.value = "";
        }
    });
});

// ====== УТИЛИТЫ ДЛЯ СООБЩЕНИЙ ======
function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.style.display = "block";
    }
}

function clearError(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = "";
        el.style.display = "none";
    }
}

// Очищаем ошибку при изменении поля
document.querySelectorAll("#registerForm input, #registerForm select, #registerForm textarea")
    .forEach(input => {
        input.addEventListener("input", () => {
            const errorId = input.id + "Error";
            clearError(errorId);
            updateSubmitButton();
        });
        input.addEventListener("change", () => {
            updateSubmitButton();
        });
    });

// ====== АКТИВАЦИЯ КНОПКИ ТОЛЬКО ПРИ УСПЕШНОЙ ВАЛИДАЦИИ ======
function updateSubmitButton() {
    const allValid = validateAll(false); // false = без показа ошибок
    registerBtn.disabled = !allValid;
}

// ====== TOP-100 ПАРОЛЕЙ 2024 ======
const TOP100_PASSWORDS = [
    "123456","password","123456789","12345678","12345","1234567","1234567890",
    "1234","qwerty","abc123","111111","123123","admin","letmein","monkey",
    "1q2w3e4r","pass","master","hello","dragon","login","solo","princess",
    "qwertyuiop","starwars","password1","iloveyou","sunshine","charlie",
    "donald","password123","admin123","welcome","shadow","superman","michael",
    "football","baseball","soccer","hockey","george","batman","access",
    "mustang","jessica","696969","123321","666666","654321","1qaz2wsx",
    "qazwsx","trustno1","ashley","bailey","passw0rd","jordan","harley",
    "ranger","daniel","matthew","andrew","andrea","joshua","hunter",
    "thomas","robert","robert1","qwerty123","zxcvbnm","asdfgh","asdfghjkl",
    "password2","123654","654123","123abc","abc","test","test1","test123",
    "guest","user","root","toor","alpine","changeme","default","service",
    "1111","0000","111111111","000000","123","1234512345","112233","121212"
];

// ====== ЕДИНАЯ ФУНКЦИЯ ВАЛИДАЦИИ ======
function validateAll(showErrors = true) {
    let valid = true;

    // Имя
    const firstName = document.getElementById("firstName").value.trim();
    if (!firstName) {
        if (showErrors) showError("firstNameError", "Введите имя");
        valid = false;
    }

    // Фамилия
    const lastName = document.getElementById("lastName").value.trim();
    if (!lastName) {
        if (showErrors) showError("lastNameError", "Введите фамилию");
        valid = false;
    }

    // Email
    const email = document.getElementById("email").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (showErrors) showError("emailError", "Введите корректный email");
        valid = false;
    }

    // Телефон РБ
    const phone = document.getElementById("phone").value.trim();
    const phoneRegex = /^\+375(25|29|33|44)\d{7}$/;
    if (!phoneRegex.test(phone)) {
        if (showErrors) showError("phoneError", "Введите номер РБ в формате +375XXXXXXXXX");
        valid = false;
    }

    // Дата рождения (16+)
    const birthDate = document.getElementById("birthDate").value;
    if (!birthDate) {
        if (showErrors) showError("birthDateError", "Введите дату рождения");
        valid = false;
    } else {
        const age = Math.floor(
            (new Date() - new Date(birthDate)) / (365.25 * 24 * 60 * 60 * 1000)
        );
        if (age < 16) {
            if (showErrors) showError("birthDateError", "Регистрация доступна только с 16 лет");
            valid = false;
        }
    }

    // Пароль
    const isAutoPassword = document.querySelector('input[name="passwordType"]:checked')?.value === "auto";
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!isAutoPassword) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/;

        if (!passwordRegex.test(password)) {
            if (showErrors) showError("passwordError",
                "Пароль: 8–20 символов, заглавная, строчная, цифра, спецсимвол (@$!%*?&)");
            valid = false;
        } else if (TOP100_PASSWORDS.includes(password.toLowerCase())) {
            if (showErrors) showError("passwordError", "Пароль слишком распространённый");
            valid = false;
        } else if (password !== confirmPassword) {
            if (showErrors) showError("confirmPasswordError", "Пароли не совпадают");
            valid = false;
        }
    }

    // Никнейм
    const nickname = nicknameInput.value.trim();
    if (!nickname) {
        if (showErrors) showError("nicknameError", "Никнейм не может быть пустым");
        valid = false;
    }

    // Соглашение
    const agreement = document.getElementById("agreement");
    if (agreement && !agreement.checked) {
        if (showErrors) showError("agreementError", "Необходимо принять пользовательское соглашение");
        valid = false;
    }

    return valid;
}

// ====== ОТПРАВКА ФОРМЫ ======
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateAll(true)) return;

    const nickname = nicknameInput.value.trim();

    try {
        const usersResponse = await fetch("http://localhost:3000/users");
        const users = await usersResponse.json();

        const nicknameExists = users.some(
            u => u.nickname && u.nickname.toLowerCase() === nickname.toLowerCase()
        );

        if (nicknameExists) {
            showError("nicknameError", "Такой никнейм уже занят");
            return;
        }

        const user = {
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            middleName: document.getElementById("middleName").value.trim(),
            nickname: nickname,
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            birthDate: document.getElementById("birthDate").value,
            password: document.getElementById("password").value,
            role: "customer"
        };

        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            alert("Регистрация успешна!");
            form.reset();
            nicknameAttempts = 0;
            generateBtn.disabled = false;
            nicknameInput.setAttribute("readonly", true);
            registerBtn.disabled = true;
        }

    } catch (error) {
        console.error(error);
        alert("Ошибка регистрации. Проверьте JSON Server.");
    }

    // Показать/скрыть пароль
document.querySelectorAll(".toggle-password").forEach(function(btn) {
    btn.addEventListener("click", function() {
        var input = document.getElementById(btn.dataset.target);
        if (input.type === "password") {
            input.type = "text";
            btn.textContent = "🙈";
        } else {
            input.type = "password";
            btn.textContent = "👁";
        }
    });
});
