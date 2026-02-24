 // Playlist data
    const playlist = [
      {
        id: 1,
        title: "Neon Dreams",
        artist: "Synthwave Collective",
        duration: "3:42",
        durationSec: 222,
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      },
      {
        id: 2,
        title: "Midnight Drive",
        artist: "Retro Future",
        duration: "4:15",
        durationSec: 255,
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
      },
      {
        id: 3,
        title: "Electric Pulse",
        artist: "Digital Horizon",
        duration: "3:58",
        durationSec: 238,
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
      },
      {
        id: 4,
        title: "Stellar Waves",
        artist: "Cosmic Drift",
        duration: "5:02",
        durationSec: 302,
        cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
      },
      {
        id: 5,
        title: "Chrome Hearts",
        artist: "Neon Riders",
        duration: "3:33",
        durationSec: 213,
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
      },
      {
        id: 6,
        title: "Binary Sunset",
        artist: "Code Breakers",
        duration: "4:47",
        durationSec: 287,
        cover: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=400&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
      },
      {
        id: 7,
        title: "Vapor Trail",
        artist: "Aesthetic Dreams",
        duration: "3:21",
        durationSec: 201,
        cover: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=400&h=400&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
      },
      {
        id: 8,
        title: "Digital Rain",
        artist: "Matrix Protocol",
        duration: "4:09",
        durationSec: 249,
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop&sat=-100",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
      }
    ];

    // State
    let currentTrackIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let repeatMode = 0; // 0: off, 1: all, 2: one
    let previousVolume = 70;
    let visualizerBars = [];
    let animationId = null;

    // DOM Elements
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const muteBtn = document.getElementById('muteBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const trackTitle = document.getElementById('trackTitle');
    const artistName = document.getElementById('artistName');
    const albumArt = document.getElementById('albumArt');
    const albumGlow = document.getElementById('albumGlow');
    const visualizer = document.getElementById('visualizer');
    const playlistEl = document.getElementById('playlist');
    const trackCount = document.getElementById('trackCount');
    const volumeIcon = document.getElementById('volumeIcon');
    const volumeWave1 = document.getElementById('volumeWave1');
    const volumeWave2 = document.getElementById('volumeWave2');

    // Initialize visualizer bars
    function initVisualizer() {
      const barCount = 32;
      visualizer.innerHTML = '';
      visualizerBars = [];
      
      for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        bar.style.height = '4px';
        visualizer.appendChild(bar);
        visualizerBars.push(bar);
      }
    }

    // Animate visualizer
    function animateVisualizer() {
      if (!isPlaying) {
        visualizerBars.forEach(bar => {
          bar.style.height = '4px';
          bar.classList.remove('active');
        });
        return;
      }

      visualizerBars.forEach((bar, i) => {
        const height = Math.random() * 60 + 10;
        bar.style.height = `${height}px`;
        bar.classList.add('active');
        bar.style.animationDelay = `${i * 0.02}s`;
      });

      animationId = requestAnimationFrame(() => {
        setTimeout(animateVisualizer, 100);
      });
    }

    // Render playlist
    function renderPlaylist() {
      playlistEl.innerHTML = '';
      trackCount.textContent = `${playlist.length} tracks`;

      playlist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = `playlist-item ${index === currentTrackIndex ? 'active' : ''}`;
        item.innerHTML = `
          <span class="track-number text-sm text-[var(--muted)] w-6">${String(index + 1).padStart(2, '0')}</span>
          <img src="${track.cover}" alt="${track.title}" class="playlist-thumb">
          <div class="flex-1 min-w-0">
            <p class="font-medium truncate">${track.title}</p>
            <p class="text-sm text-[var(--muted)] truncate">${track.artist}</p>
          </div>
          <span class="text-sm text-[var(--muted)]">${track.duration}</span>
        `;
        item.addEventListener('click', () => {
          currentTrackIndex = index;
          loadTrack();
          playTrack();
        });
        playlistEl.appendChild(item);
      });
    }

    // Load track
    function loadTrack() {
      const track = playlist[currentTrackIndex];
      audio.src = track.src;
      trackTitle.textContent = track.title;
      artistName.textContent = track.artist;
      albumArt.src = track.cover;
      durationEl.textContent = track.duration;
      
      // Reset progress
      progressBar.style.width = '0%';
      currentTimeEl.textContent = '0:00';

      // Update playlist active state
      document.querySelectorAll('.playlist-item').forEach((item, index) => {
        item.classList.toggle('active', index === currentTrackIndex);
      });
    }

    // Play track
    function playTrack() {
      audio.play().then(() => {
        isPlaying = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        albumArt.classList.add('playing');
        albumGlow.classList.add('active');
        animateVisualizer();
      }).catch(err => console.log('Playback failed:', err));
    }

    // Pause track
    function pauseTrack() {
      audio.pause();
      isPlaying = false;
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      albumArt.classList.remove('playing');
      albumGlow.classList.remove('active');
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    }

    // Format time
    function formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Event Listeners
    playBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseTrack();
      } else {
        playTrack();
      }
    });

    prevBtn.addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      loadTrack();
      if (isPlaying) playTrack();
    });

    nextBtn.addEventListener('click', () => {
      playNext();
    });

    function playNext() {
      if (isShuffle) {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * playlist.length);
        } while (newIndex === currentTrackIndex && playlist.length > 1);
        currentTrackIndex = newIndex;
      } else {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
      }
      loadTrack();
      if (isPlaying) playTrack();
    }

    shuffleBtn.addEventListener('click', () => {
      isShuffle = !isShuffle;
      shuffleBtn.style.color = isShuffle ? 'var(--accent)' : 'var(--muted)';
    });

    repeatBtn.addEventListener('click', () => {
      repeatMode = (repeatMode + 1) % 3;
      if (repeatMode === 0) {
        repeatBtn.style.color = 'var(--muted)';
        repeatBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
          </svg>
        `;
      } else if (repeatMode === 1) {
        repeatBtn.style.color = 'var(--accent)';
        repeatBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
          </svg>
        `;
      } else {
        repeatBtn.style.color = 'var(--secondary)';
        repeatBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            <text x="12" y="14" font-size="8" fill="currentColor" text-anchor="middle">1</text>
          </svg>
        `;
      }
    });
 // Volume controls
    volumeSlider.addEventListener('input', (e) => {
      const volume = e.target.value;
      audio.volume = volume / 100;
      volumeValue.textContent = `${volume}%`;
      updateVolumeIcon(volume);
    });

    muteBtn.addEventListener('click', () => {
      if (audio.volume > 0) {
        previousVolume = volumeSlider.value;
        volumeSlider.value = 0;
        audio.volume = 0;
        volumeValue.textContent = '0%';
        updateVolumeIcon(0);
      } else {
        volumeSlider.value = previousVolume;
        audio.volume = previousVolume / 100;
        volumeValue.textContent = `${previousVolume}%`;
        updateVolumeIcon(previousVolume);
      }
    });

    function updateVolumeIcon(volume) {
      if (volume == 0) {
        volumeWave1.style.display = 'none';
        volumeWave2.style.display = 'none';
      } else if (volume < 50) {
        volumeWave1.style.display = 'block';
        volumeWave2.style.display = 'none';
      } else {
        volumeWave1.style.display = 'block';
        volumeWave2.style.display = 'block';
      }
    }

    // Progress bar
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      durationEl.textContent = formatTime(audio.duration);
    });

    progressContainer.addEventListener('click', (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audio.currentTime = percent * audio.duration;
    });

    // Auto-play next
    audio.addEventListener('ended', () => {
      if (repeatMode === 2) {
        audio.currentTime = 0;
        playTrack();
      } else if (repeatMode === 1 || currentTrackIndex < playlist.length - 1) {
        playNext();
      } else {
        pauseTrack();
      }
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) pauseTrack();
        else playTrack();
      } else if (e.code === 'ArrowRight') {
        audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
      } else if (e.code === 'ArrowLeft') {
        audio.currentTime = Math.max(audio.currentTime - 5, 0);
      } else if (e.code === 'ArrowUp') {
        const newVolume = Math.min(parseInt(volumeSlider.value) + 5, 100);
        volumeSlider.value = newVolume;
        audio.volume = newVolume / 100;
        volumeValue.textContent = `${newVolume}%`;
        updateVolumeIcon(newVolume);
      } else if (e.code === 'ArrowDown') {
        const newVolume = Math.max(parseInt(volumeSlider.value) - 5, 0);
        volumeSlider.value = newVolume;
        audio.volume = newVolume / 100;
        volumeValue.textContent = `${newVolume}%`;
        updateVolumeIcon(newVolume);
      }
    });

    // Initialize
    initVisualizer();
    renderPlaylist();
    loadTrack();
    audio.volume = 0.7;
