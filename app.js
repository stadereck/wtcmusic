/* ============================================================
   WTC Music — Lógica principal del reproductor
   ============================================================ */

// ── 1. Datos ──────────────────────────────────────────────────
const SONGS = [
    {
        id: 0,
        title: 'Von Dutch',
        artist: 'Charli xcx',
        album: 'Von Dutch - Single',
        cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782505897/Von_Dutch_dplvw8.jpg',
        playerCover: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Charli_XCX_-_Brat_%28album_cover%29.png',
        url: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1782505964/Charli_xcx_-_Von_dutch_imrqqn.mp3',
        videoUrl: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1783137246/Von_Dutch_Video_yzegks.mp4'
    },
    {
        id: 1,
        title: 'SAOKO',
        artist: 'ROSALÍA',
        album: 'MOTOMAMI',
        cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782690307/00._t7pja6.jpg',
        url: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1782690354/07._BIZCOCHITO_jfnbe9.flac'
    },
    {
        id: 2,
        title: 'CANDY',
        artist: 'ROSALÍA',
        album: 'MOTOMAMI',
        cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782690307/00._t7pja6.jpg',
        url: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1782690358/02._CANDY_epgngp.flac'
    },
    {
        id: 3,
        title: 'La Fama (feat. The Weeknd)',
        artist: 'ROSALÍA',
        album: 'MOTOMAMI',
        cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782690307/00._t7pja6.jpg',
        url: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1782690356/03._LAFAMA_f0vhb1.flac'
    },
    {
        id: 4,
        title: 'BULERÍAS',
        artist: 'ROSALÍA',
        album: 'MOTOMAMI',
        cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782690307/00._t7pja6.jpg',
        url: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1782690359/04._BULER%C3%8DAS_wu0hqm.flac'
    },
    {
        id: 5,
        title: 'CHICKEN TERIYAKI',
        artist: 'ROSALÍA',
        album: 'MOTOMAMI',
        cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782690307/00._t7pja6.jpg',
        url: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1782690361/05._CHICKENTERIYAKI_n9vjai.flac'
    },
    {
        id: 6,
        title: 'Happier Than Ever',
        artist: 'Billie Eilish',
        album: 'Happier Than Ever',
        cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782504582/Happier_Than_Ever_Cover_odsqsc.jpg',
        url: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1782504769/Happier_Than_Ever_-_Billie_Eilish_pvsyna.mp3'
    },
    {
        id: 7,
        title: 'Ocean Eyes',
        artist: 'Billie Eilish',
        album: "Don't Smile at Me",
        cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782506646/Don_t_Smile_at_me_g3uiox.jpg',
        url: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1782506644/Billie_Eilish_-_Ocean_Eyes_bhycwd.mp3'
    }
];

const RECENT_CARDS = [
    { img: SONGS[0].cover,  title: 'Charli xcx',                            targetIdx: 0 },
    { img: 'https://placehold.co/100x100/121212/ffffff?text=Manana',         title: 'MAÑANA SERÁ BONITO',                   targetIdx: 0 },
    { img: 'https://placehold.co/100x100/1ed760/000000?text=Brat',           title: "Brat and it's completely...",          targetIdx: 0 },
    { img: 'https://placehold.co/100x100/ff0000/ffffff?text=Bichota',        title: 'Con B de Bichota (Customized Version)', targetIdx: 0 },
    { img: 'https://placehold.co/100x100/330066/ffffff?text=Trap',           title: 'TRAP KITTY',                           targetIdx: 0 },
    { img: 'https://placehold.co/100x100/6600cc/ffffff?text=att',            title: 'att.',                                 targetIdx: 0 },
    { img: 'https://placehold.co/100x100/1ed760/000000?text=Brat',           title: "Brat and it's completely...",          targetIdx: 0 },
    { img: SONGS[1].cover,  title: 'MOTOMAMI +',                             targetIdx: 1 }
];

const NOVEDADES_CARDS = [
    { img: 'https://placehold.co/200x200/224466/ffffff?text=Novedades', title: 'Yo no sé si no o si sí...',     desc: 'Novedades Viernes'  },
    { img: 'https://placehold.co/200x200/111111/ffffff?text=Radar',     title: 'Las novedades de los...',       desc: 'Radar de Novedades' },
    { img: 'https://placehold.co/200x200/ff4444/ffffff?text=Kalei',     title: 'A sonic wonderland of...',     desc: 'Kaleidoscope'        },
    { img: 'https://placehold.co/200x200/88cc44/000000?text=All+New',   title: 'All the new music you...',     desc: 'All New All Now'    },
    { img: 'https://placehold.co/200x200/cc8866/ffffff?text=Helium',    title: 'sOniiDos En conStANte...',     desc: 'helium'              }
];

