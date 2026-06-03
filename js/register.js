const form = document.getElementById("registerForm");

const nicknameInput = document.getElementById("nickname");
const generateBtn = document.getElementById("generateNickname");

let nicknameAttempts = 0;

function generateNickname() {
    const adjectives = [
        "Dark",
        "Silver",
        "Golden",
        "Royal",
        "Shadow",
        "Crystal",
        "Legend",
        "Storm"
    ];

    const nouns = [
        "Wolf",
        "Tiger",
        "King",
        "Knight",
        "Hunter",
        "Dragon",
        "Falcon",
        "Lion"
    ];

    const randomNickname =
        adjectives[Math.floor(Math.random() * adjectives.length)] +
        nouns[Math.floor(Math.random() * nouns.length)] +
        Math.floor(Math.random() * 1000);

    nicknameInput.value = randomNickname;
}

generateNickname();

generateBtn.addEventListener("click", () => {

    nicknameAttempts++;

    if (nicknameAttempts >= 5) {
        nicknameInput.removeAttribute("readonly");
        alert("Лимит генерации исчерпан. Теперь можно ввести никнейм вручную.");
        return;
    }

    generateNickname();
});

function generatePassword(length = 10) {

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    let password = "";

    for (let i = 0; i < length; i++) {
        password += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return password;
}

document
    .querySelectorAll('input[name="passwordType"]')
    .forEach(radio => {

        radio.addEventListener("change", () => {

            const passwordField =
                document.getElementById("password");

            if (radio.value === "auto" && radio.checked) {

                passwordField.value = generatePassword();
                passwordField.readOnly = true;

            } else {

                passwordField.readOnly = false;
                passwordField.value = "";
            }
        });
    });

const password =
    document.getElementById("password").value;

const confirmPassword =
    document.getElementById("confirmPassword").value;

if(password !== confirmPassword){
    alert("Пароли не совпадают");
    return;
}

const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/;

if(!passwordRegex.test(password)){
    alert("Пароль не соответствует требованиям");
    return;
}

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const birthDate =
        document.getElementById("birthDate").value;

    const phone =
        document.getElementById("phone").value;

    const email =
        document.getElementById("email").value;

    const nickname =
        nicknameInput.value;

    const age =
        Math.floor(
            (new Date() - new Date(birthDate))
            / (365.25 * 24 * 60 * 60 * 1000)
        );

    if (age < 16) {
        alert("Регистрация доступна только с 16 лет");
        return;
    }

    const phoneRegex =
        /^\+375(25|29|33|44)\d{7}$/;

    if (!phoneRegex.test(phone)) {
        alert("Введите корректный номер РБ");
        return;
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        alert("Некорректный email");
        return;
    }

    try {

        const usersResponse =
            await fetch("http://localhost:3000/users");

        const users =
            await usersResponse.json();

        const nicknameExists =
            users.some(
                user =>
                    user.nickname &&
                    user.nickname.toLowerCase() ===
                    nickname.toLowerCase()
            );

        if (nicknameExists) {
            alert("Такой никнейм уже существует");
            return;
        }

        const user = {
            firstName:
                document.getElementById("firstName").value,

            lastName:
                document.getElementById("lastName").value,

            middleName:
                document.getElementById("middleName").value,

            nickname: nickname,

            email: email,

            phone: phone,

            birthDate: birthDate,

            password:
                document.getElementById("password").value,

            role: "customer"
        };
        
    <label>
        <input
            type="checkbox"
            id="agreement"
            required
        >

        Я принимаю пользовательское соглашение
    </label>
        
        const response =
            await fetch(
                "http://localhost:3000/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(user)
                }
            );

        if (response.ok) {

            alert("Регистрация успешна");

            form.reset();

            nicknameInput.setAttribute(
                "readonly",
                true
            );

            generateNickname();
        }

    } catch (error) {

        console.error(error);

        alert(
            "Ошибка регистрации. Проверьте JSON Server."
        );
    }
});
