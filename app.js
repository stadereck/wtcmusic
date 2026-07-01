/* ══════════════════════════════════════════
   WTC MUSIC — app.js  v2
   ══════════════════════════════════════════ */

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const ARTISTS = [
  {
    id: 'rosalia',
    name: 'Rosalía',
    image: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782690307/00._t7pja6.jpg',
    genre: 'Pop · Flamenco',
    bio: 'Artista española que fusiona el flamenco con el pop urbano y el reggaetón.',
    monthly: '18.4M',
  },
  {
    id: 'billie',
    name: 'Billie Eilish',
    image: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782504582/Happier_Than_Ever_Cover_odsqsc.jpg',
    genre: 'Pop · Alternative',
    bio: 'Cantautora estadounidense conocida por su estilo oscuro y producción minimalista.',
    monthly: '62.1M',
  },
  {
    id: 'charli',
    name: 'Charli XCX',
    image: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782505897/Von_Dutch_dplvw8.jpg',
    genre: 'Pop · Hyperpop',
    bio: 'Artista británica pionera del hyperpop y el PC music.',
    monthly: '14.7M',
  },
];

const ALBUMS = [
  {
    id: 'motomami',
    artistId: 'rosalia',
    title: 'MOTOMAMI',
    artist: 'Rosalía',
    year: 2022,
    cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782690307/00._t7pja6.jpg',
  },
  {
    id: 'happier',
    artistId: 'billie',
    title: 'Happier Than Ever',
    artist: 'Billie Eilish',
    year: 2021,
    cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782504582/Happier_Than_Ever_Cover_odsqsc.jpg',
  },
  {
    id: 'dontsmile',
    artistId: 'billie',
    title: "Don't Smile at Me",
    artist: 'Billie Eilish',
    year: 2017,
    cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782506646/Don_t_Smile_at_me_g3uiox.jpg',
  },
  {
    id: 'vondutch',
    artistId: 'charli',
    title: 'Von Dutch - Single',
    artist: 'Charli XCX',
    year: 2023,
    cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782505897/Von_Dutch_dplvw8.jpg',
  },
];

const SONGS = [
  // ── ROSALÍA — MOTOMAMI ──
  {
    id: 1, title: 'SAOKO', artist: 'Rosalía', artistId: 'rosalia',
    album: 'MOTOMAMI', albumId: 'motomami',
    cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782690307/00._t7pja6.jpg',
    url: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1782690354/07._BIZCOCHITO_jfnbe9.flac',
    explicit: true, liked: false, year: 2022,
  },
  {
    id: 2, title: 'CANDY', artist: 'Rosalía', artistId: 'rosalia',
    album: 'MOTOMAMI', albumId: 'motomami',
    cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782690307/00._t7pja6.jpg',
    url: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1782690358/02._CANDY_epgngp.flac',
    explicit: false, liked: false, year: 2022,
  },
  {
    id: 3, title: 'La Fama (feat. The Weeknd)', artist: 'Rosalía', artistId: 'rosalia',
    album: 'MOTOMAMI', albumId: 'motomami',
    cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782690307/00._t7pja6.jpg',
    url: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1782690356/03._LAFAMA_f0vhb1.flac',
    explicit: false, liked: false, year: 2022,
  },
  {
    id: 4, title: 'BULERÍAS', artist: 'Rosalía', artistId: 'rosalia',
    album: 'MOTOMAMI', albumId: 'motomami',
    cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782690307/00._t7pja6.jpg',
    url: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1782690359/04._BULER%C3%8DAS_wu0hqm.flac',
    explicit: false, liked: false, year: 2022,
  },
  {
    id: 5, title: 'CHICKEN TERIYAKI', artist: 'Rosalía', artistId: 'rosalia',
    album: 'MOTOMAMI', albumId: 'motomami',
    cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782690307/00._t7pja6.jpg',
    url: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1782690361/05._CHICKENTERIYAKI_n9vjai.flac',
    explicit: false, liked: false, year: 2022,
  },
  // ── BILLIE EILISH — Happier Than Ever ──
  {
    id: 6, title: 'Happier Than Ever', artist: 'Billie Eilish', artistId: 'billie',
    album: 'Happier Than Ever', albumId: 'happier',
    cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782504582/Happier_Than_Ever_Cover_odsqsc.jpg',
    url: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1782504769/Happier_Than_Ever_-_Billie_Eilish_pvsyna.mp3',
    explicit: false, liked: false, year: 2021,
  },
  // ── BILLIE EILISH — Don't Smile at Me ──
  {
    id: 7, title: 'Ocean Eyes', artist: 'Billie Eilish', artistId: 'billie',
    album: "Don't Smile at Me", albumId: 'dontsmile',
    cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782506646/Don_t_Smile_at_me_g3uiox.jpg',
    url: 'https://res.cloudinary.com/df6ozlyhj/video/upload/v1782506644/Billie_Eilish_-_Ocean_Eyes_bhycwd.mp3',
    explicit: false, liked: false, year: 2017,
  },
  // ── CHARLI XCX — Von Dutch Single ──
  {
    id: 8, title: 'Von Dutch', artist: 'Charli XCX', artistId: 'charli',
    album: 'Von Dutch - Single', albumId: 'vondutch',
    cover: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782505897/Von_Dutch_dplvw8.jpg',
    url: '',
    explicit: true, liked: false, year: 2023,
  },
];

