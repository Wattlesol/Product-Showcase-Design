import os
import subprocess
import re

source_dir = "/Users/xain/Downloads/Product-Showcase-Design/newProductImages"
target_dir = "/Users/xain/Downloads/Product-Showcase-Design/attached_assets/products"

def convert():
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

    for filename in os.listdir(source_dir):
        if filename.endswith(".png"):
            # Naming convention: "8075 BLK-C.png" -> "8075_BLK_C.webp"
            # Replace spaces and hyphens with underscores
            new_filename = filename.replace(" ", "_").replace("-", "_")
            new_filename = os.path.splitext(new_filename)[0] + ".webp"
            
            source_path = os.path.join(source_dir, filename)
            target_path = os.path.join(target_dir, new_filename)
            
            print(f"Converting {filename} to {new_filename} (Lossless)...")
            
            # Using -lossless flag for maximum quality
            try:
                subprocess.run(["cwebp", "-lossless", source_path, "-o", target_path], check=True)
            except Exception as e:
                print(f"Failed to convert {filename}: {e}")

if __name__ == "__main__":
    convert()
