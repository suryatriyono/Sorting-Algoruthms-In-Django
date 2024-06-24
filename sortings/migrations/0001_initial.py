# Generated by Django 5.0.6 on 2024-06-02 15:14

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MarketCapData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rank', models.CharField(max_length=10)),
                ('name', models.CharField(max_length=100)),
                ('img_src', models.URLField(blank=True, null=True)),
                ('market_cap', models.CharField(max_length=20)),
                ('price', models.CharField(max_length=20)),
                ('change_today', models.CharField(max_length=10)),
                ('price_30_days_svg', models.TextField(blank=True, null=True)),
                ('country', models.CharField(max_length=50)),
            ],
        ),
    ]
