const thumb = document.querySelector('.slider-thumb');
const track = document.querySelector('.slider-track');
const text = document.querySelector('.slide-text');
const schermo = document.querySelector('.schermo');
const homescreen = document.querySelector('.homescreen');
const foto = document.querySelector('#foto');
const liveleak = document.querySelector('#liveleak');
const phone = document.querySelector('#phone');

let dragging = false;
let startX = 0;
let currentX = 0;
let maxSlide = 0;

function getMaxSlide() {
  return track.offsetWidth - thumb.offsetWidth;
}

thumb.addEventListener('mousedown', (e) => {
  dragging = true;
  maxSlide = getMaxSlide();
  startX = e.clientX - currentX;
  thumb.style.cursor = 'grabbing';
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  let x = e.clientX - startX;
  x = Math.max(0, Math.min(x, maxSlide));
  currentX = x;
  thumb.style.left = x + 'px';
  text.style.opacity = 1 - (x / maxSlide);
});

document.addEventListener('mouseup', () => {
  if (!dragging) return;
  dragging = false;
  thumb.style.cursor = 'grab';

  const progress = currentX / maxSlide;

  if (progress >= 0.95) {
    const unlocktop = document.querySelector('.unlocktop');
    const unlockbottom = document.querySelector('.unlockbottom');
    const spazio = document.querySelector('.spazio');

    unlocktop.style.transform = 'translateY(-100%)';
    unlocktop.style.opacity = '0';
    unlockbottom.style.transform = 'translateY(100%)';
    unlockbottom.style.opacity = '0';
    spazio.style.opacity = '0';

    setTimeout(() => {
      unlocktop.style.display = 'none';
      unlockbottom.style.display = 'none';
      spazio.style.display = 'none';
      homescreen.style.display = 'flex';

      document.querySelector('.lucchetto').style.display = 'none';
      document.querySelector('.top-center').style.display = 'block';
    }, 400);
  }
});

function updateTime() {
  const now = new Date();
  const ore = String(now.getHours()).padStart(2, '0');
  const minuti = String(now.getMinutes()).padStart(2, '0');
  const timeString = `${ore}:${minuti}`;

  document.querySelector('.orario').textContent = timeString;
  document.querySelector('.orario-top').textContent = timeString;

  const giorni = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const mesi = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const giorno = giorni[now.getDay()];
  const mese = mesi[now.getMonth()];
  const data = now.getDate();
  document.querySelector('.data').textContent = `${giorno}, ${mese} ${data}`;
}

updateTime();
setInterval(updateTime, 1000);

const viewer = document.createElement('div');
viewer.id = 'img-viewer';
viewer.style.cssText = `
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  height: calc(100% - 40px);
  background: #000;
  z-index: 300;
  display: none;
  flex-direction: column;
`;

const viewerBar = document.createElement('div');
viewerBar.style.cssText = `
  height: 44px;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  padding: 0 15px;
  flex-shrink: 0;
`;

const viewerBack = document.createElement('span');
viewerBack.textContent = '‹ Back';
viewerBack.style.cssText = `
  color: #5b9bd5;
  font-size: 18px;
  font-weight: 400;
  cursor: pointer;
`;

viewerBar.appendChild(viewerBack);

const viewerImg = document.createElement('img');
viewerImg.style.cssText = `
  flex: 1;
  width: 100%;
  height: 0;
  object-fit: contain;
`;

viewer.appendChild(viewerBar);
viewer.appendChild(viewerImg);
document.querySelector('.iphone').appendChild(viewer);

viewerBack.addEventListener('click', () => {
  viewer.style.display = 'none';
  document.querySelector('.gallery').style.display = 'flex';
});

const WORKER_URL = 'https://api.a-boulay37000.workers.dev';

async function fetchGalleryFiles() {
  const res = await fetch(`${WORKER_URL}/api/gallery`);
  const files = await res.json();
  return files.filter(f => /\.(jpg|jpeg|png|gif|webp|jfif)$/i.test(f.name));
}

