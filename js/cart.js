import API from './api.js';
import I18n from './i18n.js';
import { showNotification } from './utils.js';

const CART_KEY = 'porten_cart';
const FAVORITES_KEY = 'porten_favorites';

let cart = [];
let favorites = [];
let productsCache = []; // Кэш для хранения загруженных товаров

function loadCart() {
    const saved = localStorage.getItem(CART_KEY);
    cart = saved ? JSON.parse(saved) : [];
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function loadFavorites() {
    const saved = localStorage.getItem(FAVORITES_KEY);
    favorites = saved ? JSON.parse(saved) : [];
}

function saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    updateFavoritesCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const el = document.getElementById('headerCartCount');
    if (el) el.textContent = count;
}

function updateFavoritesCount() {
    const el = document.getElementById('headerFavoritesCount');
    if (el) el.textContent = favorites.length;
}

function addToCart(productId, quantity = 1) {
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }
    saveCart();
    showNotification(I18n.t('cart.added') || 'Товар добавлен в корзину', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
    renderCart();
    showNotification(I18n.t('cart.removed') || 'Товар удалён из корзины', 'success');
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        renderCart();
    }
}

// ИСПРАВЛЕНИЕ: Функция теперь получает товары и сопоставляет их с корзиной
function getCartItemsWithDetails(allProducts) {
    return cart.map(item => {
        const product = allProducts.find(p => p.id === item.productId);
        return {
            ...item,
            product,
            subtotal: product ? product.price * item.quantity : 0
        };
    }).filter(item => item.product); // Оставляем только те товары, которые удалось найти
}

function calculateTotal(cartItems) {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const delivery = subtotal > 0 ? 500 : 0;
    return { subtotal, delivery, total: subtotal + delivery };
}

async function renderCart() {
    const container = document.getElementById('cartItems');
    const emptyEl = document.getElementById('cartEmpty');
    const contentEl = document.getElementById('cartContent');

    if (!container) return;

    // ИСПРАВЛЕНИЕ: Загружаем товары с сервера, если они еще не загружены
    if (productsCache.length === 0) {
        try {
            productsCache = await API.getProducts();
        } catch (error) {
            console.error('Failed to load products for cart', error);
        }
    }

    const cartItems = getCartItemsWithDetails(productsCache);

    if (cartItems.length === 0) {
        emptyEl.style.display = 'block';
        contentEl.style.display = 'none';
        return;
    }

    emptyEl.style.display = 'none';
    contentEl.style.display = 'grid'; // Используем grid из вашего CSS

    container.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-product-id="${item.productId}">
            <img src="${item.product.image}" alt="${item.product.name_i18n.ru}" class="cart-item__image">
            <div class="cart-item__info">
                <h3 class="cart-item__name">${item.product.name_i18n.ru}</h3>
                <span class="cart-item__category">${getCategoryName(item.product.category)}</span>
                <span class="cart-item__price">${item.product.price.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div class="cart-item__controls">
                <div class="cart-item__quantity">
                    <button class="cart-item__quantity-btn" data-action="decrease" data-id="${item.productId}">−</button>
                    <span class="cart-item__quantity-value">${item.quantity}</span>
                    <button class="cart-item__quantity-btn" data-action="increase" data-id="${item.productId}">+</button>
                </div>
                <span class="cart-item__subtotal">${item.subtotal.toLocaleString('ru-RU')} ₽</span>
                <button class="cart-item__remove" data-action="remove" data-id="${item.productId}" data-i18n="cart.remove">Удалить</button>
            </div>
        </div>
    `).join('');

    const totals = calculateTotal(cartItems);
    document.getElementById('cartSubtotal').textContent = `${totals.subtotal.toLocaleString('ru-RU')} ₽`;
    document.getElementById('cartDelivery').textContent = totals.delivery > 0 ? `${totals.delivery.toLocaleString('ru-RU')} ₽` : (I18n.t('cart.free') || 'Бесплатно');
    document.getElementById('cartTotal').textContent = `${totals.total.toLocaleString('ru-RU')} ₽`;
}

function getCategoryName(cat) {
    const names = {
        watches: I18n.t('category.watches') || 'Часы',
        belts: I18n.t('category.belts') || 'Ремни',
        wallets: I18n.t('category.wallets') || 'Кошельки'
    };
    return names[cat] || cat;
}

function handleCartClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = parseInt(btn.dataset.id);

    if (action === 'remove') {
        removeFromCart(id);
    } else if (action === 'increase') {
        const item = cart.find(i => i.productId === id);
        if (item) updateQuantity(id, item.quantity + 1);
    } else if (action === 'decrease') {
        const item = cart.find(i => i.productId === id);
        if (item) updateQuantity(id, item.quantity - 1);
    }
}

async function handleCheckout() {
    if (cart.length === 0) return;

    const currentUser = JSON.parse(
        localStorage.getItem('currentUser') ||
        sessionStorage.getItem('currentUser')
    );

    if (!currentUser) {
        showNotification(I18n.t('cart.authRequired') || 'Войдите для оформления заказа', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    const products = productsCache.length > 0
        ? productsCache
        : await API.getProducts();

    const orderItems = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
            productId: item.productId,
            productName: product?.name_i18n?.ru || product?.name || 'Unknown',
            price: product?.price || 0,
            quantity: item.quantity,
            subtotal: (product?.price || 0) * item.quantity,
            image: product?.image || ''
        };
    });

    const totals = calculateTotal(
        cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
                ...item,
                product,
                subtotal: (product?.price || 0) * item.quantity
            };
        })
    );

    const order = {
        id: Date.now(),
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim(),
        items: orderItems,
        subtotal: totals.subtotal,
        delivery: totals.delivery,
        total: totals.total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deliveryAddress: '',
        paymentMethod: 'cash'
    };

    try {
        await API.createOrder(order);

        localStorage.removeItem(CART_KEY);
        cart = [];

        renderCart();
        updateCartCount();

        showNotification(I18n.t('cart.success') || 'Заказ успешно оформлен!', 'success');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        console.error('Error creating order:', error);
        showNotification(I18n.t('cart.orderError') || 'Ошибка оформления заказа', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    loadFavorites();
    updateCartCount();
    updateFavoritesCount();

    // Вызываем renderCart, который теперь сам загрузит данные
    renderCart();

    document.getElementById('cartItems')?.addEventListener('click', handleCartClick);
    document.getElementById('checkoutBtn')?.addEventListener('click', handleCheckout);
});

// Экспортируем для использования в других скриптах
window.addToCart = addToCart;
window.cartData = cart;