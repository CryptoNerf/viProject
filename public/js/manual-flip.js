// manual-flip.js

// localStorage может быть недоступен (приватный режим, запрет cookies) - тогда работаем без сохранения
function loadSavedLang() {
  try {
    return localStorage.getItem('manualLang');
  } catch {
    return null;
  }
}

function saveLang(lang) {
  try {
    localStorage.setItem('manualLang', lang);
  } catch {
    // Язык просто не запомнится
  }
}

// Текущий язык (загружаем из localStorage или используем английский по умолчанию)
let currentLang = loadSavedLang() === 'ru' ? 'ru' : 'en';

// Переводы для книги
const translations = {
  en: {
    cover: {
      title: 'MANUAL BOOK',
      subtitle: 'Gesture Guide',
      author: 'By Alexanyan Emile'
    },
    welcome: {
      title: 'WELCOME',
      text: 'Hey dude, I made a pretty weird graphics editor where you can create fun graphics using your keyboard and mouse or with gestures, lol(xd).<br><br>I think you\'ll figure out the keyboard/mouse controls on your own, but gestures might raise some questions.<br><br>That\'s why I thoughtfully made this mini-manual for you.<br><br>Good luck!'
    },
    gestures: {
      create: {
        title: 'CREATE MOLECULE',
        gesture: 'Pinch gesture with different fingers',
        howTo: 'Hold your thumb with different fingers for 1 second to create different shapes:<br><br><b>Index + Thumb</b> = Circle<br><b>Middle + Thumb</b> = Triangle<br><b>Ring + Thumb</b> = Heart<br><b>Pinky + Thumb</b> = Star',
        func: 'Creates a new molecule at the pinch position'
      },
      editMode: {
        title: 'EDIT MODE',
        gesture: 'Open mouth',
        howTo: 'Open your mouth wide to activate edit mode (✎).',
        func: 'Switches to EDIT MODE (✎) for molecule manipulation'
      },
      move: {
        title: 'MOVE MOLECULE',
        gesture: 'Palm (open hand)',
        howTo: 'Show your open palm and move it around to reposition molecules.',
        func: 'Moves the selected molecule to palm position'
      },
      sizeShape: {
        title: 'SIZE & SHAPE',
        gesture: 'Hands in edit mode (✎)',
        howTo: 'In edit mode:<br><br><b>Distance between fingers</b> = molecule width<br><b>Two open hands</b> = molecule shape (spread hands to stretch, bring together to compress)',
        func: 'Adjusts molecule size and shape dynamically'
      },
      lock: {
        title: 'LOCK MOLECULE',
        gesture: 'All fingers together',
        howTo: 'Close all fingers together (fist position) and hold for 1 second.',
        func: 'Locks the selected molecule (prevents movement)'
      },
      lockAll: {
        title: 'LOCK ALL',
        gesture: 'Both hands, fingers together',
        howTo: 'Close all fingers on both hands together and hold for 1 second.',
        func: 'Locks ALL molecules on the canvas'
      },
      unlock: {
        title: 'UNLOCK',
        gesture: 'Pinky finger',
        howTo: 'Extend your pinky finger while keeping other fingers closed.',
        func: 'Unlocks locked molecules'
      },
      delete: {
        title: 'DELETE MOLECULE',
        gesture: 'Crossed fingers',
        howTo: 'Cross your index and middle fingers and hold for 1 second.',
        func: 'Deletes the selected molecule'
      },
      sound: {
        title: 'SOUND DEFORMATION',
        gesture: 'Voice/Sound input',
        howTo: 'Make sounds or speak near the microphone to create audio-reactive deformations.',
        func: 'Deforms molecule contours based on sound frequency'
      },
      keyboard: {
        title: 'KEYBOARD SHORTCUTS',
        html: '<div class="page-text page-text-keys"><strong>Ctrl+C</strong> → Copy selected molecule<br><strong>Ctrl+V</strong> → Paste copied molecule<br><strong>Ctrl+Z</strong> → Undo last action<br><strong>Ctrl+Shift+Z</strong> → Redo<br><strong>Delete</strong> → Delete selected molecule<br><small>On Mac: Cmd instead of Ctrl</small></div>',
        func: 'Quick actions using keyboard'
      }
    },
    backCover: {
      title: 'Thank You!',
      subtitle: 'For more information,<br>visit the main application'
    },
    finalPage: {
      title: 'THAT\'S ALL!',
      text: 'Welp, I guess that\'s it. Thank you dear user for your interest in the project. I hope it helps you create something beautiful or captures your attention.<br>If you\'re curious about what else I do, you can visit my website <a href="https://cryptonerf.github.io/portfolio/" target="_blank">cryptonerf.github.io/portfolio</a> where I collect my works.<br>Or my telegram channel <a href="https://t.me/solnechnoederevo" target="_blank">t.me/solnechnoederevo</a> where I share my life even more often!'
    }
  },
  ru: {
    cover: {
      title: 'РУКОВОДСТВО',
      subtitle: 'Управление жестами',
      author: 'Автор: Алексанян Эмиль'
    },
    welcome: {
      title: 'ПРИВЕТСТВУЮ',
      text: 'Привет чувак, я сделал довольно странный графический редактор где можно делать забавную графику с помощью клавиатуры и мыши или с помощью жестов, лол(хд).<br><br>Я думаю ты разберёшься как управлять клавиатурой/мышью самостоятельно, но с жестами могут быть вопросы.<br><br>Для этого я заботливо сделал для тебя мини-мануал.<br><br>Удачи!'
    },
    gestures: {
      create: {
        title: 'СОЗДАТЬ МОЛЕКУЛУ',
        gesture: 'Жест щипка разными пальцами',
        howTo: 'Удерживайте большой палец с разными пальцами 1 секунду для создания разных форм:<br><br><b>Указательный + Большой</b> = Круг<br><b>Средний + Большой</b> = Треугольник<br><b>Безымянный + Большой</b> = Сердце<br><b>Мизинец + Большой</b> = Звезда',
        func: 'Создаёт новую молекулу в позиции щипка'
      },
      editMode: {
        title: 'РЕЖИМ РЕДАКТИРОВАНИЯ',
        gesture: 'Открытый рот',
        howTo: 'Широко откройте рот чтобы активировать режим редактирования (✎).',
        func: 'Переключает в РЕЖИМ РЕДАКТИРОВАНИЯ (✎) для манипуляции молекулой'
      },
      move: {
        title: 'ПЕРЕМЕЩЕНИЕ МОЛЕКУЛЫ',
        gesture: 'Ладонь (открытая рука)',
        howTo: 'Покажите открытую ладонь и перемещайте её для изменения позиции молекул.',
        func: 'Перемещает выбранную молекулу в позицию ладони'
      },
      sizeShape: {
        title: 'РАЗМЕР И ФОРМА',
        gesture: 'Руки в режиме редактирования (✎)',
        howTo: 'В режиме редактирования:<br><br><b>Расстояние между пальцами</b> = ширина молекулы<br><b>Две открытые руки</b> = форма молекулы (разводишь руки - растягивается, сводишь - сжимается)',
        func: 'Динамически изменяет размер и форму молекулы'
      },
      lock: {
        title: 'ЗАБЛОКИРОВАТЬ МОЛЕКУЛУ',
        gesture: 'Все пальцы вместе',
        howTo: 'Сожмите все пальцы вместе (позиция кулака) и удерживайте 1 секунду.',
        func: 'Блокирует выбранную молекулу (предотвращает перемещение)'
      },
      lockAll: {
        title: 'ЗАБЛОКИРОВАТЬ ВСЁ',
        gesture: 'Обе руки, пальцы вместе',
        howTo: 'Сожмите все пальцы на обеих руках вместе и удерживайте 1 секунду.',
        func: 'Блокирует ВСЕ молекулы на холсте'
      },
      unlock: {
        title: 'РАЗБЛОКИРОВАТЬ',
        gesture: 'Мизинец',
        howTo: 'Вытяните мизинец держа остальные пальцы согнутыми.',
        func: 'Разблокирует заблокированные молекулы'
      },
      delete: {
        title: 'УДАЛИТЬ МОЛЕКУЛУ',
        gesture: 'Скрещенные пальцы',
        howTo: 'Скрестите указательный и средний пальцы и удерживайте 1 секунду.',
        func: 'Удаляет выбранную молекулу'
      },
      sound: {
        title: 'ЗВУКОВАЯ ДЕФОРМАЦИЯ',
        gesture: 'Голос/Звуковой ввод',
        howTo: 'Издавайте звуки или говорите рядом с микрофоном чтобы создать аудио-реактивные деформации.',
        func: 'Деформирует контуры молекулы на основе звуковой частоты'
      },
      keyboard: {
        title: 'КЛАВИАТУРНЫЕ СОКРАЩЕНИЯ',
        html: '<div class="page-text page-text-keys"><strong>Ctrl+C</strong> → Копировать выбранную молекулу<br><strong>Ctrl+V</strong> → Вставить скопированную молекулу<br><strong>Ctrl+Z</strong> → Отменить последнее действие<br><strong>Ctrl+Shift+Z</strong> → Повторить<br><strong>Delete</strong> → Удалить выбранную молекулу<br><small>На Mac: Cmd вместо Ctrl</small></div>',
        func: 'Быстрые действия с помощью клавиатуры'
      }
    },
    backCover: {
      title: 'Спасибо!',
      subtitle: 'Для дополнительной информации,<br>посетите основное приложение'
    },
    finalPage: {
      title: 'НУ ВОТ И ВСЁ!',
      text: 'Ээээ ну вроде всё. Спасибо тебе дорогой пользователь за интерес к проекту. Надеюсь он поможет тебе сделать что-то красивое или увлечёт тебя.<br>Если тебе стало интересно узнать что ещё я делаю можешь зайти на мой web-сайт <a href="https://cryptonerf.github.io/portfolio/" target="_blank">cryptonerf.github.io/portfolio</a> где я собираю свои работы.<br>Или в мой telegram канал <a href="https://t.me/solnechnoederevo" target="_blank">t.me/solnechnoederevo</a> где я ещё чаще делюсь своей жизнью!'
    }
  }
};

