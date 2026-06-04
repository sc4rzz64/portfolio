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

foto.addEventListener('click', () => {
  homescreen.style.display = 'none';
  document.querySelector('.gallery').style.display = 'flex';
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

document.querySelector('.gallery-grid').addEventListener('click', (e) => {
  const img = e.target.closest('img');
  if (!img) return;

  viewerImg.src = img.src;
  document.querySelector('.gallery').style.display = 'none';
  viewer.style.display = 'flex';
});

viewerBack.addEventListener('click', () => {
  viewer.style.display = 'none';
  document.querySelector('.gallery').style.display = 'flex';
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
