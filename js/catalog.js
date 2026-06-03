// Глобальный массив товаров, загруженных с сервера
let products = [];

// ====== ЗАГРУЗКА ДАННЫХ С JSON SERVER ======
async function loadProducts() {
    const response = await fetch("http://localhost:3000/products");
    products = await response.json();
    renderProducts(products);
}

// ====== ОТРИСОВКА КАРТОЧЕК ======
function renderProducts(items) {
    const container = document.getElementById("productsContainer");
    const notFound = document.getElementById("notFound");

    container.innerHTML = "";

    if (items.length === 0) {
        notFound.style.display = "block";
        return;
    }

    notFound.style.display = "none";

    items.forEach(product => {
        const name = product.name_i18n?.ru || product.name_i18n?.en || "—";
        const description = product.description_i18n?.ru || product.description_i18n?.en || "—";

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
                    <p class="product-card__stock">
                        ${product.inStock ? "В наличии" : "Нет в наличии"}
                    </p>
                </div>
            </div>
        `;
    });
}

// ====== ЭТАП 3: ПОИСК ======
document.getElementById("searchInput").addEventListener("input", function () {
    const value = this.value.toLowerCase();

    const filtered = products.filter(p => {
        const name = (p.name_i18n?.ru || "").toLowerCase();
        const desc = (p.description_i18n?.ru || "").toLowerCase();
        return name.includes(value) || desc.includes(value);
    });

    renderProducts(filtered);
});

// ====== ЭТАП 3: СОРТИРОВКА (выпадающий список) ======
document.getElementById("sortSelect").addEventListener("change", function () {
    let sorted = [...products];

    if (this.value === "price") {
        sorted.sort((a, b) => a.price - b.price);
    } else if (this.value === "title") {
        sorted.sort((a, b) =>
            (a.name_i18n?.ru || "").localeCompare(b.name_i18n?.ru || "")
        );
    } else if (this.value === "rating") {
        sorted.sort((a, b) => b.rating - a.rating);
    }

    renderProducts(sorted);
});

// ====== ЭТАП 3: ФИЛЬТР ПО КАТЕГОРИЯМ ======
document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
        const category = button.dataset.category;

        if (category === "all") {
            renderProducts(products);
            return;
        }

        // filter — метод 1
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    });
});

// ====== ЭТАП 2: 10 КНОПОК — РАЗНЫЕ МЕТОДЫ МАССИВОВ ======
document.querySelectorAll(".action-btn").forEach(button => {
    button.addEventListener("click", () => {
        const action = button.dataset.action;
        let result = [];

        switch (action) {

            // 1. filter — товары дешевле 100 000
            case "cheap":
                result = products.filter(p => p.price < 100000);
                break;

            // 2. filter — товары дороже 100 000
            // Используем reduce чтобы не повторять filter
            // reduce — собираем только дорогие товары вручную
            case "expensive":
                result = products.reduce((acc, p) => {
                    if (p.price > 100000) acc.push(p);
                    return acc;
                }, []);
                break;

            // 3. map — добавляем метку "NEW!" к названию новинок
            case "new":
                result = products
                    .filter(p => p.isNew)
                    .map(p => ({
                        ...p,
                        name_i18n: {
                            ...p.name_i18n,
                            ru: "🆕 " + p.name_i18n.ru
                        }
                    }));
                break;

            // 4. sort — по алфавиту
            case "alphabet":
                result = [...products].sort((a, b) =>
                    (a.name_i18n?.ru || "").localeCompare(b.name_i18n?.ru || "")
                );
                break;

            // 5. reverse — обратный порядок
            case "reverse":
                result = [...products].reverse();
                break;

            // 6. slice — первые 5
            case "firstFive":
                result = products.slice(0, 5);
                break;

            // 7. slice — последние 5
            case "lastFive":
                result = products.slice(-5);
                break;

            // 8. find — найти самый дорогой товар и показать только его
            case "mostExpensive": {
                const found = products.reduce((max, p) =>
                    p.price > max.price ? p : max
                , products[0]);
                result = found ? [found] : [];
                break;
            }

            // 9. every/some — только товары в наличии (some использован для проверки,
            //    every — проверяем что все найденные действительно inStock)
            case "inStock": {
                const inStockItems = products.filter(p => p.inStock);
                const allInStock = inStockItems.every(p => p.inStock); // every
                const hasAny = products.some(p => p.inStock);          // some
                console.log("Все найденные в наличии:", allInStock);
                console.log("Есть хоть один в наличии:", hasAny);
                result = inStockItems;
                break;
            }

            // 10. map — скидка 10%, цены пересчитываются
            case "discount":
                result = products.map(p => ({
                    ...p,
                    price: Math.floor(p.price * 0.9),
                    name_i18n: {
                        ...p.name_i18n,
                        ru: p.name_i18n.ru + " (-10%)"
                    }
                }));
                break;

            // Сброс
            case "all":
                result = products;
                break;
        }

        renderProducts(result);
    });
});

// ====== СТАРТ ======
loadProducts();
                        