const RADIO = [
  { id:'r1', name:'WTC Radio 1',       img:'https://picsum.photos/seed/wtcr1/400/225', color:'#fc3c44' },
  { id:'r2', name:'Pop Hits',           img:'https://picsum.photos/seed/pophits/400/225', color:'#bf5af2' },
  { id:'r3', name:'Latin Vibes',        img:'https://picsum.photos/seed/latin/400/225', color:'#30d158' },
  { id:'r4', name:'Chill & Study',      img:'https://picsum.photos/seed/chill/400/225', color:'#0a84ff' },
  { id:'r5', name:'Indie Underground',  img:'https://picsum.photos/seed/indie/400/225', color:'#ff9f0a' },
  { id:'r6', name:'Electronic Dance',   img:'https://picsum.photos/seed/dance/400/225', color:'#e8185c' },
];

/* ─────────────────────────────────────────
   STATE
───────────────────────────────────────── */
let queue      = [...SONGS];
let queueIdx   = 0;
let isPlaying  = false;
let isShuffle  = false;
let repeatMode = 0;
let volume     = 0.8;
let isDraggingSeek = false;

const audio = document.getElementById('audio');

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const $   = id => document.getElementById(id);
const qs  = (sel, root = document) => root.querySelector(sel);
const fmt = s => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
};

function showToast(msg, icon = '') {
  const t = $('toast');
  t.innerHTML = icon ? `<i class="fa ${icon}"></i> ${msg}` : msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ─────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────── */
function navigateTo(section) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const match = document.querySelector(`.nav-item[data-section="${section}"]`);
  if (match) match.classList.add('active');
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  const target = $('sec-' + section);
  if (target) target.classList.add('active');
}

document.querySelectorAll('.nav-item[data-section]').forEach(el => {
  el.addEventListener('click', () => navigateTo(el.dataset.section));
});

// Pinned toggle
const pinnedToggle = $('pinnedToggle');
const pinnedItems  = $('pinnedItems');
pinnedToggle.addEventListener('click', () => {
  pinnedToggle.classList.toggle('closed');
  pinnedItems.classList.toggle('hidden');
});

/* ─────────────────────────────────────────
   SIDEBAR PLAYLISTS — update with real covers
───────────────────────────────────────── */
function updateSidebarPlaylists() {
  // Update pinned items with real album art
  const pinnedLinks = pinnedItems.querySelectorAll('.playlist-item');
  const sideCovers = [
    { src: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782504582/Happier_Than_Ever_Cover_odsqsc.jpg', label: 'Happier Than Ever' },
    { src: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782690307/00._t7pja6.jpg', label: 'MOTOMAMI' },
    { src: 'https://res.cloudinary.com/df6ozlyhj/image/upload/v1782505897/Von_Dutch_dplvw8.jpg', label: 'Von Dutch' },
  ];
  pinnedLinks.forEach((el, i) => {
    if (sideCovers[i]) {
      const img = el.querySelector('.pl-thumb');
      if (img) img.src = sideCovers[i].src;
      const sp = el.querySelector('span');
      if (sp) sp.textContent = sideCovers[i].label;
    }
  });
}

/* ─────────────────────────────────────────
   SEARCH OVERLAY
───────────────────────────────────────── */
function buildSearchOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'searchOverlay';
  overlay.innerHTML = `
    <div class="search-box">
      <div class="search-input-row">
        <i class="fa fa-magnifying-glass search-ico"></i>
        <input type="text" id="searchInput" placeholder="Artistas, canciones, álbumes..." autocomplete="off" spellcheck="false"/>
        <button id="searchClose" title="Cerrar"><i class="fa fa-xmark"></i></button>
      </div>
      <div id="searchCategories">
        <button class="scat active" data-cat="todo">Todo</button>
        <button class="scat" data-cat="artistas">Artistas</button>
        <button class="scat" data-cat="albumes">Álbumes</button>
        <button class="scat" data-cat="canciones">Canciones</button>
      </div>
      <div id="searchResults"></div>
    </div>`;
  document.body.appendChild(overlay);

  let activeCat = 'todo';
  const input = $('searchInput');

  $('searchClose').addEventListener('click', closeSearch);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });
  input.addEventListener('input', () => doSearch(input.value.trim(), activeCat));

  overlay.querySelectorAll('.scat').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('.scat').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      doSearch(input.value.trim(), activeCat);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'KeyF' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); openSearch(); }
    if (e.code === 'Escape') closeSearch();
  });
}

