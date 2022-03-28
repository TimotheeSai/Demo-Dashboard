from django.shortcuts import render
from django.views.generic import View
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from meetings.models import Category, Card


class CategoryListView(ListView):
    model = Category

    def get(self, request, *args, **kwargs):
        self.object_list = self.get_queryset()
        return JsonResponse(
            {"ok": True, "categories": [o.serialize() for o in self.object_list]}
        )


class CategoryDetailView(DetailView):
    model = Category

    def get_queryset(self):
        return super().get_queryset().order_by("order")

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        return JsonResponse({"ok": True, "category": self.object.serialize()})


class CardListView(ListView):
    model = Card

    def get(self, request, *args, **kwargs):
        self.object_list = self.get_queryset()
        return JsonResponse(
            {"ok": True, "cards": [o.serialize() for o in self.object_list]}
        )


class CardDetailView(DetailView):
    model = Card

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        return JsonResponse({"ok": True, "card": self.object.serialize(),})
