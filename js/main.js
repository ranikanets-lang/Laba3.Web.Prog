
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

window.showNotification = showNotification;

function isHomePage() {
    return !!(
        document.querySelector('.hero') ||
        document.querySelector('.mySwiper') ||
        document.querySelector('#season-grid')
    );
}

function createProductCard(product) {
    const lang = I18n.currentLang || 'ru';
    const name = product.name_i18n?.[lang] || product.name_i18n?.ru || product.name || 'Product';
    const price = product.price ? `${product.price.toLocaleString('ru-RU')} ₽` : '';
    const badge = product.isNew ? `<span class="product-card__badge product-card__badge--new">${I18n.t('product.new') || 'NEW'}</span>` : '';
    const soldOut = !product.inStock ? `<span class="product-card__badge product-card__badge--sold">${I18n.t('product.soldOut') || 'SOLD OUT'}</span>` : '';
    const buttonText = product.inStock
        ? (I18n.t('product.addToCart') || 'В корзину')
        : (I18n.t('product.outOfStock') || 'Нет в наличии');

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

async function initSlider() {
    const wrapper = document.getElementById('swiper-wrapper');
    const swiperEl = document.querySelector('.mySwiper');

    if (!wrapper || !swiperEl) {
        console.log('ℹ️ Slider not found on this page');
        return;
    }

    try {
        const products = await API.getProducts({ limit: 5 });

        if (products.length === 0) {
            wrapper.innerHTML = `
                <div class="swiper-slide" style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/assets/images/hero-bg.jpg')">
                    <div class="swiper-slide__content">
                        <h2 class="swiper-slide__title">PORTEN</h2>
                        <p class="swiper-slide__subtitle">Премиум аксессуары</p>
                    </div>
                </div>
            `;
        } else {
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

        new Swiper(".mySwiper", {
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false },
            pagination: { el: ".swiper-pagination", clickable: true },
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            effect: 'fade',
            fadeEffect: { crossFade: true }
        });

        console.log('✅ Slider initialized');
    } catch (error) {
        console.error('❌ Error loading slider:', error);
    }
}

async function loadSeasonProducts() {
    const grid = document.getElementById('season-grid');
    if (!grid) return;

    try {
        const products = await API.getProducts({ category: 'watches', limit: 3 });
        if (products.length === 0) {
            grid.innerHTML = '<p class="empty-state">Продукты не найдены</p>';
            return;
        }
        grid.innerHTML = products.map((product, index) => createProductCard(product)).join('');
        grid.querySelectorAll('.product-card').forEach((card, i) => {
            card.style.animationDelay = `${0.1 + (i * 0.1)}s`;
        });
    } catch (error) {
        console.error('❌ Error loading season products:', error);
        grid.innerHTML = '<p class="error-state">Ошибка загрузки</p>';
    }
}

async function loadNewArrivals() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    try {
        const products = await API.getProducts({ isNew: true, limit: 8 });
        if (products.length === 0) {
            grid.innerHTML = '<p class="empty-state">Новинки скоро появятся</p>';
            return;
        }
        grid.innerHTML = products.map((product, index) => createProductCard(product)).join('');
        grid.querySelectorAll('.product-card').forEach((card, i) => {
            card.style.animationDelay = `${0.1 + (i * 0.1)}s`;
        });
    } catch (error) {
        console.error('❌ Error loading new arrivals:', error);
        grid.innerHTML = '<p class="error-state">Ошибка загрузки</p>';
    }
}

function initMaps() {
    const mapContainer = document.getElementById('yandex-map');
    if (!mapContainer) return;

    if (typeof ymaps === 'undefined') {
        console.warn('⚠️ Yandex Maps API not loaded');
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <p>📍 Невский проспект, 10, Санкт-Петербург</p>
                <small>Карта загружается...</small>
            </div>
        `;
        return;
    }

    ymaps.ready(() => {
        const map = new ymaps.Map("yandex-map", {
            center: [59.9343, 30.3351],
            zoom: 15,
            controls: ['zoomControl']
        });

        const placemark = new ymaps.Placemark([59.9343, 30.3351], {
            balloonContent: '<strong>PORTEN</strong><br>Невский пр., 10',
            hintContent: 'PORTEN'
        }, { preset: 'islands#brownIcon' });

        map.geoObjects.add(placemark);

        const modalMapBtn = document.querySelector('[data-modal-open="map-modal"]');
        if (modalMapBtn) {
            modalMapBtn.addEventListener('click', () => {
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

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.includes('.html') || href === '#') return;

            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

function initModals() {
    const openBtns = document.querySelectorAll('[data-modal-open]');
    const closeBtns = document.querySelectorAll('[data-modal-close]');
    const modals = document.querySelectorAll('.modal');

    if (openBtns.length === 0 && closeBtns.length === 0) return;

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute('data-modal-open');
            const modal = document.querySelector(`[data-modal="${modalId}"]`);
            if (modal) {
                modal.classList.add('active');
                modal.hidden = false;
                document.body.classList.add('modal-open');
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

function updateCartCount() {
    try {
        const cartData = JSON.parse(localStorage.getItem('porten_cart') || '[]');
        const count = cartData.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const counter = document.querySelector('.header__cart-count');
        if (counter) counter.textContent = count;
    } catch (e) {
        console.warn('⚠️ Error reading cart count');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Main script initialized');
    console.log('📍 Current page:', window.location.pathname);

    // 1. Базовая инициализация (на всех страницах)
    I18n.init();
    ThemeManager.init();
    initSmoothScroll();
    initScrollAnimations();
    initModals();
    updateCartCount();

    // 2. Скрытие прелоадера
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
        }, 800);
    }

    // 3. Специфичный для главной страницы функционал
    if (isHomePage()) {
        console.log('🏠 Home page detected - loading dynamic content');

        try {
            await Promise.all([
                initSlider(),
                loadSeasonProducts(),
                loadNewArrivals()
            ]);
            console.log('✅ All dynamic content loaded');
        } catch (error) {
            console.error('❌ Error loading content:', error);
        }

        initMaps();

        // Приветственное уведомление (только на главной)
        setTimeout(() => {
            showNotification('Добро пожаловать в PORTEN!', 'info');
        }, 1500);
    } else {
        console.log('ℹ️ Not home page - skipping home-specific init');
    }

    console.log('✅ Main initialization complete');
});

window.I18n = I18n;
window.ThemeManager = ThemeManager;
window.updateCartCount = updateCartCount;
window.createProductCard = createProductCard;