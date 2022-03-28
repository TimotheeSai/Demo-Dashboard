from django.contrib import admin
from django.urls import path
from meetings.views import (
    CategoryDetailView,
    CardDetailView,
    CategoryListView,
    CardListView,
)

urlpatterns = [
    path("category/<slug:slug>/", CategoryDetailView.as_view(), name="category"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("card/<slug:slug>/", CardDetailView.as_view(), name="card"),
    path("cards/", CardListView.as_view(), name="cards-list"),
    path("admin/", admin.site.urls),
]
