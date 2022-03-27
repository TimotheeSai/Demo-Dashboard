from django.shortcuts import render
from django.views.generic import View
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from meetings.models import Category, Card


class CategoryView(View):
    def get(self, request, *args, **kwargs):
        cat = get_object_or_404(Category, slug=self.kwargs["name"])
        return JsonResponse({"ok": True, "category": cat.name})


class CardView(View):
    def get(self, request, *args, **kwargs):
        card = get_object_or_404(Card, id=self.kwargs["id"])
        return JsonResponse(
            {
                "ok": True,
                "card": {
                    "title": card.title,
                    "category": card.category.slug,
                    "text": card.text,
                    "due_at": card.due_at,
                },
            }
        )
