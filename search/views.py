from django.shortcuts import render
from search.forms import SearchBarForm
from search.models import *


# Create your views here.

def hello(request):
    return render(request, 'hello.html')


def searchbar(request):
    if len(request.GET) != 0:
        form = SearchBarForm(request.GET)
        courses = Course.objects.all().filter(title__icontains=request.GET['query'])
        if 'activity' in request.GET:
            courses = courses.filter(info__activity=request.GET['activity'])
            
    else:
        form = SearchBarForm()
        courses = Course.objects.all()
    return render(request, 'searchbar.html', {'form': form, 'courses': courses})