const HECHO_PARA_CARDS = [
    { img: 'https://placehold.co/200x200/0055ff/ffffff?text=DJ',    title: 'DJ',          desc: '' },
    { img: 'https://placehold.co/200x200/00cccc/ffffff?text=Mix+1', title: 'Mix diario 1', desc: '' },
    { img: 'https://placehold.co/200x200/ccaa00/ffffff?text=Mix+2', title: 'Mix diario 2', desc: '' },
    { img: 'https://placehold.co/200x200/aaaaaa/ffffff?text=Mix+3', title: 'Mix diario 3', desc: '' },
    { img: 'https://placehold.co/200x200/ff66cc/ffffff?text=Mix+4', title: 'Mix diario 4', desc: '' }
];

// ── 2. Title del documento ────────────────────────────────────
const TITLE_DEFAULT = 'Reproductor web de WTC Music: música para todo el mundo';

function setPlayingTitle(song) {
    document.title = `${song.title} • ${song.artist}`;
}
function setDefaultTitle() {
    document.title = TITLE_DEFAULT;
}

// ── 2b. Media Session API (reproductor del sistema operativo) ─
function updateMediaSession(song) {
    if (!('mediaSession' in navigator)) return;

    const artworkSrc = song.playerCover || song.cover;

    navigator.mediaSession.metadata = new MediaMetadata({
        title:  song.title,
        artist: song.artist,
        album:  song.album,
        artwork: [
            { src: artworkSrc, sizes: '512x512', type: 'image/jpeg' }
        ]
    });

    // Acciones del reproductor del sistema
    navigator.mediaSession.setActionHandler('play',         () => togglePlay());
    navigator.mediaSession.setActionHandler('pause',        () => togglePlay());
    navigator.mediaSession.setActionHandler('nexttrack',    () => nextSong());
    navigator.mediaSession.setActionHandler('previoustrack',() => prevSong());
    navigator.mediaSession.setActionHandler('seekto', (details) => {
        const activeMedia = isVideoMode ? mainVideo : audio;
        if (details.seekTime !== undefined && activeMedia.duration) {
            activeMedia.currentTime = details.seekTime;
            if (isVideoMode) audio.currentTime = mainVideo.currentTime;
            else mainVideo.currentTime = audio.currentTime;
            updatePositionState();
        }
    });
}

function updateMediaSessionState(playing) {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
}

function updatePositionState() {
    if (!('mediaSession' in navigator)) return;
    const activeMedia = isVideoMode ? mainVideo : audio;
    if (!activeMedia.duration || isNaN(activeMedia.duration)) return;
    try {
        navigator.mediaSession.setPositionState({
            duration:     activeMedia.duration,
            playbackRate: activeMedia.playbackRate,
            position:     activeMedia.currentTime
        });
    } catch (_) {}
}

// ── 3. Estado ─────────────────────────────────────────────────
let currentIdx  = 0;
let isPlaying   = false;
let isVideoMode = false;
let volume      = 0.8;

// Repeat: 0 = off | 1 = repeat album/context | 2 = repeat one
let repeatMode  = 0;

// Agrupa canciones por álbum (preserva orden de aparición)
function getAlbumSongs(albumName) {
    return SONGS.filter(s => s.album === albumName);
}

// Devuelve el índice global que sigue dentro del contexto del álbum actual,
// o null si no hay siguiente (y repeatMode === 0).
function getNextIdx() {
    const song       = SONGS[currentIdx];
    const albumSongs = getAlbumSongs(song.album);
    const posInAlbum = albumSongs.findIndex(s => s.id === song.id);
    const isLastInAlbum = posInAlbum === albumSongs.length - 1;

    if (repeatMode === 2) {
        // Repetir una sola canción
        return currentIdx;
    }

    if (repeatMode === 1) {
        // Repetir álbum/single: al llegar al final vuelve a la primera del álbum
        if (isLastInAlbum) {
            return SONGS.findIndex(s => s.id === albumSongs[0].id);
        }
        return SONGS.findIndex(s => s.id === albumSongs[posInAlbum + 1].id);
    }

    // repeatMode === 0: avance normal dentro del álbum; si es el último, para.
    if (isLastInAlbum) return null;
    return SONGS.findIndex(s => s.id === albumSongs[posInAlbum + 1].id);
}

// ── 4. Referencias DOM ────────────────────────────────────────
const audio        = document.getElementById('audio');
const mainVideo    = document.getElementById('mainVideo');
const playIco      = document.getElementById('playIco');
const btnVideoMode = document.getElementById('btnVideoMode');
const videoOverlay = document.getElementById('video-overlay');

