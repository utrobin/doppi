from django.conf.urls import url
from search import views

urlpatterns = [
    url(r'^$', views.main, name='main'),
    url(r'^selection$', views.selection_courses, name='selection'),
    url(r'^search$', views.searchbar, name='bar'),
    url(r'^course/(?P<course_id>\d+)$', views.single_course, name='single_course'),
    url(r'^add$', views.add_course, name='add_course'),
    url(r'^edit/(?P<course_id>\d+)$', views.edit_course, name='edit_course'),
    url(r'^delete/(?P<course_id>\d+)$', views.delete_course, name='delete_course'),
    url(r'^fish$', views.fish, name='fish'),

    url(r'^pinki', views.pinki, name='pinki'),

    url(r'^api/get/comments$', views.get_comments, name='get_comment'),
    url(r'^api/post/comment$', views.post_comment, name='post_comment'),
    url(r'^api/delete/comment$', views.delete_comment, name='delete_comment'),

    url(r'^api/get/courses$', views.get_courses, name='get_courses'),
    url(r'^api/get/recommendcourses$', views.get_recommend_courses, name='get_recommend_courses'),
    url(r'^api/get/activity$', views.get_activity, name='get_activity'),

    url(r'^coordinates$', views.get_courses_map, name='coordinates'),
    url(r'^like', views.do_like, name='like'),
    url(r'^rating', views.get_raiting, name='rating'),

    url(r'^api/get/recommendcoursestest1$', views.test_to_ctype, name='recommendcoursestest1'),
]
