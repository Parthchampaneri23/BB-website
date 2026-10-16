import requests
from bs4 import BeautifulSoup
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
pages = [
    'https://www.business-standard.com/sports',
    'https://www.business-standard.com/sports/cricket',
    'https://www.business-standard.com/sports/football',
    'https://www.business-standard.com/sports/other-sports',
    'https://www.business-standard.com/sports/news'
]

seen_links = set()
sports_articles = []

for page in pages:
    try:
        r = requests.get(page, headers=headers, timeout=6)
        soup = BeautifulSoup(r.text, 'html.parser')
        for a in soup.find_all('a', href=True):
            href = a['href']
            if not href.startswith('http'):
                href = 'https://www.business-standard.com' + href
            clean_href = href.split('?')[0]
            if clean_href in seen_links:
                continue
            if ('/sports/' in clean_href or '/cricket/' in clean_href) and clean_href.endswith('.html'):
                title = a.get_text(strip=True)
                if len(title) > 25 and not any(skip in title.lower() for skip in ['read more', 'click here', 'photo', 'video', 'newsletter']):
                    seen_links.add(clean_href)
                    sports_articles.append({'title': title, 'url': clean_href})
    except Exception as e:
        print(f"Error on {page}: {e}")

print(f"Total distinct sports articles discovered: {len(sports_articles)}")
for idx, item in enumerate(sports_articles[:15]):
    print(f"{idx+1}. {item['title']} -> {item['url']}")
