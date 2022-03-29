import json
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.views.generic.edit import UpdateView
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from meetings.models import Category, Card
from django.urls import reverse_lazy


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


class CardUpdateView(UpdateView):
    model = Card
    fields = ["category"]

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        if self.request.method in ("POST", "PUT") and not kwargs.get("data"):
            kwargs.update({"data": json.loads(self.request.body)})
        print(kwargs)
        return kwargs

    def form_valid(self, form):
        self.object = form.save()
        return JsonResponse({"ok": True})

    def form_invalid(self, form):
        return JsonResponse({"ok": False, "errors": form.errors.as_json()}, status=500)

