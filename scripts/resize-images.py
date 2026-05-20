#!/usr/bin/env python3
"""
Resize a source image into the two WebP sizes used in /images/:
  images/{slug}-400.webp  (mobile)
  images/{slug}-900.webp  (desktop)

Requires Pillow: pip install Pillow

Usage:
  python3 scripts/resize-images.py <source-image> <slug>

Examples:
  python3 scripts/resize-images.py ~/Downloads/my-chrome-nails.jpg chrome-nails-austin-03
  python3 scripts/resize-images.py ~/Desktop/new-set.png seasonal-nail-art-austin-03
"""

import sys
import os

def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    source = sys.argv[1]
    slug = sys.argv[2]

    if not os.path.exists(source):
        print(f'Error: source file not found: {source}')
        sys.exit(1)

    try:
        from PIL import Image
    except ImportError:
        print('Pillow not installed. Run: pip install Pillow')
        sys.exit(1)

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    images_dir = os.path.join(repo_root, 'images')
    os.makedirs(images_dir, exist_ok=True)

    img = Image.open(source).convert('RGB')
    orig_w, orig_h = img.size
    print(f'Source: {source} ({orig_w}×{orig_h})')

    for width in (400, 900):
        ratio = width / orig_w
        height = int(orig_h * ratio)
        resized = img.resize((width, height), Image.LANCZOS)
        out_path = os.path.join(images_dir, f'{slug}-{width}.webp')
        resized.save(out_path, 'WEBP', quality=82, method=6)
        size_kb = os.path.getsize(out_path) // 1024
        print(f'  Saved: {out_path} ({width}×{height}, {size_kb} KB)')

    print(f'\nDone. Add to gallery in index.html and blog articles as needed.')
    print(f'Remember to also add the ImageObject JSON-LD entries in index.html.')

if __name__ == '__main__':
    main()
