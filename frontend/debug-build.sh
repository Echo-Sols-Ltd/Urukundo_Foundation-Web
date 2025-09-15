#!/bin/bash
echo "=== Debug: Current directory ==="
pwd
echo "=== Debug: Directory contents ==="
ls -la
echo "=== Debug: src directory ==="
ls -la src/
echo "=== Debug: src/app directory ==="
ls -la src/app/
echo "=== Debug: Looking for layout files ==="
find . -name "layout.tsx" -o -name "layout.js"
echo "=== Debug: Looking for page files ==="
find . -name "page.tsx" -o -name "page.js" | head -5
echo "=== Starting Next.js build ==="