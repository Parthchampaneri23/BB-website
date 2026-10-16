import requests
import json
import xml.etree.ElementTree as ET
import os
import re
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

FEEDS_TO_REFRESH = [
    {
        'category': 'markets',
        'categoryLabel': 'Markets',
        'url': 'https://www.business-standard.com/rss/markets-106.rss'
    },
    {
        'category': 'economy',
        'categoryLabel': 'Economy',
        'url': 'https://www.business-standard.com/rss/economy-policy-102.rss'
    },
    {
        'category': 'pf',
        'categoryLabel': 'Personal Finance (PF)',
        'url': 'https://www.business-standard.com/rss/personal-finance-10301.rss'
    }
]

def clean_html(raw_html):
    if not raw_html:
        return ""
    clean = re.sub(r'<.*?>', '', raw_html)
    clean = clean.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&quot;', '"').replace('&#39;', "'").replace('&lt;', '<').replace('&gt;', '>')
    return clean.strip()

def slugify(text):
    text = re.sub(r'[^\w\s-]', '', text.lower())
    return re.sub(r'[-\s]+', '-', text).strip('-')

def fetch_and_download_image(live_url, default_remote_url, category):
    remote_img = None
    if live_url:
        try:
            r = requests.get(live_url, headers=HEADERS, timeout=6)
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, 'html.parser')
                og_tag = soup.find('meta', property='og:image')
                if og_tag and og_tag.get('content') and ('Business_Standard_1' not in og_tag.get('content')):
                    remote_img = og_tag.get('content')
                elif not remote_img:
                    tw_tag = soup.find('meta', attrs={'name': 'twitter:image'})
                    if tw_tag and tw_tag.get('content') and ('Business_Standard_1' not in tw_tag.get('content')):
                        remote_img = tw_tag.get('content')
        except Exception:
            pass

    if not remote_img:
        remote_img = default_remote_url

    if not remote_img or not remote_img.startswith('http'):
        return "/images/news/cat_home_default.jpg"

    try:
        clean_url = remote_img.split('?')[0]
        ext = os.path.splitext(clean_url)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
            ext = '.jpg'

        url_hash = hashlib.md5(remote_img.encode('utf-8')).hexdigest()[:10]
        filename = f"{category}_{url_hash}{ext}"
        local_path = os.path.join(PUBLIC_IMG_DIR, filename)

        if not (os.path.exists(local_path) and os.path.getsize(local_path) > 1000):
            res = requests.get(remote_img, headers=HEADERS, timeout=6)
            if res.status_code == 200 and len(res.content) > 1000:
                with open(local_path, 'wb') as f:
                    f.write(res.content)

        if os.path.exists(local_path) and os.path.getsize(local_path) > 1000:
            return f"/images/news/{filename}"
    except Exception as e:
        print(f"Error downloading image: {e}")

    return "/images/news/cat_home_default.jpg"

def process_item(item_data):
    cat, label, item = item_data
    link = item.find('link').text.strip() if item.find('link') is not None and item.find('link').text else ""
    title = item.find('title').text.strip() if item.find('title') is not None and item.find('title').text else ""
    desc = item.find('description').text.strip() if item.find('description') is not None and item.find('description').text else ""
    desc_clean = clean_html(desc)
    pub_date = item.find('pubDate').text.strip() if item.find('pubDate') is not None and item.find('pubDate').text else ""

    creator = item.find('{http://purl.org/dc/elements/1.1/}creator')
    author = creator.text.strip() if creator is not None and creator.text else "BusinessBulletin Desk"

    media_content = item.find('{http://search.yahoo.com/mrss/}content')
    default_img = media_content.attrib.get('url', '') if media_content is not None else ''

    local_img = fetch_and_download_image(link, default_img, cat)

    slug = slugify(title[:80]) + f"-{abs(hash(link)) % 1000000}"

    return {
        "id": slug,
        "title": title,
        "summary": desc_clean[:220] + "..." if len(desc_clean) > 220 else desc_clean,
        "fullText": desc_clean,
        "category": cat,
        "categoryLabel": label,
        "url": link,
        "imageUrl": local_img,
        "author": author,
        "pubDate": pub_date,
        "readTime": "3 min read"
    }

def main():
    print("[*] Scraping latest 10 days news for Markets, Economy, and PF...")

    # Load existing articles to preserve other categories
    existing = []
    if os.path.exists(ARTICLES_FILE):
        with open(ARTICLES_FILE, 'r', encoding='utf-8') as f:
            existing = json.load(f)

    # Filter out old items for markets, economy, and pf to replace with fresh 10 days seed
    preserved = [a for a in existing if a.get('category') not in ['markets', 'economy', 'pf']]

    items_to_process = []
    for feed_info in FEEDS_TO_REFRESH:
        cat = feed_info['category']
        label = feed_info['categoryLabel']
        url = feed_info['url']
        print(f"Fetching {cat} from {url}...")
        try:
            r = requests.get(url, headers=HEADERS, timeout=12)
            if r.status_code == 200:
                root = ET.fromstring(r.content)
                items = root.find('channel').findall('item')
                print(f" -> Found {len(items)} items in {cat}")
                # Take top 15-20 latest items (covering last 10 days)
                for item in items[:15]:
                    items_to_process.append((cat, label, item))
        except Exception as e:
            print(f"Error fetching {url}: {e}")

    print(f"Scraping & downloading images for {len(items_to_process)} articles...")
    with ThreadPoolExecutor(max_workers=8) as executor:
        fresh_articles = list(executor.map(process_item, items_to_process))

    # Combine fresh with preserved
    final_articles = fresh_articles + preserved

    # Replace any Business Standard mentions
    for a in final_articles:
        if a.get('author') == 'Business Standard Desk':
            a['author'] = 'BusinessBulletin Desk'

    with open(ARTICLES_FILE, 'w', encoding='utf-8') as f:
        json.dump(final_articles, f, indent=2, ensure_ascii=False)

    print(f"[+] Successfully seeded {len(fresh_articles)} fresh articles for Markets, Economy, and PF into articles.json!")

if __name__ == '__main__':
    main()
