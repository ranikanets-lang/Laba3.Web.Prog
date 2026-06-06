import I18n from './i18n.js';
import { showNotification } from './utils.js';

const CART_KEY = 'porten_cart';
const FAVORITES_KEY = 'porten_favorites';

let products = [
    { id: 1, name_i18n: { ru: "Louis XVI ATHOS" }, description_i18n: { ru: "Элегантные часы с механическим заводом в корпусе из нержавеющей стали." }, price: 165000, category: "watches", image: "assets/images/watches/watch-1.jpg", inStock: true, isNew: true, rating: 4.9, reviews: 24 },
    { id: 2, name_i18n: { ru: "Montblanc Heritage" }, description_i18n: { ru: "Классические часы с кожаным ремешком и сапфировым стеклом." }, price: 245000, category: "watches", image: "assets/images/watches/watch-2.jpg", inStock: true, isNew: false, rating: 4.8, reviews: 18 },
    { id: 3, name_i18n: { ru: "Tissot PRX Powermatic" }, description_i18n: { ru: "Спортивные часы с автоматическим механизмом и водозащитой 100м." }, price: 89000, category: "watches", image: "assets/images/watches/watch-3.jpg", inStock: true, isNew: true, rating: 4.7, reviews: 31 },
    { id: 4, name_i18n: { ru: "Hamilton Khaki Field" }, description_i18n: { ru: "Тактические часы в стиле милитари с люминесцентными стрелками." }, price: 112000, category: "watches", image: "assets/images/watches/watch-4.jpg", inStock: false, isNew: false, rating: 4.6, reviews: 15 },
    { id: 5, name_i18n: { ru: "Seiko Presage Cocktail" }, description_i18n: { ru: "Японские автоматические часы с перламутровым циферблатом." }, price: 67000, category: "watches", image: "assets/images/watches/watch-1.png", inStock: true, isNew: true, rating: 4.7, reviews: 45 },
    { id: 6, name_i18n: { ru: "Orient Bambino Open Heart" }, description_i18n: { ru: "Часы с открытым механизмом в классическом ретро-корпусе." }, price: 43000, category: "watches", image: "assets/images/watches/watch-2.jpg", inStock: true, isNew: false, rating: 4.8, reviews: 52 },
    { id: 7, name_i18n: { ru: "Citizen Eco-Drive Titanium" }, description_i18n: { ru: "Лёгкие титановые часы на солнечной батарее, без замены батарейки." }, price: 54000, category: "watches", image: "assets/images/watches/watch-3.jpg", inStock: false, isNew: false, rating: 4.5, reviews: 38 },
    { id: 8, name_i18n: { ru: "Ремень Italian Leather" }, description_i18n: { ru: "Ремень из натуральной итальянской кожи с классической пряжкой." }, price: 12500, category: "belts", image: "assets/images/belts/belt-1.jpg", inStock: true, isNew: false, rating: 4.9, reviews: 42 },
    { id: 9, name_i18n: { ru: "Ремень Suede Classic" }, description_i18n: { ru: "Замшевый ремень ручной работы с минималистичной пряжкой." }, price: 8900, category: "belts", image: "assets/images/belts/belt-2.jpg", inStock: true, isNew: true, rating: 4.5, reviews: 28 },
    { id: 10, name_i18n: { ru: "Ремень Reversible Two-Tone" }, description_i18n: { ru: "Двусторонний ремень: чёрный и коричневый в одном изделии." }, price: 9800, category: "belts", image: "assets/images/belts/belt-1.jpg", inStock: true, isNew: true, rating: 4.6, reviews: 33 },
    { id: 11, name_i18n: { ru: "Ремень Braided Canvas" }, description_i18n: { ru: "Плетёный холщовый ремень в морском стиле, унисекс." }, price: 5500, category: "belts", image: "assets/images/belts/belt-2.jpg", inStock: false, isNew: false, rating: 4.2, reviews: 17 },
    { id: 12, name_i18n: { ru: "Кошелёк Bifold Premium" }, description_i18n: { ru: "Компактный кошелёк из телячьей кожи с отделением для монет." }, price: 15900, category: "wallets", image: "assets/images/wallets/wallet-1.jpg", inStock: true, isNew: false, rating: 4.8, reviews: 36 },
    { id: 13, name_i18n: { ru: "Кошелёк Cardholder Slim" }, description_i18n: { ru: "Ультратонкий держатель для карт из эко-кожи." }, price: 6500, category: "wallets", image: "assets/images/wallets/wallet-2.jpg", inStock: true, isNew: true, rating: 4.4, reviews: 19 },
    { id: 14, name_i18n: { ru: "Кошелёк Trifold Ostrich" }, description_i18n: { ru: "Трёхсекционный кошелёк из кожи страуса — редкий материал." }, price: 38000, category: "wallets", image: "assets/images/wallets/wallet-1.jpg", inStock: true, isNew: false, rating: 4.6, reviews: 11 },
    { id: 15, name_i18n: { ru: "Портмоне Travel Zip" }, description_i18n: { ru: "Большой дорожный кошелёк на молнии с отделом для паспорта." }, price: 22000, category: "wallets", image: "assets/images/wallets/wallet-2.jpg", inStock: false, isNew: true, rating: 4.7, reviews: 29 }
];

