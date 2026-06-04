// Находим элементы
var burger = document.getElementById("burger");
var nav = document.querySelector(".header__nav");

// Создаём затемнение и добавляем в body
var overlay = document.createElement("div");
overlay.classList.add("overlay");
document.body.appendChild(overlay);

// Открыть/закрыть меню
function toggleMenu() {
    burger.classList.toggle("active");
    nav.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("menu-open");
}

// Закрыть меню
function closeMenu() {
    burger.classList.remove("active");
    nav.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
}

// Клик по бургеру
burger.addEventListener("click", toggleMenu);

// Клик по затемнению — закрыть
overlay.addEventListener("click", closeMenu);

// Клик по любой ссылке в меню — закрыть и перейти
nav.querySelectorAll("a").forEach(function(link) {
    link.addEventListener("click", closeMenu);
});
