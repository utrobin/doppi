from django.shortcuts import render
from search.forms import SearchBarForm
from search.models import *


# Create your views here.

def hello(request):
    return render(request, 'hello.html')


def searchbar(request):
    if len(request.GET) != 0:
        form = SearchBarForm(request.GET)
        # Сортируем по названию
        courses = Course.objects.all().filter(title__icontains=request.GET['query'])
        # Сортируем по остальным настройкам
        if 'is_0_3_age' in request.GET:
            courses = courses.filter(info__is_0_3_age=request.GET['is_0_3_age'])
        if 'is_4_6_age' in request.GET:
            courses = courses.filter(info__is_4_6_age=request.GET['is_4_6_age'])
        if 'is_7_11_age' in request.GET:
            courses = courses.filter(info__is_7_11_age=request.GET['is_7_11_age'])
        if 'is_12_15_age' in request.GET:
            courses = courses.filter(info__is_12_15_age=request.GET['is_12_15_age'])
        if 'is_16_18_age' in request.GET:
            courses = courses.filter(info__is_16_18_age=request.GET['is_16_18_age'])
        if 'activity' in request.GET:
            courses = courses.filter(info__activity__in=request.GET.getlist('activity'))
        if 'is_indoors' in request.GET:
            courses = courses.filter(info__is_indoors=request.GET['is_indoors'])
        if 'location' in request.GET:
            courses = courses.filter(info__location__icontains=request.GET['location'])
        if 'price' in request.GET and request.GET['price'] != '':
            courses = courses.filter(info__price__lte=request.GET['price'])
        if 'length' in request.GET and request.GET['length'] != '':
            courses = courses.filter(info__length__lte=request.GET['length'])
        if 'frequency' in request.GET and request.GET['frequency'] != '':
            courses = courses.filter(info__frequency__lte=request.GET['frequency'])

    else:
        form = SearchBarForm()
        courses = Course.objects.all()
    return render(request, 'searchbar.html', {'form': form, 'courses': courses})
