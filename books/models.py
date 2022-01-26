from django.db import models


class Books(models.Model):
    name = models.CharField(max_length=20)
    subtitle = models.CharField(max_length=20)
    cover = models.ImageField(upload_to='books')


class Pages(models.Model):
    book = models.ForeignKey(Books, on_delete=models.CASCADE)
    title = models.CharField(max_length=20,null=True,blank=True)
    canvas = models.TextField(null=True)
    image = models.CharField(max_length=200,null=True)

    
class Images(models.Model):
    page = models.ForeignKey(Pages, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='uploads')