#!/bin/bash
cd /Users/xain/Downloads/Product-Showcase-Design/attached_assets/products

# Require cwebp, install via Homebrew if not present on Mac.
if ! command -v cwebp &> /dev/null
then
    echo "cwebp could not be found, attempting to install webp..."
    brew install webp
fi

for img in *.png; do
  [ -f "$img" ] || continue
  filename="${img%.*}"
  echo "Converting $img to $filename.webp"
  # Quality 80 is generally a good balance for web
  cwebp -q 80 "$img" -o "$filename.webp"
  
  if [ $? -eq 0 ]; then
     # Successfully converted, remote the original PNG to save space
     echo "Removing original $img"
     rm "$img"
  else
     echo "Failed to convert $img"
  fi
done

echo "Conversion complete!"
