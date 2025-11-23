#!/bin/bash

# Скрипт для скачивания MediaPipe файлов локально
# Это устраняет проблемы с CORS и ускоряет загрузку

echo "=== Скачивание MediaPipe Hands файлов ==="

# MediaPipe Hands
curl -L "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands_solution_simd_wasm_bin.wasm" -o "public/mediapipe/hands/hands_solution_simd_wasm_bin.wasm"
curl -L "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands_solution_simd_wasm_bin.js" -o "public/mediapipe/hands/hands_solution_simd_wasm_bin.js"
curl -L "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands_solution_packed_assets_loader.js" -o "public/mediapipe/hands/hands_solution_packed_assets_loader.js"
curl -L "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands_solution_packed_assets.data" -o "public/mediapipe/hands/hands_solution_packed_assets.data"
curl -L "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.binarypb" -o "public/mediapipe/hands/hands.binarypb"
curl -L "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hand_landmark_full.tflite" -o "public/mediapipe/hands/hand_landmark_full.tflite"

echo "✅ MediaPipe Hands файлы скачаны"

echo "=== Скачивание MediaPipe FaceMesh файлов ==="

# MediaPipe FaceMesh
curl -L "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh_solution_simd_wasm_bin.wasm" -o "public/mediapipe/face_mesh/face_mesh_solution_simd_wasm_bin.wasm"
curl -L "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh_solution_simd_wasm_bin.js" -o "public/mediapipe/face_mesh/face_mesh_solution_simd_wasm_bin.js"
curl -L "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh_solution_packed_assets_loader.js" -o "public/mediapipe/face_mesh/face_mesh_solution_packed_assets_loader.js"
curl -L "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh_solution_packed_assets.data" -o "public/mediapipe/face_mesh/face_mesh_solution_packed_assets.data"
curl -L "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.binarypb" -o "public/mediapipe/face_mesh/face_mesh.binarypb"

echo "✅ MediaPipe FaceMesh файлы скачаны"

echo ""
echo "=== Размер скачанных файлов ==="
du -sh public/mediapipe/

echo ""
echo "✅ Готово! Все MediaPipe файлы скачаны в public/mediapipe/"
echo "Теперь можно задеплоить на Vercel"
