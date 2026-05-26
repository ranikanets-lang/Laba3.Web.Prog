const products = [
    {
        title: "Rolex Classic",
        description: "Элитные мужские часы",
        price: 165000,
        rating: 5,
        category: "Часы",
        image: "../assets/images/watches/watch-1.jpg"
    },

    {
        title: "Omega Silver",
        description: "Швейцарские часы",
        price: 120000,
        rating: 4,
        category: "Часы",
        image: "../assets/images/watches/watch-2.jpg"
    },

    {
        title: "Louis XVI",
        description: "Премиальные часы",
        price: 98000,
        rating: 5,
        category: "Часы",
        image: "../assets/images/watches/watch-3.jpg"
    },

    {
        title: "Black Belt",
        description: "Кожаный ремень",
        price: 15000,
        rating: 4,
        category: "Ремни",
        image: "../assets/images/watches/watch-4.jpg"
    },

    {
        title: "Premium Wallet",
        description: "Кожаный кошелек",
        price: 20000,
        rating: 5,
        category: "Кошельки",
        image: "../assets/images/watches/watch-1.jpg"
    },

    {
        title: "Business Watch",
        description: "Часы для бизнеса",
        price: 111000,
        rating: 4,
        category: "Часы",
        image: "../assets/images/watches/watch-2.jpg"
    },

    {
        title: "Luxury Belt",
        description: "Ремень класса люкс",
        price: 17000,
        rating: 5,
        category: "Ремни",
        image: "../assets/images/watches/watch-3.jpg"
    },

    {
        title: "Brown Wallet",
        description: "Коричневый кошелек",
        price: 13000,
        rating: 3,
        category: "Кошельки",
        image: "../assets/images/watches/watch-4.jpg"
    },

    {
        title: "Silver Watch",
        description: "Серебристые часы",
        price: 145000,
        rating: 5,
        category: "Часы",
        image: "../assets/images/watches/watch-1.jpg"
    },

    {
        title: "Classic Belt",
        description: "Классический ремень",
        price: 9000,
        rating: 4,
        category: "Ремни",
        image: "../assets/images/watches/watch-2.jpg"
    },

    {
        title: "Mini Wallet",
        description: "Компактный кошелек",
        price: 11000,
        rating: 3,
        category: "Кошельки",
        image: "../assets/images/watches/watch-3.jpg"
    },

    {
        title: "Gold Watch",
        description: "Золотые часы",
        price: 220000,
        rating: 5,
        category: "Часы",
        image: "../assets/images/watches/watch-4.jpg"
    },

    {
        title: "Leather Belt",
        description: "Натуральная кожа",
        price: 18000,
        rating: 4,
        category: "Ремни",
        image: "../assets/images/watches/watch-1.jpg"
    },

    {
        title: "Travel Wallet",
        description: "Для путешествий",
        price: 14000,
        rating: 4,
        category: "Кошельки",
        image: "../assets/images/watches/watch-2.jpg"
    },

    {
        title: "Modern Watch",
        description: "Современный дизайн",
        price: 175000,
        rating: 5,
        category: "Часы",
        image: "../assets/images/watches/watch-3.jpg"
    }
];

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
