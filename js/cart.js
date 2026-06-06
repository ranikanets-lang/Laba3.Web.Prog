const CART_KEY = 'porten_cart';

const PRODUCTS = [
    { id: 1, name: 'Louis XVI ATHOS', price: 165000, category: 'watches', image: 'assets/images/watches/watch-1.jpg' },
    { id: 2, name: 'Montblanc Heritage', price: 245000, category: 'watches', image: 'assets/images/watches/watch-2.jpg' },
    { id: 3, name: 'Tissot PRX Powermatic', price: 89000, category: 'watches', image: 'assets/images/watches/watch-3.jpg' },
    { id: 4, name: 'Hamilton Khaki Field', price: 112000, category: 'watches', image: 'assets/images/watches/watch-4.jpg' },
    { id: 5, name: 'Seiko Presage Cocktail', price: 67000, category: 'watches', image: 'assets/images/watches/watch-1.png' },
    { id: 6, name: 'Orient Bambino Open Heart', price: 43000, category: 'watches', image: 'assets/images/watches/watch-2.jpg' },
    { id: 7, name: 'Citizen Eco-Drive Titanium', price: 54000, category: 'watches', image: 'assets/images/watches/watch-3.jpg' },
    { id: 8, name: 'Ремень Italian Leather', price: 12500, category: 'belts', image: 'assets/images/belts/belt-1.jpg' },
    { id: 9, name: 'Ремень Suede Classic', price: 8900, category: 'belts', image: 'assets/images/belts/belt-2.jpg' },
    { id: 10, name: 'Ремень Reversible Two-Tone', price: 9800, category: 'belts', image: 'assets/images/belts/belt-1.jpg' },
    { id: 11, name: 'Ремень Braided Canvas', price: 5500, category: 'belts', image: 'assets/images/belts/belt-2.jpg' },
    { id: 12, name: 'Кошелёк Bifold Premium', price: 15900, category: 'wallets', image: 'assets/images/wallets/wallet-1.jpg' },
    { id: 13, name: 'Кошелёк Cardholder Slim', price: 6500, category: 'wallets', image: 'assets/images/wallets/wallet-2.jpg' },
    { id: 14, name: 'Кошелёк Trifold Ostrich', price: 38000, category: 'wallets', image: 'assets/images/wallets/wallet-1.jpg' },
    { id: 15, name: 'Портмоне Travel Zip', price: 22000, category: 'wallets', image: 'assets/images/wallets/wallet-2.jpg' }
];

const CATEGORY_NAMES = {
    watches: 'Часы',
    belts: 'Ремни',
    wallets: 'Кошельки',
    accessories: 'Аксессуары'
};

let cart = [];

// ===== УТИЛИТЫ =====
function log(msg, data) {
    console.log(`🛒 ${msg}`, data !== undefined ? data : '');
}

function showError(msg) {
    console.error(`❌ ${msg}`);
}

function showNotification(message, type = 'success') {
    const container = document.getElementById('notifications-container');
    if (!container) {
        alert(message);
        return;
    }

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };

    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 14px 22px;
        background: ${colors[type] || colors.info};
        color: #fff;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    notif.textContent = message;
    container.appendChild(notif);

    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(100%)';
        notif.style.transition = 'all 0.3s';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ===== РАБОТА С КОРЗИНОЙ =====
function loadCart() {
    try {
        const saved = localStorage.getItem(CART_KEY);
        if (saved) {
            cart = JSON.parse(saved);
            log('Загружена корзина:', cart);
        } else {
            cart = [];
            log('Корзина пуста');
        }
    } catch (e) {
        showError('Ошибка загрузки корзины');
        cart = [];
    }
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateHeaderCounter();
}

function updateHeaderCounter() {
    const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const el = document.getElementById('headerCartCount');
    if (el) el.textContent = count;
}

function addToCart(productId, quantity = 1) {
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }
    saveCart();
    renderCart();
    showNotification('Товар добавлен в корзину', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
    renderCart();
    showNotification('Товар удалён из корзины', 'info');
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    const item = cart.find(i => i.productId === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        renderCart();
    }
}

// ===== ПОЛУЧЕНИЕ ТОВАРА =====
function getProductById(id) {
    // 🔥 Ищем по id, преобразуя типы
    return PRODUCTS.find(p => p.id === id || String(p.id) === String(id));
}

// ===== РАСЧЁТ ИТОГА =====
function calculateTotals() {
    let subtotal = 0;
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (product) {
            subtotal += product.price * item.quantity;
        }
    });
    const delivery = subtotal > 0 ? 500 : 0;
    return {
        subtotal,
        delivery,
        total: subtotal + delivery
    };
}

// ===== ФОРМАТИРОВАНИЕ ЦЕНЫ =====
function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' ₽';
}

