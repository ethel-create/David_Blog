
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {

        this.setupActiveStates();
        this.setupLoadingStates();
    }


    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }


    setupPageTransitions() {

        document.body.classList.add('page-transition');
        

        const links = document.querySelectorAll('[onclick*="window.location.href"]:not([onclick*="toggleWindow"]):not([onclick*="openWindow"])');
        links.forEach(link => {
            const originalOnclick = link.getAttribute('onclick');
            if (originalOnclick && !originalOnclick.includes('toggleWindow') && !originalOnclick.includes('openWindow')) {
                link.removeAttribute('onclick');
                
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const url = originalOnclick.match(/'([^']+)'/)[1];
                    this.transitionToPage(url);
                });
            }
        });
    }

    transitionToPage(url) {
    
        document.body.style.animation = 'pageSlideOut 0.3s ease-in forwards';
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }


    setupTypingAnimations() {
        const textElements = document.querySelectorAll('h1, .window-title');
        textElements.forEach((element, index) => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid rgba(255, 255, 255, 0.7)';
            
            setTimeout(() => {
                this.typeText(element, text, 50);
            }, index * 200);
        });
    }

    typeText(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);

                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, speed);
    }


    setupRippleEffects() {
        const buttons = document.querySelectorAll('button, .taskbar-item, .favorites-item');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }


    setupActiveStates() {
        const currentPage = window.location.pathname.split('/').pop() || 'home.html';
        const taskbarItems = document.querySelectorAll('.taskbar-item');
        
        taskbarItems.forEach(item => {
            const onclick = item.getAttribute('onclick');
            if (onclick && onclick.includes(currentPage)) {
                item.classList.add('active');
            }
        });
    }


    setupLoadingStates() {

        const style = document.createElement('style');
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s;
            }
            
            .loading-overlay.show {
                opacity: 1;
                pointer-events: all;
            }
            
            .spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top: 3px solid #fff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }


    animateWindowOpen(windowElement) {
        windowElement.style.display = 'block';
        windowElement.classList.add('show');
        

        const content = windowElement.querySelectorAll('.window-content > *');
        content.forEach((element, index) => {
            element.style.animationDelay = (index * 0.1) + 's';
        });
    }

    animateWindowClose(windowElement) {
        windowElement.classList.add('hide');
        setTimeout(() => {
            windowElement.style.display = 'none';
            windowElement.classList.remove('show', 'hide');
        }, 300);
    }


    addGlassMorphism() {
        const style = document.createElement('style');
        style.textContent = `
            .glass {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }
        `;
        document.head.appendChild(style);
        

        document.querySelectorAll('.window, .fullscreen-window').forEach(window => {
            window.classList.add('glass');
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const animationManager = new AnimationManager();
    

    animationManager.addGlassMorphism();
    

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.05)';
            img.style.filter = 'brightness(1.1) contrast(1.1)';
        });
        
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
            img.style.filter = 'brightness(1) contrast(1)';
        });
    });
    

    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.body;
        const speed = scrolled * 0.5;
        
        parallax.style.backgroundPosition = `center ${speed}px`;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
});


window.AnimationManager = AnimationManager;


if (!window.musicPlayer) {
    window.musicPlayer = {
        currentTrack: 0,
        isPlaying: false,
        audio: new Audio(),
        playlist: [
            { title: "Bôa - Duvet", src: "mp3/Bôa -  Duvet.mp3" },
            { title: "Everything In Its Right Place - Radiohead", src: "mp3/Everything In Its Right Place - Radiohead.mp3" }
        ]
    };
    

    window.musicPlayer.audio.src = window.musicPlayer.playlist[window.musicPlayer.currentTrack].src;
    

    window.musicPlayer.audio.addEventListener('ended', function() {
        nextTrack();
        if (window.musicPlayer.isPlaying) {
            window.musicPlayer.audio.play();
        }
    });
    

    window.musicPlayer.audio.addEventListener('timeupdate', function() {
        if (window.musicPlayer.audio.duration) {
            const progress = (window.musicPlayer.audio.currentTime / window.musicPlayer.audio.duration) * 100;
            const progressBar = document.getElementById('progress');
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
        }
    });
}


function togglePlay() {
    const playBtn = document.querySelector('.play-pause');
    if (window.musicPlayer.isPlaying) {
        window.musicPlayer.audio.pause();
        if (playBtn) {
            playBtn.textContent = '▶';
            playBtn.classList.remove('playing');
        }
        window.musicPlayer.isPlaying = false;
    } else {
        window.musicPlayer.audio.play();
        if (playBtn) {
            playBtn.textContent = '⏸';
            playBtn.classList.add('playing');
        }
        window.musicPlayer.isPlaying = true;
    }
}

function nextTrack() {
    window.musicPlayer.currentTrack = (window.musicPlayer.currentTrack + 1) % window.musicPlayer.playlist.length;
    window.musicPlayer.audio.src = window.musicPlayer.playlist[window.musicPlayer.currentTrack].src;
    updateSongTitle();
    if (window.musicPlayer.isPlaying) {
        window.musicPlayer.audio.play();
    }
}

function previousTrack() {
    window.musicPlayer.currentTrack = (window.musicPlayer.currentTrack - 1 + window.musicPlayer.playlist.length) % window.musicPlayer.playlist.length;
    window.musicPlayer.audio.src = window.musicPlayer.playlist[window.musicPlayer.currentTrack].src;
    updateSongTitle();
    if (window.musicPlayer.isPlaying) {
        window.musicPlayer.audio.play();
    }
}

function setVolume(value) {
    window.musicPlayer.audio.volume = value / 100;
}

function updateSongTitle() {
    const songTitle = document.getElementById('songTitle');
    if (songTitle && window.musicPlayer.playlist.length > 0) {
        songTitle.textContent = window.musicPlayer.playlist[window.musicPlayer.currentTrack].title;
    }
}


document.addEventListener('DOMContentLoaded', function() {
    updateSongTitle();
    const playBtn = document.querySelector('.play-pause');
    if (playBtn && window.musicPlayer.isPlaying) {
        playBtn.textContent = '⏸';
        playBtn.classList.add('playing');
    }
});