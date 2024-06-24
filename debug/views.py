import json
import requests
from bs4 import BeautifulSoup
from django.shortcuts import render

def scrape_market_cap():
    url = "https://companiesmarketcap.com/assets-by-market-cap/"
    response = requests.get(url)
    market_cap_data = []  # List to store market cap data

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
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

                    # Store data in a dictionary
                    entry = {
                        'rank': rank,
                        'name': name,
                        'img_src': img_src,
                        'market_cap': market_cap,
                        'price': price,
                        'change_today': change_today,
                        'price_30_days_svg': price_30_days_svg,
                        'country': country
                    }

                    market_cap_data.append(entry)  # Append entry to list

    return market_cap_data
    

def index(request):
    market_cap_data = scrape_market_cap()
    data_json = json.dumps(market_cap_data)
    return render(request, 'debug/index.html', {'data_json': data_json, 'data': market_cap_data})
