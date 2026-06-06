import API from './api.js';
import I18n from './i18n.js';
import ThemeManager from './theme.js';

// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
const CART_KEY = 'porten_cart';
let productsCache = [];
let currentUser = null;

// ===== ПРОВЕРКА АВТОРИЗАЦИИ =====
function checkAdminAuth() {
    const stored = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    if (!stored) {
        window.location.href = 'login.html';
        return null;
    }
    currentUser = JSON.parse(stored);
    if (currentUser.email !== 'admin@mail.com' && currentUser.role !== 'admin') {
        window.location.href = 'index.html';
        return null;
    }
    return currentUser;
}

// ===== УВЕДОМЛЕНИЯ =====
function showNotification(message, type = 'success') {
    const container = document.getElementById('notifications-container');
    if (!container) {
        alert(message);
        return;
    }
    const notif = document.createElement('div');
    notif.className = `notification notification--${type}`;
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: #fff;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    container.appendChild(notif);
    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(100%)';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ===== ИНФОРМАЦИЯ ОБ АДМИНЕ =====
function renderAdminInfo(user) {
    const el = document.getElementById('adminInfo');
    if (el) el.textContent = `${user.firstName || 'Admin'} ${user.lastName || ''}`.trim() || 'Admin';
}

// ===== ПРОДУКТЫ: РЕНДЕР ТАБЛИЦЫ =====
function renderProductsTable(products = []) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state">${I18n.t('admin.noProducts') || 'Товары не найдены'}</td></tr>`;
        return;
    }

    tbody.innerHTML = products.map(product => {
        const name = product.name_i18n?.ru || product.name || 'Product';
        const category = API.getCategoryName?.(product.category) || product.category || '-';
        const price = product.price ? `${product.price.toLocaleString('ru-RU')} ₽` : '-';
        const stockBadge = product.inStock
            ? `<span class="status-badge status-badge--in-stock">${I18n.t('common.inStock') || 'В наличии'}</span>`
            : `<span class="status-badge status-badge--out-stock">${I18n.t('common.outOfStock') || 'Нет в наличии'}</span>`;
        const newBadge = product.isNew ? '<span class="status-badge status-badge--new">NEW</span>' : '';
        const image = product.image || 'assets/images/placeholder.jpg';

        return `
            <tr data-product-id="${product.id}">
                <td><img src="${image}" alt="${name}" class="products-table__image" onerror="this.src='assets/images/placeholder.jpg'"></td>
                <td><strong>${name}</strong>${newBadge}</td>
                <td>${category}</td>
                <td>${price}</td>
                <td>${stockBadge}</td>
                <td class="products-table__actions">
                    <button class="products-table__btn products-table__btn--edit" data-action="edit" data-id="${product.id}" title="${I18n.t('admin.edit') || 'Редактировать'}">✏️</button>
                    <button class="products-table__btn products-table__btn--delete" data-action="delete" data-id="${product.id}" title="${I18n.t('admin.delete') || 'Удалить'}">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

// ===== ПРОДУКТЫ: ЗАГРУЗКА =====
async function loadProducts(filter = '') {
    try {
        productsCache = await API.getProducts();
        const filtered = filter
            ? productsCache.filter(p => {
                const name = (p.name_i18n?.ru || p.name || '').toLowerCase();
                const desc = (p.description_i18n?.ru || p.description || '').toLowerCase();
                return name.includes(filter.toLowerCase()) || desc.includes(filter.toLowerCase());
            })
            : productsCache;
        renderProductsTable(filtered);
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification(I18n.t('admin.loadProductsError') || 'Ошибка загрузки товаров', 'error');
    }
}

// ===== ПРОДУКТЫ: МОДАЛЬНОЕ ОКНО =====
function openProductModal(product = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');

    if (!modal || !form) return;

    form.reset();
    document.getElementById('productId').value = '';

    if (product) {
        modalTitle.textContent = I18n.t('admin.editProduct') || 'Редактировать товар';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name_i18n?.ru || product.name || '';
        document.getElementById('productPrice').value = product.price || '';
        document.getElementById('productCategory').value = product.category || 'watches';
        document.getElementById('productImage').value = product.image || '';
        document.getElementById('productDescription').value = product.description_i18n?.ru || product.description || '';
        document.getElementById('productInStock').value = String(product.inStock ?? true);
        document.getElementById('productIsNew').value = String(product.isNew ?? false);
    } else {
        modalTitle.textContent = I18n.t('admin.addProduct') || 'Добавить товар';
    }

    modal.hidden = false;
    void modal.offsetWidth;
    modal.classList.add('active');
    document.body.classList.add('modal-open');

    setTimeout(() => document.getElementById('productName')?.focus(), 100);
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    setTimeout(() => { modal.hidden = true; }, 300);
}

// ===== ПРОДУКТЫ: СОХРАНЕНИЕ =====
async function saveProduct(formData) {
    const id = formData.get('id');
    const productData = {
        name_i18n: { ru: formData.get('name'), en: formData.get('name') },
        description_i18n: { ru: formData.get('description'), en: formData.get('description') },
        price: parseInt(formData.get('price')) || 0,
        category: formData.get('category'),
        image: formData.get('image') || 'assets/images/placeholder.jpg',
        inStock: formData.get('inStock') === 'true',
        isNew: formData.get('isNew') === 'true',
        rating: 4.5,
        reviews: 0
    };

    try {
        if (id) {
            await API.updateProduct(id, productData);
            showNotification(I18n.t('admin.productUpdated') || 'Товар обновлён', 'success');
        } else {
            productData.id = Date.now();
            await API.createProduct(productData);
            showNotification(I18n.t('admin.productAdded') || 'Товар добавлен', 'success');
        }
        return true;
    } catch (error) {
        console.error('Error saving product:', error);
        showNotification(I18n.t('admin.saveError') || 'Ошибка сохранения', 'error');
        return false;
    }
}

// ===== ПРОДУКТЫ: УДАЛЕНИЕ =====
async function deleteProduct(id) {
    if (!confirm(I18n.t('admin.confirmDelete') || 'Удалить этот товар?')) return;
    try {
        await API.deleteProduct(id);
        showNotification(I18n.t('admin.productDeleted') || 'Товар удалён', 'success');
        await loadProducts();
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification(I18n.t('admin.deleteError') || 'Ошибка удаления', 'error');
        return false;
    }
}

// ===== ЗАКАЗЫ: РЕНДЕР ТАБЛИЦЫ =====
function renderOrdersTable(orders = []) {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state">${I18n.t('admin.noOrders') || 'Заказы не найдены'}</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(order => {
        const date = new Date(order.createdAt).toLocaleDateString('ru-RU');
        const statusKey = `order.status.${order.status}`;
        const statusText = I18n.t(statusKey) || order.status;
        const statusClass = `status-badge--${order.status}`;

        return `
            <tr data-order-id="${order.id}">
                <td><strong>#${order.id}</strong></td>
                <td>
                    <div>${order.userName || 'Аноним'}</div>
                    <small style="color:var(--text-secondary)">${order.userEmail || '-'}</small>
                </td>
                <td>${date}</td>
                <td>${order.total?.toLocaleString('ru-RU') || 0} ₽</td>
                <td>
                    <select class="form-select form-select--sm order-status-select" data-order-id="${order.id}">
                        <option value="pending" ${order.status==='pending'?'selected':''}>${I18n.t('order.status.pending')||'В обработке'}</option>
                        <option value="confirmed" ${order.status==='confirmed'?'selected':''}>${I18n.t('order.status.confirmed')||'Подтверждён'}</option>
                        <option value="shipped" ${order.status==='shipped'?'selected':''}>${I18n.t('order.status.shipped')||'Отправлен'}</option>
                        <option value="delivered" ${order.status==='delivered'?'selected':''}>${I18n.t('order.status.delivered')||'Доставлен'}</option>
                        <option value="cancelled" ${order.status==='cancelled'?'selected':''}>${I18n.t('order.status.cancelled')||'Отменён'}</option>
                    </select>
                </td>
                <td class="products-table__actions">
                    <button class="products-table__btn" data-action="viewOrder" data-id="${order.id}" title="Просмотр">👁️</button>
                    <button class="products-table__btn products-table__btn--delete" data-action="deleteOrder" data-id="${order.id}" title="Удалить">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

// ===== ЗАКАЗЫ: ЗАГРУЗКА =====
async function loadOrders(search = '', statusFilter = 'all') {
    try {
        let orders = await API.getOrders();

        if (statusFilter && statusFilter !== 'all') {
            orders = orders.filter(o => o.status === statusFilter);
        }

        if (search) {
            orders = orders.filter(o => {
                const customer = `${o.userName||''} ${o.userEmail||''}`.toLowerCase();
                return customer.includes(search.toLowerCase()) || o.id.toString().includes(search);
            });
        }

        renderOrdersTable(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        showNotification(I18n.t('admin.loadOrdersError') || 'Ошибка загрузки заказов', 'error');
    }
}

// ===== ЗАКАЗЫ: ОБНОВЛЕНИЕ СТАТУСА =====
async function updateOrderStatus(orderId, newStatus) {
    try {
        await API.updateOrder(orderId, { status: newStatus, updatedAt: new Date().toISOString() });
        showNotification(I18n.t('admin.orderUpdated') || 'Статус обновлён', 'success');
        await loadOrders(
            document.getElementById('orderSearch')?.value || '',
            document.getElementById('orderStatusFilter')?.value || 'all'
        );
    } catch (error) {
        console.error('Error updating order:', error);
        showNotification(I18n.t('admin.updateOrderError') || 'Ошибка обновления', 'error');
    }
}

// ===== ЗАКАЗЫ: УДАЛЕНИЕ =====
async function deleteOrder(orderId) {
    if (!confirm(I18n.t('admin.confirmDeleteOrder') || 'Удалить заказ?')) return;
    try {
        await API.deleteOrder(orderId);
        showNotification(I18n.t('admin.orderDeleted') || 'Заказ удалён', 'success');
        await loadOrders();
    } catch (error) {
        console.error('Error deleting order:', error);
        showNotification(I18n.t('admin.deleteOrderError') || 'Ошибка удаления', 'error');
    }
}

// ===== ПОЛЬЗОВАТЕЛИ: РЕНДЕР ТАБЛИЦЫ =====
function renderUsersTable(users = []) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-state">${I18n.t('admin.noUsers') || 'Пользователи не найдены'}</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map(user => {
        const registered = new Date(user.createdAt || Date.now()).toLocaleDateString('ru-RU');
        const roleBadge = user.role === 'admin'
            ? '<span class="status-badge status-badge--new">Админ</span>'
            : '<span class="status-badge status-badge--in-stock">Покупатель</span>';
        const isSelf = user.id === currentUser?.id;
        const isAdmin = user.email === 'admin@mail.com';

        return `
            <tr data-user-id="${user.id}">
                <td>${user.firstName || '-'} ${user.lastName || ''}</td>
                <td>${user.email || '-'}</td>
                <td>${roleBadge}</td>
                <td>${registered}</td>
                <td class="products-table__actions">
                    <button class="products-table__btn products-table__btn--delete" 
                            data-action="deleteUser" 
                            data-id="${user.id}" 
                            ${isSelf || isAdmin ? 'disabled title="Нельзя удалить"' : `title="${I18n.t('admin.delete')||'Удалить'}"`}>
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// ===== ПОЛЬЗОВАТЕЛИ: ЗАГРУЗКА =====
async function loadUsers(search = '') {
    try {
        let users = await API.getUsers();

        if (search) {
            users = users.filter(u => {
                const name = `${u.firstName||''} ${u.lastName||''}`.toLowerCase();
                return name.includes(search.toLowerCase()) || (u.email||'').toLowerCase().includes(search.toLowerCase());
            });
        }

        renderUsersTable(users);
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification(I18n.t('admin.loadUsersError') || 'Ошибка загрузки', 'error');
    }
}

// ===== ПОЛЬЗОВАТЕЛИ: УДАЛЕНИЕ =====
async function deleteUser(userId) {
    if (userId === currentUser?.id) {
        showNotification(I18n.t('admin.cannotDeleteSelf') || 'Нельзя удалить себя', 'error');
        return;
    }
    if (!confirm(I18n.t('admin.confirmDeleteUser') || 'Удалить пользователя?')) return;

    try {
        await API.deleteUser(userId);
        showNotification(I18n.t('admin.userDeleted') || 'Пользователь удалён', 'success');
        await loadUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification(I18n.t('admin.deleteUserError') || 'Ошибка удаления', 'error');
    }
}

// ===== ОТЗЫВЫ: РЕНДЕР СПИСКА =====
function renderReviewsList(reviews = [], products = []) {
    const container = document.getElementById('reviewsListContainer');
    if (!container) return;

    if (reviews.length === 0) {
        container.innerHTML = `<p class="empty-state">${I18n.t('admin.noReviews') || 'Отзывы не найдены'}</p>`;
        return;
    }

    container.innerHTML = reviews.map(review => {
        const date = new Date(review.date).toLocaleDateString('ru-RU');
        const product = products.find(p => p.id === review.productId);
        const stars = '★'.repeat(review.rating || 0) + '☆'.repeat(5 - (review.rating || 0));

        return `
            <div class="review-card" data-review-id="${review.id}">
                <div class="review-card__header">
                    <div>
                        <h4 class="review-card__product">${product?.name_i18n?.ru || review.productName || 'Unknown'}</h4>
                        <div class="review-card__rating">${stars}</div>
                    </div>
                    <div class="review-card__meta">
                        <span class="review-card__author">${review.userName || 'Аноним'}</span>
                        <span class="review-card__date">${date}</span>
                    </div>
                </div>
                <p class="review-card__text">${review.text || ''}</p>
                ${review.verified ? `<span class="review-card__verified">✓ Проверенная покупка</span>` : ''}
                <div class="review-card__actions">
                    <button class="btn btn--outline btn--sm" data-action="deleteReview" data-id="${review.id}">
                        ${I18n.t('admin.delete') || 'Удалить'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ===== ОТЗЫВЫ: ЗАГРУЗКА =====
async function loadReviews(search = '', productId = 'all') {
    try {
        let reviews = await API.getReviews();
        const products = await API.getProducts();

        if (productId && productId !== 'all') {
            reviews = reviews.filter(r => r.productId === parseInt(productId));
        }

        if (search) {
            reviews = reviews.filter(r => {
                const text = (r.text || '').toLowerCase();
                const product = products.find(p => p.id === r.productId);
                const productName = (product?.name_i18n?.ru || '').toLowerCase();
                return text.includes(search.toLowerCase()) || productName.includes(search.toLowerCase());
            });
        }

        // Заполняем фильтр по товарам
        const productFilter = document.getElementById('reviewProductFilter');
        if (productFilter && productFilter.options.length <= 1) {
            products.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = p.name_i18n?.ru || p.name || 'Unknown';
                productFilter.appendChild(option);
            });
        }

        renderReviewsList(reviews, products);
    } catch (error) {
        console.error('Error loading reviews:', error);
        showNotification(I18n.t('admin.loadReviewsError') || 'Ошибка загрузки отзывов', 'error');
    }
}

// ===== ОТЗЫВЫ: УДАЛЕНИЕ =====
async function deleteReview(reviewId) {
    if (!confirm(I18n.t('admin.confirmDeleteReview') || 'Удалить отзыв?')) return;
    try {
        await API.deleteReview(reviewId);
        showNotification(I18n.t('admin.reviewDeleted') || 'Отзыв удалён', 'success');
        await loadReviews(
            document.getElementById('reviewSearch')?.value || '',
            document.getElementById('reviewProductFilter')?.value || 'all'
        );
    } catch (error) {
        console.error('Error deleting review:', error);
        showNotification(I18n.t('admin.deleteReviewError') || 'Ошибка удаления', 'error');
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Проверка авторизации
    const admin = checkAdminAuth();
    if (!admin) return;

    // 2. Инициализация модулей
    I18n.init();
    ThemeManager.init();

    // 3. Скрытие прелоадера
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
        }, 800);
    }

    // 4. Отображение инфо админа
    renderAdminInfo(admin);

    // 5. Загрузка товаров (по умолчанию активная вкладка)
    await loadProducts();

    // ===== ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК =====
    document.querySelectorAll('.admin-nav__item').forEach(item => {
        item.addEventListener('click', async () => {
            document.querySelectorAll('.admin-nav__item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
            const tab = item.dataset.tab;
            document.getElementById(`${tab}Panel`)?.classList.add('active');

            // Автозагрузка данных при переключении
            if (tab === 'orders') await loadOrders();
            else if (tab === 'users') await loadUsers();
            else if (tab === 'reviews') await loadReviews();
        });
    });

    // ===== ПОИСК ТОВАРОВ =====
    document.getElementById('productSearch')?.addEventListener('input', (e) => {
        loadProducts(e.target.value);
    });

    // ===== ПОИСК И ФИЛЬТР ЗАКАЗОВ =====
    document.getElementById('orderSearch')?.addEventListener('input', (e) => {
        loadOrders(e.target.value, document.getElementById('orderStatusFilter')?.value || 'all');
    });
    document.getElementById('orderStatusFilter')?.addEventListener('change', (e) => {
        loadOrders(document.getElementById('orderSearch')?.value || '', e.target.value);
    });

    // ===== ПОИСК ПОЛЬЗОВАТЕЛЕЙ =====
    document.getElementById('userSearch')?.addEventListener('input', (e) => {
        loadUsers(e.target.value);
    });

    // ===== ПОИСК И ФИЛЬТР ОТЗЫВОВ =====
    document.getElementById('reviewSearch')?.addEventListener('input', (e) => {
        loadReviews(e.target.value, document.getElementById('reviewProductFilter')?.value || 'all');
    });
    document.getElementById('reviewProductFilter')?.addEventListener('change', (e) => {
        loadReviews(document.getElementById('reviewSearch')?.value || '', e.target.value);
    });

    // ===== КНОПКА "ДОБАВИТЬ ТОВАР" =====
    document.getElementById('addProductBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        openProductModal();
    });

    // ===== ФОРМА ТОВАРА =====
    document.getElementById('productForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const success = await saveProduct(formData);
        if (success) {
            closeProductModal();
            e.target.reset();
            await loadProducts(document.getElementById('productSearch')?.value || '');
        }
    });

    // ===== ОБРАБОТКА КЛИКОВ ПО ТАБЛИЦАМ (ДЕЛЕГИРОВАНИЕ) =====
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;

        // Продукты
        if (action === 'edit') {
            const product = productsCache.find(p => p.id === id);
            if (product) openProductModal(product);
        } else if (action === 'delete') {
            await deleteProduct(id);
        }
        // Заказы
        else if (action === 'viewOrder') {
            const orders = await API.getOrders();
            const order = orders.find(o => o.id === id);
            if (order) {
                const items = order.items?.map(i => `• ${i.productName} × ${i.quantity}`).join('\n') || '-';
                alert(`Заказ #${order.id}\nКлиент: ${order.userName}\nEmail: ${order.userEmail}\nТовары:\n${items}\nИтого: ${order.total} ₽\nСтатус: ${order.status}`);
            }
        } else if (action === 'deleteOrder') {
            await deleteOrder(id);
        }
        // Пользователи
        else if (action === 'deleteUser') {
            await deleteUser(id);
        }
        // Отзывы
        else if (action === 'deleteReview') {
            await deleteReview(id);
        }
    });

    // ===== ИЗМЕНЕНИЕ СТАТУСА ЗАКАЗА =====
    document.addEventListener('change', async (e) => {
        if (e.target.classList.contains('order-status-select')) {
            const orderId = parseInt(e.target.dataset.orderId);
            const newStatus = e.target.value;
            await updateOrderStatus(orderId, newStatus);
        }
    });

    // ===== МОДАЛЬНОЕ ОКНО: КНОПКИ ЗАКРЫТИЯ =====
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.querySelector('[data-modal-close]')?.addEventListener('click', (e) => {
            e.preventDefault();
            closeProductModal();
        });
        modal.querySelector('.modal-close-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            closeProductModal();
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeProductModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.hidden) closeProductModal();
        });
    }

    // ===== ВЫХОД ИЗ АККАУНТА =====
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // ===== ОБНОВЛЕНИЕ СЧЁТЧИКА КОРЗИНЫ =====
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const el = document.getElementById('headerCartCount');
        if (el) el.textContent = count;
    }
    updateCartCount();
});