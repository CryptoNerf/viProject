# MediaPipe Локальная Установка

## Что это?

Все файлы MediaPipe — JS-обёртки `hands.js` / `face_mesh.js`, WASM и модели — хостятся вместе с сайтом, CDN во время работы не используется:

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

JS-обёртка (`hands.js`, `face_mesh.js`) и WASM/модели работают **только в паре одной версии**, поэтому всё лежит рядом в `public/mediapipe/` и скачивается одним скриптом.

Почему не `@mediapipe/tasks-vision`: см. замеры и решение в [ROADMAP.md](ROADMAP.md), раздел 1.

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
2. В Network вкладке все файлы `mediapipe/...` должны загружаться с вашего домена
3. Детекция рук должна работать через 2-5 секунд (не минуты!)

## Как это загружается

`startHandsEngine()` в `public/index.html`:

1. подключает `mediapipe/hands/hands.js`;
2. скачивает большие файлы (WASM, `.data`, `.tflite`) через `fetch` с подсчётом байтов — отсюда прогресс в карточке;
3. отдаёт их MediaPipe из памяти через `locateFile` (blob URL), чтобы не качать второй раз;
4. после готовности рук так же загружает FaceMesh (режим редактирования ртом).

При ошибке карточка показывает причину и кнопку Retry. Service Worker кеширует `/mediapipe/*`, поэтому повторные открытия загружают модели мгновенно.

Размеры файлов для прогресса записаны в `HANDS_ASSETS` / `FACE_ASSETS` — при обновлении MediaPipe их нужно поправить.
