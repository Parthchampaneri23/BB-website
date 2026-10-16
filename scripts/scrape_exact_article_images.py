import json
import os
import requests
import hashlib
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARTICLES_FILE = os.path.join(BASE_DIR, "..", "src", "data", "articles.json")
PUBLIC_IMG_DIR = os.path.join(BASE_DIR, "..", "public", "images", "news")

os.makedirs(PUBLIC_IMG_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

def process_article(article):
    live_url = article.get('url')
    current_img = article.get('imageUrl', '')

    # Try to fetch live og:image from the real Business Standard article page
    remote_img = None
    if live_url and ('business-standard.com' in live_url):
        try:
            r = requests.get(live_url, headers=HEADERS, timeout=8)
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, 'html.parser')
                og_tag = soup.find('meta', property='og:image')
                if og_tag and og_tag.get('content') and not ('Business_Standard_1' in og_tag.get('content')):
                    remote_img = og_tag.get('content')
                elif not remote_img:
                    tw_tag = soup.find('meta', attrs={'name': 'twitter:image'})
                    if tw_tag and tw_tag.get('content') and not ('Business_Standard_1' in tw_tag.get('content')):
                        remote_img = tw_tag.get('content')
        except Exception:
            pass

    if not remote_img:
        remote_img = article.get('originalImageUrl') or current_img

    if not remote_img or not remote_img.startswith('http'):
        return article

    # Download image locally
    try:
        clean_url = remote_img.split('?')[0]
        ext = os.path.splitext(clean_url)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
            ext = '.jpg'

        url_hash = hashlib.md5(remote_img.encode('utf-8')).hexdigest()[:10]
        cat = article.get('category', 'news')
        filename = f"{cat}_{url_hash}{ext}"
        local_path = os.path.join(PUBLIC_IMG_DIR, filename)

        if not (os.path.exists(local_path) and os.path.getsize(local_path) > 1000):
            res = requests.get(remote_img, headers=HEADERS, timeout=8)
            if res.status_code == 200 and len(res.content) > 1000:
                with open(local_path, 'wb') as f:
                    f.write(res.content)

        if os.path.exists(local_path) and os.path.getsize(local_path) > 1000:
            article['imageUrl'] = f"/images/news/{filename}"
            article['originalImageUrl'] = remote_img
            print(f"Set image for {article['id'][:30]} -> {filename}")
    except Exception as e:
        print(f"Error downloading for {article['id'][:30]}: {e}")

    return article

def main():
    if not os.path.exists(ARTICLES_FILE):
        print("articles.json not found")
        return

    with open(ARTICLES_FILE, 'r', encoding='utf-8') as f:
        articles = json.load(f)

    # Process first 50 articles in parallel
    target_articles = articles[:50]
    print(f"Scraping exact article images for {len(target_articles)} items...")

    with ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(process_article, target_articles))

    # Update back into main array
    for i, res in enumerate(results):
        articles[i] = res

    with open(ARTICLES_FILE, 'w', encoding='utf-8') as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

    print("[+] Successfully updated articles with dedicated article page images!")

if __name__ == '__main__':
    main()
