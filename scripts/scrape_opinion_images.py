import requests
import json
import os
import hashlib
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARTICLES_FILE = os.path.join(BASE_DIR, "..", "src", "data", "articles.json")
PUBLIC_IMG_DIR = os.path.join(BASE_DIR, "..", "public", "images", "news")

os.makedirs(PUBLIC_IMG_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

FALLBACK_EDITORIAL_IMG = "https://bsmedia.business-standard.com/_media/bs/img/hp/opinion/2026-10/16/9419/full/1792082393-6821.jpg"

def fetch_and_save_image(article):
    live_url = article.get('url')
    img_url = None

    if live_url:
        try:
            r = requests.get(live_url, headers=HEADERS, timeout=8)
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, 'html.parser')
                og = soup.find('meta', property='og:image')
                tw = soup.find('meta', attrs={'name': 'twitter:image'})
                
                content = (og.get('content') if og else None) or (tw.get('content') if tw else None)
                if content and 'Business_Standard_1' not in content:
                    img_url = content
        except Exception as e:
            print(f"Failed extracting image for {article.get('title')}: {e}")

    if not img_url:
        img_url = FALLBACK_EDITORIAL_IMG

    clean_url = img_url.split('?')[0]
    ext = os.path.splitext(clean_url)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
        ext = '.jpg'

    url_hash = hashlib.md5(article.get('id', img_url).encode('utf-8')).hexdigest()[:10]
    filename = f"opinion_{url_hash}{ext}"
    local_path = os.path.join(PUBLIC_IMG_DIR, filename)

    try:
        # Download image if not cached
        if not (os.path.exists(local_path) and os.path.getsize(local_path) > 1000):
            res = requests.get(img_url, headers=HEADERS, timeout=8)
            if res.status_code == 200 and len(res.content) > 1000:
                with open(local_path, 'wb') as f:
                    f.write(res.content)
            elif img_url != FALLBACK_EDITORIAL_IMG:
                # try fallback
                res2 = requests.get(FALLBACK_EDITORIAL_IMG, headers=HEADERS, timeout=8)
                if res2.status_code == 200:
                    with open(local_path, 'wb') as f:
                        f.write(res2.content)

        if os.path.exists(local_path) and os.path.getsize(local_path) > 1000:
            print(f"[OK] {article.get('title')} -> /images/news/{filename}")
            return f"/images/news/{filename}"
    except Exception as e:
        print(f"Error downloading image for {article.get('title')}: {e}")

    return "/images/news/cat_home_default.jpg"

def main():
    print("[*] Fetching real opinion images for all opinion articles...")
    if not os.path.exists(ARTICLES_FILE):
        print("articles.json not found!")
        return

    with open(ARTICLES_FILE, 'r', encoding='utf-8') as f:
        articles = json.load(f)

    opinion_indices = [i for i, a in enumerate(articles) if a.get('category') == 'opinion']
    print(f"Found {len(opinion_indices)} opinion articles to process.")

    opinion_articles = [articles[i] for i in opinion_indices]

    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(fetch_and_save_image, opinion_articles))

    for idx, local_img in zip(opinion_indices, results):
        articles[idx]['imageUrl'] = local_img

    with open(ARTICLES_FILE, 'w', encoding='utf-8') as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

    print("[DONE] Successfully updated articles.json with local opinion images!")

if __name__ == '__main__':
    main()
