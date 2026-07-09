const BACKEND_URL = 'http://localhost:3000';

// --- ELEMENTOS DEL DOM ---
const searchInput = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');
const dropdownResults = document.getElementById('dropdownResults');

// Reproductor
const audioPlayer1 = document.getElementById('audioPlayer1');
const audioPlayer2 = document.getElementById('audioPlayer2');
const automixBtn = document.getElementById('automixBtn');
const profileBtn = document.getElementById('profileBtn');
const profileNavImg = document.getElementById('profileNavImg');
const profileNavIcon = document.getElementById('profileNavIcon');
const playerTrackImg = document.getElementById('playerTrackImg');
const playerTrackTitle = document.getElementById('playerTrackTitle');
const playerTrackArtist = document.getElementById('playerTrackArtist');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressFill = document.getElementById('progressFill');
const timeCurrent = document.getElementById('timeCurrent');
const timeTotal = document.getElementById('timeTotal');
const playerAddBtn = document.getElementById('playerAddBtn');
const progressBar = document.querySelector('.progress-bar');
const volumeBar = document.querySelector('.volume-bar');
const volumeFill = document.querySelector('.volume-fill');
const toggleBtns = document.querySelectorAll('.toggle-active');

// Sidebar Derecha
const rightCover = document.getElementById('rightCover');
const rightTitle = document.getElementById('rightTitle');
const rightArtist = document.getElementById('rightArtist');
const rightAddBtn = document.getElementById('rightAddBtn');
const relatedVideosSection = document.getElementById('relatedVideosSection');
const relatedVideosContainer = document.getElementById('relatedVideosContainer');

// Vistas SPA
const homeView = document.getElementById('homeView');
const artistProfileView = document.getElementById('artistProfileView');
const playlistView = document.getElementById('playlistView');
const navHome = document.getElementById('navHome');

// Estado
let isPlaying = false;
let currentSongData = null;
let currentFilter = 'playlists';

// Nuevos estados
let queue = [];
let queueIndex = -1;
let isShuffle = false;
let isAutomix = false;
let isCrossfading = false;
let isInfinity = false;
let activePlayer = audioPlayer1;
let nextPlayer = audioPlayer2;

// Caché de Búsqueda
const searchCache = {};

// --- LOCAL STORAGE ---
let savedLibrary = JSON.parse(localStorage.getItem('wtc_library')) || [];
let savedPlaylists = JSON.parse(localStorage.getItem('wtc_playlists')) || [];
let wtcHistory = JSON.parse(localStorage.getItem('wtc_history')) || [];
let wtcProfile = JSON.parse(localStorage.getItem('wtc_profile')) || { name: 'Usuario', pic: '' };
let wtcLikedSongs = JSON.parse(localStorage.getItem('wtc_liked_songs')) || [];

// --- STATE PERSISTENCE ---
function savePlaybackState() {
    if (!currentSongData) return;
    const state = {
        currentSongData,
        queue,
        queueIndex,
        isAutomix,
        isShuffle,
        isInfinity,
        isLoop: activePlayer.loop,
        currentVolume,
        currentTime: activePlayer.currentTime
    };
    localStorage.setItem('wtc_playback_state', JSON.stringify(state));
}

function restorePlaybackState() {
    const stateStr = localStorage.getItem('wtc_playback_state');
    if (!stateStr) return;
    try {
        const state = JSON.parse(stateStr);
        if (state.currentSongData) {
            currentSongData = state.currentSongData;
            queue = state.queue || [];
            queueIndex = state.queueIndex || 0;
            isAutomix = state.isAutomix || false;
            isShuffle = state.isShuffle || false;
            isInfinity = state.isInfinity || false;
            activePlayer.loop = state.isLoop || false;
            if (state.currentVolume !== undefined) {
                currentVolume = state.currentVolume;
                activePlayer.volume = currentVolume;
                volumeFill.style.width = `${currentVolume * 100}%`;
            }
            if(isAutomix) automixBtn.classList.add('active-automix');
            
            // Restore button visual states
            const uiShuffle = document.querySelector('.fa-shuffle')?.parentElement;
            if (uiShuffle) uiShuffle.classList.toggle('text-green', isShuffle);
            const uiRepeat = document.querySelector('.fa-repeat')?.parentElement;
            if (uiRepeat) uiRepeat.classList.toggle('text-green', activePlayer.loop);
            const uiInfinity = document.querySelector('.fa-infinity')?.parentElement;
            if (uiInfinity) {
                uiInfinity.classList.toggle('text-green', isInfinity);
                uiInfinity.classList.toggle('active-automix', isInfinity);
            }
            
            updatePlayerUI(currentSongData);
            activePlayer.src = `${BACKEND_URL}/api/stream/${currentSongData.id}`;
            activePlayer.load();
            
            activePlayer.addEventListener('loadedmetadata', function restoreTime() {
                activePlayer.currentTime = state.currentTime || 0;
                activePlayer.removeEventListener('loadedmetadata', restoreTime);
            });
        }
    } catch(e) { console.error('Error restoring state', e); }
}

window.addEventListener('DOMContentLoaded', () => {
    restorePlaybackState();
    renderLibrary();
    showView('home');
    if (wtcProfile.name) {
        document.getElementById('profileNavIcon').style.display = wtcProfile.pic ? 'none' : 'block';
        if(wtcProfile.pic) {
            profileNavImg.src = wtcProfile.pic;
            profileNavImg.style.display = 'block';
        }
    }
});

const videoView = document.getElementById('videoView');

// --- NAVEGACIÓN Y VISTAS ---
function showView(viewName) {
    homeView.style.display = 'none';
    artistProfileView.style.display = 'none';
    playlistView.style.display = 'none';
    videoView.style.display = 'none';
    const queueView = document.getElementById('queueView');
    if(queueView) queueView.style.display = 'none';

    if(viewName === 'home') {
        homeView.style.display = 'block';
        renderHome();
    } else if (viewName === 'artist') {
        artistProfileView.style.display = 'block';
    } else if (viewName === 'playlist') {
        playlistView.style.display = 'block';
    } else if (viewName === 'queue') {
        if(queueView) queueView.style.display = 'block';
    } else if (viewName === 'video') {
        videoView.style.display = 'block';
    }
}
navHome.addEventListener('click', () => showView('home'));

