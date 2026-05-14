const API = {
    baseURL: 'http://localhost:3000',

    async fetch(endpoint, params = {}) {
        const url = new URL(`${this.baseURL}${endpoint}`);
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value);
            }
        });

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            return [];
        }
    },

    async getProducts(filters = {}) {
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.isNew) params.isNew = filters.isNew;
        if (filters.inStock !== undefined) params.inStock = filters.inStock;
        if (filters.sort) params._sort = filters.sort;
        if (filters.order) params._order = filters.order;
        if (filters.limit) params._limit = filters.limit;

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
            name_i18n: {
                ru: this.getCategoryNameRu(cat),
                en: this.getCategoryNameEn(cat)
            }
        }));
    },

    getCategoryNameRu(cat) {
        const names = {
            watches: 'Часы',
            belts: 'Ремни',
            wallets: 'Кошельки',
            accessories: 'Аксессуары'
        };
        return names[cat] || cat;
    },

    getCategoryNameEn(cat) {
        const names = {
            watches: 'Watches',
            belts: 'Belts',
            wallets: 'Wallets',
            accessories: 'Accessories'
        };
        return names[cat] || cat;
    }
};

export default API;
