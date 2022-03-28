from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField()

    def serialize(self):
        return {
            "name": self.name,
            "slug": self.slug,
        }


        
class Card(models.Model):
    title = models.CharField(max_length=50)
    slug = models.SlugField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    text = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    due_at = models.DateTimeField(null=True, blank=True)
    
    def serialize(self):
        return {
            "title": self.title,
            "category": self.category.slug,
            "text": self.text,
            "due_at": self.due_at,
        }