// Функция получения данных страниц на нужном языке
function getManualPages(lang) {
  const t = translations[lang];
  return [
    // Передняя обложка
    {
      type: 'cover',
      title: t.cover.title,
      subtitle: t.cover.subtitle,
      author: t.cover.author,
      image: 'img/manual/cover2.png'
    },
    {
      title: t.welcome.title,
      html: `<div class="page-text">${t.welcome.text}</div>`
    },
    {
      title: t.gestures.create.title,
      gesture: t.gestures.create.gesture,
      howTo: t.gestures.create.howTo,
      func: t.gestures.create.func,
      image: 'img/manual/pinchalt.png'
    },
    {
      title: t.gestures.editMode.title,
      gesture: t.gestures.editMode.gesture,
      howTo: t.gestures.editMode.howTo,
      func: t.gestures.editMode.func,
      image: 'img/manual/mouth.png'
    },
    {
      title: t.gestures.move.title,
      gesture: t.gestures.move.gesture,
      howTo: t.gestures.move.howTo,
      func: t.gestures.move.func,
      image: 'img/manual/open.png'
    },
    {
      title: t.gestures.sizeShape.title,
      gesture: t.gestures.sizeShape.gesture,
      howTo: t.gestures.sizeShape.howTo,
      func: t.gestures.sizeShape.func,
      image: 'img/manual/broke.png'
    },
    {
      title: t.gestures.lock.title,
      gesture: t.gestures.lock.gesture,
      howTo: t.gestures.lock.howTo,
      func: t.gestures.lock.func,
      image: 'img/manual/hz.png'
    },
    {
      title: t.gestures.lockAll.title,
      gesture: t.gestures.lockAll.gesture,
      howTo: t.gestures.lockAll.howTo,
      func: t.gestures.lockAll.func,
      image: 'img/manual/lock2.png'
    },
    {
      title: t.gestures.unlock.title,
      gesture: t.gestures.unlock.gesture,
      howTo: t.gestures.unlock.howTo,
      func: t.gestures.unlock.func,
      image: 'img/manual/unlock.png'
    },
    {
      title: t.gestures.delete.title,
      gesture: t.gestures.delete.gesture,
      howTo: t.gestures.delete.howTo,
      func: t.gestures.delete.func,
      image: 'img/manual/chryst.png'
    },
    {
      title: t.gestures.sound.title,
      gesture: t.gestures.sound.gesture,
      howTo: t.gestures.sound.howTo,
      func: t.gestures.sound.func,
      image: 'img/manual/music.png',
    },
    {
      title: t.gestures.keyboard.title,
      html: t.gestures.keyboard.html,
      func: t.gestures.keyboard.func,
      image: 'img/manual/keyboard2.png'
    },
    // Финальная страница
    {
      title: t.finalPage.title,
      html: `<div class="page-text">${t.finalPage.text}</div>`,
      image: 'img/manual/Emile.png'
    },
    // Задняя обложка
    {
      type: 'cover',
      title: t.backCover.title,
      subtitle: t.backCover.subtitle
    }
  ];
}

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
              <strong>${currentLang === 'ru' ? 'Жест:' : 'Gesture:'}</strong> ${pageData.gesture}<br>
              <strong>${currentLang === 'ru' ? 'Как выполнить:' : 'How to perform:'}</strong> ${pageData.howTo}
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
          <div class="gesture-image">
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

