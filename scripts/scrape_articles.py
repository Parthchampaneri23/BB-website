import requests
import json
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
import os
import re
import hashlib
from urllib.parse import urlparse

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_IMG_DIR = os.path.join(BASE_DIR, "..", "public", "images", "news")
DATA_DIR = os.path.join(BASE_DIR, "..", "src", "data")

os.makedirs(PUBLIC_IMG_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

FEEDS = [
    {
        'category': 'home',
        'categoryLabel': 'Home / Top Stories',
        'url': 'https://www.business-standard.com/rss/home_page_top_stories.rss'
    },
    {
        'category': 'markets',
        'categoryLabel': 'Stock Market News',
        'url': 'https://www.business-standard.com/rss/markets-106.rss'
    },
    {
        'category': 'smart-investor',
        'categoryLabel': 'Smart Investor',
        'url': 'https://www.business-standard.com/rss/finance-103.rss'
    },
    {
        'category': 'economy',
        'categoryLabel': 'Economy & Policy',
        'url': 'https://www.business-standard.com/rss/economy-policy-102.rss'
    },
    {
        'category': 'technology',
        'categoryLabel': 'Technology',
        'url': 'https://www.business-standard.com/rss/technology-108.rss'
    },
    {
        'category': 'cricket',
        'categoryLabel': 'Sports',
        'url': 'https://www.business-standard.com/rss/sports-105.rss'
    },
    {
        'category': 'companies',
        'categoryLabel': 'Companies & Corporates',
        'url': 'https://www.business-standard.com/rss/companies-101.rss'
    },
    {
        'category': 'opinion',
        'categoryLabel': 'Opinion & Columns',
        'url': 'https://www.business-standard.com/rss/opinion-104.rss'
    },
    {
        'category': 'latest',
        'categoryLabel': 'Latest News',
        'url': 'https://www.business-standard.com/rss/latest.rss'
    }
]

DEFAULT_REMOTE_IMAGES = {
    'home': 'https://bsmedia.business-standard.com/_media/bs/img/hp/home-page/2026-10/15/10939/full/1764354013-2571.jpg',
    'markets': 'https://bsmedia.business-standard.com/_media/bs/img/article/2024-07/19/full/1721388506-6468.jpg',
    'smart-investor': 'https://bsmedia.business-standard.com/_media/bs/img/article/2024-08/14/full/1723630663-1256.jpg',
    'economy': 'https://bsmedia.business-standard.com/_media/bs/img/article/2024-05/27/full/1716812836-8488.jpg',
    'technology': 'https://bsmedia.business-standard.com/_media/bs/img/article/2024-09/10/full/1725946114-1188.jpg',
    'cricket': 'https://bsmedia.business-standard.com/_media/bs/img/article/2024-06/29/full/1719688402-2309.jpg',
    'companies': 'https://bsmedia.business-standard.com/_media/bs/img/article/2024-08/01/full/1722497645-3814.jpg',
    'opinion': 'https://bsmedia.business-standard.com/_media/bs/img/article/2024-03/22/full/1711099684-2577.jpg'
}

def clean_html(raw_html):
    if not raw_html:
        return ""
    clean = re.sub(r'<.*?>', '', raw_html)
    clean = clean.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&quot;', '"').replace('&#39;', "'").replace('&lt;', '<').replace('&gt;', '>')
    return clean.strip()

def slugify(text):
    text = re.sub(r'[^\w\s-]', '', text.lower())
    return re.sub(r'[-\s]+', '-', text).strip('-')

def download_image(url, prefix="news"):
    """Download image to public/images/news and return the local path /images/news/<filename>"""
    if not url:
        return None
    try:
        # Determine extension
        clean_url = url.split('?')[0]
        ext = os.path.splitext(clean_url)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
            ext = '.jpg'

        url_hash = hashlib.md5(url.encode('utf-8')).hexdigest()[:12]
        filename = f"{prefix}_{url_hash}{ext}"
        local_path = os.path.join(PUBLIC_IMG_DIR, filename)

        if os.path.exists(local_path) and os.path.getsize(local_path) > 1000:
            return f"/images/news/{filename}"

        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code == 200 and len(resp.content) > 500:
            with open(local_path, 'wb') as img_f:
                img_f.write(resp.content)
            return f"/images/news/{filename}"
    except Exception as e:
        print(f"Failed to download image {url}: {e}")
    return None

def scrape_feeds():
    all_articles = []
    seen_urls = set()

    print("[*] Starting Business Standard content & image scraping...")

    # Download default fallback images for each category first
    category_local_defaults = {}
    for cat, def_url in DEFAULT_REMOTE_IMAGES.items():
        loc = download_image(def_url, prefix=f"cat_{cat}")
        if loc:
            category_local_defaults[cat] = loc
        else:
            category_local_defaults[cat] = def_url

    for feed_info in FEEDS:
        cat = feed_info['category']
        label = feed_info['categoryLabel']
        url = feed_info['url']
        print(f"\nFetching feed for {cat}: {url}")

        try:
            res = requests.get(url, headers=HEADERS, timeout=15)
            if res.status_code != 200:
                print(f"Failed to fetch {url}, status: {res.status_code}")
                continue

            root = ET.fromstring(res.content)
            channel = root.find('channel')
            if channel is None:
                continue

            items = channel.findall('item')
            print(f"  -> Found {len(items)} items in {cat}")

            for idx, item in enumerate(items):
                link = item.find('link').text.strip() if item.find('link') is not None and item.find('link').text else ""
                if not link or link in seen_urls:
                    continue
                seen_urls.add(link)

                title = item.find('title').text.strip() if item.find('title') is not None and item.find('title').text else ""
                desc = item.find('description').text.strip() if item.find('description') is not None and item.find('description').text else ""
                desc_clean = clean_html(desc)
                pub_date = item.find('pubDate').text.strip() if item.find('pubDate') is not None and item.find('pubDate').text else ""

                creator = item.find('{http://purl.org/dc/elements/1.1/}creator')
                author = creator.text.strip() if creator is not None and creator.text else "Business Standard Desk"

                # Extract image url
                remote_image_url = ""
                media_content = item.find('{http://search.yahoo.com/mrss/}content')
                if media_content is not None and 'url' in media_content.attrib:
                    remote_image_url = media_content.attrib['url']
                elif item.find('enclosure') is not None and 'url' in item.find('enclosure').attrib:
                    remote_image_url = item.find('enclosure').attrib['url']
                
                if not remote_image_url and desc:
                    img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', desc)
                    if img_match:
                        remote_image_url = img_match.group(1)

                # Download image locally into /public/images/news
                local_image = None
                if remote_image_url:
                    local_image = download_image(remote_image_url, prefix=cat)

                if not local_image:
                    local_image = category_local_defaults.get(cat, "/images/news/cat_home_default.jpg")

                slug = slugify(title[:80]) + f"-{abs(hash(link)) % 1000000}"

                article = {
                    "id": slug,
                    "title": title,
                    "summary": desc_clean[:220] + "..." if len(desc_clean) > 220 else desc_clean,
                    "fullText": desc_clean,
                    "category": cat,
                    "categoryLabel": label,
                    "url": link,
                    "imageUrl": local_image,
                    "originalImageUrl": remote_image_url,
                    "author": author,
                    "pubDate": pub_date,
                    "readTime": "3 min read"
                }

                all_articles.append(article)

        except Exception as e:
            print(f"Error parsing feed {url}: {e}")

    print(f"\n[+] Total parsed articles: {len(all_articles)}")

    out_file = os.path.join(DATA_DIR, "articles.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(all_articles, f, indent=2, ensure_ascii=False)

    print(f"[+] Successfully saved articles to {out_file}")

    # Build market indices
    markets = [
        {"symbol": "SENSEX", "name": "BSE SENSEX", "price": "81,892.40", "change": "+345.10", "percent": "+0.42%", "isPositive": True},
        {"symbol": "NIFTY 50", "name": "NIFTY 50", "price": "25,038.75", "change": "+98.30", "percent": "+0.39%", "isPositive": True},
        {"symbol": "NIFTY BANK", "name": "BANK NIFTY", "price": "51,840.20", "change": "+210.50", "percent": "+0.41%", "isPositive": True},
        {"symbol": "BSE MIDCAP", "name": "BSE MIDCAP", "price": "47,120.60", "change": "-65.40", "percent": "-0.14%", "isPositive": False},
        {"symbol": "GOLD (10g)", "name": "MCX GOLD", "price": "₹76,450", "change": "+180.00", "percent": "+0.24%", "isPositive": True},
        {"symbol": "USD/INR", "name": "USD to INR", "price": "84.07", "change": "-0.04", "percent": "-0.05%", "isPositive": False},
        {"symbol": "BRENT CRUDE", "name": "Brent Oil ($/bbl)", "price": "74.29", "change": "-0.82", "percent": "-1.09%", "isPositive": False}
    ]
    markets_file = os.path.join(DATA_DIR, "markets.json")
    with open(markets_file, "w", encoding="utf-8") as f:
        json.dump(markets, f, indent=2)

if __name__ == '__main__':
    scrape_feeds()
