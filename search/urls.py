from django.conf.urls import url
from search import views

urlpatterns = [
    url(r'^$', views.hello, name='main'),
    url(r'^search$', views.searchbar, name='bar'),
    url(r'^course/(?P<course_id>\d+)$', views.single_course, name='single_course'),
    url(r'^add$', views.add_course, name='add_course'),
    url(r'^edit/(?P<course_id>\d+)$', views.edit_course, name='edit_course'),
    url(r'^delete/(?P<comment_id>\d+)$', views.delete_comment, name='delete_comment'),
    url(r'^post_comment/(?P<course_id>\d+)$', views.post_comment, name='post_comment'),
    url(r'^single_comment', views.single_comment, name='single_comment'),
]
