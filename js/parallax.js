// Parallax Effect
class ParallaxEffect {
    constructor() {
        this.section = document.getElementById('parallaxSection');
        this.layers = this.section?.querySelectorAll('.parallax-layer');
        this.ticking = false;

        // 🔥 Проверка наличия элементов
        if (!this.section) {
            console.error('❌ parallaxSection not found');
            return;
        }

        if (!this.layers || this.layers.length === 0) {
            console.error('❌ No parallax layers found');
            return;
        }

        console.log('✅ ParallaxEffect initialized with', this.layers.length, 'layers');

        // 🔥 Логирование слоев
        this.layers.forEach((layer, index) => {
            const speed = layer.dataset.speed;
            console.log(`Layer ${index}:`, {
                class: layer.className,
                speed: speed,
                hasImage: !!layer.querySelector('img')
            });
        });

        this.init();
    }

    init() {
        // Обновление при скролле
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.update();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });

        // Обновление при изменении размера окна
        window.addEventListener('resize', () => {
            this.update();
        });

        // Начальное обновление
        setTimeout(() => this.update(), 100);
    }

    update() {
        if (!this.section) return;

        const sectionTop = this.section.offsetTop;
        const sectionHeight = this.section.offsetHeight;
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;

        // Проверка: секция в видимой области
        const sectionBottom = sectionTop + sectionHeight;
        const isInView = scrollTop + windowHeight > sectionTop && scrollTop < sectionBottom;

        if (!isInView) {
            // 🔥 Сброс transform если секция не видна
            this.layers.forEach(layer => {
                layer.style.transform = 'translate3d(0, 0, 0)';
            });
            return;
        }

        // 🔥 Вычисляем прогресс прокрутки секции (0 to 1)
        const scrolled = (scrollTop - sectionTop + windowHeight) / (sectionHeight + windowHeight);

        this.layers.forEach((layer, index) => {
            const speed = parseFloat(layer.dataset.speed) || 0.5;
            const yPos = -(scrolled * 500 * speed); // 🔥 Увеличиваем множитель для заметного эффекта

            // Применяем трансформацию
            layer.style.transform = `translate3d(0, ${yPos}px, 0)`;

            // 🔥 Лог для первого слоя
            if (index === 0 && scrolled < 0.1) {
                console.log('🎯 Parallax update:', {
                    layer: index,
                    speed: speed,
                    scrolled: scrolled.toFixed(2),
                    yPos: yPos.toFixed(2)
                });
            }
        });
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const parallaxSection = document.getElementById('parallaxSection');
    if (parallaxSection) {
        window.parallaxEffect = new ParallaxEffect(); // 🔥 Глобальный доступ
    } else {
        console.error('❌ Parallax section not found in DOM');
    }
});