// ── 5. Renderizado de interfaz ────────────────────────────────
function renderLibrary() {
    document.getElementById('libraryList').innerHTML = `
        <div class="lib-item">
            <div class="lib-icon-bg bg-liked"><i class="fa fa-heart"></i></div>
            <div class="lib-info">
                <div class="lib-name">Canciones que te gustan</div>
                <div class="lib-desc"><i class="fa fa-thumbtack"></i> Lista • 44 canciones</div>
            </div>
        </div>
        <div class="lib-item">
            <div class="lib-icon-bg" style="background:#e31b23;font-size:10px;font-weight:bold;font-family:serif;text-align:center;line-height:1.2;">
                THE<br>GALA<br><span style="font-size:6px">OF<br>KINDNESS</span>
            </div>
            <div class="lib-info">
                <div class="lib-name">The Gala Of Kindness (Original Score ...</div>
                <div class="lib-desc"><i class="fa fa-thumbtack"></i> Lista • Alice Whitman</div>
            </div>
        </div>
        <div class="lib-item active" onclick="playSong(0)">
            <img src="${SONGS[0].cover}" class="lib-img round" loading="lazy" alt="${SONGS[0].artist}"/>
            <div class="lib-info">
                <div class="lib-name">${SONGS[0].artist}</div>
                <div class="lib-desc"><i class="fa fa-thumbtack"></i> Artista</div>
            </div>
            <i class="fa fa-volume-high" style="color:var(--spotify-green);font-size:14px;"></i>
        </div>
        <div class="lib-item">
            <div class="lib-icon-bg" style="background:#e31b23;font-size:10px;font-weight:bold;font-family:serif;text-align:center;line-height:1.2;">
                THE<br>GALA<br><span style="font-size:6px">OF<br>KINDNESS</span>
            </div>
            <div class="lib-info">
                <div class="lib-name">The Gala of Kindness (Original Score f...</div>
                <div class="lib-desc"><i class="fa fa-thumbtack"></i> Lista • forge Records</div>
            </div>
        </div>
        <div class="lib-item">
            <img src="https://placehold.co/48x48/e31b23/ffffff?text=BICHOTA" class="lib-img" loading="lazy" alt="Bichota"/>
            <div class="lib-info">
                <div class="lib-name">Con B de Bichota (Customized Version)</div>
                <div class="lib-desc">Lista • forge Records</div>
            </div>
        </div>
        <div class="lib-item">
            <img src="https://placehold.co/48x48/f2e8d5/000000?text=MSB" class="lib-img" loading="lazy" alt="MSB"/>
            <div class="lib-info">
                <div class="lib-name">MAÑANA SERÁ BONITO</div>
                <div class="lib-desc">Álbum • KAROL G</div>
            </div>
        </div>
        <div class="lib-item" onclick="playSong(1)">
            <img src="${SONGS[1].cover}" class="lib-img" loading="lazy" alt="${SONGS[1].album}"/>
            <div class="lib-info">
                <div class="lib-name">MOTOMAMI +</div>
                <div class="lib-desc">Álbum • ROSALÍA</div>
            </div>
        </div>
        <div class="lib-item">
            <img src="https://placehold.co/48x48/8bc34a/000000?text=BRAT" class="lib-img" loading="lazy" alt="Brat"/>
            <div class="lib-info">
                <div class="lib-name">Brat and it's completely different but ...</div>
                <div class="lib-desc">Álbum • Charli xcx</div>
            </div>
        </div>
        <div class="lib-item">
            <img src="https://placehold.co/48x48/111111/ffffff?text=Biagi" class="lib-img round" loading="lazy" alt="Biagi"/>
            <div class="lib-info">
                <div class="lib-name">Biagi</div>
                <div class="lib-desc">Artista</div>
            </div>
        </div>
    `;
}

function renderGrids() {
    // Recents
    document.getElementById('recentGrid').innerHTML = RECENT_CARDS.map(c => `
        <div class="recent-card" onclick="playSong(${c.targetIdx})">
            <img src="${c.img}" loading="lazy" alt="${c.title}"/>
            <span>${c.title}</span>
            <button class="btn-play-green" aria-label="Reproducir ${c.title}"><i class="fa fa-play"></i></button>
        </div>
    `).join('');

    // Novedades
    document.getElementById('novedadesGrid').innerHTML = NOVEDADES_CARDS.map(c => `
        <div class="shelf-card" onclick="playSong(1)">
            <img src="${c.img}" loading="lazy" alt="${c.title}"/>
            <div class="shelf-title">${c.title}</div>
            <div class="shelf-desc">${c.desc}</div>
            <button class="btn-play-green" aria-label="Reproducir ${c.title}"><i class="fa fa-play" style="margin-left:2px"></i></button>
        </div>
    `).join('');

    // Hecho para
    document.getElementById('hechoParaGrid').innerHTML = HECHO_PARA_CARDS.map(c => `
        <div class="shelf-card" onclick="playSong(1)">
            <img src="${c.img}" loading="lazy" alt="${c.title}"/>
            <div class="shelf-title">${c.title}</div>
            <div class="shelf-desc">${c.desc}</div>
            <button class="btn-play-green" aria-label="Reproducir ${c.title}"><i class="fa fa-play" style="margin-left:2px"></i></button>
        </div>
    `).join('');
}

