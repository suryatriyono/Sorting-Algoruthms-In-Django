import json
import requests
from bs4 import BeautifulSoup
from django.shortcuts import render
from .models import MarketCapData

def scrape_market_cap():
    url = "https://companiesmarketcap.com/assets-by-market-cap/"
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        MarketCapData.objects.all().delete()

        table = soup.find('table', {'class': 'default-table table marketcap-table dataTable'})
        if table:
            rows = table.find_all('tr')

            for row in rows:
                cols = row.find_all('td')
                if len(cols) > 0:
                    rank = cols[0].text.strip()
                    name = cols[1].text.strip()
                    img_src = cols[1].find('img')['src'] if cols[1].find('img') else None
                    market_cap = cols[2].text.strip()
                    price = cols[3].text.strip()
                    change_today = cols[4].text.strip()
                    price_30_days_svg = str(cols[5].find('svg')) if cols[5].find('svg') else None
                    country = cols[6].text.strip()
                    MarketCapData.objects.create(
                        rank=rank,
                        name=name,
                        img_src=img_src,
                        market_cap=market_cap,
                        price=price,
                        change_today=change_today,
                        price_30_days_svg=price_30_days_svg,
                        country=country
                    )

def index(request):
    return render(request, 'sortings/index.html')

def sortings(request):
    scrape_market_cap()
    data = MarketCapData.objects.all().values()
    data_json = json.dumps(list(data))
    return render(request, 'sortings/sortings.html', {'data_json': data_json, 'data': data})