// ===== РЕНДЕР КОРЗИНЫ =====
function renderCart() {
    log('Рендер корзины...');
    log('Товаров в корзине:', cart.length);

    const container = document.getElementById('cartItems');
    const emptyEl = document.getElementById('cartEmpty');
    const contentEl = document.getElementById('cartContent');

    const itemsWithProducts = [];
    const notFoundIds = [];

    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (product) {
            itemsWithProducts.push({
                ...item,
                product,
                subtotal: product.price * item.quantity
            });
        } else {
            notFoundIds.push(item.productId);
        }
    });

    // Если есть не найденные товары
    if (notFoundIds.length > 0) {
        showError(`Не найдены товары с ID: ${notFoundIds.join(', ')}`);
        log('Доступные ID товаров:', PRODUCTS.map(p => p.id));
    }


    // Показываем контент
    emptyEl.style.display = 'none';
    contentEl.style.display = 'grid';

    log(`Рендерим ${itemsWithProducts.length} товаров`);

    // Генерируем HTML
    container.innerHTML = itemsWithProducts.map(item => `
        <div class="cart-item" data-product-id="${item.productId}">
            <img src="${item.product.image}" 
                 alt="${item.product.name}" 
                 class="cart-item__image"
                 onerror="this.src='assets/images/placeholder.jpg'">
            <div class="cart-item__info">
                <h3 class="cart-item__name">${item.product.name}</h3>
                <span class="cart-item__category">${CATEGORY_NAMES[item.product.category] || item.product.category}</span>
                <span class="cart-item__price">${formatPrice(item.product.price)}</span>
            </div>
            <div class="cart-item__controls">
                <div class="cart-item__quantity">
                    <button class="cart-item__quantity-btn" data-action="decrease" data-id="${item.productId}">−</button>
                    <span class="cart-item__quantity-value">${item.quantity}</span>
                    <button class="cart-item__quantity-btn" data-action="increase" data-id="${item.productId}">+</button>
                </div>
                <span class="cart-item__subtotal">${formatPrice(item.subtotal)}</span>
                <button class="cart-item__remove" data-action="remove" data-id="${item.productId}">Удалить</button>
            </div>
        </div>
    `).join('');

    // Обновляем итоги
    const totals = calculateTotals();
    document.getElementById('cartSubtotal').textContent = formatPrice(totals.subtotal);
    document.getElementById('cartDelivery').textContent = totals.delivery > 0 ? formatPrice(totals.delivery) : 'Бесплатно';
    document.getElementById('cartTotal').textContent = formatPrice(totals.total);

    log('Рендер завершён');
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
function handleCartClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = parseInt(btn.dataset.id);

    log(`Действие: ${action}, ID: ${id}`);

    switch (action) {
        case 'remove':
            removeFromCart(id);
            break;
        case 'increase':
            const itemInc = cart.find(i => i.productId === id);
            if (itemInc) updateQuantity(id, itemInc.quantity + 1);
            break;
        case 'decrease':
            const itemDec = cart.find(i => i.productId === id);
            if (itemDec) updateQuantity(id, itemDec.quantity - 1);
            break;
    }
}

// ===== ОФОРМЛЕНИЕ ЗАКАЗА =====
async function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }

    const currentUser = JSON.parse(
        localStorage.getItem('currentUser') ||
        sessionStorage.getItem('currentUser') || 'null'
    );

    if (!currentUser) {
        showNotification('Войдите для оформления заказа', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    const totals = calculateTotals();
    const orderItems = cart.map(item => {
        const product = getProductById(item.productId);
        return {
            productId: item.productId,
            productName: product?.name || 'Unknown',
            price: product?.price || 0,
            quantity: item.quantity,
            subtotal: (product?.price || 0) * item.quantity,
            image: product?.image || ''
        };
    });

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
        updatedAt: new Date().toISOString()
    };

    try {
        log('Создание заказа:', order);

        const response = await fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        // Очищаем корзину
        cart = [];
        saveCart();
        renderCart();

        showNotification('Заказ успешно оформлен!', 'success');

        setTimeout(() => window.location.href = 'index.html', 2000);

    } catch (error) {
        showError('Ошибка оформления заказа: ' + error.message);
        showNotification('Ошибка оформления заказа', 'error');
    }
}

// ===== ТЕСТОВЫЕ ФУНКЦИИ (для отладки) =====
window.addTestProduct = function(id = 1) {
    addToCart(id, 1);
};

window.clearCart = function() {
    cart = [];
    saveCart();
    renderCart();
    showNotification('Корзина очищена', 'info');
};

window.showAvailableProducts = function() {
    console.table(PRODUCTS.map(p => ({ id: p.id, name: p.name, price: p.price })));
};

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    log('=== ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ КОРЗИНЫ ===');
    log('Доступно товаров в каталоге:', PRODUCTS.length);

    // Загружаем корзину
    loadCart();
    updateHeaderCounter();

    // Рендерим корзину
    renderCart();

    // Обработчики
    const cartItems = document.getElementById('cartItems');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cartItems) {
        cartItems.addEventListener('click', handleCartClick);
    } else {
        showError('Не найден элемент #cartItems');
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    } else {
        showError('Не найден элемент #checkoutBtn');
    }

    log('=== ИНИЦИАЛИЗАЦИЯ ЗАВЕРШЕНА ===');
    log('💡 Команды для отладки:');
    log('  addTestProduct(1) - добавить товар ID 1');
    log('  clearCart() - очистить корзину');
    log('  showAvailableProducts() - список всех товаров');
});

// Глобальный доступ
window.addToCart = addToCart;
window.cartData = cart;
window.renderCart = renderCart;