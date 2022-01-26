from rest_framework import serializers
from books.models import Books, Pages, Images

class BooksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Books
        fields = ('id',"name", "subtitle", "cover")

class PagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pages
        fields = ('id',
                    'book',
                    'title',
                  'canvas',
                  'image')
                
class ImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = ('id', 'page', 'image')                 