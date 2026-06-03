import I18n from './i18n.js';
import ThemeManager from './theme.js';
import API from './api.js';

function createProductCard(product) {
    const lang = I18n.currentLang;
    const name = product.name_i18n?.[lang] || product.name_i18n?.ru || 'Product';
    const description = product.description_i18n?.[lang] || product.description_i18n?.ru || '';
    const price = product.price.toLocaleString('ru-RU');
    const currency = I18n.t('common.currency');

    return `
        <article class="product-card" data-product-id="${product.id}">
            <div class="product-card__badge-container">
                ${product.isNew ? `<span class="product-card__badge product-card__badge--new">${I18n.t('common.new')}</span>` : ''}
                ${!product.inStock ? `<span class="product-card__badge product-card__badge--sold">${I18n.t('common.outOfStock')}</span>` : ''}
            </div>
            <img src="${product.image}" alt="${name}" class="product-card__image" loading="lazy">
            <div class="product-card__content">
                <h3 class="product-card__title">${name}</h3>
                <p class="product-card__description">${description}</p>
                <div class="product-card__footer">
                    <span class="product-card__price">${price} ${currency}</span>
                    <div class="product-card__rating">
                        <span class="product-card__stars">★ ${product.rating}</span>
                        <span class="product-card__reviews">(${product.reviews} ${I18n.t('common.reviews')})</span>
                    </div>
                </div>
                <button class="btn btn--primary btn--sm" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'В корзину' : 'Уведомить'}
                </button>
            </div>
        </article>
    `;
}

async function renderProducts(containerSelector, filters = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = `<div class="loading">${I18n.t('common.loading')}</div>`;

    try {
        const products = await API.getProducts({ ...filters, limit: 8 });

        if (products.length === 0) {
            container.innerHTML = `<p class="empty-state">No products found</p>`;
            return;
        }

        container.innerHTML = products.map(createProductCard).join('');

        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const productId = card.dataset.productId;
                    window.location.href = `pages/product.html?id=${productId}`;
                }
            });
        });
    } catch (error) {
        console.error('Error rendering products:', error);
        container.innerHTML = `<p class="error-state">Error loading products</p>`;
    }
}

window.renderProducts = () => {
    renderProducts('.season__grid', { isNew: true, limit: 3 });
    renderProducts('.products-grid', { limit: 8 });
};

document.addEventListener('DOMContentLoaded', async () => {
    I18n.init();
    ThemeManager.init();

    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 500);
        }, 800);
    }

    await renderProducts('.season__grid', { isNew: true, limit: 3 });
    await renderProducts('.products-grid', { limit: 8 });

    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(0,0,0,0.9)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'transparent';
            header.style.backdropFilter = 'none';
        }
    });

    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            const isExpanded = burger.getAttribute('aria-expanded') === 'true';
            burger.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('active');
        });
    }

    const newsletterForm = document.querySelector('[data-newsletter-form]');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing: ${email}`);
            newsletterForm.reset();
        });
    }
});

const user = JSON.parse(
    localStorage.getItem("currentUser")
);

if(user){

    document.querySelector(
        ".header__user-btn"
    ).innerHTML = user.nickname;
}

const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

if(currentUser){

    document.querySelector(
        ".header__user-btn"
    ).innerHTML = currentUser.nickname;
}

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-animate]').forEach(el => {
        scrollObserver.observe(el);
    });
});
