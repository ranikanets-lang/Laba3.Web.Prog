const user = JSON.parse(
localStorage.getItem("currentUser")
);

if (!user || user.role !== "admin") {

alert("Access denied");

window.location.href = "index.html";

}

loadProducts();
loadFeedback();

async function loadProducts() {

const response = await fetch(
    "http://localhost:3000/products"
);

const products = await response.json();

const container =
    document.getElementById("productsList");

container.innerHTML = "";

products.forEach(product => {

    container.innerHTML += `
        <div>

            <b>
                ${product.name_i18n?.ru || product.title}
            </b>

            <button
                onclick="deleteProduct(${product.id})"
            >
                Delete
            </button>

        </div>
    `;
});

}

async function deleteProduct(id) {

await fetch(
    `http://localhost:3000/products/${id}`,
    {
        method: "DELETE"
    }
);

loadProducts();

}

document
.getElementById("productForm")
.addEventListener("submit", async e => {

    e.preventDefault();

    const product = {

        title:
            document.getElementById("title").value,

        price:
            Number(
                document.getElementById("price").value
            ),

        category:
            document.getElementById("category").value
    };

    await fetch(
        "http://localhost:3000/products",
        {
            method: "POST",
            headers: {
                "Content-Type":
                "application/json"
            },
            body: JSON.stringify(product)
        }
    );

    loadProducts();
});

async function loadFeedback() {

const response = await fetch(
    "http://localhost:3000/feedback"
);

const feedback =
    await response.json();

const container =
    document.getElementById("feedbackList");

container.innerHTML = "";

feedback.forEach(item => {

    container.innerHTML += `
        <div>

            <b>${item.nickname}</b>

            <p>${item.text}</p>

            <button
                onclick="deleteFeedback(${item.id})"
            >
                Delete
            </button>

        </div>
    `;
});

}

async function deleteFeedback(id) {

await fetch(
    `http://localhost:3000/feedback/${id}`,
    {
        method: "DELETE"
    }
);

loadFeedback();

}
