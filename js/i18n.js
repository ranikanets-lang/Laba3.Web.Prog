const translations = {
    ru: {
        'meta.title': 'PORTEN — Мужские аксессуары премиум-класса | Санкт-Петербург',
        'meta.description': 'PORTEN — элитные мужские аксессуары в Санкт-Петербурге. Часы, ремни, кошельки премиум-класса.',
        'header.catalog': 'Каталог',
        'header.about': 'О магазине',
        'header.contacts': 'Контакты',
        'header.location': 'Санкт-Петербург',
        'hero.subtitle': 'САНКТ-ПЕТЕРБУРГ',
        'hero.text': 'Мы предлагаем изысканные мужские аксессуары премиум-класса. Каждый предмет — это сочетание безупречного стиля и качества.',
        'season.title': 'СЕЗОН 2024/25',
        'collection.newTitle': 'НОВАЯ КОЛЛЕКЦИЯ',
        'collection.newText': 'Откройте для себя нашу новую коллекцию аксессуаров, созданную для современных мужчин.',
        'collection.viewCatalog': 'КАТАЛОГ',
        'collection.classicTitle': 'КОЛЛЕКЦИЯ 2024',
        'collection.classicText': 'Классические аксессуары для особых случаев. Идеальное дополнение к вашему гардеробу.',
        'collection.viewCollection': 'ПОСМОТРЕТЬ КОЛЛЕКЦИЮ',
        'newArrivals.title': 'НОВЫЕ ПОСТУПЛЕНИЯ',
        'brands.title': 'НАШИ БРЕНДЫ',
        'footer.aboutTitle': 'О МАГАЗИНЕ',
        'footer.aboutText': 'PORTEN — это бутик мужских аксессуаров премиум-класса в Санкт-Петербурге.',
        'footer.categoriesTitle': 'КАТЕГОРИИ',
        'footer.watches': 'Часы',
        'footer.belts': 'Ремни',
        'footer.wallets': 'Кошельки',
        'footer.accessories': 'Аксессуары',
        'footer.newsletterTitle': 'РАССЫЛКА',
        'footer.newsletterText': 'Подпишитесь, чтобы быть в курсе новинок.',
        'footer.emailPlaceholder': 'Ваш email',
        'footer.subscribe': 'ПОДПИСАТЬСЯ',
        'footer.copyright': '© 2025 PORTEN. Все права защищены.',
        'common.loading': 'Загрузка...',
        'common.currency': '₽',
        'common.inStock': 'В наличии',
        'common.outOfStock': 'Нет в наличии',
        'common.new': 'Новинка',
        'common.rating': 'Рейтинг',
        'common.reviews': 'отзывов'
    },
    en: {
        'meta.title': 'PORTEN — Premium Men\'s Accessories | St. Petersburg',
        'meta.description': 'PORTEN — luxury men\'s accessories in St. Petersburg. Watches, belts, wallets premium class.',
        'header.catalog': 'Catalog',
        'header.about': 'About',
        'header.contacts': 'Contacts',
        'header.location': 'St. Petersburg',
        'hero.subtitle': 'SAINT PETERSBURG',
        'hero.text': 'We offer exquisite premium men\'s accessories. Every item is a combination of impeccable style and quality.',
        'season.title': 'SEASON 2024/25',
        'collection.newTitle': 'NEW COLLECTION',
        'collection.newText': 'Discover our new collection of accessories, created for modern men.',
        'collection.viewCatalog': 'CATALOG',
        'collection.classicTitle': 'COLLECTION 2024',
        'collection.classicText': 'Classic accessories for special occasions. The perfect addition to your wardrobe.',
        'collection.viewCollection': 'VIEW COLLECTION',
        'newArrivals.title': 'NEW ARRIVALS',
        'brands.title': 'OUR BRANDS',
        'footer.aboutTitle': 'ABOUT STORE',
        'footer.aboutText': 'PORTEN is a boutique of premium men\'s accessories in St. Petersburg.',
        'footer.categoriesTitle': 'CATEGORIES',
        'footer.watches': 'Watches',
        'footer.belts': 'Belts',
        'footer.wallets': 'Wallets',
        'footer.accessories': 'Accessories',
        'footer.newsletterTitle': 'NEWSLETTER',
        'footer.newsletterText': 'Subscribe to stay up to date with new arrivals.',
        'footer.emailPlaceholder': 'Your email',
        'footer.subscribe': 'SUBSCRIBE',
        'footer.copyright': '© 2025 PORTEN. All rights reserved.',
        'common.loading': 'Loading...',
        'common.currency': '₽',
        'common.inStock': 'In Stock',
        'common.outOfStock': 'Out of Stock',
        'common.new': 'New',
        'common.rating': 'Rating',
        'common.reviews': 'reviews'
    }
};

class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('lang') || 'ru';
    }

    init() {
        this.applyTranslations();
    }

    setLanguage(lang) {
        if (translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('lang', lang);
            this.applyTranslations();
            if (window.renderProducts) window.renderProducts();
        }
    }

    t(key) {
        return translations[this.currentLang]?.[key] || key;
    }

    applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[this.currentLang]?.[key]) {
                el.textContent = translations[this.currentLang][key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[this.currentLang]?.[key]) {
                el.placeholder = translations[this.currentLang][key];
            }
        });

        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            if (translations[this.currentLang]?.[key]) {
                el.setAttribute('aria-label', translations[this.currentLang][key]);
            }
        });
    }
}

export default new I18n();