function openSearch() {
  $('searchOverlay').classList.add('show');
  setTimeout(() => $('searchInput').focus(), 80);
}
function closeSearch() {
  $('searchOverlay').classList.remove('show');
  $('searchInput').value = '';
  $('searchResults').innerHTML = '';
}

function doSearch(q, cat) {
  const el = $('searchResults');
  if (!q) { el.innerHTML = renderSearchEmpty(); return; }
  const low = q.toLowerCase();

  const mArtists = (cat === 'todo' || cat === 'artistas')
    ? ARTISTS.filter(a => a.name.toLowerCase().includes(low) || a.genre.toLowerCase().includes(low))
    : [];
  const mAlbums = (cat === 'todo' || cat === 'albumes')
    ? ALBUMS.filter(a => a.title.toLowerCase().includes(low) || a.artist.toLowerCase().includes(low))
    : [];
  const mSongs = (cat === 'todo' || cat === 'canciones')
    ? SONGS.filter(s => s.title.toLowerCase().includes(low) || s.artist.toLowerCase().includes(low) || s.album.toLowerCase().includes(low))
    : [];

  let html = '';
  if (!mArtists.length && !mAlbums.length && !mSongs.length) {
    html = `<div class="sr-empty"><i class="fa fa-magnifying-glass"></i><p>Sin resultados para <strong>"${q}"</strong></p></div>`;
  }

  if (mArtists.length) {
    html += `<div class="sr-section">Artistas</div>`;
    html += mArtists.map(a => `
      <div class="sr-row" data-type="artist" data-id="${a.id}">
        <img src="${a.image}" class="sr-img round"/>
        <div class="sr-info">
          <div class="sr-title">${highlight(a.name, q)}</div>
          <div class="sr-sub"><i class="fa fa-user"></i> Artista · ${a.genre}</div>
        </div>
        <button class="sr-play" title="Reproducir"><i class="fa fa-play"></i></button>
      </div>`).join('');
  }
  if (mAlbums.length) {
    html += `<div class="sr-section">Álbumes</div>`;
    html += mAlbums.map(a => `
      <div class="sr-row" data-type="album" data-id="${a.id}">
        <img src="${a.cover}" class="sr-img"/>
        <div class="sr-info">
          <div class="sr-title">${highlight(a.title, q)}</div>
          <div class="sr-sub"><i class="fa fa-record-vinyl"></i> Álbum · ${a.artist} · ${a.year}</div>
        </div>
        <button class="sr-play" title="Reproducir"><i class="fa fa-play"></i></button>
      </div>`).join('');
  }
  if (mSongs.length) {
    html += `<div class="sr-section">Canciones</div>`;
    html += mSongs.map(s => `
      <div class="sr-row sr-song" data-type="song" data-id="${s.id}">
        <img src="${s.cover}" class="sr-img"/>
        <div class="sr-info">
          <div class="sr-title">${highlight(s.title, q)}${s.explicit ? ' <span class="badge-e">E</span>' : ''}</div>
          <div class="sr-sub"><i class="fa fa-music"></i> ${s.artist} · ${s.album}</div>
        </div>
        <button class="sr-play" title="Reproducir"><i class="fa fa-play"></i></button>
      </div>`).join('');
  }

  el.innerHTML = html;
  el.querySelectorAll('.sr-row').forEach(row => {
    row.addEventListener('click', e => {
      if (e.target.closest('.sr-play')) return handleSearchPlay(row);
      handleSearchPlay(row);
    });
    row.querySelector('.sr-play')?.addEventListener('click', e => { e.stopPropagation(); handleSearchPlay(row); });
  });
}

function handleSearchPlay(row) {
  const { type, id } = row.dataset;
  closeSearch();
  if (type === 'song') {
    const idx = SONGS.findIndex(s => s.id == id);
    if (idx >= 0) { queue = [...SONGS]; queueIdx = idx; loadTrack(idx); playAudio(); }
  } else if (type === 'artist') {
    navigateTo('artistas');
    setTimeout(() => openArtistPage(id), 120);
  } else if (type === 'album') {
    const albumSongs = SONGS.filter(s => s.albumId === id);
    if (albumSongs.length) { queue = albumSongs; queueIdx = 0; loadTrack(0); playAudio(); }
    navigateTo('albumes');
  }
}

