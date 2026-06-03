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
