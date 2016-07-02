from django.conf.urls import url
from search import views

urlpatterns = [
    url(r'^$', views.hello, name='main'),
    url(r'^search$', views.searchbar, name='bar'),
    url(r'^find', views.findCourse, name='find'),
]
