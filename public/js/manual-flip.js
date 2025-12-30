// manual-flip.js

// Данные страниц manual-книги
const manualPages = [
  // Передняя обложка
  {
    type: 'cover',
    title: 'MANUAL BOOK',
    subtitle: 'Gesture Guide',
    author: 'By Alexanyan Emile',
    image: 'img/manual/cover2.png' // Добавьте путь к вашей картинке
  },
  {
    title: 'WELCOME',
    html: '<div style="font-size: 16px; line-height: 1.8; text-align: left;">Hey dude, I made a pretty weird graphics editor where you can create fun graphics using your keyboard and mouse or with gestures, lol(xd).<br><br>I think you\'ll figure out the keyboard/mouse controls on your own, but gestures might raise some questions.<br><br>That\'s why I thoughtfully made this mini-manual for you.<br><br>Good luck!</div>'
  },
  {
    title: 'CREATE MOLECULE',
    gesture: 'Pinch gesture',
    howTo: 'Bring your thumb and index finger together (pinch position) and hold for 1 second.',
    func: '→ Creates a new molecule at the pinch position',
    image: 'img/manual/pinch_gesture.gif'
  },
  {
    title: 'EDIT MODE',
    gesture: 'Open mouth',
    howTo: 'Open your mouth wide to activate edit mode (✎).',
    func: '→ Switches to EDIT MODE (✎) for molecule manipulation',
    image: 'img/manual/open_mouth.gif'
  },
  {
    title: 'MOVE MOLECULE',
    gesture: 'Palm (open hand)',
    howTo: 'Show your open palm and move it around to reposition molecules.',
    func: '→ Moves the selected molecule to palm position',
    image: 'img/manual/palm_move.gif'
  },
  {
    title: 'SIZE & SHAPE',
    gesture: 'Palm in edit mode (✎)',
    howTo: 'In edit mode, use your palm width to control size and bend fingers to change shape.<br><br>• <strong>Palm width</strong> = molecule size<br>• <strong>Bent fingers</strong> = molecule shape',
    func: '→ Adjusts molecule size and shape dynamically',
    image: 'img/manual/palm_edit.gif'
  },
  {
    title: 'LOCK MOLECULE',
    gesture: 'All fingers together',
    howTo: 'Close all fingers together (fist position) and hold for 1 second.',
    func: '→ Locks the selected molecule (prevents movement)',
    image: 'img/manual/lock_single.gif'
  },
  {
    title: 'LOCK ALL',
    gesture: 'Both hands, fingers together',
    howTo: 'Close all fingers on both hands together and hold for 1 second.',
    func: '→ Locks ALL molecules on the canvas',
    image: 'img/manual/lock_all.gif'
  },
  {
    title: 'UNLOCK',
    gesture: 'Pinky finger',
    howTo: 'Extend your pinky finger while keeping other fingers closed.',
    func: '→ Unlocks locked molecules',
    image: 'img/manual/unlock.gif'
  },
  {
    title: 'DELETE MOLECULE',
    gesture: 'Crossed fingers',
    howTo: 'Cross your index and middle fingers and hold for 1 second.',
    func: '→ Deletes the selected molecule',
    image: 'img/manual/delete.gif'
  },
  {
    title: 'SOUND DEFORMATION',
    gesture: 'Voice/Sound input',
    howTo: 'Make sounds or speak near the microphone to create audio-reactive deformations.',
    func: '→ Deforms molecule contours based on sound frequency',
    image: 'img/manual/sound.gif'
  },
  {
    title: 'KEYBOARD SHORTCUTS',
    html: '<div style="font-size: 18px; line-height: 2;"><strong>Ctrl+C</strong> → Copy selected molecule<br><strong>Ctrl+V</strong> → Paste copied molecule<br><strong>Ctrl+Z</strong> → Undo last action</div>',
    func: '→ Quick actions using keyboard',
    image: 'img/manual/keyboard.png',
    imageHeight: '150px'
  },
  // Пустая страница для правильного отображения задней обложки
  {
    title: '',
    html: '<div style="height: 100%;"></div>'
  },
  // Задняя обложка
  {
    type: 'cover',
    title: 'Thank You!',
    subtitle: 'For more information,<br>visit the main application'
  }
];