window.catalogProducts = products;

function getCart() {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function getFavorites() {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
}

function saveFavorites(favs) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    updateFavoritesCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const el = document.getElementById('headerCartCount');
    if (el) el.textContent = count;
}

function updateFavoritesCount() {
    const favs = getFavorites();
    const el = document.getElementById('headerFavoritesCount');
    if (el) el.textContent = favs.length;
}

function addToCart(productId) {
    const cart = getCart();
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ productId, quantity: 1 });
    }
    saveCart(cart);
    showNotification(I18n.t('cart.added') || 'Товар добавлен в корзину', 'success');
}

function toggleFavorite(productId) {
    const favs = getFavorites();
    const index = favs.indexOf(productId);
    if (index > -1) {
        favs.splice(index, 1);
        showNotification(I18n.t('favorites.removed') || 'Удалено из избранного', 'info');
    } else {
        favs.push(productId);
        showNotification(I18n.t('favorites.added') || 'Добавлено в избранное', 'success');
    }
    saveFavorites(favs);
    renderProducts(products);
}

function isFavorite(productId) {
    return getFavorites().includes(productId);
}

function isInCart(productId) {
    return getCart().some(item => item.productId === productId);
}

function renderProducts(items) {
    const container = document.getElementById('productsContainer');
    const notFound = document.getElementById('notFound');
    if (!container) return;

    container.innerHTML = '';

    if (items.length === 0) {
        notFound.style.display = 'block';
        return;
    }

    notFound.style.display = 'none';

    items.forEach(product => {
        const name = product.name_i18n.ru;
        const description = product.description_i18n.ru;
        const stockText = product.inStock ? I18n.t('common.inStock') || 'В наличии' : I18n.t('common.outOfStock') || 'Нет в наличии';
        const stockColor = product.inStock ? 'var(--color-success)' : '#ef4444';
        const favoriteActive = isFavorite(product.id) ? 'active' : '';
        const inCart = isInCart(product.id);

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-card__badges">
                ${product.isNew ? `<span class="product-card__badge product-card__badge--new" data-i18n="common.new">NEW</span>` : ''}
                ${!product.inStock ? `<span class="product-card__badge product-card__badge--sold" data-i18n="common.outOfStock">SOLD</span>` : ''}
            </div>
            <button class="product-card__favorite ${favoriteActive}" aria-label="В избранное" data-favorite="${product.id}">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="${favoriteActive ? 'currentColor' : 'none'}">
                    <path d="M10 2.5l1.903 3.854a1 1 0 00.754.547l4.243.616-3.07 3.003a1 1 0 00-.288.884l.724 4.226L10 13.5l-3.766 1.98.724-4.226a1 1 0 00-.288-.884l-3.07-3.003 4.243-.616a1 1 0 00.754-.547L10 2.5z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
            </button>
            <img src="${product.image}" alt="${name}" class="product-card__image" loading="lazy" onerror="this.src='../assets/images/placeholder.jpg'">
            <div class="product-card__content">
                <h3 class="product-card__title">${name}</h3>
                <p class="product-card__description">${description}</p>
                <div class="product-card__footer">
                    <span class="product-card__price">${product.price.toLocaleString('ru-RU')} ₽</span>
                    <span class="product-card__rating">⭐ ${product.rating}</span>
                </div>
                <p class="product-card__stock" style="color: ${stockColor}">${stockText}</p>
                <button class="btn btn--primary btn--full add-to-cart" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                    ${inCart ? (I18n.t('cart.inCart') || 'В корзине') : (I18n.t('cart.addToCart') || 'В корзину')}
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    container.querySelectorAll('[data-favorite]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(parseInt(btn.dataset.favorite));
        });
    });

    container.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(parseInt(btn.dataset.id));
            btn.textContent = I18n.t('cart.inCart') || 'В корзине';
            btn.disabled = true;
        });
    });
}

