from django.db import models

class MarketCapData(models.Model):
    rank = models.CharField(max_length=10)
    name = models.CharField(max_length=100)
    img_src = models.URLField(null=True, blank=True)
    market_cap = models.CharField(max_length=20)
    price = models.CharField(max_length=20)
    change_today = models.CharField(max_length=10)
    price_30_days_svg = models.TextField(null=True, blank=True)
    country = models.CharField(max_length=50)