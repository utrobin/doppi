from django.shortcuts import render
from search.forms import SearchBarForm


# Create your views here.

def hello(request):
    return render(request, 'hello.html')


def searchbar(request):
    form = SearchBarForm()
    return render(request, 'searchbar.html', {'form': form})

def findCourse(request):
    return render(request, 'hello.html')