#!/usr/bin/env bash
# Run this script from your LOCAL machine (not inside the remote Claude Code environment)
# to download the externally-hosted images and place them in the /images/ directory.
#
# Usage:
#   cd /path/to/NailsbyThuy
#   bash download-images.sh
#
# After running, commit and push the new image files:
#   git add images/hero-nails-900.jpg images/portrait-thuy-400.jpg \
#           images/portrait-thuy-900.jpg images/og-cover.jpg images/bg-texture.jpg
#   git commit -m "add self-hosted images"
#   git push

set -euo pipefail

IMAGES_DIR="$(dirname "$0")/images"
mkdir -p "$IMAGES_DIR"

echo "Downloading hero-nails-900.jpg ..."
curl -fL "https://lh3.googleusercontent.com/pw/AP1GczOTQECPB1Ukk2WCwgnJxDG5BtYxE5ejQq6zboz7pmz8jD6W0bFfC7xrwxU8JPtncM5HfBhe4nAyyPnFGMZz0--qBXwBRX0syr9Ma13UkOu0KHBHLUQ=w1200-k-no" \
  -o "$IMAGES_DIR/hero-nails-900.jpg"

echo "Downloading portrait-thuy-400.jpg ..."
curl -fL "https://lh3.googleusercontent.com/pw/AP1GczOA262XONbzlPzY_tbc-eY1P9df82PbQpssLnRn9WtaOqKLlvOSrSHACtW-YhAsmEq1J0xC1lufWEUSI5hR2ZW39sj0_EU-NU-jTMCLDbGp8jWpszk=w400-k-no" \
  -o "$IMAGES_DIR/portrait-thuy-400.jpg"

echo "Downloading portrait-thuy-900.jpg ..."
curl -fL "https://lh3.googleusercontent.com/pw/AP1GczOA262XONbzlPzY_tbc-eY1P9df82PbQpssLnRn9WtaOqKLlvOSrSHACtW-YhAsmEq1J0xC1lufWEUSI5hR2ZW39sj0_EU-NU-jTMCLDbGp8jWpszk=w1200-k-no" \
  -o "$IMAGES_DIR/portrait-thuy-900.jpg"

echo "Downloading og-cover.jpg ..."
curl -fL "https://lh3.googleusercontent.com/pw/AP1GczPfcqZPkK1gtAXEW8yTjO1khvKyFF7wX9MoV_LyOVpHNtWcbAxPMph65mBDIJKZj8OWprNz2UjU6UDvPirdZ0Eh4S4baOyHASHdDckZf8Mqyq1uiKk=w1400-k-no" \
  -o "$IMAGES_DIR/og-cover.jpg"

echo "Downloading bg-texture.jpg (Unsplash) ..."
curl -fL "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=60" \
  -o "$IMAGES_DIR/bg-texture.jpg"

echo ""
echo "Done. Files written to: $IMAGES_DIR"
ls -lh "$IMAGES_DIR/hero-nails-900.jpg" "$IMAGES_DIR/portrait-thuy-400.jpg" \
        "$IMAGES_DIR/portrait-thuy-900.jpg" "$IMAGES_DIR/og-cover.jpg" "$IMAGES_DIR/bg-texture.jpg"
