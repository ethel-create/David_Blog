
(function() {

    if (!window.GlobalMusicPlayer) {
        window.GlobalMusicPlayer = {
            audio: new Audio(),
            currentTrack: 0,
            isPlaying: false,
            currentTime: 0,
            volume: 0.5,
            playlist: [
                { title: "Bôa - Duvet", src: "../mp3/Bôa -  Duvet.mp3" },
                { title: "Everything In Its Right Place - Radiohead", src: "../mp3/Everything In Its Right Place - Radiohead.mp3" },
                { title: "I Really Want to Stay at Your House", src: "../mp3/I Really Want to Stay at Your House.mp3" }
            ],
            
            saveState: function() {
                localStorage.setItem('musicState', JSON.stringify({
                    currentTrack: this.currentTrack,
                    isPlaying: this.isPlaying,
                    currentTime: this.audio.currentTime,
                    volume: this.audio.volume
                }));
            },
            
            loadState: function() {
                const saved = localStorage.getItem('musicState');
                if (saved) {
                    const state = JSON.parse(saved);
                    this.currentTrack = state.currentTrack;
                    this.isPlaying = state.isPlaying;
                    this.currentTime = state.currentTime;
                    this.volume = state.volume;
                }
            },
            
            init: function() {
                this.loadState();
                

                this.audio.src = this.playlist[this.currentTrack].src;
                this.audio.volume = this.volume;
                this.audio.currentTime = this.currentTime;
                
                if (this.isPlaying) {
                    this.audio.play();
                }
                

                setInterval(() => this.saveState(), 1000);
                

                this.audio.addEventListener('ended', () => {
                    this.nextTrack();
                    if (this.isPlaying) {
                        this.audio.play();
                    }
                });
                

                this.audio.addEventListener('timeupdate', () => {
                    if (this.audio.duration) {
                        const progress = (this.audio.currentTime / this.audio.duration) * 100;
                        const progressBar = document.getElementById('progress');
                        if (progressBar) {
                            progressBar.style.width = progress + '%';
                        }
                    }
                });
                

                this.updateUI();
            },
            
            togglePlay: function() {
                const playBtn = document.querySelector('.play-pause');
                if (this.isPlaying) {
                    this.audio.pause();
                    this.isPlaying = false;
                    if (playBtn) {
                        playBtn.textContent = '▶';
                        playBtn.classList.remove('playing');
                    }
                } else {
                    this.audio.play();
                    this.isPlaying = true;
                    if (playBtn) {
                        playBtn.textContent = '⏸';
                        playBtn.classList.add('playing');
                    }
                }
                this.saveState();
            },
            
            nextTrack: function() {
                this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
                this.audio.src = this.playlist[this.currentTrack].src;
                this.updateSongTitle();
                if (this.isPlaying) {
                    this.audio.play();
                }
                this.saveState();
            },
            
            previousTrack: function() {
                this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
                this.audio.src = this.playlist[this.currentTrack].src;
                this.updateSongTitle();
                if (this.isPlaying) {
                    this.audio.play();
                }
                this.saveState();
            },
            
            setVolume: function(value) {
                this.audio.volume = value / 100;
                this.volume = value / 100;
                this.saveState();
            },
            
            updateSongTitle: function() {
                const songTitle = document.getElementById('songTitle');
                if (songTitle) {
                    songTitle.textContent = this.playlist[this.currentTrack].title;
                }
            },
            
            updateUI: function() {
                this.updateSongTitle();
                const playBtn = document.querySelector('.play-pause');
                const volumeSlider = document.querySelector('.volume-slider');
                
                if (playBtn) {
                    playBtn.textContent = this.isPlaying ? '⏸' : '▶';
                    if (this.isPlaying) {
                        playBtn.classList.add('playing');
                    } else {
                        playBtn.classList.remove('playing');
                    }
                }
                
                if (volumeSlider) {
                    volumeSlider.value = this.volume * 100;
                }
            }
        };
        

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.GlobalMusicPlayer.init();
            });
        } else {
            window.GlobalMusicPlayer.init();
        }
    } else {

        setTimeout(() => {
            window.GlobalMusicPlayer.updateUI();
        }, 100);
    }
})();


function togglePlay() {
    window.GlobalMusicPlayer.togglePlay();
}

function nextTrack() {
    window.GlobalMusicPlayer.nextTrack();
}

function previousTrack() {
    window.GlobalMusicPlayer.previousTrack();
}

function setVolume(value) {
    window.GlobalMusicPlayer.setVolume(value);
}