// ── 6. Lógica del reproductor ─────────────────────────────────
function loadUI(idx) {
    const song = SONGS[idx];
    currentIdx = idx;

    // Player bar — usa playerCover si existe
    const playerImg = song.playerCover || song.cover;
    document.getElementById('pb-title').textContent  = song.title;
    document.getElementById('pb-artist').textContent = song.artist;
    document.getElementById('pb-cover').src          = playerImg;

    // Right sidebar — siempre usa cover (vista previa original)
    document.getElementById('rs-header-title').textContent = song.artist;
    document.getElementById('rs-title').textContent        = song.title;
    document.getElementById('rs-artist').textContent       = song.artist;
    document.getElementById('rs-cover').src                = song.cover;

    // Botón de video
    btnVideoMode.style.display = song.videoUrl ? 'flex' : 'none';
    if (!song.videoUrl && isVideoMode) exitVideoMode();

    updateProgressUI(0, 0);
    updateMediaSession(song);
}

function playSong(idx) {
    if (currentIdx !== idx) {
        loadUI(idx);
        const song = SONGS[idx];
        audio.src = song.url;

        if (song.videoUrl) {
            mainVideo.src = song.videoUrl;
            mainVideo.load();
        } else {
            mainVideo.removeAttribute('src');
            mainVideo.load();
            if (isVideoMode) exitVideoMode();
        }
    }

    mainVideo.muted = !(isVideoMode && SONGS[idx].videoUrl);
    togglePlay(true);
}

function togglePlay(forcePlay = false) {
    const activeMedia   = isVideoMode ? mainVideo : audio;
    const inactiveMedia = isVideoMode ? audio : mainVideo;
    const song          = SONGS[currentIdx];

    if (isPlaying && !forcePlay) {
        activeMedia.pause();
        inactiveMedia.pause();
        isPlaying = false;
        playIco.className = 'fa fa-play';
        setDefaultTitle();
        updateMediaSessionState(false);
    } else {
        inactiveMedia.pause();
        const p = activeMedia.play();
        if (p !== undefined) {
            p.then(() => {
                isPlaying = true;
                playIco.className = 'fa fa-pause';
                setPlayingTitle(song);
                updateMediaSessionState(true);
            }).catch(e => {
                if (e.name !== 'AbortError') console.error('Playback failed:', e);
            });
        }
    }
}

function nextSong() {
    const next = getNextIdx();
    if (next === null) {
        // Sin repetición y es la última del álbum: para.
        isPlaying = false;
        playIco.className = 'fa fa-play';
        setDefaultTitle();
        return;
    }
    playSong(next);
}

function prevSong() {
    const activeMedia = isVideoMode ? mainVideo : audio;
    if (activeMedia.currentTime > 3) {
        activeMedia.currentTime = 0;
        if (isVideoMode) audio.currentTime = 0;
        else mainVideo.currentTime = 0;
    } else {
        const song       = SONGS[currentIdx];
        const albumSongs = getAlbumSongs(song.album);
        const posInAlbum = albumSongs.findIndex(s => s.id === song.id);
        if (posInAlbum > 0) {
            playSong(SONGS.findIndex(s => s.id === albumSongs[posInAlbum - 1].id));
        } else {
            // ya es la primera: reinicia
            activeMedia.currentTime = 0;
        }
    }
}

// ── 7. Modo video ─────────────────────────────────────────────
function enterVideoMode() {
    const song = SONGS[currentIdx];
    if (!song.videoUrl) return;

    isVideoMode = true;
    mainVideo.src = song.videoUrl;
    mainVideo.currentTime = audio.currentTime;
    mainVideo.muted = false;
    mainVideo.volume = volume;
    videoOverlay.classList.remove('hidden');

    if (isPlaying) {
        audio.pause();
        const vp = mainVideo.play();
        if (vp !== undefined) vp.catch(e => { if (e.name !== 'AbortError') console.error('Video play failed:', e); });
    }
}

function exitVideoMode() {
    isVideoMode = false;
    audio.currentTime = mainVideo.currentTime;
    videoOverlay.classList.add('hidden');

    if (isPlaying) {
        mainVideo.pause();
        const p = audio.play();
        if (p !== undefined) p.catch(e => { if (e.name !== 'AbortError') console.error('Audio play failed:', e); });
    } else {
        mainVideo.pause();
    }
}

btnVideoMode.addEventListener('click', enterVideoMode);
document.getElementById('btnAudioMode').addEventListener('click', exitVideoMode);

// ── 8. Progreso y tiempo ──────────────────────────────────────
const fmtTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
};

