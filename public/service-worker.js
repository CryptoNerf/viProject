// Версия кеша. Увеличивайте при изменении стратегии кеширования
// или при обновлении файлов MediaPipe (они берутся из кеша без проверки сети).
const CACHE_NAME = 'vi-project-v3';

// Минимальный набор для запуска оболочки приложения без сети
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/molecules_icon.png'
];

// Большие и редко меняющиеся файлы: сначала кеш (модели MediaPipe ~25 МБ, картинки, шрифты, иконки).
// Всё остальное (HTML, JS, CSS) - сначала сеть, чтобы обновления сайта сразу доходили до пользователей.
// Раньше index.html тоже отдавался из кеша, и пользователи навсегда оставались на старой версии.
const CACHE_FIRST_PATHS = ['/mediapipe/', '/icons/', '/img/', '/fonts/'];

// Установка service worker и кэширование оболочки
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()) // Новая версия активируется без ожидания закрытия вкладок
  );
});

// Активация service worker и удаление старых кэшей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

function putInCache(request, response) {
  // Кешируем только успешные ответы своего сайта
  if (response.ok && response.type === 'basic') {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
  }
  return response;
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  return putInCache(request, await fetch(request));
}

async function networkFirst(request) {
  try {
    return putInCache(request, await fetch(request));
  } catch (error) {
    // Нет сети - отдаём последнюю сохранённую версию
    const cached = await caches.match(request, { ignoreSearch: request.mode === 'navigate' });
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;

  // Кеш работает только с GET; запросы с Range (перемотка видео) пропускаем как есть
  if (request.method !== 'GET' || request.headers.has('range')) return;

  const url = new URL(request.url);

  // Сторонние ресурсы (CDN MediaPipe, page-flip) браузер кеширует сам
  if (url.origin !== self.location.origin) return;

  if (CACHE_FIRST_PATHS.some(path => url.pathname.startsWith(path))) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});