function applySearch() {
    const value = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => {
        const name = p.name_i18n.ru.toLowerCase();
        const desc = p.description_i18n.ru.toLowerCase();
        return name.includes(value) || desc.includes(value);
    });
    renderProducts(filtered);
}

function applySort() {
    const value = document.getElementById('sortSelect').value;
    let sorted = products.slice();

    if (value === 'price') {
        sorted.sort((a, b) => a.price - b.price);
    } else if (value === 'title') {
        sorted.sort((a, b) => a.name_i18n.ru.localeCompare(b.name_i18n.ru));
    } else if (value === 'rating') {
        sorted.sort((a, b) => b.rating - a.rating);
    }

    renderProducts(sorted);
}

function applyCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`)?.classList.add('active');

    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

function applyArrayMethod(action) {
    let result = [];

    switch (action) {
        case 'cheap':
            result = products.filter(p => p.price < 100000);
            break;
        case 'expensive':
            result = products.reduce((acc, p) => { if (p.price > 100000) acc.push(p); return acc; }, []);
            break;
        case 'new':
            result = products.filter(p => p.isNew).map(p => ({ ...p, name_i18n: { ru: '🆕 ' + p.name_i18n.ru } }));
            break;
        case 'alphabet':
            result = products.slice().sort((a, b) => a.name_i18n.ru.localeCompare(b.name_i18n.ru));
            break;
        case 'reverse':
            result = products.slice().reverse();
            break;
        case 'firstFive':
            result = products.slice(0, 5);
            break;
        case 'lastFive':
            result = products.slice(-5);
            break;
        case 'mostExpensive':
            const max = products.reduce((max, p) => p.price > max.price ? p : max, products[0]);
            result = max ? [max] : [];
            break;
        case 'inStock':
            result = products.filter(p => p.inStock);
            break;
        case 'discount':
            result = products.map(p => ({ ...p, price: Math.floor(p.price * 0.9), name_i18n: { ru: p.name_i18n.ru + ' (-10%)' } }));
            break;
        case 'all':
        default:
            result = products;
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-category="all"]')?.classList.add('active');
            document.getElementById('sortSelect').value = '';
            document.getElementById('searchInput').value = '';
            break;
    }

    renderProducts(result);
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateFavoritesCount();
    renderProducts(products);

    document.getElementById('searchInput')?.addEventListener('input', applySearch);
    document.getElementById('sortSelect')?.addEventListener('change', applySort);

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => applyCategory(btn.dataset.category));
    });

    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => applyArrayMethod(btn.dataset.action));
    });
});