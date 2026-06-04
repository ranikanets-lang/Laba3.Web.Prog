document.addEventListener("DOMContentLoaded", function() {

    var burger = document.getElementById("burger");
    var nav = document.querySelector(".header__nav");

    var overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    function toggleMenu() {
        burger.classList.toggle("active");
        nav.classList.toggle("active");
        overlay.classList.toggle("active");
        document.body.classList.toggle("menu-open");
    }

    function closeMenu() {
        burger.classList.remove("active");
        nav.classList.remove("active");
        overlay.classList.remove("active");
        document.body.classList.remove("menu-open");
    }

    burger.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", closeMenu);

    nav.querySelectorAll("a").forEach(function(link) {
        link.addEventListener("click", closeMenu);
    });

});
