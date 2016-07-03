from django.conf.urls import url
from authentication import views

urlpatterns = [
    url(r'^signin/?$', views.signin, name='signin'),
    url(r'^signup/?$', views.signup, name='signup'),
    url(r'^logout/?$', views.logout, name='logout'),
]
