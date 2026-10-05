// vision-worker.js
// Распознавание рук и лица (MediaPipe Tasks Vision) в отдельном потоке.
//
// Зачем: в основном потоке нейросеть блокирует отрисовку страницы. На iPad распознавание кадра
// занимает ~50-150 мс, и всё это время холст не обновляется - экран "дёргается" с частотой 5-10 кадров/с.
// В воркере основной поток свободен и рисует 60 кадров/с, а результаты распознавания приходят
// сообщениями по мере готовности.
//
// Протокол сообщений:
//   main -> worker: { type: 'init-hands', urls }, { type: 'init-face', urls },
//                   { type: 'frame', bitmap, timestamp, face }
//   worker -> main: { type: 'progress', loaded, total }, { type: 'hands-ready', delegate },
//                   { type: 'face-ready', delegate }, { type: 'result', hands, face, handsMs, faceMs },
//                   { type: 'error', stage, message }
'use strict';

// Библиотека пишет служебные сообщения ("INFO: Created TensorFlow Lite XNNPACK delegate...",
// предупреждения GL) через console.error - в консоли они выглядели как ошибки
const originalConsoleError = console.error.bind(console);
console.error = (...args) => {
    if (typeof args[0] === 'string' && /^(INFO:|W\d{4} )/.test(args[0])) {
        console.info(...args);
        return;
    }
    originalConsoleError(...args);
};

let vision = null;          // Экспорт vision_bundle_cjs.js
let handLandmarker = null;
let faceLandmarker = null;
let wasmFileset = null;

// vision_bundle_cjs.js - CommonJS-сборка (vision_bundle.cjs из npm, переименована в .js: importScripts
// принимает только JavaScript MIME-тип, а .cjs серверы отдают как octet-stream).
// В классическом воркере даём ей временные module/exports, а затем убираем их:
// иначе загрузчик WASM (тоже проверяет module/exports) перезапишет экспорт.
function loadVisionBundle(bundleUrl) {
    if (vision) return;
    self.exports = {};
    self.module = { exports: self.exports };
    importScripts(bundleUrl);
    vision = self.module.exports;
    delete self.module;
    delete self.exports;
}

// Скачивание с подсчётом байтов (для прогресса в интерфейсе)
async function fetchBuffer(url, onBytes) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`${url.split('/').pop()}: HTTP ${response.status}`);
    }
    if (!response.body || !response.body.getReader) {
        const buffer = await response.arrayBuffer();
        onBytes(buffer.byteLength);
        return new Uint8Array(buffer);
    }
    const reader = response.body.getReader();
    const chunks = [];
    let size = 0;
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        size += value.length;
        onBytes(value.length);
    }
    const result = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
    }
    return result;
}

// Создание задачи: сначала на видеокарте, при ошибке - на процессоре (всё равно в отдельном потоке).
// Холст передаём явно: иначе библиотека по User-Agent решает, что OffscreenCanvas не поддерживается
// (Chrome на iPad выглядит как старый Safari), и пытается создать холст через document, которого в воркере нет.
async function createTask(TaskClass, modelBuffer, options) {
    const attempts = ['GPU', 'CPU'];
    let lastError = null;
    for (const delegate of attempts) {
        try {
            const task = await TaskClass.createFromOptions(wasmFileset, {
                ...options,
                baseOptions: { modelAssetBuffer: modelBuffer, delegate },
                canvas: new OffscreenCanvas(1, 1),
                runningMode: 'VIDEO'
            });
            return { task, delegate };
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError;
}

async function initHands(urls) {
    loadVisionBundle(urls.bundle);

    const total = urls.wasmSize + urls.handModelSize;
    let loaded = 0;
    const onBytes = (n) => {
        loaded += n;
        self.postMessage({ type: 'progress', loaded, total: Math.max(total, loaded) });
    };

    const [wasmBinary, handModel] = await Promise.all([
        fetchBuffer(urls.wasmBinary, onBytes),
        fetchBuffer(urls.handModel, onBytes)
    ]);

    wasmFileset = {
        wasmLoaderPath: urls.wasmLoader,
        wasmBinaryPath: URL.createObjectURL(new Blob([wasmBinary], { type: 'application/wasm' }))
    };

    const { task, delegate } = await createTask(vision.HandLandmarker, handModel, {
        numHands: 2,
        minHandDetectionConfidence: 0.8,   // Как minDetectionConfidence в прежнем @mediapipe/hands
        minHandPresenceConfidence: 0.75,   // Как minTrackingConfidence в прежнем @mediapipe/hands
        minTrackingConfidence: 0.5
    });
    handLandmarker = task;
    self.postMessage({ type: 'hands-ready', delegate });
}

async function initFace(urls) {
    const faceModel = await fetchBuffer(urls.faceModel, () => {});
    const { task, delegate } = await createTask(vision.FaceLandmarker, faceModel, {
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    faceLandmarker = task;
    self.postMessage({ type: 'face-ready', delegate });
}

// Только координаты: у Tasks Vision поле visibility для рук не заполняется (0),
// а прежняя логика по нему отбрасывала "невидимые" руки
function plainLandmarks(landmarks) {
    return landmarks.map(p => ({ x: p.x, y: p.y, z: p.z }));
}

function detect(message) {
    const { bitmap, timestamp } = message;
    try {
        let hands = [];
        let face = null;
        let handsMs = 0;
        let faceMs = 0;

        if (handLandmarker) {
            const start = performance.now();
            const result = handLandmarker.detectForVideo(bitmap, timestamp);
            handsMs = performance.now() - start;
            hands = result.landmarks.map((landmarks, i) => ({
                landmarks: plainLandmarks(landmarks),
                label: result.handedness[i] && result.handedness[i][0] ? result.handedness[i][0].categoryName : null
            }));
        }

        if (message.face && faceLandmarker) {
            const start = performance.now();
            const result = faceLandmarker.detectForVideo(bitmap, timestamp);
            faceMs = performance.now() - start;
            face = result.faceLandmarks.length > 0 ? plainLandmarks(result.faceLandmarks[0]) : [];
        }

        self.postMessage({ type: 'result', hands, face, handsMs, faceMs });
    } finally {
        bitmap.close();
    }
}

self.onmessage = async (event) => {
    const message = event.data;
    try {
        if (message.type === 'init-hands') {
            await initHands(message.urls);
        } else if (message.type === 'init-face') {
            await initFace(message.urls);
        } else if (message.type === 'frame') {
            detect(message);
        }
    } catch (error) {
        if (message.type === 'frame' && message.bitmap && message.bitmap.close) {
            try { message.bitmap.close(); } catch { /* уже закрыт */ }
        }
        self.postMessage({ type: 'error', stage: message.type, message: String((error && error.message) || error) });
    }
};