// Создание HTML страницы
function createManualPageHTML(pageData, index, total) {
  if (pageData.type === 'cover') {
    const coverClass =
      index === 0
        ? 'page-cover page-cover-front'
        : index === total - 1
        ? 'page-cover page-cover-back'
        : 'page-cover';

    return `
      <div class="page ${coverClass}" data-density="hard">
        <div class="page-inner">
          <div class="page-content">
            <h1>${pageData.title}</h1>
            ${pageData.subtitle ? `<div class="subtitle">${pageData.subtitle}</div>` : ''}
            ${pageData.author ? `<div class="author">${pageData.author}</div>` : ''}
            ${pageData.image ? `<img src="${pageData.image}" alt="${pageData.title}" class="cover-image">` : ''}
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="page">
      <div class="page-inner">
        <div class="page-content">
          <h2>${pageData.title}</h2>

          ${
            pageData.gesture
              ? `
            <div class="gesture-description">
              <strong>Gesture:</strong> ${pageData.gesture}<br>
              <strong>How to perform:</strong> ${pageData.howTo}
            </div>
          `
              : ''
          }

          ${pageData.html || ''}

          ${
            pageData.func
              ? `
          <div class="gesture-function">
            ${pageData.func}
          </div>
          `
              : ''
          }

          ${
            pageData.image
              ? `
          <div class="gesture-image" style="${pageData.imageHeight ? `min-height:${pageData.imageHeight}` : ''}">
            <img src="${pageData.image}" alt="${pageData.title}">
          </div>
          `
              : ''
          }
        </div>
      </div>
    </div>
  `;
}

// Вычисление размеров книги
function calculateManualBookDimensions() {
  let vw = window.innerWidth;
  let vh = window.innerHeight;

  const topOffset = 80;
  const bottomOffset = 40;
  const availableHeight = vh - topOffset - bottomOffset;

  const originalWidth = Math.min(window.innerWidth, window.innerHeight);

  let pageWidth, pageHeight;

  if (originalWidth <= 768) {
    // мобильный
    const mobileAvailableHeight = vh - 100;
    pageHeight = Math.floor(mobileAvailableHeight * 0.85);
    pageWidth = Math.floor(pageHeight / 1.4);
    const maxWidth = Math.floor(vw * 0.42);
    if (pageWidth > maxWidth) {
      pageWidth = maxWidth;
      pageHeight = Math.floor(pageWidth * 1.4);
    }
  } else if (originalWidth <= 1024) {
    // планшет
    const heightPercent = 0.92;
    const maxWidthPercent = 0.45;
    pageHeight = Math.floor(availableHeight * heightPercent);
    pageWidth = Math.floor(pageHeight / 1.4);
    const maxWidth = Math.floor(vw * maxWidthPercent);
    if (pageWidth > maxWidth) {
      pageWidth = maxWidth;
      pageHeight = Math.floor(pageWidth * 1.4);
    }
  } else {
    // десктоп
    const heightPercent = 0.92;
    const maxWidthPercent = 0.45;
    pageHeight = Math.floor(availableHeight * heightPercent);
    pageWidth = Math.floor(pageHeight / 1.4);
    const maxWidth = Math.floor(vw * maxWidthPercent);
    if (pageWidth > maxWidth) {
      pageWidth = maxWidth;
      pageHeight = Math.floor(pageWidth * 1.4);
    }
    if (pageWidth < 400) pageWidth = 400;
    if (pageHeight < 560) pageHeight = 560;
  }

  return { width: pageWidth, height: pageHeight };
}

// Инициализация manual-книги
document.addEventListener('DOMContentLoaded', () => {
  const bookElement = document.getElementById('book');

  // Рендер страниц
  bookElement.innerHTML = '';
  manualPages.forEach((p, i) => {
    bookElement.innerHTML += createManualPageHTML(p, i, manualPages.length);
  });

  const totalPages = manualPages.length;

  const { width, height } = calculateManualBookDimensions();

  const pageFlip = new St.PageFlip(bookElement, {
    width,
    height,
    size: 'fixed',
    showCover: true,
    mobileScrollSupport: true,
    swipeDistance: 30,
    clickEventForward: true,
    usePortrait: false,
    startPage: 0,
    drawShadow: false,
    flippingTime: 800,
    useMouseEvents: true,
    maxShadowOpacity: 0,
    showPageCorners: true,
    disableFlipByClick: false
  });

  pageFlip.loadFromHTML(document.querySelectorAll('#book .page'));

  let currentPage = 0;

  function updateUI() {
    // центрирование обложек как в gallery-flip
    const stfWrapper = bookElement.querySelector('.stf__wrapper');
    if (!stfWrapper) return;

    const dims = calculateManualBookDimensions();
    const w = dims.width;

    if (currentPage === 0) {
      stfWrapper.style.transform = `translateX(-${w / 2}px)`;
    } else if (currentPage === totalPages - 1) {
      stfWrapper.style.transform = `translateX(${w / 2}px)`;
    } else {
      stfWrapper.style.transform = 'translateX(0)';
    }
  }

  pageFlip.on('flip', (e) => {
    currentPage = e.data;
    updateUI();
  });

  // Управление стрелками клавиатуры
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      pageFlip.flipPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      pageFlip.flipNext();
    }
  });

  // ресайз — пересоздаём книгу по аналогии с gallery-flip
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const { width: w, height: h } = calculateManualBookDimensions();
      pageFlip.update({ ...pageFlip.getSettings(), width: w, height: h });
      updateUI();
    }, 300);
  });

  setTimeout(updateUI, 100);
});
