import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARTICLES_FILE = os.path.join(BASE_DIR, "..", "src", "data", "articles.json")
PUBLIC_IMG_DIR = os.path.join(BASE_DIR, "..", "public", "images", "news")

def cleanup():
    if not os.path.exists(ARTICLES_FILE) or not os.path.exists(PUBLIC_IMG_DIR):
        print("Required directories not found.")
        return

    with open(ARTICLES_FILE, 'r', encoding='utf-8') as f:
        articles = json.load(f)

    # Collect all image filenames that are legitimately used by our website articles
    active_filenames = set()
    for a in articles:
        img = a.get('imageUrl', '')
        if img.startswith('/images/news/'):
            fname = os.path.basename(img)
            active_filenames.add(fname)

    print(f"Active image filenames referenced by our website articles: {len(active_filenames)}")

    deleted_count = 0
    kept_count = 0

    for item in os.listdir(PUBLIC_IMG_DIR):
        file_path = os.path.join(PUBLIC_IMG_DIR, item)
        if not os.path.isfile(file_path):
            continue

        if item not in active_filenames:
            try:
                os.remove(file_path)
                deleted_count += 1
            except Exception as e:
                print(f"Error removing {item}: {e}")
        else:
            kept_count += 1

    print(f"[+] Cleanup completed:")
    print(f"    - Kept {kept_count} active website images")
    print(f"    - Removed {deleted_count} unwanted image files")

if __name__ == '__main__':
    cleanup()
