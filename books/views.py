from django.shortcuts import get_object_or_404,HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from books.models import Books, Pages,Images
from books.serializers import BooksSerializer, PagesSerializer, ImagesSerializer
from django.core.files.storage import default_storage

class BookView(APIView):
    def get(self, request, id=None):
        if id:
            book = get_object_or_404(Books, pk=id)
            return Response(
                {
                    "book": BooksSerializer(book).data,
                    "pages": PagesSerializer(
                        Pages.objects.filter(book=book), many=True
                    ).data,
                }
            )
        else:
            books = BooksSerializer(Books.objects.all(), many=True)
            return Response(books.data, status=200)
            
    def delete(self, request, id):
        book = get_object_or_404(Books, pk=id)
        book.delete()
        return Response(status=204)

    def post(self, request):
        book = BooksSerializer(data=request.data)
        if book.is_valid():
            book.save()
            page = PagesSerializer(data={**request.data, "book": book.instance.id, "canvas": request.data["canvas"], "image": request.data["image"], "title": request.data["title"]})
            if page.is_valid():
                page.save()
                return Response(book.data, status=201)
            return Response(page.errors, status=400)
        return Response(book.errors, status=400)


class PageView(APIView):
    def post(self, request, book_id, page_id=None):
        page = PagesSerializer(data={**request.data, "book": book_id})
        if page.is_valid():
            page.save()
            return Response(page.data, status=201)
        return Response(page.errors, status=400)

    def put(self, request, book_id, page_id):
        page = get_object_or_404(Pages, pk=page_id)
        page.canvas = request.data["canvas"]
        page.image = request.data["image"]
        page.save()
        return Response(PagesSerializer(page).data, status=200)

    def delete(self, request, book_id, page_id):
        page = get_object_or_404(Pages, pk=page_id)
        page.delete()
        return Response(status=204)

    def get(self, request, book_id, page_id):
        page = get_object_or_404(Pages, pk=page_id)
        return Response(PagesSerializer(page).data)




class AddImage(APIView):
    def post(self,request,id):
        image = ImagesSerializer(data=request.data)
        if image.is_valid():
            image.save()
            return Response(image.data, status=201)
        return Response(image.errors, status=400)
    
    def get(self,request,id):
        page = get_object_or_404(Pages, pk=id)
        images = ImagesSerializer(Images.objects.filter(page=page), many=True).data
        return Response(images, status=200)