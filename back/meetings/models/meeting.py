from django.db import models
from django.db.models.fields import CharField


class Category(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField()
    order = models.IntegerField(default=0)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "order": self.order,
        }


class Tag(models.Model):
    name = CharField(max_length=30)
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }

        
class Card(models.Model):
    title = models.CharField(max_length=50)
    slug = models.SlugField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    text = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    due_at = models.DateTimeField(null=True, blank=True)
    tags = models.ManyToManyField(Tag)
    
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category.slug,
            "text": self.text,
            "dueAt": self.due_at,
            "tags": [t.serialize() for t in self.tags.all()]
        }


