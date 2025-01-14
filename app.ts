interface CountdownElements {
    days: HTMLElement;
    hours: HTMLElement;
    minutes: HTMLElement;
    seconds: HTMLElement;
}

class WeddingCountdown {
    private readonly weddingDate: Date;
    private readonly elements: CountdownElements;
    private readonly audio: HTMLAudioElement;
    private readonly musicButton: HTMLButtonElement;
    private countdownInterval: number;

    constructor(weddingDate: Date) {
        this.weddingDate = weddingDate;
        this.elements = {
            days: document.getElementById('days')!,
            hours: document.getElementById('hours')!,
            minutes: document.getElementById('minutes')!,
            seconds: document.getElementById('seconds')!
        };
        console.log('Countdown initialized for:', weddingDate);
        console.log('Elements found:', this.elements);

        this.audio = document.getElementById('bgMusic') as HTMLAudioElement;
        this.musicButton = document.getElementById('toggleMusic') as HTMLButtonElement;
        this.countdownInterval = 0;
        this.init();
    }

    private init(): void {
        this.setupMusicControl();
        this.startCountdown();
    }

    private setupMusicControl(): void {
        this.musicButton.addEventListener('click', () => {
            if (this.audio.paused) {
                this.audio.play();
                this.musicButton.innerHTML = '<span class="music-icon">🔊</span>';
            } else {
                this.audio.pause();
                this.musicButton.innerHTML = '<span class="music-icon">🔇</span>';
            }
        });

        // Auto-play music (many browsers block this)
        document.addEventListener('click', () => {
            if (this.audio.paused) {
                this.audio.play();
                this.musicButton.innerHTML = '<span class="music-icon">🔊</span>';
            }
        }, { once: true });
    }

    private startCountdown(): void {
        this.updateCountdown();
        this.countdownInterval = window.setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    private updateCountdown(): void {
        const now = new Date().getTime();
        const timeLeft = this.weddingDate.getTime() - now;

        console.log('Time left:', timeLeft);

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

        if (this.elements.days) this.elements.days.textContent = days.toString().padStart(2, '0');
        if (this.elements.hours) this.elements.hours.textContent = hours.toString().padStart(2, '0');
        if (this.elements.minutes) this.elements.minutes.textContent = minutes.toString().padStart(2, '0');
        if (this.elements.seconds) this.elements.seconds.textContent = seconds.toString().padStart(2, '0');
    }
}

// Map Integration
class VenueMap {
    private map: google.maps.Map;
    private marker: google.maps.Marker;

    constructor() {
        const mapElement = document.getElementById('map') as HTMLElement;
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }

        const venueLocation = { lat: 43.238949, lng: 76.889709 };

        this.map = new google.maps.Map(mapElement, {
            center: venueLocation,
            zoom: 15,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "geometry",
                    "stylers": [{"color": "#242f3e"}]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#746855"}]
                }
                // Add more styles as needed
            ]
        });

        this.marker = new google.maps.Marker({
            position: venueLocation,
            map: this.map,
            title: 'Дайын той сарайы',
            animation: google.maps.Animation.DROP
        });
    }
}

// Make map initialization global
declare global {
    interface Window {
        initMap: () => void;
    }
}

window.initMap = () => {
    new VenueMap();
};

// Calendar Integration
function addToCalendar(): void {
    const event = {
        title: 'Иса & Анка Үйлену тойы',
        start: new Date('2024-07-16T17:00:00'),
        end: new Date('2024-07-16T23:00:00'),
        location: 'Дайын той сарайы, Алматы',
        description: 'Иса мен Анканың үйлену тойына шақырамыз!'
    };

    // Create calendar URL
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start.toISOString().replace(/[-:]/g, '').replace('.000', '')}/${event.end.toISOString().replace(/[-:]/g, '').replace('.000', '')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(calendarUrl, '_blank');
}

// Comments Section
class CommentsManager {
    private commentsList: HTMLElement;
    private form: HTMLFormElement;

    constructor() {
        this.commentsList = document.getElementById('comments-list') as HTMLElement;
        this.form = document.getElementById('commentForm') as HTMLFormElement;
        console.log('CommentsManager initialized', this.commentsList, this.form); // Debug
        this.initializeForm();
        this.loadComments();
    }

    private initializeForm(): void {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted'); // Debug
            this.handleSubmit();
        });
    }

    private handleSubmit(): void {
        const nameInput = document.getElementById('name') as HTMLInputElement;
        const messageInput = document.getElementById('message') as HTMLTextAreaElement;

        if (!nameInput || !messageInput) {
            console.error('Form inputs not found');
            return;
        }

        if (!nameInput.value || !messageInput.value) {
            alert('Барлық өрістерді толтырыңыз');
            return;
        }

        const comment = {
            author: nameInput.value,
            message: messageInput.value,
            date: new Date().toISOString()
        };

        console.log('New comment:', comment);

        try {
            this.addComment(comment);
            this.saveComment(comment);
            this.form.reset();
            alert('Тілегіңіз сәтті жіберілді!');
        } catch (error) {
            console.error('Error saving comment:', error);
            alert('Қате шықты. Қайталап көріңіз.');
        }
    }

    private addComment(comment: { author: string, message: string, date: string }): void {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment fade-in';
        commentElement.innerHTML = `
            <p class="comment-author">${this.escapeHtml(comment.author)}</p>
            <p class="comment-text">${this.escapeHtml(comment.message)}</p>
            <small class="comment-date">${new Date(comment.date).toLocaleDateString('kk-KZ')}</small>
        `;
        this.commentsList.prepend(commentElement);
    }

    private escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    private saveComment(comment: object): void {
        const comments = this.getStoredComments();
        comments.push(comment);
        localStorage.setItem('weddingComments', JSON.stringify(comments));
    }

    private loadComments(): void {
        const comments = this.getStoredComments();
        comments.forEach(comment => this.addComment(comment));
    }

    private getStoredComments(): any[] {
        const stored = localStorage.getItem('weddingComments');
        return stored ? JSON.parse(stored) : [];
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const weddingDate = new Date('2024-07-16T17:00:00');
        console.log('Initializing countdown for:', weddingDate);
        new WeddingCountdown(weddingDate);
    } catch (error) {
        console.error('Error initializing countdown:', error);
    }

    try {
        new CommentsManager();
    } catch (error) {
        console.error('Error initializing comments:', error);
    }
}); 