# MediaPipe Локальная Установка

## Что это?

MediaPipe файлы теперь хостятся локально на Vercel для:
- ✅ **Быстрой загрузки** - нет задержек от CDN
- ✅ **Надёжности** - работает даже если CDN недоступен
- ✅ **Совместимости** - работает во всех браузерах без QUIC ошибок
- ✅ **Нет CORS проблем** - файлы загружаются с того же домена

## Структура файлов

```
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

## Как обновить файлы MediaPipe

Если Google выпустит новую версию MediaPipe, запустите:

```bash
bash download-mediapipe.sh
```

Это скачает последние версии файлов с CDN.

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

1. Должны увидеть: `📦 MediaPipe запрашивает: hands_solution_simd_wasm_bin.wasm`
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

Теперь MediaPipe загружает файлы локально с относительными путями. Работает одинаково на Live Server и Vercel!
