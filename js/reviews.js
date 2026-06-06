import API from './api.js';
import I18n from './i18n.js';
import { showNotification } from './utils.js';

const MIN_REVIEW_LENGTH = 50;
const REVIEWS_KEY = 'porten_reviews';
const CART_KEY = 'porten_cart';

let currentUser = null;
let purchasedProducts = [];
let allProducts = [];
let selectedRating = 0;

// Проверка авторизации и прав
function checkAuth() {
    const stored = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');

    if (!stored) {
        document.getElementById('authRequired').style.display = 'block';
        document.getElementById('reviewsContent').style.display = 'none';
        return false;
    }

    currentUser = JSON.parse(stored);

    // Проверка на администратора
    if (currentUser.role === 'admin' || currentUser.email === 'admin@mail.com') {
        document.getElementById('adminBlocked').style.display = 'block';
        document.getElementById('reviewsContent').style.display = 'none';
        return false;
    }

    document.getElementById('authRequired').style.display = 'none';
    document.getElementById('adminBlocked').style.display = 'none';
    document.getElementById('reviewsContent').style.display = 'block';

    return true;
}

// Загрузка купленных товаров
async function loadPurchasedProducts() {
    try {
        // Получаем корзину (историю покупок можно хранить отдельно)
        const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

        if (cart.length === 0) {
            document.getElementById('productSelect').innerHTML =
                '<option value="" data-i18n="reviews.noPurchases">-- У вас нет купленных товаров --</option>';
            return;
        }

        // Загружаем все товары
        allProducts = await API.getProducts();

        // Фильтруем только купленные товары
        purchasedProducts = cart.map(item => {
            const product = allProducts.find(p => p.id === item.productId);
            return product ? { ...product, quantity: item.quantity } : null;
        }).filter(p => p !== null);

        // Заполняем select
        const select = document.getElementById('productSelect');
        select.innerHTML = '<option value="" data-i18n="reviews.selectProductPlaceholder">-- Выберите купленный товар --</option>';

        purchasedProducts.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name_i18n.ru} (${product.price.toLocaleString('ru-RU')} ₽)`;
            select.appendChild(option);
        });

    } catch (error) {
        console.error('Error loading purchased products:', error);
        showNotification(I18n.t('reviews.loadError') || 'Ошибка загрузки товаров', 'error');
    }
}

// Инициализация рейтинга
function initRating() {
    const stars = document.querySelectorAll('.rating-input .star');
    const ratingValue = document.getElementById('ratingValue');
    const ratingError = document.getElementById('ratingError');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            selectedRating = rating;
            ratingValue.value = rating;

            // Обновляем визуальное состояние
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });

            // Очищаем ошибку
            ratingError.textContent = '';
        });

        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating);
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });

    document.getElementById('ratingInput').addEventListener('mouseleave', () => {
        const currentRating = parseInt(ratingValue.value) || 0;
        stars.forEach((s, index) => {
            if (index < currentRating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });
}

// Счетчик символов
function initCharCounter() {
    const textarea = document.getElementById('reviewText');
    const counter = document.getElementById('charCount');

    textarea.addEventListener('input', () => {
        const length = textarea.value.length;
        counter.textContent = length;

        if (length >= MIN_REVIEW_LENGTH) {
            counter.style.color = 'var(--color-success, #10b981)';
        } else {
            counter.style.color = 'var(--text-secondary)';
        }
    });
}

// Валидация формы
function validateForm() {
    let isValid = true;

    // Проверка товара
    const productSelect = document.getElementById('productSelect');
    const productError = document.getElementById('productError');

    if (!productSelect.value) {
        productError.textContent = I18n.t('reviews.selectProductError') || 'Выберите товар';
        isValid = false;
    } else {
        productError.textContent = '';
    }

    // Проверка рейтинга
    const ratingError = document.getElementById('ratingError');
    if (selectedRating === 0) {
        ratingError.textContent = I18n.t('reviews.selectRatingError') || 'Выберите оценку';
        isValid = false;
    } else {
        ratingError.textContent = '';
    }

    // Проверка текста
    const textarea = document.getElementById('reviewText');
    const textError = document.getElementById('textError');

    if (textarea.value.length < MIN_REVIEW_LENGTH) {
        textError.textContent = I18n.t('reviews.textTooShort') || `Минимум ${MIN_REVIEW_LENGTH} символов`;
        isValid = false;
    } else {
        textError.textContent = '';
    }

    return isValid;
}

// Отправка отзыва
async function submitReview(e) {
    e.preventDefault();

    if (!validateForm()) {
        showNotification(I18n.t('reviews.fillAllFields') || 'Заполните все поля корректно', 'error');
        return;
    }

    const productId = parseInt(document.getElementById('productSelect').value);
    const product = purchasedProducts.find(p => p.id === productId);

    if (!product) {
        showNotification(I18n.t('reviews.productNotFound') || 'Товар не найден', 'error');
        return;
    }

    const review = {
        id: Date.now(),
        productId: productId,
        productName: product.name_i18n.ru,
        productImage: product.image,
        userId: currentUser.id,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        userEmail: currentUser.email,
        rating: selectedRating,
        text: document.getElementById('reviewText').value,
        date: new Date().toISOString(),
        verified: true // Товар был куплен
    };

    try {
        // Сохраняем отзыв
        const reviews = getReviews();
        reviews.unshift(review); // Добавляем в начало
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));

        showNotification(I18n.t('reviews.success') || 'Отзыв успешно отправлен!', 'success');

        // Очищаем форму
        document.getElementById('reviewForm').reset();
        document.getElementById('charCount').textContent = '0';
        selectedRating = 0;
        document.querySelectorAll('.rating-input .star').forEach(s => s.classList.remove('active'));

        // Перезагружаем список отзывов
        loadReviews();

    } catch (error) {
        console.error('Error saving review:', error);
        showNotification(I18n.t('reviews.saveError') || 'Ошибка сохранения отзыва', 'error');
    }
}

// Получение отзывов
function getReviews() {
    const saved = localStorage.getItem(REVIEWS_KEY);
    return saved ? JSON.parse(saved) : [];
}

// Отображение отзывов
function loadReviews() {
    const container = document.getElementById('reviewsList');
    const reviews = getReviews();

    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="reviews-empty">
                <svg width="48" height="48" viewBox="0 0 20 20" fill="none">
                    <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" fill="currentColor"/>
                </svg>
                <p data-i18n="reviews.noReviews">Пока нет отзывов</p>
            </div>
        `;
        return;
    }

    container.innerHTML = reviews.map(review => {
        const date = new Date(review.date);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

        return `
            <div class="review-card" data-animate>
                <div class="review-card__header">
                    <div>
                        <h3 class="review-card__product">${review.productName}</h3>
                        <div class="review-card__rating">${stars}</div>
                    </div>
                    <div class="review-card__meta">
                        <span class="review-card__author">${review.userName}</span>
                        <span class="review-card__date">${formattedDate}</span>
                    </div>
                </div>
                <p class="review-card__text">${review.text}</p>
                ${review.verified ? `
                    <div class="review-card__verified">
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 11l-4-4 1.4-1.4 2.6 2.6 5.6-5.6L16 10l-7 7z" fill="currentColor"/>
                        </svg>
                        <span data-i18n="reviews.verified">Проверенная покупка</span>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;

    loadPurchasedProducts();
    initRating();
    initCharCounter();
    loadReviews();

    document.getElementById('reviewForm').addEventListener('submit', submitReview);
});