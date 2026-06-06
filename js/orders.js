import API from './api.js';
import I18n from './i18n.js';

function checkAuth() {
    const stored = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (!stored) {
        document.getElementById('ordersAuth').style.display = 'block';
        document.getElementById('ordersList').style.display = 'none';
        return null;
    }
    document.getElementById('ordersAuth').style.display = 'none';
    document.getElementById('ordersList').style.display = 'block';
    return JSON.parse(stored);
}

function formatPrice(price) {
    return `${price.toLocaleString('ru-RU')} ₽`;
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusBadge(status) {
    const statuses = {
        pending: { text: I18n.t('order.status.pending') || 'В обработке', color: '#f59e0b' },
        confirmed: { text: I18n.t('order.status.confirmed') || 'Подтверждён', color: '#10b981' },
        shipped: { text: I18n.t('order.status.shipped') || 'Отправлен', color: '#3b82f6' },
        delivered: { text: I18n.t('order.status.delivered') || 'Доставлен', color: '#10b981' },
        cancelled: { text: I18n.t('order.status.cancelled') || 'Отменён', color: '#ef4444' }
    };
    const s = statuses[status] || statuses.pending;
    return `<span class="order-status" style="background:${s.color}20;color:${s.color}">${s.text}</span>`;
}

async function renderOrders(orders) {
    const container = document.getElementById('ordersList');
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `<p class="empty-state" data-i18n="orders.noOrders">У вас пока нет заказов</p>`;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-card__header">
                <div>
                    <span class="order-card__id" data-i18n="orders.orderId">Заказ #</span>${order.id}
                    <span class="order-card__date">${formatDate(order.createdAt)}</span>
                </div>
                ${getStatusBadge(order.status)}
            </div>
            <div class="order-card__items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.productName}" class="order-item__image">
                        <div class="order-item__info">
                            <h4 class="order-item__name">${item.productName}</h4>
                            <span class="order-item__qty" data-i18n="orders.quantity">Кол-во:</span> ${item.quantity}
                        </div>
                        <span class="order-item__price">${formatPrice(item.subtotal)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-card__footer">
                <div class="order-card__totals">
                    <span data-i18n="orders.subtotal">Промежуточный итог:</span> ${formatPrice(order.subtotal)}
                    <span data-i18n="orders.delivery">Доставка:</span> ${formatPrice(order.delivery)}
                    <strong data-i18n="orders.total">Итого:</strong> ${formatPrice(order.total)}
                </div>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    const user = checkAuth();
    if (!user) return;

    try {
        const orders = await API.getUserOrders(user.id);
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        renderOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('ordersList').innerHTML =
            `<p class="error-state" data-i18n="orders.loadError">Ошибка загрузки заказов</p>`;
    }
});