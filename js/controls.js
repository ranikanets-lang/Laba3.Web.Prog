// Language and Theme Controls
class Controls {
    constructor() {
        this.langToggle = document.getElementById('langToggle');
        this.themeToggle = document.getElementById('themeToggle');
        this.currentLangEl = document.getElementById('currentLang');

        this.currentLang = localStorage.getItem('lang') || 'ru';
        this.currentTheme = localStorage.getItem('theme') || 'dark';

        this.init();
    }

    init() {
        // Apply saved theme
        this.applyTheme();

        // Update language display
        this.updateLangDisplay();

        // Language toggle click
        this.langToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleLangDropdown();
        });

        // Theme toggle click
        this.themeToggle?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Close dropdown on outside click
        document.addEventListener('click', () => {
            this.closeLangDropdown();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLangDropdown();
            }
        });
    }

    toggleLangDropdown() {
        const dropdown = this.langToggle?.querySelector('.lang-switcher__dropdown');
        if (!dropdown) {
            this.createLangDropdown();
            return;
        }
        dropdown.classList.toggle('active');
    }

    closeLangDropdown() {
        const dropdown = this.langToggle?.querySelector('.lang-switcher__dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }

    createLangDropdown() {
        const existing = this.langToggle?.querySelector('.lang-switcher__dropdown');
        if (existing) existing.remove();

        const dropdown = document.createElement('div');
        dropdown.className = 'lang-switcher__dropdown';

        const languages = [
            { code: 'ru', flag: '🇷🇺', name: 'Русский' },
            { code: 'en', flag: '🇬', name: 'English' }
        ];

        languages.forEach(lang => {
            const btn = document.createElement('button');
            btn.className = `lang-switcher__option ${lang.code === this.currentLang ? 'active' : ''}`;
            btn.innerHTML = `<span>${lang.flag}</span><span>${lang.name}</span>`;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setLanguage(lang.code);
            });
            dropdown.appendChild(btn);
        });

        this.langToggle?.appendChild(dropdown);

        // Trigger reflow for animation
        void dropdown.offsetWidth;
        dropdown.classList.add('active');
    }

    setLanguage(lang) {
        if (lang === this.currentLang) {
            this.closeLangDropdown();
            return;
        }

        this.currentLang = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;

        this.updateLangDisplay();
        this.closeLangDropdown();

        // Apply translations
        if (window.I18nInstance) {
            window.I18nInstance.setLanguage(lang);
        }

        // Re-render products if exists
        if (window.renderProducts) {
            window.renderProducts();
        }

        console.log(`🌐 Language changed to: ${lang}`);
    }

    updateLangDisplay() {
        if (this.currentLangEl) {
            this.currentLangEl.textContent = this.currentLang.toUpperCase();
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();

        console.log(`🎨 Theme changed to: ${this.currentTheme}`);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);

        // Update meta theme-color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', this.currentTheme === 'dark' ? '#1a1a1a' : '#ffffff');
        }
    }
}

// Initialize controls
document.addEventListener('DOMContentLoaded', () => {
    window.controls = new Controls();
});