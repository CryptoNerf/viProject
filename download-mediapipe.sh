#!/bin/bash

# Скрипт для скачивания MediaPipe файлов локально
# Это устраняет проблемы с CORS и ускоряет загрузку
#
# Два движка:
#  - основной: @mediapipe/tasks-vision (распознавание в Web Worker, public/js/vision-worker.js) -> public/mediapipe/tasks/
#  - запасной: @mediapipe/hands + @mediapipe/face_mesh в основном потоке (старые браузеры) -> hands/, face_mesh/
# JS-обёртки и WASM/модели одной версии работают только вместе. Приложение берёт всё с нашего
# сервера, CDN во время работы не используется.
# После обновления: проверьте размеры файлов в TASKS_SIZES, HANDS_ASSETS и FACE_ASSETS в
# public/index.html (по ним считается прогресс загрузки) и увеличьте CACHE_NAME в public/service-worker.js.

set -euo pipefail

TASKS_VISION_VERSION="1.0.1"
HANDS_VERSION="0.4.1675469240"
FACE_MESH_VERSION="0.4.1633559619"

# Работаем относительно корня репозитория, откуда бы ни запустили скрипт
cd "$(dirname "$0")"

TASKS_DIR="public/mediapipe/tasks"
HANDS_DIR="public/mediapipe/hands"
FACE_MESH_DIR="public/mediapipe/face_mesh"
mkdir -p "$TASKS_DIR/wasm" "$TASKS_DIR/models" "$HANDS_DIR" "$FACE_MESH_DIR"

# -f: ошибка при HTTP 4xx/5xx (иначе curl молча сохранит страницу ошибки вместо файла)
download() {
  curl -fL --retry 3 "$1" -o "$2"
}

echo "=== Скачивание MediaPipe Tasks Vision ${TASKS_VISION_VERSION} (основной движок) ==="

TASKS_URL="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}"
# CommonJS-сборка сохраняется как .js: importScripts в воркере принимает только JavaScript MIME-тип
download "${TASKS_URL}/vision_bundle.cjs" "${TASKS_DIR}/vision_bundle_cjs.js"
download "${TASKS_URL}/wasm/vision_wasm_internal.js" "${TASKS_DIR}/wasm/vision_wasm_internal.js"
download "${TASKS_URL}/wasm/vision_wasm_internal.wasm" "${TASKS_DIR}/wasm/vision_wasm_internal.wasm"

MODELS_URL="https://storage.googleapis.com/mediapipe-models"
download "${MODELS_URL}/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task" "${TASKS_DIR}/models/hand_landmarker.task"
download "${MODELS_URL}/face_landmarker/face_landmarker/float16/1/face_landmarker.task" "${TASKS_DIR}/models/face_landmarker.task"

echo "✅ MediaPipe Tasks Vision файлы скачаны"

echo "=== Скачивание MediaPipe Hands ${HANDS_VERSION} (запасной движок) ==="

HANDS_URL="https://cdn.jsdelivr.net/npm/@mediapipe/hands@${HANDS_VERSION}"
for file in \
  hands.js \
  hands_solution_simd_wasm_bin.wasm \
  hands_solution_simd_wasm_bin.js \
  hands_solution_packed_assets_loader.js \
  hands_solution_packed_assets.data \
  hands.binarypb \
  hand_landmark_full.tflite; do
  download "${HANDS_URL}/${file}" "${HANDS_DIR}/${file}"
done

echo "✅ MediaPipe Hands файлы скачаны"

echo "=== Скачивание MediaPipe FaceMesh ${FACE_MESH_VERSION} (запасной движок) ==="

FACE_MESH_URL="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${FACE_MESH_VERSION}"
for file in \
  face_mesh.js \
  face_mesh_solution_simd_wasm_bin.wasm \
  face_mesh_solution_simd_wasm_bin.js \
  face_mesh_solution_packed_assets_loader.js \
  face_mesh_solution_packed_assets.data \
  face_mesh.binarypb; do
  download "${FACE_MESH_URL}/${file}" "${FACE_MESH_DIR}/${file}"
done

echo "✅ MediaPipe FaceMesh файлы скачаны"

echo ""
echo "=== Размер скачанных файлов ==="
du -sh public/mediapipe/

echo ""
echo "✅ Готово! Все MediaPipe файлы скачаны в public/mediapipe/"
echo "Теперь можно задеплоить на Vercel"