function renderSearchEmpty() {
  return `<div class="sr-suggestions">
    <div class="sr-section">Sugerencias</div>
    ${ARTISTS.map(a => `<div class="sr-row" data-type="artist" data-id="${a.id}">
      <img src="${a.image}" class="sr-img round"/>
      <div class="sr-info"><div class="sr-title">${a.name}</div><div class="sr-sub">Artista</div></div>
    </div>`).join('')}
  </div>`;
}

function highlight(text, q) {
  if (!q) return text;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

$('searchBtn').addEventListener('click', openSearch);

/* ─────────────────────────────────────────
   RENDER — SONG LIST (shared)
───────────────────────────────────────── */
function renderSongList(containerId, songs, showAlbumCol = true) {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = `
    <div class="sl-header">
      <span class="sl-h-num">#</span>
      <span class="sl-h-title">Título</span>
      ${showAlbumCol ? '<span class="sl-h-album">Álbum</span>' : ''}
      <span class="sl-h-dur"><i class="fa fa-clock"></i></span>
    </div>
    ${songs.map((s, i) => `
    <div class="srow" data-id="${s.id}">
      <div class="s-num" data-n="${i + 1}">${i + 1}</div>
      <div class="s-thumb-wrap">
        <img class="s-art" src="${s.cover}" alt="${s.title}" loading="lazy"/>
        <div class="s-thumb-play"><i class="fa fa-play"></i></div>
      </div>
      <div class="s-meta">
        <div class="s-title">${s.title}${s.explicit ? ' <span class="badge-e">E</span>' : ''}</div>
        <div class="s-artist">${s.artist}</div>
      </div>
      ${showAlbumCol ? `<div class="s-album-col">${s.album}</div>` : ''}
      <button class="s-like${s.liked ? ' on' : ''}" data-id="${s.id}" title="Me gusta">
        <i class="${s.liked ? 'fa fa-heart' : 'fa fa-regular fa-heart'}"></i>
      </button>
      <div class="s-dur" id="dur-${s.id}">—</div>
    </div>`).join('')}`;

  el.querySelectorAll('.srow').forEach(row => {
    row.addEventListener('click', e => {
      if (e.target.closest('.s-like')) return;
      const id = parseInt(row.dataset.id);
      const idx = songs.findIndex(s => s.id === id);
      queue = [...songs]; queueIdx = idx; loadTrack(idx); playAudio();
    });
    row.addEventListener('dblclick', e => {
      if (e.target.closest('.s-like')) return;
      const id = parseInt(row.dataset.id);
      const idx = songs.findIndex(s => s.id === id);
      queue = [...songs]; queueIdx = idx; loadTrack(idx); playAudio();
    });
  });

  el.querySelectorAll('.s-like').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const song = SONGS.find(s => s.id === id);
      if (!song) return;
      song.liked = !song.liked;
      btn.classList.toggle('on', song.liked);
      btn.querySelector('i').className = song.liked ? 'fa fa-heart' : 'fa fa-regular fa-heart';
      showToast(song.liked ? `Añadida a favoritas` : `Eliminada de favoritas`, song.liked ? 'fa-heart' : 'fa-heart-crack');
    });
  });
}

/* ─────────────────────────────────────────
   RENDER — CARD (shared helper)
───────────────────────────────────────── */
function makeCard(cover, title, sub, clickFn, badge = '') {
  const div = document.createElement('div');
  div.className = 'mcard';
  div.innerHTML = `
    <div class="mcard-art">
      <img src="${cover}" alt="${title}" loading="lazy"/>
      <div class="mcard-ov"><i class="fa fa-circle-play"></i></div>
      ${badge ? `<div class="mcard-badge">${badge}</div>` : ''}
    </div>
    <div class="mcard-title">${title}</div>
    <div class="mcard-sub">${sub}</div>`;
  div.addEventListener('click', clickFn);
  return div;
}

/* ─────────────────────────────────────────
   RENDER — INICIO
───────────────────────────────────────── */
function renderInicio() {
  const rowRecent = $('rowRecent');
  const rowRec    = $('rowRec');

  rowRecent.innerHTML = '';
  ALBUMS.forEach(al => {
    rowRecent.appendChild(makeCard(al.cover, al.title, al.artist, () => {
      const s = SONGS.filter(x => x.albumId === al.id);
      if (s.length) { queue = s; queueIdx = 0; loadTrack(0); playAudio(); }
    }));
  });

  rowRec.innerHTML = '';
  ARTISTS.forEach(a => {
    rowRec.appendChild(makeCard(a.image, a.name, 'Artista', () => {
      navigateTo('artistas');
      setTimeout(() => openArtistPage(a.id), 120);
    }));
  });

  renderSongList('listTop', SONGS.slice(0, 5));
}