// Вычисление размеров книги по реально доступному месту.
// Раньше окна ноутбуков высотой <= 768px попадали в "мобильную" ветку (по min(ширина, высота)),
// книга получалась мелкой, а текст с фиксированными размерами в пикселях обрезался снизу.
const PAGE_ASPECT = 1.4;          // Высота страницы / ширина
const BUTTONS_RESERVE = 72;       // Место над книгой под кнопки "назад" и "язык"
const SIDE_SPACE_FOR_BUTTONS = 80; // Если по бокам от книги столько места - кнопки не мешают
const EDGE_GAP = 12;

// Вертикальный экран (телефон, планшет в портрете): одна страница вместо разворота
function isPortraitLayout() {
  return window.innerWidth < window.innerHeight * 0.9;
}

function fitBook(vw, vh, pagesAcross, topReserve) {
  const maxHeight = vh - topReserve - EDGE_GAP;
  const maxWidth = (vw * 0.94) / pagesAcross;
  const height = Math.floor(Math.max(200, Math.min(maxHeight, maxWidth * PAGE_ASPECT, 1200)));
  return { width: Math.floor(height / PAGE_ASPECT), height, topReserve };
}

function calculateManualBookDimensions() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pagesAcross = isPortraitLayout() ? 1 : 2;

  // Сначала пробуем занять всю высоту: на широких экранах кнопки стоят в углах сбоку от книги
  const tall = fitBook(vw, vh, pagesAcross, EDGE_GAP);
  const sideSpace = (vw - tall.width * pagesAcross) / 2;
  if (sideSpace >= SIDE_SPACE_FOR_BUTTONS) {
    return tall;
  }
  // Иначе оставляем полосу сверху под кнопки
  return fitBook(vw, vh, pagesAcross, BUTTONS_RESERVE);
}