function updateProgressUI(pct, curTime) {
    document.getElementById('prog-fill').style.width    = pct + '%';
    document.getElementById('time-current').textContent = fmtTime(curTime);
}

function handleTimeUpdate(media) {
    const pct = media.duration ? (media.currentTime / media.duration) * 100 : 0;
    updateProgressUI(pct, media.currentTime);
    document.getElementById('time-total').textContent = fmtTime(media.duration);
}

audio.addEventListener('timeupdate',     () => { if (!isVideoMode) { handleTimeUpdate(audio);     updatePositionState(); } });
mainVideo.addEventListener('timeupdate', () => { if (isVideoMode)  { handleTimeUpdate(mainVideo); updatePositionState(); } });

// Al terminar la canción, pasa a la siguiente
audio.addEventListener('ended',     nextSong);
mainVideo.addEventListener('ended', nextSong);

// ── 9. Seek con drag en la barra de progreso ─────────────────
(function () {
    const container = document.getElementById('prog-container');
    let dragging = false;

    function seekTo(clientX) {
        const activeMedia = isVideoMode ? mainVideo : audio;
        if (!activeMedia.duration) return;
        const rect = container.getBoundingClientRect();
        const pct  = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        activeMedia.currentTime = pct * activeMedia.duration;
        if (isVideoMode) audio.currentTime = mainVideo.currentTime;
        else mainVideo.currentTime = audio.currentTime;
        updateProgressUI(pct * 100, activeMedia.currentTime);
    }

    // Mouse
    container.addEventListener('mousedown', (e) => {
        dragging = true;
        seekTo(e.clientX);
    });
    document.addEventListener('mousemove', (e) => {
        if (dragging) seekTo(e.clientX);
    });
    document.addEventListener('mouseup', () => { dragging = false; });

    // Touch
    container.addEventListener('touchstart', (e) => {
        dragging = true;
        seekTo(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
        if (dragging) seekTo(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchend', () => { dragging = false; });
})();

// ── 10. Control de volumen ────────────────────────────────────
document.getElementById('vol-container').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    volume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.volume = volume;
    mainVideo.volume = volume;
    document.getElementById('vol-fill').style.width = (volume * 100) + '%';
});

// ── 11. Botones de control ────────────────────────────────────
document.getElementById('btnPlay').addEventListener('click', () => togglePlay());
document.getElementById('btnNext').addEventListener('click', nextSong);
document.getElementById('btnPrev').addEventListener('click', prevSong);

// Repeat: cicla entre off → album → one → off
const btnRepeat = document.getElementById('btnRepeat');
function updateRepeatUI() {
    const icon = btnRepeat.querySelector('i');
    if (repeatMode === 0) {
        // off
        icon.className = 'fa fa-repeat';
        btnRepeat.style.color = 'var(--text-sub)';
        btnRepeat.style.position = 'relative';
        // quita badge si hay
        const badge = btnRepeat.querySelector('.repeat-badge');
        if (badge) badge.remove();
    } else if (repeatMode === 1) {
        // repeat context (álbum/single)
        icon.className = 'fa fa-repeat';
        btnRepeat.style.color = 'var(--spotify-green)';
        const badge = btnRepeat.querySelector('.repeat-badge');
        if (badge) badge.remove();
    } else {
        // repeat one
        icon.className = 'fa fa-repeat';
        btnRepeat.style.color = 'var(--spotify-green)';
        if (!btnRepeat.querySelector('.repeat-badge')) {
            const dot = document.createElement('span');
            dot.className = 'repeat-badge';
            dot.textContent = '1';
            dot.style.cssText = `
                position:absolute; top:-4px; right:-4px;
                background:var(--spotify-green); color:#000;
                border-radius:50%; width:14px; height:14px;
                font-size:9px; font-weight:800;
                display:flex; align-items:center; justify-content:center;
                pointer-events:none;
            `;
            btnRepeat.style.position = 'relative';
            btnRepeat.appendChild(dot);
        }
    }
}

btnRepeat.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    updateRepeatUI();
});

// Barra espaciadora
document.addEventListener('keydown', e => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
    }
});

// ── 12. Persistencia de sesión ────────────────────────────────
const SESSION_KEY = 'wtc_session';

/** Guarda el estado actual en localStorage. Llamado periódicamente y al cerrar. */
function saveSession() {
    const activeMedia = isVideoMode ? mainVideo : audio;
    localStorage.setItem(SESSION_KEY, JSON.stringify({
        idx:     currentIdx,
        time:    activeMedia.currentTime || 0,
        playing: isPlaying
    }));
}