async function loadGallery() {
  const grid = document.querySelector('.gallery-grid');
  grid.innerHTML = '';
  const files = await fetchGalleryFiles();
  files.forEach(f => {
    const img = document.createElement('img');
    img.src = f.download_url;
    img.alt = '';
    grid.appendChild(img);
  });

  grid.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;
    viewerImg.src = img.src;
    document.querySelector('.gallery').style.display = 'none';
    viewer.style.display = 'flex';
  });
}

foto.addEventListener('click', () => {
  homescreen.style.display = 'none';
  document.querySelector('.gallery').style.display = 'flex';
  loadGallery();
});

document.querySelector('.gallery-back').addEventListener('click', () => {
  document.querySelector('.gallery').style.display = 'none';
  homescreen.style.display = 'flex';
});

liveleak.addEventListener('click', () => {
  homescreen.style.display = 'none';
  document.querySelector('.liveleak').style.display = 'flex';
});

document.querySelector('.liveleak-back').addEventListener('click', () => {
  document.querySelector('.liveleak').style.display = 'none';
  homescreen.style.display = 'flex';
});

phone.addEventListener('click', () => {
  homescreen.style.display = 'none';
  document.querySelector('.hotline').style.display = 'flex';
});

document.querySelector('.hotline-back').addEventListener('click', () => {
  document.querySelector('.hotline').style.display = 'none';
  homescreen.style.display = 'flex';
});

thumb.addEventListener('touchstart', (e) => {
  dragging = true;
  maxSlide = getMaxSlide();
  startX = e.touches[0].clientX - currentX;
  thumb.style.cursor = 'grabbing';
  e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  if (!dragging) return;
  let x = e.touches[0].clientX - startX;
  x = Math.max(0, Math.min(x, maxSlide));
  currentX = x;
  thumb.style.left = x + 'px';
  text.style.opacity = 1 - (x / maxSlide);
}, { passive: false });

document.addEventListener('touchend', () => {
  if (!dragging) return;
  dragging = false;

  const progress = currentX / maxSlide;

  if (progress >= 0.95) {
    const unlocktop = document.querySelector('.unlocktop');
    const unlockbottom = document.querySelector('.unlockbottom');
    const spazio = document.querySelector('.spazio');

    unlocktop.style.transform = 'translateY(-100%)';
    unlocktop.style.opacity = '0';
    unlockbottom.style.transform = 'translateY(100%)';
    unlockbottom.style.opacity = '0';
    spazio.style.opacity = '0';

    setTimeout(() => {
      unlocktop.style.display = 'none';
      unlockbottom.style.display = 'none';
      spazio.style.display = 'none';
      homescreen.style.display = 'flex';

      document.querySelector('.lucchetto').style.display = 'none';
      document.querySelector('.top-center').style.display = 'block';
    }, 400);
  }
});

const admin        = document.querySelector('.admin');
const adminViewer  = document.querySelector('.admin-viewer');
const adminUpload  = document.querySelector('.admin-upload');
const adminGrid    = document.querySelector('.admin-grid');
const adminAddTile = document.querySelector('#admin-add');

let adminPassword = null;

function openAdmin() {
  const pwd = prompt('Mot de passe :');
  if (!pwd) return;
  adminPassword = pwd;
  homescreen.style.display = 'none';
  admin.style.display = 'flex';
  loadAdminGallery();
}

document.querySelector('#admin-icon').addEventListener('click', openAdmin);

document.querySelector('.admin-back').addEventListener('click', () => {
  admin.style.display = 'none';
  homescreen.style.display = 'flex';
});

async function loadAdminGallery() {
  adminGrid.querySelectorAll('img').forEach(i => i.remove());
  const files = await fetchGalleryFiles();
  files.forEach(f => {
    const img = document.createElement('img');
    img.src = f.download_url;
    img.dataset.sha  = f.sha;
    img.dataset.path = f.path;
    img.dataset.name = f.name;
    img.alt = '';
    adminGrid.insertBefore(img, adminAddTile);
  });
}

