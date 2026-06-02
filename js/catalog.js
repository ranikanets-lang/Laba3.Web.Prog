let products = [];

async function loadProducts() {
    const response = await fetch(
        "http://localhost:3000",
    );

    products = await response.json();

    renderProducts(products);
}

function renderProducts(products) {
    const container = document.getElementById("container");

    container.innerHTML = "";

    products.forEach(product => {
        container.innerHTML += 
            <div class="card">
                <h2>${product.name_i18n.ru}</h2>
                <p>${product.description_i18n.ru}</p>
                <span>${product.price} ₽</span>
            </div>
        ;
    });
}

loadProducts();
const container = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const notFound = document.getElementById("notFound");

function renderProducts(items) {

    container.innerHTML = "";

    if(items.length === 0){
        notFound.style.display = "block";
        return;
    }

    notFound.style.display = "none";

    items.forEach(product => {

        container.innerHTML += `
        
        <div class="product-card">
        
            <img src="${product.image}" class="product-card__image">
            
            <div class="product-card__content">
            
                <h3 class="product-card__title">
                    ${product.title}
                </h3>
                
                <p class="product-card__description">
                    ${product.description}
                </p>
                
                <div class="product-card__footer">
                
                    <span class="product-card__price">
                        ${product.price} ₽
                    </span>
                    
                    <span class="product-card__rating">
                        ⭐ ${product.rating}
                    </span>
                    
                </div>
                
            </div>
            
        </div>
        `;
    });
}

renderProducts(products);

searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase();

    const filtered = products.filter(product =>
        product.title.toLowerCase().includes(value) ||
        product.description.toLowerCase().includes(value)
    );

    renderProducts(filtered);
});

sortSelect.addEventListener("change", () => {

    let sorted = [...products];

    if(sortSelect.value === "price"){
        sorted.sort((a,b) => a.price - b.price);
    }

    if(sortSelect.value === "title"){
        sorted.sort((a,b) => a.title.localeCompare(b.title));
    }

    if(sortSelect.value === "rating"){
        sorted.sort((a,b) => b.rating - a.rating);
    }

    renderProducts(sorted);
});

document.querySelectorAll(".category-btn").forEach(button => {

    button.addEventListener("click", () => {

        const category = button.dataset.category;

        if(category === "all"){
            renderProducts(products);
            return;
        }

        const filtered = products.filter(product =>
            product.category === category
        );

        renderProducts(filtered);
    });
});

document.querySelectorAll(".action-btn").forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        let result = [...products];

        switch(action){

            case "cheap":
                result = products.filter(p => p.price < 100000);
                break;

            case "expensive":
                result = products.filter(p => p.price > 100000);
                break;

            case "top":
                result = products.filter(p => p.rating >= 5);
                break;

            case "new":
                result = products.map(p => ({
                    ...p,
                    title: "NEW! " + p.title
                }));
                break;

            case "reverse":
                result.reverse();
                break;

            case "firstFive":
                result = products.slice(0,5);
                break;

            case "lastFive":
                result = products.slice(-5);
                break;

            case "alphabet":
                result.sort((a,b) => a.title.localeCompare(b.title));
                break;

            case "discount":
                result = products.map(p => ({
                    ...p,
                    price: Math.floor(p.price * 0.9)
                }));
                break;

            case "all":
                result = products;
                break;
        }

        renderProducts(result);
    });
});