/** Lee la sesión guardada y restaura la posición + estado de reproducción sin animaciones. */
function restoreSession() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (_) {}

    const idx     = (saved && saved.idx  >= 0 && saved.idx  < SONGS.length) ? saved.idx  : 0;
    const time    = (saved && saved.time >= 0)                               ? saved.time : 0;
    const wasPlay = !!(saved && saved.playing);

    loadUI(idx);
    audio.src    = SONGS[idx].url;
    audio.volume = volume;

    const afterSeek = () => {
        if (time > 0) {
            audio.currentTime = time;
            const pct = audio.duration ? (time / audio.duration) * 100 : 0;
            updateProgressUI(pct, time);
            document.getElementById('time-total').textContent = fmtTime(audio.duration);
        }
        // Si estaba sonando antes de navegar, reanuda automáticamente
        if (wasPlay) {
            const p = audio.play();
            if (p !== undefined) {
                p.then(() => {
                    isPlaying = true;
                    playIco.className = 'fa fa-pause';
                    setPlayingTitle(SONGS[idx]);
                    updateMediaSessionState(true);
                }).catch(() => {
                    // El navegador bloqueó el autoplay — queda pausado, sin error visible
                });
            }
        } else {
            setDefaultTitle();
        }
        audio.removeEventListener('loadedmetadata', afterSeek);
    };

    if (audio.readyState >= 1) {
        afterSeek();
    } else {
        audio.addEventListener('loadedmetadata', afterSeek);
    }
}

// Guarda cada 5 s mientras se reproduce
setInterval(() => { if (isPlaying) saveSession(); }, 5000);

// Guarda también en cada actualización de tiempo (sobreescribe, es barato)
audio.addEventListener('timeupdate', () => {
    if (!isVideoMode && isPlaying) saveSession();
});
mainVideo.addEventListener('timeupdate', () => {
    if (isVideoMode && isPlaying) saveSession();
});

// Guarda al cerrar / recargar / navegar fuera
window.addEventListener('pagehide',         saveSession);
window.addEventListener('beforeunload',     saveSession);
window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveSession();
});

// ── 13. Arranque ──────────────────────────────────────────────
renderLibrary();
renderGrids();
restoreSession();