// Подгоняет размер шрифта страницы, чтобы всё содержимое помещалось без обрезки.
// Все размеры внутри страниц в manual.css заданы в em, поэтому масштабируются вместе со шрифтом.
// Базовый размер растёт с высотой страницы (на больших мониторах текст крупнее).
// Шрифт ставится на .page-inner: inline-стили самого .page перезаписывает StPageFlip.
const MIN_READABLE_FONT = 10;

function fitPagesToSize(pages, width, height) {
  const baseFont = Math.max(MIN_READABLE_FONT, Math.min(24, (height / 680) * 16));

  for (const page of pages) {
    page.style.width = `${width}px`;
    page.style.height = `${height}px`;

    const inner = page.querySelector('.page-inner');
    const content = page.querySelector('.page-content');
    const overflows = () => content.scrollHeight > content.clientHeight + 1;
    const shrinkTo = (minFont) => {
      let fontSize = baseFont;
      inner.style.fontSize = `${fontSize}px`;
      while (fontSize > minFont && overflows()) {
        fontSize -= 0.5;
        inner.style.fontSize = `${fontSize}px`;
      }
    };

    page.classList.remove('page-compact', 'page-scroll');
    shrinkTo(MIN_READABLE_FONT);

    // Очень низкая страница (телефон горизонтально): сначала убираем иллюстрацию,
    // если и это не помогло - разрешаем прокрутку текста внутри страницы
    if (overflows()) {
      page.classList.add('page-compact');
      shrinkTo(MIN_READABLE_FONT);
    }
    if (overflows()) {
      page.classList.add('page-scroll');
    }

    // Размеры дальше задаёт StPageFlip
    page.style.width = '';
    page.style.height = '';
  }
}

// Глобальные переменные для книги
let pageFlip;
let currentPage = 0;
let lastBookSize = null; // Размер страниц последнего рендера (для пропуска лишних перерисовок)

