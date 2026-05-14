class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateButtons();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.currentTheme);
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateButtons();
    }

    updateButtons() {
        document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
            const theme = btn.getAttribute('data-theme-toggle');
            btn.classList.toggle('active', theme === this.currentTheme);
        });
    }
}

export default new ThemeManager();
