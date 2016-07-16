# -*- coding: utf-8 -*-
from django.shortcuts import render
from search.forms import SearchBarForm, CommentForm, CourseForm, CourseInfoForm
from authentication.models import UserProfile
from search.models import *
from django.http.response import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.db.models import Q
import random

import json
import pusher

# Create your views here.

pusher_client = pusher.Pusher(
    app_id='223104',
    key='3140ed0ba3ff0af4856a',
    secret='96c8ed472fdf00dd0038',
    cluster='eu',
    ssl=True
)


def hello(request):
    return render(request, 'hello.html')

def data(request):
    return render(request, 'data.json')

def mk_int(s, tabur):
    s = s.strip()
    if tabur:
        return int(s) if s else 1000000
    else:
        return int(s) if s else 0


def mk_checkboxes(list):
    if len(list) != 0:
        return list
    else:
        for k in CourseType.objects.all():
            list.append(k.title)
        return list


def get_courses(request):
    data = []
    options = json.loads(request.GET['options'])
    page = int(request.GET['page'])
    for course in Course.objects.filter(
                    Q(description__icontains=(options['searchQuery'])) | Q(title__icontains=options['searchQuery']),
            Q(info__price__gte=mk_int(options['priceFrom'], False)),
            Q(info__price__lte=mk_int(options['priceTo'], True)),
            Q(info__age_from__gte=mk_int(options['ageFrom'], False)),
            Q(info__age_to__lte=mk_int(options['ageTo'], True)),
                    Q(info__activity__title__in=mk_checkboxes(options['checkboxes']))

    )[page * 21:(page + 1) * 21]:
        data.append({'id': course.id, 'author': course.author.user.username, 'title': course.title,
                     'description': course.description, 'pic': course.pic.url,
                     'age_from': course.info.age_from, 'age_to': course.info.age_to,
                     'time_from': course.info.time_from, 'time_to': course.info.time_to,
                     'activity': [str(a) for a in course.info.activity.all()],
                     'location': [str(a) for a in course.info.location.all()],
                     'price': course.info.price, 'frequency': course.info.frequency})
    print(len(data))
    print(data)
    return HttpResponse(json.dumps(data), content_type="application/json")


def getTabur(request):
    coordinates = json.loads(request.GET['coordinates'])
    data = {}
    data['type'] = 'FeatureCollection'
    data['features'] = []
    i = 0
    for course in Course.objects.filter():
        data['features'].append({'type': 'Feature', 'id': i, 'geometry':
            {'type': 'Point'},
                                 'properties': {'balloonContent': "<a href='http://doppi.info/course/" + str(
                                     course.id) + "'>" + course.title + "</a>", 'clusterCaption': course.title,
                                                'hintContent': course.title}})

    return HttpResponse(json.dumps(data), content_type="application/json")


def get_activity(request):
    data = []
    for course in CourseType.objects.all():
        data.append({'id': course.id, 'title': course.title})

    return HttpResponse(json.dumps(data), content_type="application/json")


def searchbar(request):
    return render(request, 'pinki_drag.html')


def single_course(request, course_id):
    course = Course.objects.get(id=course_id)
    return render(request, 'course_page.html', {'course': course})


@login_required(login_url='/authentication/signin/')
def add_course(request):
    if request.method == 'POST':
        form = CourseForm(request.POST, request.FILES)
        form_info = CourseInfoForm(request.POST)
        if form.is_valid() and form_info.is_valid():
            course = form.save(commit=False)
            info = form_info.save()
            course.info = info
            course.author = UserProfile.objects.get(user=request.user)
            course.save()
            return HttpResponseRedirect('/search')
    else:
        form = CourseForm()
        form_info = CourseInfoForm()
    return render(request, 'add_course.html', {'form': form, 'forminfo': form_info})


@login_required(login_url='/authentication/signin/')
def edit_course(request, course_id):
    course = Course.objects.get(id=course_id)
    if request.user != course.author.user:
        return render(request, 'searchbar.html')
    if request.method == 'POST':
        form = CourseForm(request.POST, request.FILES, instance=course)
        form_info = CourseInfoForm(request.POST, instance=course.info)
        if form.is_valid() and form_info.is_valid():
            form.save()
            form_info.save()
            return HttpResponseRedirect('/course/' + str(course_id))
    else:
        form = CourseForm(instance=course)
        form_info = CourseInfoForm(instance=course.info)
    return render(request, 'edit_course.html', {'form': form, 'forminfo': form_info, 'course': course})


# csrf attack
@login_required(login_url='/authentication/signin/')
def delete_course(request, course_id):
    course = Course.objects.get(id=course_id)
    if request.user == course.author.user:
        course.delete()
    return render(request, 'searchbar.html')


def get_comments(request):
    course_id = request.GET['course_id']
    data = []
    for comment in Comment.objects.filter(course__pk=course_id).order_by('added_at'):
        data.append({'id': comment.id, 'author': comment.author.user.username, 'text': comment.text,
                     'added_at': comment.added_at.strftime('%Y-%m-%d %H:%M'), 'pic': comment.author.avatar.url})

    return HttpResponse(json.dumps(data), content_type="application/json")


@login_required(login_url='/authentication/signin/')
def delete_comment(request):
    comment = Comment.objects.get(id=request.POST['comment_id'])
    if comment.author == UserProfile.objects.get(user=request.user):
        comment.delete()
        pusher_client.trigger('comments', 'new_comment', {})
    return HttpResponse(json.dumps({}), content_type="application/json")


@login_required(login_url='/authentication/signin/')
def post_comment(request):
    course_id = request.POST['course_id']
    comment = Comment(author=UserProfile.objects.get(user=request.user), course=Course.objects.get(id=course_id),
                      text=request.POST['text'])
    comment.save()
    pusher_client.trigger('comments', 'new_comment', {})
    return HttpResponse(json.dumps({}), content_type="application/json")


def pinki(request):
    return render(request, 'pinki_drag.html')
