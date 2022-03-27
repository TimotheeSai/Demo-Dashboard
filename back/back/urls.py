from django.contrib import admin
from django.urls import path
from meetings.views import CategoryView, CardView

urlpatterns = [
    path("category/<slug:name>/", CategoryView.as_view(), name='category'),
    path("card/<int:id>/", CardView.as_view(), name='category'),
    path('admin/', admin.site.urls),
]
