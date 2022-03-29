from django.contrib import admin
from django.urls import path, include
from meetings.urls import urlpatterns as meetings_urls

urlpatterns = [
    path("api/", include(meetings_urls)),
    path("admin/", admin.site.urls),
]
