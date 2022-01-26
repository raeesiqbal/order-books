from books import views
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path("", views.BookView.as_view()),
    path("<int:id>/", views.BookView.as_view()),
    path("<int:book_id>/page/", views.PageView.as_view()),
    path("<int:book_id>/page/<int:page_id>/", views.PageView.as_view()),
    path("upload/<int:id>/", views.AddImage.as_view()),
    path("images/<int:id>/", views.AddImage.as_view()),
]