/* ─────────────────────────────────────────
   RENDER — ARTISTS
───────────────────────────────────────── */
function renderArtists() {
  const sec = $('sec-artistas');
  sec.innerHTML = `
    <h1 class="page-title">Artistas</h1>
    <div class="artist-grid" id="artistGrid"></div>`;

  const grid = $('artistGrid');
  ARTISTS.forEach(a => {
    const card = document.createElement('div');
    card.className = 'acard';
    card.dataset.artist = a.id;
    card.innerHTML = `
      <div class="acard-img-wrap">
        <img src="${a.image}" alt="${a.name}" loading="lazy"/>
        <div class="acard-play-ov"><i class="fa fa-play"></i></div>
      </div>
      <div class="acard-name">${a.name}</div>
      <div class="acard-genre">${a.genre}</div>`;
    card.addEventListener('click', () => openArtistPage(a.id));
    grid.appendChild(card);
  });
}

function openArtistPage(artistId) {
  const artist = ARTISTS.find(a => a.id === artistId);
  if (!artist) return;
  const artistAlbums = ALBUMS.filter(a => a.artistId === artistId);
  const artistSongs  = SONGS.filter(s => s.artistId === artistId);
  const sec = $('sec-artistas');

  // Dominant color per artist
  const colors = { rosalia: '#c8155a', billie: '#3a7d44', charli: '#7b2ff7' };
  const col = colors[artistId] || '#fc3c44';

  sec.innerHTML = `
    <div class="artist-page">
      <button class="back-btn" id="backToArtists"><i class="fa fa-chevron-left"></i> Artistas</button>
      <div class="artist-hero" style="--artist-color:${col}">
        <div class="artist-hero-bg" style="background:linear-gradient(160deg,${col}88 0%,transparent 70%)"></div>
        <img src="${artist.image}" class="artist-hero-img" alt="${artist.name}"/>
        <div class="artist-hero-info">
          <div class="artist-hero-verified"><i class="fa fa-circle-check"></i> Artista verificado</div>
          <div class="artist-hero-name">${artist.name}</div>
          <div class="artist-hero-stats">
            <span><i class="fa fa-headphones"></i> ${artist.monthly} oyentes mensuales</span>
            <span><i class="fa fa-compact-disc"></i> ${artistAlbums.length} álbum${artistAlbums.length !== 1 ? 'es' : ''}</span>
          </div>
          <div class="artist-hero-actions">
            <button class="hero-btn-play" id="artistPlayAll"><i class="fa fa-play"></i> Reproducir</button>
            <button class="hero-btn-shuffle" id="artistShuffle"><i class="fa fa-shuffle"></i></button>
          </div>
        </div>
      </div>
      <h2 class="row-title">Canciones populares</h2>
      <div class="song-list" id="artistSongList"></div>
      <h2 class="row-title">Discografía</h2>
      <div class="cards-row wrap" id="artistAlbumList"></div>
      <h2 class="row-title">Sobre el artista</h2>
      <div class="artist-bio">${artist.bio}</div>
    </div>`;

  $('backToArtists').addEventListener('click', renderArtists);

  $('artistPlayAll').addEventListener('click', () => {
    if (artistSongs.length) { queue = [...artistSongs]; queueIdx = 0; loadTrack(0); playAudio(); }
  });
  $('artistShuffle').addEventListener('click', () => {
    if (artistSongs.length) {
      isShuffle = true;
      $('btnShuffle').classList.add('on');
      queue = [...artistSongs];
      queueIdx = Math.floor(Math.random() * queue.length);
      loadTrack(queueIdx); playAudio();
    }
  });

  renderSongList('artistSongList', artistSongs, false);

  const albumContainer = $('artistAlbumList');
  albumContainer.innerHTML = '';
  artistAlbums.forEach(al => {
    albumContainer.appendChild(makeCard(al.cover, al.title, `${al.year} · Álbum`, () => {
      const s = SONGS.filter(x => x.albumId === al.id);
      if (s.length) { queue = s; queueIdx = 0; loadTrack(0); playAudio(); }
    }));
  });
}

/* ─────────────────────────────────────────
   RENDER — ALBUMS
───────────────────────────────────────── */
function renderAlbums() {
  const grid = $('albumGrid');
  grid.innerHTML = '';
  ALBUMS.forEach(al => {
    grid.appendChild(makeCard(al.cover, al.title, `${al.artist} · ${al.year}`, () => {
      const s = SONGS.filter(x => x.albumId === al.id);
      if (s.length) { queue = s; queueIdx = 0; loadTrack(0); playAudio(); }
    }));
  });
}