// ── 14. Búsqueda estilo Spotify ───────────────────────────────
(function () {
    const input    = document.getElementById('searchInput');
    const dropdown = document.getElementById('searchDropdown');
    const sdList   = document.getElementById('sdList');
    const clearBtn = document.getElementById('searchClear');
    const bar      = document.getElementById('searchBar');

    const SUGGESTIONS = [
        'remix', 'instrumental', 'cult classic', 'live', 'acoustic',
        'karaoke', 'official video', 'tour', 'deluxe', 'extended'
    ];

    let focusedIdx = -1;
    let allItems   = [];

    function escHtml(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function buildResults(query) {
        const q = query.trim().toLowerCase();
        if (!q) { closeDropdown(); return; }

        // Sugerencias de texto
        const textItems = [q, ...SUGGESTIONS.map(s => `${q} ${s}`).slice(0, 4)]
            .map(s => ({ type: 'suggestion', label: s }));

        // Artistas del catálogo que coinciden
        const artistItems = (typeof WTC_ARTISTS !== 'undefined' ? WTC_ARTISTS : [])
            .filter(a => a.name.toLowerCase().includes(q) || a.aliases.some(al => al.includes(q)))
            .map(a => ({ type: 'artist', artist: a }));

        // Canciones que coinciden
        const songItems = SONGS
            .filter(s =>
                s.title.toLowerCase().includes(q)  ||
                s.artist.toLowerCase().includes(q) ||
                s.album.toLowerCase().includes(q)
            )
            .map(s => ({ type: 'song', song: s }));

        allItems   = [...textItems, ...artistItems, ...songItems];
        focusedIdx = -1;

        let html = '';

        // Sugerencias
        textItems.forEach((item, i) => {
            html += `
            <div class="sd-item" data-idx="${i}" role="option">
                <div class="sd-item-icon"><i class="fa fa-magnifying-glass"></i></div>
                <span class="sd-item-text">${escHtml(item.label)}</span>
            </div>`;
        });

        // Artistas
        if (artistItems.length) {
            html += '<div class="sd-divider"></div>';
            artistItems.forEach((item, i) => {
                const globalIdx = textItems.length + i;
                const a = item.artist;
                html += `
                <div class="sd-item" data-idx="${globalIdx}" data-artisturl="${escHtml(a.url)}" role="option">
                    <img class="sd-item-thumb" src="${escHtml(a.photo)}" alt="${escHtml(a.name)}" loading="lazy"
                         style="border-radius:50%;"/>
                    <div class="sd-item-info">
                        <div class="sd-item-title">${escHtml(a.name)}</div>
                        <div class="sd-item-meta">
                            ${a.verified ? '<i class="fa fa-circle-check" style="color:#3d91f4;"></i>' : ''}
                            Artista
                        </div>
                    </div>
                </div>`;
            });
        }

        // Canciones
        if (songItems.length) {
            html += '<div class="sd-divider"></div>';
            songItems.forEach((item, i) => {
                const globalIdx = textItems.length + artistItems.length + i;
                const s   = item.song;
                const art = s.playerCover || s.cover;
                const typeMeta = s.videoUrl
                    ? `<i class="fa fa-film"></i> Vídeo musical • ${escHtml(s.artist)}`
                    : `Canción • ${escHtml(s.artist)}`;
                html += `
                <div class="sd-item" data-idx="${globalIdx}" data-songid="${s.id}" role="option">
                    <img class="sd-item-thumb" src="${art}" alt="${escHtml(s.title)}" loading="lazy"/>
                    <div class="sd-item-info">
                        <div class="sd-item-title">${escHtml(s.title)}</div>
                        <div class="sd-item-meta">${typeMeta}</div>
                    </div>
                    <button class="sd-item-add" aria-label="Agregar" tabindex="-1">
                        <i class="fa fa-plus"></i>
                    </button>
                </div>`;
            });
        }

        sdList.innerHTML  = html;
        dropdown.hidden   = false;
        bar.classList.add('focused');

        sdList.querySelectorAll('.sd-item').forEach(el => {
            el.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const songId    = el.dataset.songid;
                const artistUrl = el.dataset.artisturl;

                if (artistUrl) {
                    // Guarda sesión antes de navegar para que la música no se interrumpa
                    saveSession();
                    location.href = artistUrl;
                } else if (songId !== undefined) {
                    const idx = SONGS.findIndex(s => s.id === parseInt(songId));
                    if (idx !== -1) playSong(idx);
                    closeDropdown();
                } else {
                    const idx = parseInt(el.dataset.idx);
                    input.value = allItems[idx].label;
                    buildResults(input.value);
                }
            });

            const addBtn = el.querySelector('.sd-item-add');
            if (addBtn) addBtn.addEventListener('mousedown', e => e.stopPropagation());
        });
    }

    function setFocused(idx) {
        const items = sdList.querySelectorAll('.sd-item');
        items.forEach(el => el.classList.remove('focused'));
        if (idx >= 0 && idx < items.length) {
            focusedIdx = idx;
            items[idx].classList.add('focused');
            items[idx].scrollIntoView({ block: 'nearest' });
        } else {
            focusedIdx = -1;
        }
    }

    function closeDropdown() {
        dropdown.hidden = true;
        bar.classList.remove('focused');
        focusedIdx = -1;
    }

    input.addEventListener('input', () => {
        clearBtn.style.display = input.value ? 'block' : 'none';
        buildResults(input.value);
    });

    input.addEventListener('focus', () => {
        if (input.value) buildResults(input.value);
    });

    input.addEventListener('keydown', (e) => {
        const items = sdList.querySelectorAll('.sd-item');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocused(Math.min(focusedIdx + 1, items.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocused(Math.max(focusedIdx - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (focusedIdx >= 0 && focusedIdx < allItems.length) {
                const item = allItems[focusedIdx];
                if (item.type === 'artist') {
                    saveSession();
                    location.href = item.artist.url;
                } else if (item.type === 'song') {
                    const idx = SONGS.findIndex(s => s.id === item.song.id);
                    if (idx !== -1) playSong(idx);
                    closeDropdown();
                } else {
                    input.value = item.label;
                    buildResults(input.value);
                }
            }
        } else if (e.key === 'Escape') {
            closeDropdown();
            input.blur();
        }
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        closeDropdown();
        input.focus();
    });

    document.getElementById('sdNavUp').addEventListener('click',   () => setFocused(Math.max(focusedIdx - 1, 0)));
    document.getElementById('sdNavDown').addEventListener('click', () => {
        const items = sdList.querySelectorAll('.sd-item');
        setFocused(Math.min(focusedIdx + 1, items.length - 1));
    });

    document.addEventListener('mousedown', (e) => {
        if (!bar.contains(e.target) && !dropdown.contains(e.target)) closeDropdown();
    });
})()

    // Sugerencias estáticas que se filtran por el texto (simulan el autocomplete de Spotify)
    const SUGGESTIONS = [
        'remix', 'instrumental', 'cult classic', 'live', 'acoustic',
        'karaoke', 'official video', 'tour', 'deluxe', 'extended'
    ];

    let focusedIdx = -1;   // índice del item resaltado con teclado
    let allItems   = [];   // lista plana de items renderizados

    function getType(song) {
        if (song.videoUrl) return 'Vídeo musical';
        return 'Canción';
    }

    function buildResults(query) {
        const q = query.trim().toLowerCase();
        if (!q) { close(); return; }

        // ── sugerencias de texto ──────────────────────────────
        const suggs = SUGGESTIONS
            .map(s => `${q} ${s}`)
            .slice(0, 4);

        // la primera sugerencia siempre es el texto exacto tal como está
        const textItems = [q, ...suggs].map(s => ({
            type: 'suggestion',
            label: s
        }));

        // ── canciones que coinciden ───────────────────────────
        const songItems = SONGS
            .filter(s =>
                s.title.toLowerCase().includes(q)  ||
                s.artist.toLowerCase().includes(q) ||
                s.album.toLowerCase().includes(q)
            )
            .map(s => ({ type: 'song', song: s }));

        allItems   = [...textItems, ...songItems];
        focusedIdx = -1;

        // ── renderizado ───────────────────────────────────────
        let html = '';

        textItems.forEach((item, i) => {
            html += `
            <div class="sd-item" data-idx="${i}" role="option">
                <div class="sd-item-icon"><i class="fa fa-magnifying-glass"></i></div>
                <span class="sd-item-text">${escHtml(item.label)}</span>
            </div>`;
        });

        if (songItems.length) {
            html += '<div class="sd-divider"></div>';
            songItems.forEach((item, i) => {
                const globalIdx = textItems.length + i;
                const s   = item.song;
                const art = s.playerCover || s.cover;
                const typeMeta = s.videoUrl
                    ? `<i class="fa fa-film"></i> Vídeo musical • ${escHtml(s.artist)}`
                    : `Canción • ${escHtml(s.artist)}`;
                html += `
                <div class="sd-item" data-idx="${globalIdx}" data-songid="${s.id}" role="option">
                    <img class="sd-item-thumb" src="${art}" alt="${escHtml(s.title)}" loading="lazy"/>
                    <div class="sd-item-info">
                        <div class="sd-item-title">${escHtml(s.title)}</div>
                        <div class="sd-item-meta">${typeMeta}</div>
                    </div>
                    <button class="sd-item-add" aria-label="Agregar" tabindex="-1">
                        <i class="fa fa-plus"></i>
                    </button>
                </div>`;
            });
        }

        sdList.innerHTML = html;
        dropdown.hidden  = false;
        bar.classList.add('focused');

        // eventos de click en cada item
        sdList.querySelectorAll('.sd-item').forEach(el => {
            el.addEventListener('mousedown', (e) => {
                e.preventDefault();   // evita que el input pierda el foco antes del click
                const songId = el.dataset.songid;
                if (songId !== undefined) {
                    const idx = SONGS.findIndex(s => s.id === parseInt(songId));
                    if (idx !== -1) playSong(idx);
                    close();
                } else {
                    // sugerencia de texto: rellena el input y re-busca
                    const idx = parseInt(el.dataset.idx);
                    input.value = allItems[idx].label;
                    buildResults(input.value);
                }
            });

            // stop propagation en el botón +
            const addBtn = el.querySelector('.sd-item-add');
            if (addBtn) {
                addBtn.addEventListener('mousedown', (e) => { e.stopPropagation(); });
            }
        });
    }

    function escHtml(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function setFocused(idx) {
        const items = sdList.querySelectorAll('.sd-item');
        items.forEach(el => el.classList.remove('focused'));
        if (idx >= 0 && idx < items.length) {
            focusedIdx = idx;
            items[idx].classList.add('focused');
            items[idx].scrollIntoView({ block: 'nearest' });
        } else {
            focusedIdx = -1;
        }
    }

    function close() {
        dropdown.hidden = true;
        bar.classList.remove('focused');
        focusedIdx = -1;
    }

    // ── Eventos del input ─────────────────────────────────────
    input.addEventListener('input', () => {
        clearBtn.style.display = input.value ? 'block' : 'none';
        buildResults(input.value);
    });

    input.addEventListener('focus', () => {
        if (input.value) buildResults(input.value);
    });

    input.addEventListener('keydown', (e) => {
        const items = sdList.querySelectorAll('.sd-item');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocused(Math.min(focusedIdx + 1, items.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocused(Math.max(focusedIdx - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (focusedIdx >= 0 && focusedIdx < allItems.length) {
                const item = allItems[focusedIdx];
                if (item.type === 'song') {
                    const idx = SONGS.findIndex(s => s.id === item.song.id);
                    if (idx !== -1) playSong(idx);
                    close();
                } else {
                    input.value = item.label;
                    buildResults(input.value);
                }
            }
        } else if (e.key === 'Escape') {
            close();
            input.blur();
        }
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        close();
        input.focus();
    });

    // botones de nav del dropdown
    document.getElementById('sdNavUp').addEventListener('click',   () => setFocused(Math.max(focusedIdx - 1, 0)));
    document.getElementById('sdNavDown').addEventListener('click', () => {
        const items = sdList.querySelectorAll('.sd-item');
        setFocused(Math.min(focusedIdx + 1, items.length - 1));
    });

    // cierra al hacer click fuera
    document.addEventListener('mousedown', (e) => {
        if (!bar.contains(e.target) && !dropdown.contains(e.target)) close();
    });
})();