let adminCurrentFile = null;

adminGrid.addEventListener('click', (e) => {
  const img = e.target.closest('img');
  if (!img) return;
  adminCurrentFile = { sha: img.dataset.sha, path: img.dataset.path, name: img.dataset.name };
  document.querySelector('.admin-viewer-img').src = img.src;
  admin.style.display = 'none';
  adminViewer.style.display = 'flex';
});

document.querySelector('.admin-viewer-back').addEventListener('click', () => {
  adminViewer.style.display = 'none';
  admin.style.display = 'flex';
});

document.querySelector('.admin-delete-btn').addEventListener('click', () => {
  if (!adminCurrentFile) return;
  const ok = confirm(`Êtes-vous sûr de vouloir supprimer "${adminCurrentFile.name}" ?`);
  if (!ok) return;
  deletePhoto(adminCurrentFile);
});

async function deletePhoto({ sha, path, name }) {
  const res = await fetch(`${WORKER_URL}/api/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Password': adminPassword
    },
    body: JSON.stringify({ path, name, sha })
  });
  if (res.ok) {
    adminViewer.style.display = 'none';
    admin.style.display = 'flex';
    loadAdminGallery();
  } else if (res.status === 401) {
    alert('Mot de passe incorrect.');
    adminPassword = null;
  } else {
    alert('Erreur lors de la suppression.');
  }
}

adminAddTile.addEventListener('click', () => {
  admin.style.display = 'none';
  adminUpload.style.display = 'flex';
  document.getElementById('admin-upload-status').textContent = '';
  document.getElementById('admin-upload-btn').disabled = true;
  document.getElementById('admin-preview').style.display = 'none';
  document.getElementById('admin-upload-hint').style.display = 'block';
  document.getElementById('admin-file-input').value = '';
});

document.querySelector('.admin-upload-back').addEventListener('click', () => {
  adminUpload.style.display = 'none';
  admin.style.display = 'flex';
});

let uploadFile = null;

function handleFileSelect(file) {
  if (!file) return;
  uploadFile = file;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const preview = document.getElementById('admin-preview');
    preview.src = ev.target.result;
    preview.style.display = 'block';
    document.getElementById('admin-upload-hint').style.display = 'none';
    document.getElementById('admin-upload-btn').disabled = false;
  };
  reader.readAsDataURL(file);
}

document.getElementById('admin-file-input').addEventListener('change', (e) => {
  handleFileSelect(e.target.files[0]);
});

const uploadLabel = document.getElementById('admin-upload-label');

uploadLabel.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadLabel.style.borderColor = '#5b9bd5';
});

uploadLabel.addEventListener('dragleave', () => {
  uploadLabel.style.borderColor = '#444';
});

uploadLabel.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadLabel.style.borderColor = '#444';
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    handleFileSelect(file);
  }
});

document.getElementById('admin-upload-btn').addEventListener('click', async () => {
  if (!uploadFile) return;
  const status = document.getElementById('admin-upload-status');
  status.textContent = 'Téléchargement en cours...';

  const reader = new FileReader();
  reader.onload = async (ev) => {
    const base64 = ev.target.result.split(',')[1];
    const filename = `${Date.now()}_${uploadFile.name}`;

    const res = await fetch(`${WORKER_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': adminPassword
      },
      body: JSON.stringify({ filename, content: base64 })
    });

    if (res.ok) {
      status.textContent = '✓ Photo téléchargée !';
      uploadFile = null;
      setTimeout(() => {
        adminUpload.style.display = 'none';
        admin.style.display = 'flex';
        loadAdminGallery();
      }, 1000);
    } else if (res.status === 401) {
      status.textContent = 'Mot de passe incorrect.';
      adminPassword = null;
    } else {
      status.textContent = 'Erreur lors du téléchargement.';
    }
  };
  reader.readAsDataURL(uploadFile);
});