/* ─────────────────────────────────────────
   RENDER — ALL SONGS
───────────────────────────────────────── */
function renderAllSongs() {
  renderSongList('listAll', SONGS);
}

/* ─────────────────────────────────────────
   RENDER — RECIENTES
───────────────────────────────────────── */
function renderRecientes() {
  const grid = $('recentGrid');
  grid.innerHTML = '';
  [...ALBUMS].reverse().forEach(al => {
    grid.appendChild(makeCard(al.cover, al.title, al.artist, () => {
      const s = SONGS.filter(x => x.albumId === al.id);
      if (s.length) { queue = s; queueIdx = 0; loadTrack(0); playAudio(); }
    }));
  });
}

/* ─────────────────────────────────────────
   RENDER — RADIO
───────────────────────────────────────── */
function renderRadio() {
  const grid = $('radioGrid');
  grid.innerHTML = RADIO.map(r => `
    <div class="rcard" style="--rcolor:${r.color}">
      <img src="${r.img}" alt="${r.name}" loading="lazy"/>
      <div class="rcard-lbl">${r.name}</div>
      <div class="rcard-play"><i class="fa fa-play"></i></div>
    </div>`).join('');
}

/* ─────────────────────────────────────────
   RENDER — VIDEOCLIPS
───────────────────────────────────────── */
function renderVideoclips() {
  const grid = $('videoGrid');
  const vids = SONGS.filter(s => s.url);
  grid.innerHTML = vids.map(s => `
    <div class="vcard" data-id="${s.id}">
      <img src="${s.cover}" alt="${s.title}" loading="lazy"/>
      <div class="vcard-ov"><i class="fa fa-circle-play"></i></div>
      <div class="vcard-lbl">
        <div class="vcard-title">${s.title}</div>
        <div class="vcard-artist">${s.artist}</div>
      </div>
    </div>`).join('');

  grid.querySelectorAll('.vcard').forEach(c => {
    c.addEventListener('click', () => {
      const idx = SONGS.findIndex(s => s.id == c.dataset.id);
      if (idx >= 0) { queue = [...SONGS]; queueIdx = idx; loadTrack(idx); playAudio(); }
    });
  });
}

/* ─────────────────────────────────────────
   PLAYER — CORE
───────────────────────────────────────── */
function loadTrack(idx) {
  const song = queue[idx];
  if (!song) return;

  $('pbTitle').textContent  = song.title;
  $('pbArtist').textContent = `${song.artist} — ${song.album}`;
  $('pbExplicit').style.display = song.explicit ? 'inline' : 'none';
  $('pbArt').innerHTML = `<img src="${song.cover}" alt="${song.title}"/>`;

  // Highlight now-playing rows across all lists
  document.querySelectorAll('.srow').forEach(r => {
    const isNow = parseInt(r.dataset.id) === song.id;
    r.classList.toggle('now', isNow);
    const numEl = r.querySelector('.s-num');
    if (numEl) {
      if (isNow) {
        numEl.innerHTML = '<div class="eq"><span></span><span></span><span></span></div>';
      } else {
        numEl.textContent = numEl.dataset.n || '';
      }
    }
  });

  if (song.url) {
    audio.src = song.url;
    audio.load();
  } else {
    audio.src = '';
  }
  updateProgUI(0, 0);
  document.title = `${song.title} — ${song.artist} · WTC Music`;
}

function playAudio() {
  const song = queue[queueIdx];
  if (!song || !song.url) {
    showToast('Esta canción no está disponible aún', 'fa-circle-xmark');
    $('playIco').className = 'fa fa-play';
    isPlaying = false;
    return;
  }
  audio.play()
    .then(() => { isPlaying = true; $('playIco').className = 'fa fa-pause'; })
    .catch(() => showToast('No se pudo reproducir', 'fa-circle-xmark'));
}

function pauseAudio() {
  audio.pause();
  isPlaying = false;
  $('playIco').className = 'fa fa-play';
}

function togglePlay() { if (isPlaying) pauseAudio(); else playAudio(); }

function nextTrack() {
  queueIdx = isShuffle
    ? Math.floor(Math.random() * queue.length)
    : (queueIdx + 1) % queue.length;
  loadTrack(queueIdx); playAudio();
}

function prevTrack() {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  queueIdx = (queueIdx - 1 + queue.length) % queue.length;
  loadTrack(queueIdx); playAudio();
}

