from django.conf.urls import url
from authentication import views

urlpatterns = [
    url(r'^signin/?$', views.signin, name='signin'),
    url(r'^signup/?$', views.signup, name='signup'),
    url(r'^logout/?$', views.logout, name='logout'),
    url(r'^edit/?$', views.profile_edit, name='edit'),
    url(r'^addchild', views.add_child, name='add_child'),
    url(r'^editchild/(?P<child_id>\d+)$', views.edit_child, name='edit_child')
]
