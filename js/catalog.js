// ====================================================
// МАССИВ ТОВАРОВ — 15 объектов, 6+ полей каждый
// Используются только фото из папки assets/images/
// ====================================================
let products = [
    {
        id: 1,
        name_i18n: { ru: "Louis XVI ATHOS" },
        description_i18n: { ru: "Элегантные часы с механическим заводом в корпусе из нержавеющей стали." },
        price: 165000,
        category: "watches",
        image: "assets/images/watches/watch-1.jpg",
        inStock: true,
        isNew: true,
        rating: 4.9,
        reviews: 24
    },
    {
        id: 2,
        name_i18n: { ru: "Montblanc Heritage" },
        description_i18n: { ru: "Классические часы с кожаным ремешком и сапфировым стеклом." },
        price: 245000,
        category: "watches",
        image: "assets/images/watches/watch-2.jpg",
        inStock: true,
        isNew: false,
        rating: 4.8,
        reviews: 18
    },
    {
        id: 3,
        name_i18n: { ru: "Tissot PRX Powermatic" },
        description_i18n: { ru: "Спортивные часы с автоматическим механизмом и водозащитой 100м." },
        price: 89000,
        category: "watches",
        image: "assets/images/watches/watch-3.jpg",
        inStock: true,
        isNew: true,
        rating: 4.7,
        reviews: 31
    },
    {
        id: 4,
        name_i18n: { ru: "Hamilton Khaki Field" },
        description_i18n: { ru: "Тактические часы в стиле милитари с люминесцентными стрелками." },
        price: 112000,
        category: "watches",
        image: "assets/images/watches/watch-4.jpg",
        inStock: false,
        isNew: false,
        rating: 4.6,
        reviews: 15
    },
    {
        id: 5,
        name_i18n: { ru: "Seiko Presage Cocktail" },
        description_i18n: { ru: "Японские автоматические часы с перламутровым циферблатом." },
        price: 67000,
        category: "watches",
        image: "assets/images/watches/watch-1.png",
        inStock: true,
        isNew: true,
        rating: 4.7,
        reviews: 45
    },
    {
        id: 6,
        name_i18n: { ru: "Orient Bambino Open Heart" },
        description_i18n: { ru: "Часы с открытым механизмом в классическом ретро-корпусе." },
        price: 43000,
        category: "watches",
        image: "assets/images/watches/watch-2.jpg",
        inStock: true,
        isNew: false,
        rating: 4.8,
        reviews: 52
    },
    {
        id: 7,
        name_i18n: { ru: "Citizen Eco-Drive Titanium" },
        description_i18n: { ru: "Лёгкие титановые часы на солнечной батарее, без замены батарейки." },
        price: 54000,
        category: "watches",
        image: "assets/images/watches/watch-3.jpg",
        inStock: false,
        isNew: false,
        rating: 4.5,
        reviews: 38
    },
    {
        id: 8,
        name_i18n: { ru: "Ремень Italian Leather" },
        description_i18n: { ru: "Ремень из натуральной итальянской кожи с классической пряжкой." },
        price: 12500,
        category: "belts",
        image: "assets/images/belts/belt-1.jpg",
        inStock: true,
        isNew: false,
        rating: 4.9,
        reviews: 42
    },
    {
        id: 9,
        name_i18n: { ru: "Ремень Suede Classic" },
        description_i18n: { ru: "Замшевый ремень ручной работы с минималистичной пряжкой." },
        price: 8900,
        category: "belts",
        image: "assets/images/belts/belt-2.jpg",
        inStock: true,
        isNew: true,
        rating: 4.5,
        reviews: 28
    },
    {
        id: 10,
        name_i18n: { ru: "Ремень Reversible Two-Tone" },
        description_i18n: { ru: "Двусторонний ремень: чёрный и коричневый в одном изделии." },
        price: 9800,
        category: "belts",
        image: "assets/images/belts/belt-1.jpg",
        inStock: true,
        isNew: true,
        rating: 4.6,
        reviews: 33
    },
    {
        id: 11,
        name_i18n: { ru: "Ремень Braided Canvas" },
        description_i18n: { ru: "Плетёный холщовый ремень в морском стиле, унисекс." },
        price: 5500,
        category: "belts",
        image: "assets/images/belts/belt-2.jpg",
        inStock: false,
        isNew: false,
        rating: 4.2,
        reviews: 17
    },
    {
        id: 12,
        name_i18n: { ru: "Кошелёк Bifold Premium" },
        description_i18n: { ru: "Компактный кошелёк из телячьей кожи с отделением для монет." },
        price: 15900,
        category: "wallets",
        image: "assets/images/wallets/wallet-1.jpg",
        inStock: true,
        isNew: false,
        rating: 4.8,
        reviews: 36
    },
    {
        id: 13,
        name_i18n: { ru: "Кошелёк Cardholder Slim" },
        description_i18n: { ru: "Ультратонкий держатель для карт из эко-кожи." },
        price: 6500,
        category: "wallets",
        image: "assets/images/wallets/wallet-2.jpg",
        inStock: true,
        isNew: true,
        rating: 4.4,
        reviews: 19
    },
    {
        id: 14,
        name_i18n: { ru: "Кошелёк Trifold Ostrich" },
        description_i18n: { ru: "Трёхсекционный кошелёк из кожи страуса — редкий материал." },
        price: 38000,
        category: "wallets",
        image: "assets/images/wallets/wallet-1.jpg",
        inStock: true,
        isNew: false,
        rating: 4.6,
        reviews: 11
    },
    {
        id: 15,
        name_i18n: { ru: "Портмоне Travel Zip" },
        description_i18n: { ru: "Большой дорожный кошелёк на молнии с отделом для паспорта." },
        price: 22000,
        category: "wallets",
        image: "assets/images/wallets/wallet-2.jpg",
        inStock: false,
        isNew: true,
        rating: 4.7,
        reviews: 29
    }
];