audio.addEventListener('ended', () => {
  if (repeatMode === 2) { audio.currentTime = 0; playAudio(); }
  else nextTrack();
});

audio.addEventListener('timeupdate', () => {
  if (isDraggingSeek) return;
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  updateProgUI(pct, audio.currentTime);
  $('seekDur').textContent = fmt(audio.duration);
});

audio.addEventListener('loadedmetadata', () => {
  const song = queue[queueIdx];
  if (song) {
    const d = document.getElementById('dur-' + song.id);
    if (d) d.textContent = fmt(audio.duration);
  }
  $('seekDur').textContent = fmt(audio.duration);
});

function updateProgUI(pct, cur) {
  const p = Math.min(100, Math.max(0, pct));
  const pf = $('progLineFill');   if (pf) pf.style.width = p + '%';
  const pi = $('progInlineFill'); if (pi) pi.style.width = p + '%';
  const sf = $('seekFill');       if (sf) sf.style.width = p + '%';
  const st = $('seekThumb');      if (st) st.style.left  = `calc(${p}% - 7px)`;
  $('seekCur').textContent = fmt(cur);
}

/* ─────────────────────────────────────────
   PLAYER — CONTROLS
───────────────────────────────────────── */
$('btnPlay').addEventListener('click', togglePlay);
$('btnNext').addEventListener('click', nextTrack);
$('btnPrev').addEventListener('click', prevTrack);

$('btnShuffle').addEventListener('click', () => {
  isShuffle = !isShuffle;
  $('btnShuffle').classList.toggle('on', isShuffle);
  showToast(isShuffle ? 'Aleatorio activado' : 'Aleatorio desactivado', 'fa-shuffle');
});

$('btnRepeat').addEventListener('click', () => {
  repeatMode = (repeatMode + 1) % 3;
  $('btnRepeat').classList.toggle('on', repeatMode > 0);
  $('btnRepeat').querySelector('i').className = repeatMode === 2 ? 'fa fa-1' : 'fa fa-repeat';
  const labels = ['Repetir desactivado', 'Repetir todo', 'Repetir una vez'];
  showToast(labels[repeatMode], 'fa-repeat');
});

// Seek click
function seekTo(e, el) {
  if (!audio.duration) return;
  const rect = el.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audio.currentTime = pct * audio.duration;
  updateProgUI(pct * 100, audio.currentTime);
}
$('seekWrap').addEventListener('click',   e => seekTo(e, $('seekWrap')));
$('progInline').addEventListener('click', e => seekTo(e, $('progInline')));
$('pbPill').querySelector('.pb-prog-line').addEventListener('click', e => seekTo(e, e.currentTarget));

// Seek drag
let dragStartX = 0;
$('seekWrap').addEventListener('mousedown', e => {
  isDraggingSeek = true; dragStartX = e.clientX;
  document.addEventListener('mousemove', onSeekDrag);
  document.addEventListener('mouseup', onSeekUp, { once: true });
});
function onSeekDrag(e) {
  if (!isDraggingSeek || !audio.duration) return;
  const rect = $('seekWrap').getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  updateProgUI(pct * 100, pct * audio.duration);
}
function onSeekUp(e) {
  isDraggingSeek = false;
  document.removeEventListener('mousemove', onSeekDrag);
  seekTo(e, $('seekWrap'));
}

// Seek modal
$('pbCenter').addEventListener('click', () => $('seekModal').classList.toggle('show'));
document.addEventListener('click', e => {
  if (!$('pbCenter').contains(e.target) && !$('seekModal').contains(e.target))
    $('seekModal').classList.remove('show');
});

// Volume
audio.volume = volume;
function setVolume(v) {
  volume = Math.max(0, Math.min(1, v));
  audio.volume = volume;
  const pct = volume * 100;
  $('volFill').style.width = pct + '%';
  $('volThumb').style.left = `calc(${pct}% - 5px)`;
  $('volIcoL').className = volume === 0 ? 'fa fa-volume-xmark vol-ico' : 'fa fa-volume-low vol-ico';
}
setVolume(volume);
$('volWrap').addEventListener('click', e => {
  const rect = $('volWrap').getBoundingClientRect();
  setVolume((e.clientX - rect.left) / rect.width);
});
$('volIcoL').addEventListener('click', () => setVolume(volume === 0 ? 0.5 : 0));
$('volIcoH').addEventListener('click', () => setVolume(1));

// More options (btnMore)
$('btnMore').addEventListener('click', e => {
  e.stopPropagation();
  const song = queue[queueIdx];
  if (song) showCtx(e.clientX, e.clientY, song);
});