// --- INICIO Y ALGORITMO ---
const homeDynamicContent = document.getElementById('homeDynamicContent');
function renderHome() {
    homeDynamicContent.innerHTML = '';
    if (wtcHistory.length === 0) {
        homeDynamicContent.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-headphones"></i>
                <h1>¿Qué quieres escuchar hoy?</h1>
                <p>Busca tus canciones o artistas favoritos en la barra superior para comenzar a llenar tu inicio.</p>
            </div>
        `;
        return;
    }

    const recentUnique = [];
    const seen = new Set();
    for (let i = 0; i < wtcHistory.length; i++) {
        if (!seen.has(wtcHistory[i].id)) {
            recentUnique.push(wtcHistory[i]);
            seen.add(wtcHistory[i].id);
        }
        if (recentUnique.length >= 8) break;
    }

    let recentHTML = '<div class="recent-grid">';
    recentUnique.forEach(song => {
        const titleEsc = song.title.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const artistEsc = song.artist.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        recentHTML += `
            <div class="recent-card song-item" data-id="${song.id}" data-title="${titleEsc}" data-artist="${artistEsc}" data-thumbnail="${song.thumbnail}" onclick="loadTrack('${song.id}', '${titleEsc}', '${artistEsc}', '${song.thumbnail}')">
                <img src="${song.thumbnail}" alt="Cover">
                <p>${song.title}</p>
                <button class="quick-add-btn" onclick="event.stopPropagation(); quickAddAction('${song.id}', '${titleEsc}', '${artistEsc}', '${song.thumbnail}')"><i class="fa-solid fa-plus"></i></button>
                <button class="play-btn-card"><i class="fa-solid fa-play"></i></button>
            </div>
        `;
    });
    recentHTML += '</div>';

    const userName = wtcProfile.name || 'ti';
    let sectionsHTML = `
        <div style="display:flex; gap: 24px; margin-bottom: 40px;">
            <div style="flex:1;">
                <div class="section-header" style="margin-bottom:16px;">
                    <h2>Cómo empezar</h2>
                </div>
                <div style="background: linear-gradient(135deg, #a63f69, #5e2840); border-radius: 8px; padding: 24px; display:flex; gap: 20px; color:white; min-height: 280px;">
                    <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between; height:100%;">
                        <div>
                            <h2 style="font-size:40px; font-weight:800; margin-bottom:16px; line-height:1;">4. Añade contenido...</h2>
                            <p style="font-size:18px; opacity:0.9; line-height:1.4; max-width:90%;">Incorpora contenido a tu cola, arrástralo, suéltalo y controla lo que se reproducirá a continuación.</p>
                        </div>
                        <div style="display:flex; flex-direction:column; align-items:flex-start; gap:16px; margin-top:24px;">
                            <button onclick="loadQueueView()" style="background:#1ed760; color:#000; border:none; padding:12px 24px; border-radius:500px; font-weight:700; font-size:16px; cursor:pointer;">Abrir cola</button>
                            <span style="font-size:16px; font-weight:700; cursor:pointer; opacity:0.9;">Ver más consejos</span>
                        </div>
                    </div>
                    
                    <div style="width:280px; background:#121212; border-radius:8px; padding:16px; box-shadow:0 8px 24px rgba(0,0,0,0.5); display:flex; flex-direction:column; gap:16px; user-select:none;">
                        <div style="display:flex; gap:16px; font-size:13px; font-weight:700; color:var(--text-muted); border-bottom:1px solid #282828; padding-bottom:8px;">
                            <span style="color:#fff; border-bottom:2px solid #1ed760; padding-bottom:6px; margin-bottom:-9px;">Cola</span>
                            <span>Escuchado recientemente</span>
                        </div>
                        
                        <div>
                            <h4 style="font-size:13px; margin-bottom:8px;">Sonando</h4>
                            <div style="display:flex; align-items:center; gap:12px;">
                                <img src="${currentSongData ? currentSongData.thumbnail : 'https://via.placeholder.com/150'}" style="width:40px; height:40px; border-radius:4px; object-fit:cover;">
                                <div style="display:flex; flex-direction:column; overflow:hidden;">
                                    <span style="font-size:14px; font-weight:600; color:#1ed760; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${currentSongData ? currentSongData.title : 'Ninguna'}</span>
                                    <span style="font-size:13px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${currentSongData ? currentSongData.artist : 'artista'}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 style="font-size:13px; margin-bottom:8px;">A continuación en la cola</h4>
                            <div style="display:flex; flex-direction:column; gap:10px;">
                                ${queue.slice(queueIndex + 1, queueIndex + 4).map((q, i) => `
                                    <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" onclick="queueIndex = ${queueIndex + 1 + i}; playQueueIndex();">
                                        <img src="${q.thumbnail}" style="width:40px; height:40px; border-radius:4px; object-fit:cover;">
                                        <div style="display:flex; flex-direction:column; overflow:hidden;">
                                            <span style="font-size:14px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${q.title}</span>
                                            <span style="font-size:13px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${q.artist}</span>
                                        </div>
                                    </div>
                                `).join('')}
                                ${queue.length <= queueIndex + 1 ? '<span style="font-size:13px; color:var(--text-muted);">Vacía</span>' : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section-header" style="margin-top: 40px; margin-bottom:16px;">
                    <h2>Álbumes Recomendados</h2>
                </div>
                <div class="recent-grid">
                    <div class="recent-card song-item" onclick="loadMixView('MOTOMAMI', 'El aclamado álbum de Rosalía.', 'https://upload.wikimedia.org/wikipedia/en/2/23/Rosal%C3%ADa_-_Motomami.png', 'Rosalia', '#b33232')">
                        <img src="https://upload.wikimedia.org/wikipedia/en/2/23/Rosal%C3%ADa_-_Motomami.png" alt="Motomami">
                        <p>MOTOMAMI</p>
                    </div>
                    <div class="recent-card song-item" onclick="loadMixView('Un Verano Sin Ti', 'Éxitos de Bad Bunny.', 'https://upload.wikimedia.org/wikipedia/en/3/3f/Bad_Bunny_-_Un_Verano_Sin_Ti.png', 'Bad Bunny', '#e67345')">
                        <img src="https://upload.wikimedia.org/wikipedia/en/3/3f/Bad_Bunny_-_Un_Verano_Sin_Ti.png" alt="Un Verano Sin Ti">
                        <p>Un Verano Sin Ti</p>
                    </div>
                    <div class="recent-card song-item" onclick="loadMixView('Starboy', 'The Weeknd y Daft Punk.', 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png', 'The Weeknd', '#c92a2a')">
                        <img src="https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png" alt="Starboy">
                        <p>Starboy</p>
                    </div>
                    <div class="recent-card song-item" onclick="loadMixView('YHLQMDLG', 'Bad Bunny.', 'https://upload.wikimedia.org/wikipedia/en/f/f6/Bad_Bunny_-_Yhlqmdlg.png', 'Bad Bunny', '#454545')">
                        <img src="https://upload.wikimedia.org/wikipedia/en/f/f6/Bad_Bunny_-_Yhlqmdlg.png" alt="YHLQMDLG">
                        <p>YHLQMDLG</p>
                    </div>
                </div>

            </div>
            
            <div style="width: 320px; display:flex; flex-direction:column; gap:24px;">
                <div class="section-header">
                    <h2>Mixes para ${userName}</h2>
                </div>
                <div style="display:flex; flex-direction:column; gap:16px;">
                    <!-- Descubrimiento -->
                    <div class="card" onclick="loadMixView('Descubrimiento Semanal', 'Nuevas canciones de tus artistas favoritos.', 'https://newjams-images.scdn.co/image/ab676477000033ad/dt/v3/discover-weekly/aAbca4VN5PIHvn1O-9YJ5Kiv-BwXb_O-2y-a_2mGj2F-8ZfM23y19Yx11mUa3tB7pQd_Vz8WwZlX53kR_1hK26Gg72d6Q3bI_U3d84w6Hcw=/NjA6MzM6MDlUMTEtNzAtNA==', 'discover', '#450af5')">
                        <img src="https://newjams-images.scdn.co/image/ab676477000033ad/dt/v3/discover-weekly/aAbca4VN5PIHvn1O-9YJ5Kiv-BwXb_O-2y-a_2mGj2F-8ZfM23y19Yx11mUa3tB7pQd_Vz8WwZlX53kR_1hK26Gg72d6Q3bI_U3d84w6Hcw=/NjA6MzM6MDlUMTEtNzAtNA==" alt="Mix">
                        <h3 style="font-size:16px;">Descubrimiento Semanal</h3>
                        <p style="font-size:14px;">Nuevas canciones de tus artistas favoritos.</p>
                    </div>
                    
                    ${artists.map(artist => `
                        <div class="card" onclick="loadMixView('Mix de ${artist.replace(/'/g, "\\'")}', 'Inspirado en tu historial reciente.', 'https://via.placeholder.com/150/1ed760/000000?text=${artist.charAt(0)}', '${artist.replace(/'/g, "\\'")}', '#1ed760')">
                            <img src="https://via.placeholder.com/150/1ed760/000000?text=${artist.charAt(0)}" alt="${artist}">
                            <h3 style="font-size:16px;">Mix de ${artist}</h3>
                            <p style="font-size:14px;">Inspirado en tu historial reciente.</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    sectionsHTML += `
        <section class="section" style="margin-bottom: 40px;">
            <div class="section-header" style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px;">
                <div>
                    <span style="color:var(--text-muted); font-size:14px; display:block; margin-bottom:4px;">Hecho para</span>
                    <h2 style="font-size:28px;">${userName}</h2>
                </div>
                <span style="font-size:14px; font-weight:700; cursor:pointer; color:var(--text-muted);">Mostrar todos</span>
            </div>
            <div class="cards-grid">
                <div class="card" onclick="loadMixView('Descubrimiento Semanal', 'Nuevas canciones de tus artistas favoritos.', 'https://newjams-images.scdn.co/image/ab676477000033ad/dt/v3/discover-weekly/aAbca4VN5PIHvn1O-9YJ5Kiv-BwXb_O-2y-a_2mGj2F-8ZfM23y19Yx11mUa3tB7pQd_Vz8WwZlX53kR_1hK26Gg72d6Q3bI_U3d84w6Hcw=/NjA6MzM6MDlUMTEtNzAtNA==', 'discover', '#450af5')">
                    <img src="https://newjams-images.scdn.co/image/ab676477000033ad/dt/v3/discover-weekly/aAbca4VN5PIHvn1O-9YJ5Kiv-BwXb_O-2y-a_2mGj2F-8ZfM23y19Yx11mUa3tB7pQd_Vz8WwZlX53kR_1hK26Gg72d6Q3bI_U3d84w6Hcw=/NjA6MzM6MDlUMTEtNzAtNA==" alt="Mix">
                    <h3 style="font-size:16px;">Descubrimiento Semanal</h3>
                    <p style="font-size:14px;">Nuevas canciones de tus artistas favoritos.</p>
                </div>
    `;

    const artists = [...new Set(recentUnique.map(s => s.artist))].slice(0, 3);
    artists.forEach((artist, idx) => {
        const artistSongs = recentUnique.filter(s => s.artist === artist);
        if(artistSongs.length > 0) {
            const firstSong = artistSongs[0];
            const mixCover = firstSong.thumbnail;
            const mixTitleEsc = `Mix de ${artist.replace(/'/g, "\\'")}`;
            const mixDescEsc = `Tu mezcla personalizada de ${artist.replace(/'/g, "\\'")}.`;
            const mixCoverEsc = mixCover.replace(/'/g, "\\'");
            const artistIdEsc = artist.replace(/'/g, "\\'");
            sectionsHTML += `
                <div class="card" onclick="loadMixView('${mixTitleEsc}', '${mixDescEsc}', '${mixCoverEsc}', '${artistIdEsc}', '#1ed760')">
                    <img src="${firstSong.thumbnail}" alt="Mix Cover">
                    <h3 style="font-size:16px;">Mix de ${artist}</h3>
                    <p style="font-size:14px;">Tu mezcla personalizada de ${artist}.</p>
                    <button class="play-btn-card"><i class="fa-solid fa-play"></i></button>
                </div>
            `;
        }
    });
    
    sectionsHTML += `</div></section>`;
    
    homeDynamicContent.innerHTML = recentHTML + sectionsHTML;
}

function addToHistory(songData) {
    wtcHistory.unshift(songData);
    if (wtcHistory.length > 100) wtcHistory.pop();
    localStorage.setItem('wtc_history', JSON.stringify(wtcHistory));
}

// --- BIBLIOTECA Y PLAYLISTS ---
const libraryList = document.getElementById('libraryList');

window.filterLibrary = function(type) {
    if (currentFilter === type) {
        currentFilter = 'all'; // Toggle off
    } else {
        currentFilter = type;
    }
    
    document.querySelectorAll('.library-filters .badge').forEach(b => {
        b.style.backgroundColor = 'var(--bg-active)';
        b.style.color = 'var(--text-main)';
        if(currentFilter !== 'all' && b.innerText.toLowerCase().includes(currentFilter === 'playlists' ? 'listas' : 'canciones')) {
            b.style.backgroundColor = '#fff';
            b.style.color = '#000';
        }
    });
    renderLibrary();
};

function renderLibrary() {
    libraryList.innerHTML = '';
    
    let hasItems = false;

    // Playlists
    if (currentFilter === 'all' || currentFilter === 'playlists') {
        // Canciones que te gustan (Liked Songs)
        hasItems = true;
        const likedItem = document.createElement('div');
        likedItem.classList.add('lib-item');
        likedItem.innerHTML = `
            <div class="lib-img liked"><i class="fa-solid fa-heart"></i></div>
            <div class="lib-info">
                <p>Canciones que te gustan</p>
                <span>Lista • ${wtcLikedSongs.length} canciones</span>
            </div>
        `;
        likedItem.addEventListener('click', () => loadLikedSongsView());
        libraryList.appendChild(likedItem);

        savedPlaylists.forEach(pl => {
            hasItems = true;
            const item = document.createElement('div');
            item.classList.add('lib-item');
            item.innerHTML = `
                <div class="lib-img" style="background:#282828;"><i class="fa-solid fa-music"></i></div>
                <div class="lib-info">
                    <p>${pl.name}</p>
                    <span>Playlist • ${pl.songs.length} canciones</span>
                </div>
            `;
            item.addEventListener('click', () => loadPlaylistView(pl.id));
            libraryList.appendChild(item);
        });
    }
    
    // Songs
    if (currentFilter === 'all' || currentFilter === 'songs') {
        savedLibrary.forEach(song => {
            hasItems = true;
            const item = document.createElement('div');
            item.classList.add('lib-item', 'song-item');
            item.dataset.id = song.id;
            item.dataset.title = song.title;
            item.dataset.artist = song.artist;
            item.dataset.thumbnail = song.thumbnail;
            item.innerHTML = `
                <div class="lib-img">
                    <img src="${song.thumbnail}" alt="Cover" style="width:100%; border-radius:4px; object-fit:cover;">
                </div>
                <div class="lib-info">
                    <p>${song.title}</p>
                    <span>Canción • ${song.artist}</span>
                </div>
            `;
            item.addEventListener('click', () => loadTrack(song.id, song.title, song.artist, song.thumbnail));
            libraryList.appendChild(item);
        });
    }

    if (!hasItems) {
        libraryList.innerHTML = '<p style="padding: 10px; color: var(--text-muted); font-size: 13px; text-align:center;">Tu biblioteca está vacía.</p>';
    }
}

// Modales de Playlists
const createPlaylistBtn = document.getElementById('createPlaylistBtn');
const createPlaylistModal = document.getElementById('createPlaylistModal');
const savePlaylistBtn = document.getElementById('savePlaylistBtn');
const playlistNameInput = document.getElementById('playlistNameInput');

const addToPlaylistModal = document.getElementById('addToPlaylistModal');
const modalPlaylistsList = document.getElementById('modalPlaylistsList');
let songToAdd = null;

window.quickAddAction = function(id, title, artist, thumbnail) {
    const song = {id, title, artist, thumbnail};
    addToLibrary(song);
    openAddToPlaylistModal(song);
};

createPlaylistBtn.addEventListener('click', () => {
    playlistNameInput.value = '';
    createPlaylistModal.style.display = 'flex';
    playlistNameInput.focus();
});

savePlaylistBtn.addEventListener('click', () => {
    const name = playlistNameInput.value.trim();
    if(name) {
        const newPlaylist = { id: Date.now().toString(), name: name, songs: [] };
        savedPlaylists.push(newPlaylist);
        localStorage.setItem('wtc_playlists', JSON.stringify(savedPlaylists));
        createPlaylistModal.style.display = 'none';
        filterLibrary('playlists');
    }
});

function openAddToPlaylistModal(song) {
    songToAdd = song;
    modalPlaylistsList.innerHTML = '';
    
    // Always add "Canciones que te gustan" first
    const likedLi = document.createElement('li');
    likedLi.innerHTML = `<i class="fa-solid fa-heart" style="color:var(--spotify-green);"></i> <span>Canciones que te gustan</span>`;
    likedLi.addEventListener('click', () => {
        if(!wtcLikedSongs.find(s => s.id === song.id)) {
            wtcLikedSongs.push(song);
            localStorage.setItem('wtc_liked_songs', JSON.stringify(wtcLikedSongs));
        }
        addToPlaylistModal.style.display = 'none';
        if(currentFilter === 'playlists' || currentFilter === 'all') renderLibrary();
    });
    modalPlaylistsList.appendChild(likedLi);
    
    if (savedPlaylists.length > 0) {
        savedPlaylists.forEach(pl => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-music"></i> <span>${pl.name}</span>`;
            li.addEventListener('click', () => {
                if(!pl.songs.find(s => s.id === song.id)) {
                    pl.songs.push(song);
                    localStorage.setItem('wtc_playlists', JSON.stringify(savedPlaylists));
                }
                addToPlaylistModal.style.display = 'none';
                if(currentFilter === 'playlists') renderLibrary();
            });
            modalPlaylistsList.appendChild(li);
        });
    }
    addToPlaylistModal.style.display = 'flex';
}

function loadLikedSongsView() {
    showView('playlist');
    document.getElementById('playlistViewName').innerText = 'Canciones que te gustan';
    document.getElementById('playlistSongCount').innerText = wtcLikedSongs.length;
    
    const header = document.querySelector('.playlist-header');
    header.style.background = 'transparent';
    header.style.padding = '24px';
    
    // Override playlist cover to look like liked songs
    const cover = document.querySelector('.playlist-cover');
    cover.style.background = 'linear-gradient(135deg, #450af5, #c4efd9)';
    cover.innerHTML = '<i class="fa-solid fa-heart" style="color:white;"></i>';

    const list = document.getElementById('playlistSongsList');
    list.innerHTML = '';
    
    wtcLikedSongs.forEach((song, index) => {
        const titleEsc = song.title.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const artistEsc = song.artist.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const row = document.createElement('div');
        row.classList.add('playlist-row', 'song-item');
        row.dataset.id = song.id;
        row.dataset.title = titleEsc;
        row.dataset.artist = artistEsc;
        row.dataset.thumbnail = song.thumbnail;
        
        row.innerHTML = `
            <span>${index + 1}</span>
            <div class="row-title">
                <img src="${song.thumbnail}" alt="Cover">
                <div style="display:flex; flex-direction:column;">
                    <span style="font-weight:600; color:#fff;">${song.title}</span>
                    <span class="clickable-artist" onclick="event.stopPropagation(); loadArtistProfile('${artistEsc}')">${song.artist}</span>
                </div>
            </div>
            <span>-</span>
            <span><i class="fa-solid fa-play"></i></span>
        `;
        row.addEventListener('click', () => loadTrack(song.id, titleEsc, artistEsc, song.thumbnail));
        list.appendChild(row);
    });
}

function loadPlaylistView(playlistId) {
    const pl = savedPlaylists.find(p => p.id === playlistId);
    if(!pl) return;
    
    const cover = document.querySelector('.playlist-cover');
    cover.style.background = '#282828';
    cover.innerHTML = '<i class="fa-solid fa-music"></i>';
    
    const header = document.querySelector('.playlist-header');
    header.style.background = 'transparent';
    header.style.padding = '24px';
    
    showView('playlist');
    document.getElementById('playlistViewName').innerText = pl.name;
    document.getElementById('playlistSongCount').innerText = pl.songs.length;
    
    const list = document.getElementById('playlistSongsList');
    list.innerHTML = '';
    
    pl.songs.forEach((song, index) => {
        const row = document.createElement('div');
        row.classList.add('playlist-row', 'song-item');
        row.dataset.id = song.id;
        row.dataset.title = song.title;
        row.dataset.artist = song.artist;
        row.dataset.thumbnail = song.thumbnail;
        row.innerHTML = `
            <div style="color:var(--text-muted);">${index + 1}</div>
            <div class="row-title">
                <img src="${song.thumbnail}" alt="Cover">
                <div class="row-title-info">
                    <span>${song.title}</span>
                    <small>${song.artist}</small>
                </div>
            </div>
            <div style="color:var(--text-muted);">${song.artist}</div>
            <div style="text-align:right;"><i class="fa-solid fa-play"></i></div>
        `;
        row.addEventListener('click', () => loadTrack(song.id, song.title, song.artist, song.thumbnail));
        list.appendChild(row);
    });
}

// Botones Guardar (+) Canción
function addToLibrary(song) {
    if (!savedLibrary.find(s => s.id === song.id)) {
        savedLibrary.push(song);
        localStorage.setItem('wtc_library', JSON.stringify(savedLibrary));
        if(currentFilter === 'songs') renderLibrary();
    }
}
function updateAddButtonsState(songId) {
    const isSaved = savedLibrary.some(s => s.id === songId);
    [playerAddBtn, rightAddBtn].forEach(btn => {
        if (!btn) return;
        btn.style.display = 'block';
        if (isSaved) {
            btn.classList.replace('fa-circle-plus', 'fa-circle-check');
            btn.classList.replace('text-muted', 'text-green');
            btn.style.color = 'var(--spotify-green)';
        } else {
            btn.classList.replace('fa-circle-check', 'fa-circle-plus');
            btn.classList.replace('text-green', 'text-muted');
            btn.style.color = 'var(--text-muted)';
        }
    });
}
function handleSaveCurrentSong() {
    if (currentSongData) {
        addToLibrary(currentSongData);
        updateAddButtonsState(currentSongData.id);
    }
}
playerAddBtn.addEventListener('click', handleSaveCurrentSong);
rightAddBtn.addEventListener('click', handleSaveCurrentSong);


// --- BÚSQUEDA CACHEADA ---
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    if (!query) {
        searchDropdown.classList.remove('active');
        return;
    }
    
    // Si tenemos en caché, mostrar de inmediato
    if (searchCache[query]) {
        renderSearchResults(searchCache[query]);
        return;
    }

    searchTimeout = setTimeout(() => {
        performSearch(query);
    }, 400);
});

async function performSearch(query) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`);
        let songs = await response.json();
        if (!Array.isArray(songs)) songs = [];
        searchCache[query] = songs; // Guardar en caché
        renderSearchResults(songs);
    } catch (error) {
        console.error("Error al buscar:", error);
    }
}

function renderSearchResults(songs) {
    dropdownResults.innerHTML = '';
    if (songs.length === 0) {
        dropdownResults.innerHTML = '<li class="dropdown-item"><p style="color:var(--text-muted)">No hay resultados</p></li>';
        searchDropdown.classList.add('active');
        return;
    }

    songs.forEach(song => {
        const isSaved = savedLibrary.some(s => s.id === song.id);
        const li = document.createElement('li');
        li.classList.add('dropdown-item', 'song-item');
        li.dataset.id = song.id;
        li.dataset.title = song.title;
        li.dataset.artist = song.artist;
        li.dataset.thumbnail = song.thumbnail;
        li.innerHTML = `
            <img src="${song.thumbnail}" alt="Cover">
            <div class="dropdown-item-info">
                <p>${song.title}</p>
                <span>Canción • ${song.artist}</span>
            </div>
            <i class="fa-solid fa-list add-to-pl-btn" style="margin-left:auto; margin-right:15px; color:var(--text-muted); cursor:pointer;" title="Añadir a Playlist"></i>
            <i class="fa-solid ${isSaved ? 'fa-check' : 'fa-plus'} add-to-lib-btn" style="color:${isSaved ? 'var(--spotify-green)' : 'var(--text-muted)'}; cursor:pointer; font-size: 16px;"></i>
        `;
        
        li.addEventListener('click', () => {
            loadTrack(song.id, song.title, song.artist, song.thumbnail);
            searchDropdown.classList.remove('active');
            searchInput.value = ''; 
        });

        // Botón Playlist
        const plBtn = li.querySelector('.add-to-pl-btn');
        plBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openAddToPlaylistModal(song);
        });

        // Botón Library
        const libBtn = li.querySelector('.add-to-lib-btn');
        libBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            addToLibrary(song);
            libBtn.classList.replace('fa-plus', 'fa-check');
            libBtn.style.color = 'var(--spotify-green)';
            if (currentSongData && currentSongData.id === song.id) {
                updateAddButtonsState(song.id);
            }
        });

        dropdownResults.appendChild(li);
    });
    searchDropdown.classList.add('active');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-bar-wrapper')) {
        searchDropdown.classList.remove('active');
    }
});


// --- PERFIL DE ARTISTA Y RELACIONADOS (API REAL) ---
async function loadArtistProfile(artistName) {
    showView('artist');
    document.getElementById('artistProfileName').innerText = artistName;
    const container = document.getElementById('artistPopularSongs');
    container.innerHTML = '<p style="color:var(--text-muted);">Cargando canciones...</p>';

    try {
        const res = await fetch(`${BACKEND_URL}/api/related?artist=${encodeURIComponent(artistName)}`);
        const songs = await res.json();
        
        container.innerHTML = '';
        songs.forEach((song, index) => {
            const row = document.createElement('div');
            row.classList.add('playlist-row', 'song-item');
            row.dataset.id = song.id;
            row.dataset.title = song.title;
            row.dataset.artist = song.artist;
            row.dataset.thumbnail = song.thumbnail;
            row.innerHTML = `
                <div style="color:var(--text-muted);">${index + 1}</div>
                <div class="row-title">
                    <img src="${song.thumbnail}" alt="Cover">
                    <div class="row-title-info">
                        <span>${song.title}</span>
                    </div>
                </div>
                <div style="color:var(--text-muted);">${song.artist}</div>
                <div style="text-align:right;"><i class="fa-solid fa-play"></i></div>
            `;
            row.addEventListener('click', () => loadTrack(song.id, song.title, song.artist, song.thumbnail));
            container.appendChild(row);
        });

    } catch(err) {
        container.innerHTML = '<p style="color:red;">Error al cargar temas populares</p>';
    }
}

async function fetchRelatedVideos(artistName) {
    relatedVideosContainer.innerHTML = '<p style="color:var(--text-muted); font-size:12px;">Cargando...</p>';
    try {
        const res = await fetch(`${BACKEND_URL}/api/related?artist=${encodeURIComponent(artistName)}`);
        const songs = await res.json();
        
        relatedVideosContainer.innerHTML = '';
        // Mostramos 3 relacionados
        songs.slice(0,3).forEach(song => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.gap = '10px';
            div.style.alignItems = 'center';
            div.style.cursor = 'pointer';
            div.classList.add('song-item');
            div.dataset.id = song.id;
            div.dataset.title = song.title;
            div.dataset.artist = song.artist;
            div.dataset.thumbnail = song.thumbnail;
            
            div.innerHTML = `
                <img src="${song.thumbnail}" style="width:70px; height:50px; border-radius:4px; object-fit:cover;" alt="Video">
                <div style="display:flex; flex-direction:column;">
                    <span style="font-size:13px; font-weight:600; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${song.title}</span>
                </div>
            `;
            div.addEventListener('click', () => loadTrack(song.id, song.title, song.artist, song.thumbnail));
            relatedVideosContainer.appendChild(div);
        });
    } catch(err) {
        relatedVideosContainer.innerHTML = '<p style="color:red; font-size:12px;">Error al cargar</p>';
    }
}


// --- REPRODUCCIÓN CORE Y COLA ---
function loadTrack(id, title, artist, thumbnail) {
    const song = { id, title, artist, thumbnail };
    queue = [song];
    queueIndex = 0;
    playQueueIndex();
}

function playQueueIndex() {
    if (queueIndex < 0 || queueIndex >= queue.length) return;
    
    currentSongData = queue[queueIndex];
    updatePlayerUI(currentSongData);

    // Cargar y reproducir en activePlayer
    activePlayer.src = `${BACKEND_URL}/api/stream/${currentSongData.id}`;
    activePlayer.load();
    activePlayer.volume = currentVolume; // restore volume
    activePlayer.play().then(() => {
        isPlaying = true;
        updatePlayPauseIcon();
        isCrossfading = false;
    }).catch(error => {
        console.log("Autoplay bloqueado:", error);
        isPlaying = false;
        updatePlayPauseIcon();
    });
}

function updatePlayerUI(song) {
    playerTrackTitle.innerText = song.title;
    playerTrackArtist.innerText = song.artist;
    playerTrackImg.src = song.thumbnail;
    playerTrackImg.style.display = 'block';

    rightTitle.innerText = song.title;
    rightArtist.innerText = song.artist;
    rightCover.src = song.thumbnail;
    rightCover.style.opacity = '1';
    relatedVideosSection.style.display = 'block';

    document.querySelectorAll('.clickable-artist').forEach(el => {
        el.onclick = () => loadArtistProfile(song.artist);
    });

    updateAddButtonsState(song.id);
    addToHistory(song);
    fetchRelatedVideos(song.artist);
    savePlaybackState();
    
    if (isVideoMode) injectVideoIframe(document.getElementById('rightVideoContainer'), song.id);
    if (videoView.style.display === 'block') injectVideoIframe(document.getElementById('mainVideoContainer'), song.id);

    // Update Queue Views if they are visible
    if (document.getElementById('rightQueueContent')?.style.display === 'flex') {
        loadQueueView();
    }
    if (homeView.style.display === 'block') {
        renderHome();
    }

    // MediaSession API Integration
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist,
            album: 'WTC Music',
            artwork: [
                { src: song.thumbnail, sizes: '512x512', type: 'image/jpeg' }
            ]
        });

        navigator.mediaSession.setActionHandler('play', () => { activePlayer.play(); });
        navigator.mediaSession.setActionHandler('pause', () => { activePlayer.pause(); });
        navigator.mediaSession.setActionHandler('previoustrack', playPrev);
        navigator.mediaSession.setActionHandler('nexttrack', playNext);
    }
}

// Lógica de Automix
automixBtn.addEventListener('click', () => {
    isAutomix = !isAutomix;
    automixBtn.classList.toggle('active-automix', isAutomix);
});

let currentVolume = 0.5;

function handleTimeUpdate() {
    if (this !== activePlayer) return; // Sólo actualizar barra con el reproductor activo principal

    if (this.duration) {
        const percent = (this.currentTime / this.duration) * 100;
        progressFill.style.width = `${percent}%`;
        timeCurrent.innerText = formatTime(this.currentTime);
        timeTotal.innerText = formatTime(this.duration);

        // Automix Crossfade trigger (10 seconds before end)
        if (isAutomix && (this.duration - this.currentTime) <= 10 && !isCrossfading) {
            triggerCrossfade();
        }

        if (Math.floor(this.currentTime) % 5 === 0) {
            savePlaybackState();
        }
    }
}
audioPlayer1.addEventListener('timeupdate', handleTimeUpdate);
audioPlayer2.addEventListener('timeupdate', handleTimeUpdate);

// --- VIDEO TOGGLE LOGIC ---
let isVideoMode = false;
const toggleVideoSidebarBtn = document.getElementById('toggleVideoSidebarBtn');
const rightVideoContainer = document.getElementById('rightVideoContainer');
// rightCover already declared
const mainVideoContainer = document.getElementById('mainVideoContainer');
const toggleAudioMainBtn = document.getElementById('toggleAudioMainBtn');

function injectVideoIframe(container, videoId) {
    container.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&origin=https://www.youtube.com" frameborder="0" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin" style="pointer-events:none;"></iframe>`;
}

toggleVideoSidebarBtn.addEventListener('click', () => {
    if (!currentSongData) return;
    isVideoMode = !isVideoMode;
    if (isVideoMode) {
        rightCover.style.display = 'none';
        rightVideoContainer.style.display = 'block';
        toggleVideoSidebarBtn.innerHTML = '<i class="fa-solid fa-music"></i> Cambiar a audio';
        injectVideoIframe(rightVideoContainer, currentSongData.id);
    } else {
        rightCover.style.display = 'block';
        rightVideoContainer.style.display = 'none';
        rightVideoContainer.innerHTML = ''; // Destroy iframe
        toggleVideoSidebarBtn.innerHTML = '<i class="fa-solid fa-music"></i> Cambiar a vídeo';
    }
});

window.enterFullVideo = function() {
    if(!currentSongData) return;
    showView('video');
    injectVideoIframe(mainVideoContainer, currentSongData.id);
};

toggleAudioMainBtn.addEventListener('click', () => {
    showView('home');
    mainVideoContainer.innerHTML = '';
    // Resync sidebar if it was on
    if (isVideoMode && currentSongData) {
        injectVideoIframe(rightVideoContainer, currentSongData.id);
    }
});

const infinityBtn = document.getElementById('infinityBtn');
infinityBtn.addEventListener('click', () => {
    isInfinity = !isInfinity;
    infinityBtn.classList.toggle('active-automix', isInfinity);
    savePlaybackState();
});

// --- MIX VIEW Y COLA LOGIC ---
window.loadQueueView = async function() {
    if (!currentSongData) return;
    
    const rightInfoContent = document.getElementById('rightInfoContent');
    const rightQueueContent = document.getElementById('rightQueueContent');
    if(rightInfoContent) rightInfoContent.style.display = 'none';
    if(rightQueueContent) rightQueueContent.style.display = 'flex';

    const currentDiv = document.getElementById('queueCurrentSong');
    currentDiv.innerHTML = `
        <div class="playlist-row song-item" style="background:rgba(255,255,255,0.1);">
            <div class="row-title">
                <img src="${currentSongData.thumbnail}" alt="Cover">
                <div style="display:flex; flex-direction:column;">
                    <span style="font-weight:600; color:#1ed760;">${currentSongData.title}</span>
                    <span class="clickable-artist">${currentSongData.artist}</span>
                </div>
            </div>
            <span><i class="fa-solid fa-volume-high" style="color:#1ed760;"></i></span>
        </div>
    `;

    // Si la cola está vacía y el infinito está activo, generar canciones
    if (queueIndex >= queue.length - 1 && isInfinity) {
        await fetchAIAutoplay();
    }

    const listDiv = document.getElementById('queueUpcomingList');
    listDiv.innerHTML = '';
    
    for (let i = queueIndex + 1; i < queue.length; i++) {
        const song = queue[i];
        const titleEsc = song.title.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const artistEsc = song.artist.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const row = document.createElement('div');
        row.classList.add('playlist-row', 'song-item');
        row.innerHTML = `
            <span>${i - queueIndex}</span>
            <div class="row-title">
                <img src="${song.thumbnail}" alt="Cover">
                <div style="display:flex; flex-direction:column;">
                    <span style="font-weight:600; color:#fff;">${song.title}</span>
                    <span class="clickable-artist">${song.artist}</span>
                </div>
            </div>
            <span><i class="fa-solid fa-play"></i></span>
        `;
        row.addEventListener('click', () => {
            queueIndex = i - 1; // Play this song
            handleTrackEnd();
        });
        listDiv.appendChild(row);
    }
    
    if (queueIndex >= queue.length - 1) {
        listDiv.innerHTML = '<p style="color:var(--text-muted); font-size:14px;">No hay canciones a continuación. Activa el Infinito para reproducir automáticamente.</p>';
    }
};

const closeQueueBtn = document.getElementById('closeQueueBtn');
if (closeQueueBtn) {
    closeQueueBtn.addEventListener('click', () => {
        const rightInfoContent = document.getElementById('rightInfoContent');
        const rightQueueContent = document.getElementById('rightQueueContent');
        if(rightInfoContent) rightInfoContent.style.display = 'block';
        if(rightQueueContent) rightQueueContent.style.display = 'none';
    });
}

const footerQueueBtn = document.getElementById('footerQueueBtn');
if (footerQueueBtn) {
    footerQueueBtn.addEventListener('click', () => {
        const rightQueueContent = document.getElementById('rightQueueContent');
        if (rightQueueContent && rightQueueContent.style.display === 'flex') {
            const rightInfoContent = document.getElementById('rightInfoContent');
            if(rightInfoContent) rightInfoContent.style.display = 'block';
            rightQueueContent.style.display = 'none';
        } else {
            loadQueueView();
        }
    });
}

window.loadMixView = function(mixTitle, mixDesc, mixCover, mixArtistId, gradientColor) {
    let songs = [];
    if (mixArtistId === 'discover') {
        songs = savedLibrary;
    } else {
        songs = savedLibrary.filter(s => s.artist === mixArtistId);
    }

    showView('playlist');
    const cover = document.querySelector('.playlist-cover');
    cover.style.background = `url(${mixCover}) center/cover no-repeat`;
    cover.innerHTML = '';
    
    document.getElementById('playlistViewName').innerText = mixTitle;
    document.getElementById('playlistSongCount').innerText = songs.length;
    
    const header = document.querySelector('.playlist-header');
    header.style.background = `linear-gradient(180deg, ${gradientColor} 0%, #121212 100%)`;
    header.style.padding = '80px 24px 24px 24px';

    const list = document.getElementById('playlistSongsList');
    list.innerHTML = '';
    
    songs.forEach((song, index) => {
        const titleEsc = song.title.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const artistEsc = song.artist.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const row = document.createElement('div');
        row.classList.add('playlist-row', 'song-item');
        row.dataset.id = song.id;
        row.dataset.title = titleEsc;
        row.dataset.artist = artistEsc;
        row.dataset.thumbnail = song.thumbnail;
        
        row.innerHTML = `
            <span>${index + 1}</span>
            <div class="row-title">
                <img src="${song.thumbnail}" alt="Cover">
                <div style="display:flex; flex-direction:column;">
                    <span style="font-weight:600; color:#fff;">${song.title}</span>
                    <span class="clickable-artist" onclick="event.stopPropagation(); loadArtistProfile('${artistEsc}')">${song.artist}</span>
                </div>
            </div>
            <span>-</span>
            <span><i class="fa-solid fa-play"></i></span>
        `;
        row.addEventListener('click', () => {
            queue = [...songs];
            queueIndex = index;
            if (isShuffle && queue.length > 1) {
                const remaining = queue.splice(queueIndex + 1);
                for (let j = remaining.length - 1; j > 0; j--) {
                    const k = Math.floor(Math.random() * (j + 1));
                    [remaining[j], remaining[k]] = [remaining[k], remaining[j]];
                }
                queue = queue.concat(remaining);
            }
            playQueueIndex();
        });
        list.appendChild(row);
    });
};

async function triggerCrossfade() {
    isCrossfading = true;
    
    // Avanzar cola
    queueIndex++;
    if (queueIndex >= queue.length) {
        await fetchAIAutoplay();
    }
    
    if (queueIndex < queue.length) {
        currentSongData = queue[queueIndex];
        updatePlayerUI(currentSongData);
        
        // Cargar en el nextPlayer
        nextPlayer.src = `${BACKEND_URL}/api/stream/${currentSongData.id}`;
        nextPlayer.load();
        nextPlayer.volume = 0;
        nextPlayer.play().catch(e => console.log(e));

        // Crossfade animation
        let fadeOut = activePlayer;
        let fadeIn = nextPlayer;
        
        let steps = 50;
        let stepTime = 10000 / steps; // 10 seconds total
        let volStep = currentVolume / steps;

        let interval = setInterval(() => {
            if (fadeOut.volume - volStep >= 0) fadeOut.volume -= volStep;
            else fadeOut.volume = 0;
            
            if (fadeIn.volume + volStep <= currentVolume) fadeIn.volume += volStep;
            else fadeIn.volume = currentVolume;

            steps--;
            if (steps <= 0) {
                clearInterval(interval);
                fadeOut.pause();
                // Swap players
                let temp = activePlayer;
                activePlayer = nextPlayer;
                nextPlayer = temp;
                isCrossfading = false;
            }
        }, stepTime);
    } else {
        isCrossfading = false;
    }
}

async function fetchAIAutoplay() {
    if(!currentSongData) return;
    try {
        const res = await fetch(`${BACKEND_URL}/api/related?artist=${encodeURIComponent(currentSongData.artist)}`);
        const songs = await res.json();
        if(Array.isArray(songs) && songs.length > 0) {
            const randomSong = songs[Math.floor(Math.random() * songs.length)];
            queue.push(randomSong);
            return;
        }
    } catch(e) {
        console.error("WTC Music AI fallback API failed", e);
    }
    
    // Fallback to library if API fails or returns error
    if (savedLibrary.length > 0) {
        const randomLibSong = savedLibrary[Math.floor(Math.random() * savedLibrary.length)];
        queue.push(randomLibSong);
    }
}

async function handleTrackEnd() {
    if (isAutomix && isCrossfading) return; // Automix maneja su propia transición

    queueIndex++;
    if (queueIndex >= queue.length && isInfinity) {
        await fetchAIAutoplay();
    }

    if (queueIndex < queue.length) {
        playQueueIndex();
    } else {
        isPlaying = false;
        updatePlayPauseIcon();
    }
}
audioPlayer1.addEventListener('ended', handleTrackEnd);
audioPlayer2.addEventListener('ended', handleTrackEnd);

playPauseBtn.addEventListener('click', () => {
    if (!activePlayer.src) return;
    if (isPlaying) { activePlayer.pause(); } else { activePlayer.play(); }
    isPlaying = !isPlaying;
    updatePlayPauseIcon();
});

function playNext() {
    if (queueIndex < queue.length - 1) {
        queueIndex++;
        playQueueIndex();
    } else if (isInfinity) {
        handleTrackEnd();
    }
}

function playPrev() {
    if (queueIndex > 0) {
        queueIndex--;
        playQueueIndex();
    }
}

const uiPrevBtn = document.querySelector('.fa-backward-step')?.parentElement;
const uiNextBtn = document.querySelector('.fa-forward-step')?.parentElement;
if (uiPrevBtn) uiPrevBtn.addEventListener('click', playPrev);
if (uiNextBtn) uiNextBtn.addEventListener('click', playNext);

function updatePlayPauseIcon() {
    playPauseBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
}

// --- CONTROLES Y BARRAS ---
function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

progressBar.addEventListener('click', (e) => {
    if(!activePlayer.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    activePlayer.currentTime = percent * activePlayer.duration;
});

audioPlayer1.volume = currentVolume;
audioPlayer2.volume = currentVolume;
volumeFill.style.width = `${currentVolume * 100}%`;

volumeBar.addEventListener('click', (e) => {
    const rect = volumeBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    currentVolume = percent;
    activePlayer.volume = percent;
    volumeFill.style.width = `${percent * 100}%`;
    savePlaybackState();
});

toggleBtns.forEach(btn => btn.addEventListener('click', () => {
    btn.classList.toggle('text-green');
    if (btn.querySelector('.fa-shuffle')) {
        isShuffle = btn.classList.contains('text-green');
        if (isShuffle && queue.length > 1) {
            const current = queue[queueIndex];
            const remaining = queue.filter((_, i) => i !== queueIndex);
            for (let i = remaining.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
            }
            queue = [current, ...remaining];
            queueIndex = 0;
            if (document.getElementById('rightQueueContent')?.style.display === 'flex') {
                loadQueueView();
            }
            if (homeView.style.display === 'block') {
                renderHome();
            }
        }
    } else if (btn.querySelector('.fa-repeat')) {
        activePlayer.loop = btn.classList.contains('text-green');
    }
    savePlaybackState();
}));

// INICIALIZACIÓN
function initProfile() {
    if (wtcProfile.pic) {
        profileNavIcon.style.display = 'none';
        profileNavImg.style.display = 'block';
        profileNavImg.src = wtcProfile.pic;
    }
}
initProfile();
filterLibrary('playlists');
showView('home');

// --- PERFIL Y EXPORTACIÓN .WMS ---
const profileModal = document.getElementById('profileModal');
const profileNameInput = document.getElementById('profileNameInput');
const profilePicInput = document.getElementById('profilePicInput');

profileBtn.addEventListener('click', () => {
    profileNameInput.value = wtcProfile.name;
    profilePicInput.value = wtcProfile.pic;
    profileModal.style.display = 'flex';
});

document.getElementById('saveProfileBtn').addEventListener('click', () => {
    wtcProfile.name = profileNameInput.value.trim() || 'Usuario';
    wtcProfile.pic = profilePicInput.value.trim();
    localStorage.setItem('wtc_profile', JSON.stringify(wtcProfile));
    initProfile();
    profileModal.style.display = 'none';
});

document.getElementById('exportWmsBtn').addEventListener('click', () => {
    const exportData = {
        profile: wtcProfile,
        library: savedLibrary,
        playlists: savedPlaylists,
        history: wtcHistory
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mi_musica.wms");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

document.getElementById('importWmsInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const data = JSON.parse(evt.target.result);
                if (data.profile) localStorage.setItem('wtc_profile', JSON.stringify(data.profile));
                if (data.library) localStorage.setItem('wtc_library', JSON.stringify(data.library));
                if (data.playlists) localStorage.setItem('wtc_playlists', JSON.stringify(data.playlists));
                if (data.history) localStorage.setItem('wtc_history', JSON.stringify(data.history));
                alert('Datos importados correctamente. La página se recargará.');
                location.reload();
            } catch (error) {
                alert('Archivo .wms inválido');
            }
        };
        reader.readAsText(file);
    }
});

// --- CONTEXT MENU ---
const contextMenu = document.getElementById('contextMenu');
let contextSongData = null;

document.addEventListener('contextmenu', (e) => {
    const songItem = e.target.closest('.song-item');
    if (songItem) {
        e.preventDefault();
        
        contextSongData = {
            id: songItem.dataset.id,
            title: songItem.dataset.title,
            artist: songItem.dataset.artist,
            thumbnail: songItem.dataset.thumbnail
        };
        
        contextMenu.style.display = 'block';
        let x = e.clientX;
        let y = e.clientY;
        
        if (x + contextMenu.offsetWidth > window.innerWidth) x = window.innerWidth - contextMenu.offsetWidth;
        if (y + contextMenu.offsetHeight > window.innerHeight) y = window.innerHeight - contextMenu.offsetHeight;
        
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
    } else {
        contextMenu.style.display = 'none';
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('#contextMenu')) contextMenu.style.display = 'none';
});

document.getElementById('ctxAddLibrary').addEventListener('click', () => {
    if (contextSongData) addToLibrary(contextSongData);
    contextMenu.style.display = 'none';
});

document.getElementById('ctxAddQueue').addEventListener('click', () => {
    if (contextSongData) {
        queue.push(contextSongData);
        alert(`Añadido a la cola: ${contextSongData.title}`);
    }
    contextMenu.style.display = 'none';
});

document.getElementById('ctxReport').addEventListener('click', () => {
    alert(`Se ha denunciado la canción.`);
    contextMenu.style.display = 'none';
});

document.getElementById('ctxExclude').addEventListener('click', () => {
    alert(`Excluido del perfil de gustos.`);
    contextMenu.style.display = 'none';
});

document.getElementById('ctxAddFolder').addEventListener('click', () => {
    if (contextSongData) openAddToPlaylistModal(contextSongData);
    contextMenu.style.display = 'none';
});

document.getElementById('ctxShare').addEventListener('click', () => {
    if (contextSongData) {
        const shareText = `Escucha ${contextSongData.title} de ${contextSongData.artist}`;
        navigator.clipboard.writeText(shareText);
        alert('Enlace copiado al portapapeles');
    }
    contextMenu.style.display = 'none';
});

document.getElementById('ctxDesktop').addEventListener('click', () => {
    alert('Abriendo en la aplicación de ordenador...');
    contextMenu.style.display = 'none';
});