// Функция рендера книги
function renderBook(lang, savedPage = 0) {
  const bookWrapper = document.querySelector('.book-wrapper');
  const manualPages = getManualPages(lang);

  // Устанавливаем класс языка на body и язык документа
  document.body.className = lang === 'ru' ? 'lang-ru' : 'lang-en';
  document.documentElement.lang = lang;

  // Уничтожаем предыдущий экземпляр: иначе его обработчики на window (resize, mousemove,
  // touchmove, mouseup...) оставались жить после каждой смены языка или ресайза.
  // destroy() сам удаляет корневой элемент книги.
  if (pageFlip) {
    pageFlip.destroy();
    pageFlip = null;
  }
  const oldBookElement = document.getElementById('book');
  if (oldBookElement) oldBookElement.remove();

  // Полностью пересоздаём элемент книги (HTML собираем один раз, без innerHTML += в цикле)
  const newBookElement = document.createElement('div');
  newBookElement.id = 'book';
  newBookElement.innerHTML = manualPages
    .map((p, i) => createManualPageHTML(p, i, manualPages.length))
    .join('');
  bookWrapper.appendChild(newBookElement);

  const totalPages = manualPages.length;
  const { width, height, topReserve } = calculateManualBookDimensions();
  lastBookSize = `${width}x${height}`;
  // Книга центрируется в области под полосой кнопок
  bookWrapper.style.paddingTop = `${topReserve}px`;
  bookWrapper.style.paddingBottom = `${EDGE_GAP}px`;

  const pageElements = newBookElement.querySelectorAll('.page');
  fitPagesToSize(pageElements, width, height);

  pageFlip = new St.PageFlip(newBookElement, {
    width,
    height,
    size: 'fixed',
    showCover: true,
    mobileScrollSupport: true,
    swipeDistance: 30,
    clickEventForward: true,
    usePortrait: true, // Если разворот не помещается по ширине - показываем по одной странице
    startPage: savedPage,
    drawShadow: false,
    flippingTime: 800,
    useMouseEvents: true,
    maxShadowOpacity: 0,
    showPageCorners: true,
    disableFlipByClick: false
  });

  pageFlip.loadFromHTML(pageElements);

  currentPage = savedPage;

  function updateUI() {
    // центрирование обложек
    const stfWrapper = newBookElement.querySelector('.stf__wrapper');
    if (!stfWrapper) return;

    const w = width;

    // В постраничном режиме обложка и так по центру
    if (pageFlip.getOrientation() === 'portrait') {
      stfWrapper.style.transform = 'translateX(0)';
    } else if (currentPage === 0) {
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

  setTimeout(updateUI, 100);
}

// Возврат в приложение. Мануал открывается из приложения в новой вкладке - в этом случае
// просто закрываем её, а не открываем второй экземпляр приложения (с повторным запросом камеры).
function goBackToApp() {
  if (window.opener && !window.opener.closed) {
    window.close();
    return;
  }
  window.location.href = 'index.html';
}

// Инициализация manual-книги
document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.addEventListener('click', goBackToApp);
  }

  // Рендерим книгу с текущим языком. Ждём загрузки шрифта: от него зависит подгонка текста
  // (иначе размер подбирался бы по запасному шрифту).
  const fontLoad = document.fonts ? document.fonts.load('16px SysfontC').catch(() => {}) : Promise.resolve();
  const fontTimeout = new Promise(resolve => setTimeout(resolve, 1500)); // Не ждём шрифт бесконечно
  Promise.race([fontLoad, fontTimeout]).then(() => renderBook(currentLang, currentPage));

  // Обновляем текст кнопки языка
  const langText = document.getElementById('langText');
  if (langText) {
    langText.textContent = currentLang === 'en' ? 'RU' : 'EN';
  }

  // Обработчик кнопки смены языка
  const langButton = document.getElementById('langButton');
  if (langButton) {
    langButton.addEventListener('click', () => {
      // Сохраняем текущую страницу
      const savedPage = currentPage;

      // Переключаем язык
      currentLang = currentLang === 'en' ? 'ru' : 'en';

      // Сохраняем в localStorage
      saveLang(currentLang);

      // Обновляем текст кнопки
      langText.textContent = currentLang === 'en' ? 'RU' : 'EN';

      // Перерендериваем книгу с сохранённой страницей
      renderBook(currentLang, savedPage);
    });
  }

  // Управление стрелками клавиатуры
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (pageFlip) pageFlip.flipPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (pageFlip) pageFlip.flipNext();
    } else if (e.key === 'Escape') {
      goBackToApp();
    }
  });

  // Ресайз. Перерисовываем только если размер страниц действительно изменился:
  // на телефонах resize срабатывает при каждом появлении/скрытии адресной строки.
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const { width, height } = calculateManualBookDimensions();
      if (`${width}x${height}` === lastBookSize) return;
      // Сохраняем текущую страницу при ресайзе
      renderBook(currentLang, currentPage);
    }, 300);
  });
});
