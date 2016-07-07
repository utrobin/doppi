# -*- coding: utf-8 -*-
from django.shortcuts import render
from search.forms import SearchBarForm, CommentForm, CourseForm, CourseInfoForm
from authentication.models import UserProfile
from search.models import *
from django.http.response import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.core import serializers
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


def searchbar(request):
    form = SearchBarForm()
    courses = Course.objects.all()
    return render(request, 'searchbar.html', {'form': form, 'courses': courses})


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
