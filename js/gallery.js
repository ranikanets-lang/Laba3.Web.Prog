// Interactive Media Gallery
class MediaGallery {
    constructor() {
        this.mainImage = document.getElementById('galleryMainImage');
        this.playerIndicator = document.getElementById('playerIndicator');
        this.volumeBtn = document.getElementById('volumeBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.triggers = document.querySelectorAll('[data-gallery-trigger]');
        this.videoTrigger = document.querySelector('[data-gallery-video]');
        this.videoModal = document.querySelector('[data-modal="video-modal"]');
        this.modalVideo = document.getElementById('modalVideo');

        // Ваши пути к изображениям (8 штук)
        this.images = [
            'assets/images/watches/watch-1.png',
            'assets/images/watches/watch-2.jpg',
            'assets/images/watches/watch-3.jpg',
            'assets/images/watches/watch-4.jpg',
            'assets/images/belts/belt-1.jpg',
            'assets/images/belts/belt-2.jpg',
            'assets/images/wallets/wallet-1.jpg',
            'assets/images/wallets/wallet-2.jpg'
        ];

        // Звуки с ленивой загрузкой
        this.sounds = [];
        this.soundsLoaded = false;

        this.currentSound = null;
        this.isPlaying = false;
        this.volume = 0.7;
        this.userInteracted = false; // 🔥 Флаг взаимодействия с пользователем

        // 🔥 Проверка наличия элементов
        if (!this.mainImage) {
            console.error('❌ galleryMainImage not found');
            return;
        }

        console.log('✅ MediaGallery initialized');
        this.init();
    }

    init() {
        // 🔥 Глобальная функция для тестирования звуков (требует клика)
        window.testSound = (index) => {
            this.loadAndPlaySound(index);
        };

        // 🔥 Глобальная функция для тестирования видео
        window.testVideo = () => {
            this.openVideoModal('assets/videos/promo.mp4');
        };

        // 🔥 Первый клик пользователя активирует аудио контекст
        document.addEventListener('click', () => {
            if (!this.userInteracted) {
                this.userInteracted = true;
                console.log('👆 User interaction detected - audio enabled');
            }
        }, { once: true });

        // Слайдер громкости
        this.volumeSlider?.addEventListener('input', (e) => {
            this.volume = e.target.value / 100;
            if (this.currentSound) {
                this.currentSound.volume = this.volume;
            }
        });

        // Кнопка mute/unmute
        this.volumeBtn?.addEventListener('click', () => {
            const isMuted = this.volume === 0 || (this.currentSound && this.currentSound.muted);
            const newVolume = isMuted ? 0.7 : 0;

            this.volume = newVolume;
            this.volumeSlider.value = isMuted ? 70 : 0;

            if (this.currentSound) {
                this.currentSound.volume = newVolume;
                this.currentSound.muted = !isMuted;
            }
        });

        // Триггеры галереи
        this.triggers.forEach((trigger, triggerIndex) => {
            trigger.addEventListener('click', () => {
                const index = parseInt(trigger.dataset.galleryTrigger) - 1;
                console.log('🖱️ Trigger clicked, index:', index);

                if (index >= 0 && index < this.images.length) {
                    this.changeImage(index);
                    this.triggers.forEach(t => t.classList.remove('active'));
                    trigger.classList.add('active');
                }
            });
        });

        // Видео-триггер
        this.videoTrigger?.addEventListener('click', () => {
            const videoSrc = this.videoTrigger.dataset.galleryVideo;
            console.log('🎬 Video trigger clicked, src:', videoSrc);

            if (videoSrc) {
                this.openVideoModal(videoSrc);
            }
        });

        // Закрытие видео-модалки
        const closeBtn = this.videoModal?.querySelector('[data-modal-close]');
        closeBtn?.addEventListener('click', () => this.closeVideoModal());

        // Закрытие по клику на оверлей
        this.videoModal?.addEventListener('click', (e) => {
            if (e.target === this.videoModal) {
                this.closeVideoModal();
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.videoModal && !this.videoModal.hidden) {
                this.closeVideoModal();
            }
        });
    }

    // 🔥 Метод для загрузки и воспроизведения звука
    loadAndPlaySound(index) {
        if (!this.userInteracted) {
            alert('👆 Нажмите в любом месте страницы для активации звуков');
            return;
        }

        if (index < 0 || index >= this.sounds.length) {
            console.error('Invalid sound index:', index);
            return;
        }

        // Остановка текущего звука
        if (this.currentSound) {
            this.currentSound.pause();
            this.currentSound.currentTime = 0;
        }

        // Создание или получение звука
        if (!this.sounds[index]) {
            const soundPath = `assets/sounds/sound-${index + 1}.mp3`;
            console.log('🔊 Loading sound:', soundPath);

            this.sounds[index] = new Audio(soundPath);
            this.sounds[index].volume = this.volume;

            // Обработчики событий
            this.sounds[index].addEventListener('error', (e) => {
                console.error(`❌ Sound ${index + 1} failed to load:`, e);
                alert(`Звук ${index + 1} не найден. Проверьте путь: assets/sounds/sound-${index + 1}.mp3`);
            });

            this.sounds[index].addEventListener('canplaythrough', () => {
                console.log(`✅ Sound ${index + 1} ready to play`);
            });
        }

        // Воспроизведение
        this.currentSound = this.sounds[index];
        this.currentSound.play()
            .then(() => {
                this.isPlaying = true;
                this.updatePlayerIndicator();
                console.log('🔊 Sound playing');
            })
            .catch(e => {
                console.error('❌ Sound play failed:', e);
                alert('Не удалось воспроизвести звук. Убедитесь, что файл существует.');
            });

        this.currentSound.onended = () => {
            this.isPlaying = false;
            this.updatePlayerIndicator();
        };
    }

    // 🔥 Метод открытия видео
    openVideoModal(videoSrc) {
        if (!this.modalVideo || !this.videoModal) {
            console.error('Video elements not found');
            return;
        }

        console.log('🎬 Opening video modal:', videoSrc);

        this.modalVideo.src = videoSrc;
        this.modalVideo.muted = false; // 🔥 Не mute для лучшего UX
        this.videoModal.classList.add('active');
        this.videoModal.hidden = false;
        document.body.classList.add('modal-open');

        // Попытка воспроизведения
        setTimeout(() => {
            this.modalVideo.play()
                .then(() => console.log('✅ Video playing'))
                .catch(e => {
                    console.warn('⚠️ Video autoplay blocked:', e);
                    // Показываем контролы если autoplay заблокирован
                    this.modalVideo.controls = true;
                });
        }, 300);
    }

    // 🔥 Метод закрытия видео
    closeVideoModal() {
        if (this.modalVideo) {
            this.modalVideo.pause();
            this.modalVideo.src = '';
        }
        if (this.videoModal) {
            this.videoModal.classList.remove('active');
            setTimeout(() => {
                this.videoModal.hidden = true;
            }, 300);
        }
        document.body.classList.remove('modal-open');
    }

    changeImage(index) {
        console.log('🖼️ Changing image to index:', index);

        // Fade out
        if (this.mainImage) {
            this.mainImage.classList.add('fade-out');
        }

        setTimeout(() => {
            // Смена изображения
            if (this.mainImage) {
                const newSrc = this.images[index] || this.images[0];
                console.log('🖼️ New image src:', newSrc);

                // Проверка загрузки изображения
                const img = new Image();
                img.onload = () => {
                    this.mainImage.src = newSrc;
                    console.log('✅ Image loaded successfully');
                };
                img.onerror = () => {
                    console.error('❌ Failed to load image:', newSrc);
                    alert(`Изображение не найдено: ${newSrc}`);
                };
                img.src = newSrc;
            }

            // Fade in
            if (this.mainImage) {
                this.mainImage.classList.remove('fade-out');
                this.mainImage.classList.add('fade-in');
                setTimeout(() => {
                    this.mainImage.classList.remove('fade-in');
                }, 500);
            }
        }, 500);
    }

    updatePlayerIndicator() {
        if (this.playerIndicator) {
            this.playerIndicator.classList.toggle('active', this.isPlaying);
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('mediaGallery')) {
        window.mediaGallery = new MediaGallery(); // 🔥 Глобальный доступ для отладки
    }
});