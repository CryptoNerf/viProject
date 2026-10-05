#!/bin/bash

# Скрипт для скачивания MediaPipe файлов локально
# Это устраняет проблемы с CORS и ускоряет загрузку
#
# Скачиваются и JS-обёртки (hands.js, face_mesh.js), и WASM/модели одной версии - они работают
# только вместе. Приложение берёт всё с нашего сервера, CDN во время работы не используется.
# После обновления: проверьте размеры файлов в HANDS_ASSETS / FACE_ASSETS в public/index.html
# (по ним считается прогресс загрузки) и увеличьте CACHE_NAME в public/service-worker.js.

set -euo pipefail

HANDS_VERSION="0.4.1675469240"
FACE_MESH_VERSION="0.4.1633559619"

# Работаем относительно корня репозитория, откуда бы ни запустили скрипт
cd "$(dirname "$0")"

HANDS_DIR="public/mediapipe/hands"
FACE_MESH_DIR="public/mediapipe/face_mesh"
mkdir -p "$HANDS_DIR" "$FACE_MESH_DIR"

# -f: ошибка при HTTP 4xx/5xx (иначе curl молча сохранит страницу ошибки вместо файла)
download() {
  curl -fL --retry 3 "$1" -o "$2"
}

echo "=== Скачивание MediaPipe Hands ${HANDS_VERSION} ==="

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

echo "=== Скачивание MediaPipe FaceMesh ${FACE_MESH_VERSION} ==="

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
