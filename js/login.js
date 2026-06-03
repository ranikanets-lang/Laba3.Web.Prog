const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {

event.preventDefault();

const email =
    document.getElementById("email").value;

const password =
    document.getElementById("password").value;

try {

    const response =
        await fetch(
            "http://localhost:3000/users"
        );

    const users =
        await response.json();

    const user =
        users.find(
            user =>
                user.email === email &&
                user.password === password
        );

    if (!user) {

        alert(
            "Неверный email или пароль"
        );

        return;
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    alert("Авторизация успешна");

    if (user.role === "admin") {

        window.location.href =
            "admin.html";

    } else {

        window.location.href =
            "index.html";
    }

} catch (error) {

    console.error(error);

    alert(
        "Ошибка подключения к серверу"
    );
}

});

localStorage.setItem(
    "currentUser",
    JSON.stringify(user)
);

window.location.href = "profile.html";
