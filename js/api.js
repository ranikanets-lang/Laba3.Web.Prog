const API = {
    baseURL: 'http://localhost:3000', // JSON Server

    async fetch(endpoint, params = {}) {
        const url = new URL(`${this.baseURL}${endpoint}`);

        // Добавляем параметры запроса
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value);
            }
        });

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error fetching ${endpoint}:`, error);
            // Возвращаем пустой массив при ошибке, чтобы не ломать интерфейс
            return [];
        }
    },

    async getProducts(filters = {}) {
        const params = {};

        if (filters.category) params.category = filters.category;
        if (filters.isNew !== undefined) params.isNew = filters.isNew;
        if (filters.inStock !== undefined) params.inStock = filters.inStock;
        if (filters.limit) params._limit = filters.limit;
        if (filters.sort) params._sort = filters.sort;
        if (filters.order) params._order = filters.order;

        return await this.fetch('/products', params);
    },

    async getProductById(id) {
        return await this.fetch(`/products/${id}`);
    },

    async getCategories() {
        const products = await this.getProducts();
        const categories = [...new Set(products.map(p => p.category))];
        return categories.map(cat => ({
            id: cat,
            name: this.getCategoryName(cat)
        }));
    },

    getCategoryName(cat) {
        const names = {
            watches: 'Часы',
            belts: 'Ремни',
            wallets: 'Кошельки',
            accessories: 'Аксессуары'
        };
        return names[cat] || cat;
    },


    async createProduct(product) {
        const response = await fetch(`${this.baseURL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        return await response.json();
    },

    async updateProduct(id, data) {
        const response = await fetch(`${this.baseURL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    async deleteProduct(id) {
        const response = await fetch(`${this.baseURL}/products/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    },

    async createOrder(orderData) {
        const response = await fetch(`${this.baseURL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        return await response.json();
    },

    async getUserOrders(userId) {
        const response = await fetch(`${this.baseURL}/orders?userId=${userId}`);
        return await response.json();
    },

    async updateOrder(id, data) {
        const response = await fetch(`${this.baseURL}/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    async getOrders() {
        const response = await fetch(`${this.baseURL}/orders`);
        return await response.json();
    },

    async deleteOrder(id) {
        const response = await fetch(`${this.baseURL}/orders/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    },

    async getUsers() {
        const response = await fetch(`${this.baseURL}/users`);
        return await response.json();
    },

    async deleteUser(id) {
        const response = await fetch(`${this.baseURL}/users/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    },

    async getReviews() {
        const response = await fetch(`${this.baseURL}/reviews`);
        return await response.json();
    },

    async deleteReview(id) {
        const response = await fetch(`${this.baseURL}/reviews/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    },

};

export default API;