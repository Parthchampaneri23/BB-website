import json
import os
import requests
import hashlib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARTICLES_FILE = os.path.join(BASE_DIR, "..", "src", "data", "articles.json")
PUBLIC_IMG_DIR = os.path.join(BASE_DIR, "..", "public", "images", "news")

os.makedirs(PUBLIC_IMG_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

def main():
    if not os.path.exists(ARTICLES_FILE):
        print("articles.json not found!")
        return

    with open(ARTICLES_FILE, 'r', encoding='utf-8') as f:
        articles = json.load(f)

    # Filter to only the articles displayed on our website across categories:
    # 1. Lead & Trending on Homepage (~15 articles)
    # 2. Key category highlights: markets, smart-investor, economy, technology, cricket, companies, opinion
    chosen_articles = []
    seen_ids = set()

    # Pick top 6 for each category used on the website
    categories = ['home', 'markets', 'smart-investor', 'economy', 'technology', 'cricket', 'companies', 'opinion', 'latest']
    for cat in categories:
        cat_items = [a for a in articles if a.get('category') == cat][:6]
        for item in cat_items:
            if item['id'] not in seen_ids:
                seen_ids.add(item['id'])
                chosen_articles.append(item)

    print(f"Selected {len(chosen_articles)} website articles for image caching...")

    for idx, art in enumerate(chosen_articles):
        img_url = art.get('originalImageUrl') or art.get('imageUrl')
        if not img_url or img_url.startswith('/images/news/'):
            continue

        clean_url = img_url.split('?')[0]
        ext = os.path.splitext(clean_url)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
            ext = '.jpg'

        url_hash = hashlib.md5(img_url.encode('utf-8')).hexdigest()[:10]
        filename = f"{art.get('category', 'news')}_{url_hash}{ext}"
        local_path = os.path.join(PUBLIC_IMG_DIR, filename)

        # Download if not present
        if not (os.path.exists(local_path) and os.path.getsize(local_path) > 1000):
            try:
                res = requests.get(img_url, headers=HEADERS, timeout=8)
                if res.status_code == 200 and len(res.content) > 500:
                    with open(local_path, 'wb') as img_f:
                        img_f.write(res.content)
                    print(f"[{idx+1}/{len(chosen_articles)}] Downloaded: {filename}")
            except Exception as e:
                print(f"Error downloading {img_url}: {e}")

        if os.path.exists(local_path):
            art['imageUrl'] = f"/images/news/{filename}"

    # Also update in the full articles dataset
    id_to_local_img = {a['id']: a['imageUrl'] for a in chosen_articles if a.get('imageUrl', '').startswith('/images/news/')}
    for a in articles:
        if a['id'] in id_to_local_img:
            a['imageUrl'] = id_to_local_img[a['id']]

    with open(ARTICLES_FILE, 'w', encoding='utf-8') as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

    print(f"[+] Successfully saved local image references into articles.json!")

if __name__ == '__main__':
    main()