/* Keyboard shortcuts */
document.addEventListener('keydown', e => {
  const tag = document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  if (e.code === 'Space')                    { e.preventDefault(); togglePlay(); }
  if (e.code === 'ArrowRight' && e.shiftKey) nextTrack();
  if (e.code === 'ArrowLeft'  && e.shiftKey) prevTrack();
  if (e.code === 'ArrowUp'    && e.shiftKey) setVolume(volume + 0.1);
  if (e.code === 'ArrowDown'  && e.shiftKey) setVolume(volume - 0.1);
  if (e.code === 'KeyS')  $('btnShuffle').click();
  if (e.code === 'KeyR')  $('btnRepeat').click();
  if (e.code === 'KeyL') {
    const s = queue[queueIdx];
    if (s) { s.liked = !s.liked; renderAllSongs(); showToast(s.liked ? 'Añadida a favoritas' : 'Eliminada', s.liked ? 'fa-heart' : 'fa-heart-crack'); }
  }
});

/* ─────────────────────────────────────────
   CONTEXT MENU
───────────────────────────────────────── */
const ctxMenu = $('ctxMenu');
let ctxSong = null;

function showCtx(x, y, song) {
  ctxSong = song;
  ctxMenu.innerHTML = `
    <div class="ctx-i" id="ctx-play"><i class="fa fa-play"></i> Reproducir</div>
    <div class="ctx-i" id="ctx-next"><i class="fa fa-list"></i> Añadir a continuación</div>
    <div class="ctx-i" id="ctx-queue"><i class="fa fa-plus"></i> Añadir a la cola</div>
    <div class="ctx-sep"></div>
    <div class="ctx-i" id="ctx-like">
      <i class="fa ${song.liked ? 'fa-heart-crack' : 'fa-heart'}"></i>
      ${song.liked ? 'Quitar de favoritas' : 'Añadir a favoritas'}
    </div>
    <div class="ctx-sep"></div>
    <div class="ctx-i ctx-i--artist" id="ctx-artist"><i class="fa fa-user"></i> Ir al artista</div>
    <div class="ctx-i ctx-i--info" style="cursor:default;opacity:.6">
      <i class="fa fa-circle-info"></i> ${song.album} · ${song.year || ''}
    </div>`;

  ctxMenu.style.left = Math.min(x, window.innerWidth - 220) + 'px';
  ctxMenu.style.top  = Math.min(y, window.innerHeight - 200) + 'px';
  ctxMenu.classList.add('show');

  $('ctx-play').onclick = () => {
    const idx = SONGS.findIndex(s => s.id === ctxSong.id);
    queue = [...SONGS]; queueIdx = idx; loadTrack(idx); playAudio(); hideCtx();
  };
  $('ctx-next').onclick = () => {
    queue.splice(queueIdx + 1, 0, { ...ctxSong });
    showToast('Se reproducirá a continuación', 'fa-list'); hideCtx();
  };
  $('ctx-queue').onclick = () => {
    queue.push({ ...ctxSong });
    showToast('Añadida a la cola', 'fa-plus'); hideCtx();
  };
  $('ctx-like').onclick = () => {
    ctxSong.liked = !ctxSong.liked;
    showToast(ctxSong.liked ? 'Añadida a favoritas' : 'Eliminada', ctxSong.liked ? 'fa-heart' : 'fa-heart-crack');
    renderAllSongs(); hideCtx();
  };
  $('ctx-artist').onclick = () => {
    navigateTo('artistas');
    setTimeout(() => openArtistPage(ctxSong.artistId), 120);
    hideCtx();
  };
}

function hideCtx() { ctxMenu.classList.remove('show'); }
document.addEventListener('click',  e => { if (!ctxMenu.contains(e.target)) hideCtx(); });
document.addEventListener('contextmenu', e => {
  const row = e.target.closest('.srow');
  if (!row) return;
  e.preventDefault();
  const song = SONGS.find(s => s.id == row.dataset.id);
  if (song) showCtx(e.clientX, e.clientY, song);
});

/* ─────────────────────────────────────────
   NOW PLAYING — animated album art pulse
───────────────────────────────────────── */
audio.addEventListener('play',  () => $('pbArt').classList.add('playing'));
audio.addEventListener('pause', () => $('pbArt').classList.remove('playing'));

/* ─────────────────────────────────────────
   PROMO
───────────────────────────────────────── */
$('promoPlay').addEventListener('click', () => {
  queue = [...SONGS]; queueIdx = 0; loadTrack(0); playAudio();
});

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
buildSearchOverlay();
updateSidebarPlaylists();
renderInicio();
renderArtists();
renderAlbums();
renderAllSongs();
renderRecientes();
renderRadio();
renderVideoclips();
loadTrack(0);
setVolume(volume);
