# MediaPipe Локальная Установка

## Что это?

WASM-файлы и модели MediaPipe хостятся локально на Vercel (JS-обёртки `hands.js` и `face_mesh.js` подключаются с CDN с фиксированной версией) для:

- ✅ **Быстрой загрузки** - нет задержек от CDN
- ✅ **Надёжности** - работает даже если CDN недоступен
- ✅ **Совместимости** - работает во всех браузерах без QUIC ошибок
- ✅ **Нет CORS проблем** - файлы загружаются с того же домена

## Структура файлов

```text
public/                           # Vercel использует эту папку как корень сайта
├── index.html                    # Главная страница
└── mediapipe/                    # MediaPipe файлы
    ├── hands/
    │   ├── hands_solution_simd_wasm_bin.wasm (6 MB)
    │   ├── hands_solution_simd_wasm_bin.js
    │   ├── hands_solution_packed_assets_loader.js
    │   ├── hands_solution_packed_assets.data (4.3 MB)
    │   ├── hands.binarypb
    │   └── hand_landmark_full.tflite (5.5 MB)
    └── face_mesh/
        ├── face_mesh_solution_simd_wasm_bin.wasm (6 MB)
        ├── face_mesh_solution_simd_wasm_bin.js
        ├── face_mesh_solution_packed_assets_loader.js
        ├── face_mesh_solution_packed_assets.data (4 MB)
        └── face_mesh.binarypb
```

**Общий размер:** ~26 MB

## Версии

| Пакет | Версия |
| ----- | ------ |
| `@mediapipe/hands` | `0.4.1675469240` |
| `@mediapipe/face_mesh` | `0.4.1633559619` |

JS-обёртка (`hands.js`, `face_mesh.js` в `public/index.html`) и локальные WASM/модели работают **только в паре одной версии**. Раньше скрипты в `index.html` подключались без версии (всегда «последняя»), и любой новый релиз на CDN мог сломать распознавание.

## Как обновить файлы MediaPipe

1. Поменяйте версии в `download-mediapipe.sh` (`HANDS_VERSION`, `FACE_MESH_VERSION`) и в URL скриптов в `public/index.html`.
2. Запустите:

   ```bash
   bash download-mediapipe.sh
   ```

3. Увеличьте `CACHE_NAME` в `public/service-worker.js` — файлы MediaPipe отдаются из кеша без проверки сети, иначе у пользователей останутся старые версии.

## Деплой на Vercel

1. Убедитесь что папка `public/` закоммичена в git:

   ```bash
   git add public/
   git commit -m "Add local MediaPipe files for faster loading"
   git push
   ```

2. Vercel автоматически задеплоит файлы из `public/` папки

3. Файлы будут доступны по пути:
   - `https://your-domain.vercel.app/mediapipe/hands/hands_solution_simd_wasm_bin.wasm`
   - `https://your-domain.vercel.app/mediapipe/face_mesh/face_mesh_solution_simd_wasm_bin.wasm`

## Проверка работы

После деплоя откройте консоль браузера (F12) и проверьте:

1. Должны увидеть: `🎉 onResults вызван первый раз! MediaPipe работает!` и список загруженных файлов
2. В Network вкладке файлы должны загружаться с вашего домена (не cdn.jsdelivr.net)
3. Детекция рук должна работать через 2-5 секунд (не минуты!)

## Что изменилось в коде

В `public/index.html` изменены пути `locateFile`:

```javascript
// БЫЛО:
return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;

// СТАЛО:
return `./mediapipe/hands/${file}`;
```

Теперь MediaPipe загружает файлы локально с относительными путями. Работает одинаково на локальном сервере и Vercel!

Если скрипт `hands.js` не загрузился (нет сети, блокировщик), приложение продолжает работать с мышью и касаниями, а в строке статуса появляется сообщение о недоступном распознавании рук.