// ЭТАП 1: ОТРИСОВКА КАРТОЧЕК ТОВАРОВ

function renderProducts(items) {
    var container = document.getElementById("productsContainer");
    var notFound = document.getElementById("notFound");

    // Очищаем контейнер перед отрисовкой
    container.innerHTML = "";

    // Если массив пустой — показываем сообщение "не найдено"
    if (items.length === 0) {
        notFound.style.display = "block";
        return;
    }

    notFound.style.display = "none";

    // Перебираем каждый товар и создаём карточку
    items.forEach(function(product) {
        var name = product.name_i18n.ru;
        var description = product.description_i18n.ru;
        var stockText = product.inStock ? "В наличии" : "Нет в наличии";
        var stockColor = product.inStock ? "green" : "red";

        container.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${name}" class="product-card__image">
                <div class="product-card__content">
                    <h3 class="product-card__title">${name}</h3>
                    <p class="product-card__description">${description}</p>
                    <div class="product-card__footer">
                        <span class="product-card__price">${product.price.toLocaleString("ru-RU")} ₽</span>
                        <span class="product-card__rating">⭐ ${product.rating}</span>
                    </div>
                    <p class="product-card__stock" style="color: ${stockColor}">
                        ${stockText}
                    </p>
                </div>
            </div>
        `;
    });
}

// ЭТАП 3: ПОИСК ПО НАЗВАНИЮ И ОПИСАНИЮ
document.getElementById("searchInput").addEventListener("input", function() {
    var value = this.value.toLowerCase();

    // filter — оставляем только те товары, которые совпадают с поиском
    var filtered = products.filter(function(p) {
        var name = p.name_i18n.ru.toLowerCase();
        var desc = p.description_i18n.ru.toLowerCase();
        return name.includes(value) || desc.includes(value);
    });

    renderProducts(filtered);
});

// ЭТАП 3: СОРТИРОВКА ЧЕРЕЗ ВЫПАДАЮЩИЙ СПИСОК
document.getElementById("sortSelect").addEventListener("change", function() {
    // Создаём копию массива, чтобы не менять оригинал
    var sorted = products.slice();

    if (this.value === "price") {
        // sort по цене — от дешёвого к дорогому
        sorted.sort(function(a, b) {
            return a.price - b.price;
        });
    } else if (this.value === "title") {
        // sort по названию — алфавитный порядок
        sorted.sort(function(a, b) {
            return a.name_i18n.ru.localeCompare(b.name_i18n.ru);
        });
    } else if (this.value === "rating") {
        // sort по рейтингу — от высокого к низкому
        sorted.sort(function(a, b) {
            return b.rating - a.rating;
        });
    } else {
        // Значение не выбрано — показываем всё
        sorted = products;
    }

    renderProducts(sorted);
});

// ====================================================
// ЭТАП 3: ФИЛЬТР ПО КАТЕГОРИЯМ (кнопки)
// ====================================================
document.querySelectorAll(".category-btn").forEach(function(button) {
    button.addEventListener("click", function() {
        var category = button.dataset.category;

        if (category === "all") {
            // Показываем все товары
            renderProducts(products);
            return;
        }

        // filter — оставляем только нужную категорию
        var filtered = products.filter(function(p) {
            return p.category === category;
        });

        renderProducts(filtered);
    });
});

// ====================================================
// ЭТАП 2: 10 КНОПОК — КАЖДАЯ ИСПОЛЬЗУЕТ СВОЙ МЕТОД
// ====================================================
document.querySelectorAll(".action-btn").forEach(function(button) {
    button.addEventListener("click", function() {
        var action = button.dataset.action;
        var result = [];

        switch (action) {

            // Кнопка 1: filter — товары дешевле 100 000 ₽
            case "cheap":
                result = products.filter(function(p) {
                    return p.price < 100000;
                });
                break;

            // Кнопка 2: reduce — собираем товары дороже 100 000 ₽
            case "expensive":
                result = products.reduce(function(acc, p) {
                    if (p.price > 100000) {
                        acc.push(p);
                    }
                    return acc;
                }, []);
                break;

            // Кнопка 3: filter + map — добавляем метку 🆕 к новинкам
            case "new":
                result = products
                    .filter(function(p) {
                        return p.isNew === true;
                    })
                    .map(function(p) {
                        return Object.assign({}, p, {
                            name_i18n: { ru: "🆕 " + p.name_i18n.ru }
                        });
                    });
                break;

            // Кнопка 4: sort — по алфавиту (А → Я)
            case "alphabet":
                result = products.slice().sort(function(a, b) {
                    return a.name_i18n.ru.localeCompare(b.name_i18n.ru);
                });
                break;

            // Кнопка 5: reverse — обратный порядок
            case "reverse":
                result = products.slice().reverse();
                break;

            // Кнопка 6: slice — первые 5 товаров
            case "firstFive":
                result = products.slice(0, 5);
                break;

            // Кнопка 7: slice — последние 5 товаров
            case "lastFive":
                result = products.slice(-5);
                break;

            // Кнопка 8: reduce — найти самый дорогой товар
            case "mostExpensive":
                var maxItem = products.reduce(function(max, p) {
                    return p.price > max.price ? p : max;
                }, products[0]);
                result = maxItem ? [maxItem] : [];
                break;

            // Кнопка 9: some + every — товары в наличии
            //   some  — проверяем, есть ли вообще товары в наличии
            //   every — проверяем, что все отфильтрованные точно inStock
            case "inStock":
                var hasAny = products.some(function(p) {
                    return p.inStock === true;
                });
                console.log("Есть хоть один товар в наличии (some):", hasAny);

                result = products.filter(function(p) {
                    return p.inStock === true;
                });

                var allTrue = result.every(function(p) {
                    return p.inStock === true;
                });
                console.log("Все найденные точно в наличии (every):", allTrue);
                break;

            // Кнопка 10: map — скидка 10% на все товары
            case "discount":
                result = products.map(function(p) {
                    return Object.assign({}, p, {
                        price: Math.floor(p.price * 0.9),
                        name_i18n: { ru: p.name_i18n.ru + " (-10%)" }
                    });
                });
                break;

            // Кнопка «Сбросить» — показать все товары
            case "all":
                result = products;
                break;
        }

        renderProducts(result);
    });
});

// ====================================================
// СТАРТ — отображаем все товары при открытии страницы
// ====================================================
renderProducts(products);
