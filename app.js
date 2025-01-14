"use strict";
class WeddingCountdown {
    constructor(weddingDate) {
        this.weddingDate = weddingDate;
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        this.audio = document.getElementById('bgMusic');
        this.musicButton = document.getElementById('toggleMusic');
        this.countdownInterval = 0;
        this.init();
    }
    init() {
        this.setupMusicControl();
        this.startCountdown();
    }
    setupMusicControl() {
        this.musicButton.addEventListener('click', () => {
            if (this.audio.paused) {
                this.audio.play();
                this.musicButton.innerHTML = '<span class="music-icon">🔊</span>';
            }
            else {
                this.audio.pause();
                this.musicButton.innerHTML = '<span class="music-icon">🔇</span>';
            }
        });
        document.addEventListener('click', () => {
            if (this.audio.paused) {
                this.audio.play();
                this.musicButton.innerHTML = '<span class="music-icon">🔊</span>';
            }
        }, { once: true });
    }
    startCountdown() {
        this.updateCountdown();
        this.countdownInterval = window.setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }
    updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = this.weddingDate.getTime() - now;
        if (timeLeft < 0) {
            clearInterval(this.countdownInterval);
            Object.values(this.elements).forEach(element => {
                element.textContent = '00';
            });
            return;
        }
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        this.elements.days.textContent = days.toString().padStart(2, '0');
        this.elements.hours.textContent = hours.toString().padStart(2, '0');
        this.elements.minutes.textContent = minutes.toString().padStart(2, '0');
        this.elements.seconds.textContent = seconds.toString().padStart(2, '0');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const weddingDate = new Date('2024-07-16T17:00:00');
    new WeddingCountdown(weddingDate);
}); 