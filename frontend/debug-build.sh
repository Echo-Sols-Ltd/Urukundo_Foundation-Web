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
echo "=== Debug: Next.js config ==="
cat next.config.ts
echo "=== Debug: Cleaning build files (except cache) ==="
rm -rf .next/static .next/server .next/types .next/standalone .next/trace .next/build-manifest.json .next/export-marker.json .next/next-env.d.ts .next/package.json .next/required-server-files.json 2>/dev/null || true
echo "=== Starting Next.js build ==="