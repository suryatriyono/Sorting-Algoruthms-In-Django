from django.urls import path
from .views import index,sortings

urlpatterns = [
    path('',index, name='sortings-home'),
    path('sortings/',sortings, name='sortings-visualization'),
]
