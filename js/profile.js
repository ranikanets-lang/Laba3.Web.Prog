const user = JSON.parse(
localStorage.getItem("currentUser")
);

if (!user) {
window.location.href = "login.html";
}

document.getElementById("nickname").textContent =
user.nickname || "-";

document.getElementById("firstName").textContent =
user.firstName || "-";

document.getElementById("lastName").textContent =
user.lastName || "-";

document.getElementById("middleName").textContent =
user.middleName || "-";

document.getElementById("email").textContent =
user.email || "-";

document.getElementById("phone").textContent =
user.phone || "-";

document.getElementById("birthDate").textContent =
user.birthDate || "-";

document
.getElementById("logoutBtn")
.addEventListener("click", () => {

    localStorage.removeItem("currentUser");

    window.location.href = "index.html";
});

form.addEventListener("input", () => {
    registerBtn.disabled =
        !form.checkValidity();
});

document
    .getElementById("sendFeedback")
    .addEventListener("click", async () => {

        const user = JSON.parse(
            localStorage.getItem("currentUser")
        );

        const text = document
            .getElementById("feedbackText")
            .value;

        if (!text.trim()) {
            alert("Введите отзыв");
            return;
        }

        const feedback = {
            userId: user.id,
            nickname: user.nickname,
            text: text,
            date: new Date().toLocaleDateString()
        };

        await fetch(
            "http://localhost:3000/feedback",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(feedback)
            }
        );

        alert("Отзыв отправлен");

        document.getElementById(
            "feedbackText"
        ).value = "";
    });
