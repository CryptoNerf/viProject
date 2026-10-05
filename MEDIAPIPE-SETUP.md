# MediaPipe: распознавание рук и лица

Все файлы MediaPipe лежат вместе с сайтом в `public/mediapipe/`, CDN во время работы не используется.

## Два движка

| | Основной | Запасной |
| --- | --- | --- |
| Библиотека | `@mediapipe/tasks-vision` 1.0.1 | `@mediapipe/hands` 0.4.1675469240, `@mediapipe/face_mesh` 0.4.1633559619 |
| Где работает | Web Worker (`public/js/vision-worker.js`) | основной поток страницы |
| Файлы | `public/mediapipe/tasks/` (~24 МБ) | `public/mediapipe/hands/`, `face_mesh/` (~26 МБ) |
| Когда используется | всегда, если браузер поддерживает Worker, OffscreenCanvas и createImageBitmap | если их нет или воркер не запустился |

Пользователь скачивает только один из движков.

### Почему основной движок работает в воркере

В основном потоке нейросеть блокирует отрисовку страницы. На iPad распознавание кадра занимает ~50–150 мс, и всё это время холст не обновлялся: экран и курсор руки двигались с частотой 5–10 кадров в секунду. В воркере основной поток свободен:

| Замедление CPU (имитация планшета) | Воркер: кадров/с экрана | Основной поток: кадров/с экрана |
| --- | --- | --- |
| нет | 60 | 55 |
| ×4 | 60 | 8,7 |
| ×6 | 60 | 5,7 |

Старый `@mediapipe/hands` в воркере работать не может (он завязан на DOM страницы), поэтому основной движок — Tasks Vision. Точки руки у обоих движков почти совпадают (для раскрытой руки расхождение ~0,005 при порогах жестов 0,035–0,17), логика жестов общая.

Для проверки запасного движка откройте страницу с `?engine=legacy`.

## Структура файлов

```text
public/
├── js/vision-worker.js                     # Воркер распознавания (Tasks Vision)
└── mediapipe/
    ├── tasks/                              # Основной движок
    │   ├── vision_bundle_cjs.js            # = vision_bundle.cjs из npm (.js - чтобы importScripts принял MIME-тип)
    │   ├── wasm/vision_wasm_internal.js
    │   ├── wasm/vision_wasm_internal.wasm  (11.8 MB)
    │   └── models/
    │       ├── hand_landmarker.task        (7.8 MB)
    │       └── face_landmarker.task        (3.8 MB)
    ├── hands/                              # Запасной движок: руки
    │   ├── hands.js
    │   ├── hands_solution_simd_wasm_bin.wasm (6 MB)
    │   ├── hands_solution_simd_wasm_bin.js
    │   ├── hands_solution_packed_assets_loader.js
    │   ├── hands_solution_packed_assets.data (4.3 MB)
    │   ├── hands.binarypb
    │   └── hand_landmark_full.tflite (5.5 MB)
    └── face_mesh/                          # Запасной движок: лицо
        ├── face_mesh.js
        ├── face_mesh_solution_simd_wasm_bin.wasm (6 MB)
        ├── face_mesh_solution_simd_wasm_bin.js
        ├── face_mesh_solution_packed_assets_loader.js
        ├── face_mesh_solution_packed_assets.data (4 MB)
        └── face_mesh.binarypb
```

## Как это загружается

**Основной движок** (`startWorkerEngine()` в `public/index.html`):

1. страница создаёт воркер `js/vision-worker.js`;
2. воркер скачивает WASM и модель руки через `fetch` с подсчётом байтов и шлёт прогресс — его показывает карточка загрузки;
3. создаёт `HandLandmarker` сначала на видеокарте (`GPU`), при ошибке — на процессоре (`CPU`), всё равно в отдельном потоке;
4. после готовности рук так же загружает `FaceLandmarker` (режим редактирования ртом);
5. страница отправляет в воркер кадры камеры (`createImageBitmap`, без копирования) и получает точки рук и лица.

**Запасной движок** (`startHandsEngine()`): подключает `hands.js`, скачивает большие файлы с прогрессом и отдаёт их MediaPipe из памяти (blob URL).

При ошибке карточка показывает причину и кнопку Retry. Service Worker кеширует `/mediapipe/*`, поэтому повторные открытия загружают модели мгновенно.

## Как обновить файлы MediaPipe

1. Поменяйте версии в `download-mediapipe.sh`.
2. Запустите:

   ```bash
   bash download-mediapipe.sh
   ```

3. Поправьте размеры файлов в `TASKS_SIZES`, `HANDS_ASSETS` и `FACE_ASSETS` в `public/index.html` (по ним считается прогресс загрузки).
4. Увеличьте `CACHE_NAME` в `public/service-worker.js` — файлы MediaPipe отдаются из кеша без проверки сети, иначе у пользователей останутся старые версии.

## Диагностика

Откройте приложение с `?debug` в адресе — внизу появится строка с реальной частотой отрисовки экрана, частотой и временем распознавания, типом движка (`worker-GPU`, `worker-CPU` или `main-thread`) и разрешением камеры.

В консоли браузера при успешном запуске видно:

- `✅ Распознавание рук в отдельном потоке (GPU)`
- `✅ Распознавание лица в отдельном потоке (GPU)`
