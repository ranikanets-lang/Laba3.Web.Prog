import I18n from './i18n.js';
import ThemeManager from './theme.js';
import API from './api.js';
import './burger.js';

export function showNotification(message, type = 'success') {
    const container = document.getElementById('notifications-container');
    if (!container) return;

    const notif = document.createElement('div');
    notif.className = `notification notification--${type}`;
    notif.innerHTML = `<span class="notification__message">${message}</span>`;

    container.appendChild(notif);

    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(100%)';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

function initBurgerMenu() {
    const burger = document.querySelector('[data-burger]');
    const menu = document.querySelector('[data-mobile-menu]');
    const links = menu?.querySelectorAll('a');

    if (!burger || !menu) return;

    burger.addEventListener('click', () => {
        const isExpanded = burger.getAttribute('aria-expanded') === 'true';
        burger.classList.toggle('active');
        burger.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('active');
        menu.hidden = !menu.classList.contains('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    links?.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            menu.classList.remove('active');
            menu.hidden = true;
            document.body.style.overflow = '';
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !burger.contains(e.target) && menu.classList.contains('active')) {
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            menu.classList.remove('active');
            menu.hidden = true;
            document.body.style.overflow = '';
        }
    });
}

// --- Create Product Card HTML ---
function createProductCard(product) {
    const lang = I18n.currentLang;
    const name = product.name_i18n?.[lang] || product.name_i18n?.ru || product.name || 'Product';
    const price = product.price ? `${product.price.toLocaleString('ru-RU')} ₽` : '';
    const badge = product.isNew ? `<span class="product-card__badge product-card__badge--new">${I18n.t('product.new')}</span>` : '';
    const soldOut = !product.inStock ? `<span class="product-card__badge product-card__badge--sold">${I18n.t('product.soldOut')}</span>` : '';
    const buttonText = product.inStock ? I18n.t('product.addToCart') : I18n.t('product.outOfStock');

    return `
        <article class="product-card" data-product-id="${product.id}">
            <div class="product-card__image-wrapper">
                ${badge}
                ${soldOut}
                <img src="${product.image}" alt="${name}" class="product-card__image" loading="lazy" onerror="this.src='assets/images/placeholder.jpg'">
            </div>
            <div class="product-card__content">
                <h3 class="product-card__title">${name}</h3>
                <p class="product-card__price">${price}</p>
                <button class="btn btn--primary btn--sm add-to-cart-btn" data-product-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                    ${buttonText}
                </button>
            </div>
        </article>
    `;
}

// --- Swiper Slider (Fetched from products) ---
async function initSlider() {
    try {
        // Загружаем продукты с сервера - берём первые 5 для слайдера
        const products = await API.getProducts({ limit: 5 });
        const wrapper = document.getElementById('swiper-wrapper');

        if (!wrapper) {
            console.warn('Slider wrapper not found');
            return;
        }

        if (products.length === 0) {
            // Fallback слайды если продукты не загрузились
            wrapper.innerHTML = `
                <div class="swiper-slide" style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/assets/images/hero-bg.jpg')">
                    <div class="swiper-slide__content">
                        <h2 class="swiper-slide__title">PORTEN</h2>
                        <p class="swiper-slide__subtitle">Премиум аксессуары</p>
                    </div>
                </div>
            `;
        } else {
            // Создаем слайды из продуктов
            wrapper.innerHTML = products.map(product => {
                const name = product.name_i18n?.ru || product.name || 'Product';
                const price = product.price ? `${product.price.toLocaleString('ru-RU')} ₽` : '';

                return `
                <div class="swiper-slide" style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${product.image}')">
                    <div class="swiper-slide__content">
                        <h2 class="swiper-slide__title">${name}</h2>
                        <p class="swiper-slide__price">${price}</p>
                        <p class="swiper-slide__subtitle">Премиум качество</p>
                    </div>
                </div>
            `}).join('');
        }

        // Инициализируем Swiper после добавления слайдов
        new Swiper(".mySwiper", {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            on: {
                init: function() {
                    console.log('✅ Slider initialized');
                }
            }
        });

    } catch (error) {
        console.error('❌ Error loading slider:', error);
        showNotification('Ошибка загрузки слайдера', 'error');
    }
}

// --- Load Products for Season Section ---
async function loadSeasonProducts() {
    try {
        const grid = document.getElementById('season-grid');
        if (!grid) return;

        // Загружаем часы для секции "Сезон"
        const products = await API.getProducts({ category: 'watches', limit: 3 });

        if (products.length === 0) {
            grid.innerHTML = '<p class="empty-state">Продукты не найдены</p>';
            return;
        }

        grid.innerHTML = products.map((product, index) => createProductCard(product)).join('');

        // Добавляем анимацию появления
        grid.querySelectorAll('.product-card').forEach((card, i) => {
            card.style.animationDelay = `${0.1 + (i * 0.1)}s`;
        });

    } catch (error) {
        console.error('❌ Error loading season products:', error);
        document.getElementById('season-grid').innerHTML = '<p class="error-state">Ошибка загрузки</p>';
    }
}

// --- Load New Arrivals ---
async function loadNewArrivals() {
    try {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        // Загружаем новинки
        const products = await API.getProducts({ isNew: true, limit: 8 });

        if (products.length === 0) {
            grid.innerHTML = '<p class="empty-state">Новинки скоро появятся</p>';
            return;
        }

        grid.innerHTML = products.map((product, index) => createProductCard(product)).join('');

        // Добавляем анимацию появления
        grid.querySelectorAll('.product-card').forEach((card, i) => {
            card.style.animationDelay = `${0.1 + (i * 0.1)}s`;
        });

    } catch (error) {
        console.error('❌ Error loading new arrivals:', error);
        document.getElementById('products-grid').innerHTML = '<p class="error-state">Ошибка загрузки</p>';
    }
}

// --- Yandex Maps ---
function initMaps() {
    // Проверяем, загружен ли API Яндекс.Карт
    if (typeof ymaps === 'undefined') {
        console.warn('⚠️ Yandex Maps API not loaded - check your API key');
        // Fallback: показать статичное изображение или сообщение
        const mapContainer = document.getElementById('yandex-map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="map-placeholder">
                    <p>📍 Невский проспект, 10, Санкт-Петербург</p>
                    <small>Карта загружается...</small>
                </div>
            `;
        }
        return;
    }

    ymaps.ready(() => {
        // Main Map
        const map = new ymaps.Map("yandex-map", {
            center: [59.9343, 30.3351], // SPb coordinates
            zoom: 15,
            controls: ['zoomControl']
        });

        const placemark = new ymaps.Placemark([59.9343, 30.3351], {
            balloonContent: '<strong>PORTEN</strong><br>Невский пр., 10, Санкт-Петербург',
            hintContent: 'PORTEN'
        }, {
            preset: 'islands#brownIcon'
        });

        map.geoObjects.add(placemark);

        // Modal Map Logic
        const modalMapBtn = document.querySelector('[data-modal-open="map-modal"]');
        if (modalMapBtn) {
            modalMapBtn.addEventListener('click', () => {
                // Инициализируем карту в модалке с небольшой задержкой
                setTimeout(() => {
                    const modalMap = new ymaps.Map("modal-map", {
                        center: [59.9343, 30.3351],
                        zoom: 15,
                        controls: ['zoomControl']
                    });
                    modalMap.geoObjects.add(new ymaps.Placemark([59.9343, 30.3351], {
                        balloonContent: '<strong>PORTEN</strong><br>Невский пр., 10'
                    }));
                }, 400);
            });
        }
    });
}

// --- Smooth Scroll ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Не обрабатываем ссылки на другие страницы
            if (this.getAttribute('href').includes('.html')) return;

            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// --- Scroll Animations (Intersection Observer) ---
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.querySelector('.header__cart');

    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Определяем текущий путь и формируем правильный путь к корзине
            const currentPath = window.location.pathname;
            let cartPath;

            if (currentPath === '/' || currentPath.endsWith('index.html')) {
                cartPath = 'cart.html';
            } else {
                cartPath = 'cart.html';
            }

            window.location.href = cartPath;
        });

        // Добавляем стиль курсора для индикации кликабельности
        cartBtn.style.cursor = 'pointer';
    }
});
// --- Modals ---
function initModals() {
    const openBtns = document.querySelectorAll('[data-modal-open]');
    const closeBtns = document.querySelectorAll('[data-modal-close]');
    const modals = document.querySelectorAll('.modal');

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute('data-modal-open');
            const modal = document.querySelector(`[data-modal="${modalId}"]`);
            if (modal) {
                modal.classList.add('active');
                modal.hidden = false;
                document.body.classList.add('modal-open');

                // Фокус на первый интерактивный элемент
                const firstInput = modal.querySelector('input, textarea, button:not([data-modal-close])');
                if (firstInput) {
                    setTimeout(() => firstInput.focus(), 300);
                }
            }
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.hidden = true;
                    document.body.classList.remove('modal-open');
                }, 300);
            }
        });
    });

    // Close on backdrop click
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.hidden = true;
                    document.body.classList.remove('modal-open');
                }, 300);
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.hidden = true;
                    document.body.classList.remove('modal-open');
                }, 300);
            });
        }
    });
}

// --- Cart Counter Animation ---
function updateCartCount(count) {
    const counter = document.querySelector('.header__cart-count');
    if (!counter) return;

    // Анимация обновления счётчика
    counter.style.transform = 'scale(1.3)';
    counter.style.color = 'var(--color-primary)';
    counter.textContent = count;

    setTimeout(() => {
        counter.style.transform = 'scale(1)';
        counter.style.color = '';
    }, 300);
}

// --- Main Init ---
document.addEventListener('DOMContentLoaded', async () => {
    // Инициализация модулей
    I18n.init();
    ThemeManager.init();

    // Hide Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.style.display = 'none', 500);
        }, 800);
    }

    // Инициализация интерактивных элементов
    initBurgerMenu();
    initSmoothScroll();
    initScrollAnimations();
    initModals();

    // Загрузка динамического контента с сервера
    try {
        await Promise.all([
            initSlider(),
            loadSeasonProducts(),
            loadNewArrivals()
        ]);
        console.log('✅ All dynamic content loaded');
    } catch (error) {
        console.error('❌ Error loading content:', error);
        showNotification('Не удалось загрузить контент', 'error');
    }

    // Инициализация карт (может быть асинхронной)
    initMaps();

    // Приветственное уведомление
    setTimeout(() => {
        showNotification('Добро пожаловать в PORTEN!', 'info');
    }, 1500);
});
