document.addEventListener("DOMContentLoaded", function() {
    // ✅ Правильный ID из вашего HTML
    const burger = document.getElementById("burger-btn");
    // ✅ Мобильное меню, а не хедер-нав
    const mobileMenu = document.getElementById("mobile-menu");

    if (!burger || !mobileMenu) {
        console.warn('Burger or mobile menu not found');
        return;
    }

    // Создаём оверлей, если его нет
    let overlay = document.querySelector('.burger-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'burger-overlay';
        document.body.appendChild(overlay);
    }

    function toggleMenu() {
        const isExpanded = burger.getAttribute('aria-expanded') === 'true';

        // Переключаем состояние
        burger.classList.toggle('active');
        burger.setAttribute('aria-expanded', !isExpanded);

        // 🔥 КЛЮЧЕВОЕ: сначала убираем hidden, потом добавляем active
        if (!isExpanded) {
            // Открываем: сначала показываем, потом анимируем
            mobileMenu.hidden = false;

            // Форсируем перерисовку для запуска анимации
            void mobileMenu.offsetWidth;

            mobileMenu.classList.add('active');
        } else {
            // Закрываем: сначала анимация, потом скрываем
            mobileMenu.classList.remove('active');

            setTimeout(() => {
                mobileMenu.hidden = true;
            }, 300); // Ждём окончания анимации (0.3s из CSS)
        }

        // Оверлей
        overlay.classList.toggle('active');

        // Блокируем скролл
        document.body.classList.toggle('menu-open');
    }

    function closeMenu() {
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');

        // 🔥 Анимация закрытия
        mobileMenu.classList.remove('active');

        setTimeout(() => {
            mobileMenu.hidden = true;
        }, 300);

        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    const closeMenuBtn = document.querySelector('.mobile-menu__close');
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }

    // Открытие/закрытие по клику на бургер
    burger.addEventListener('click', toggleMenu);

    // Закрытие по клику на оверлей
    overlay.addEventListener('click', closeMenu);

    // Закрытие по клику на ссылку в меню
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileMenu.hidden) {
            closeMenu();
        }
    });
});