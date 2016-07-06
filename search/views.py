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
    if len(request.GET) != 0:
        form = SearchBarForm(request.GET)
        # Сортируем по названию
        courses = Course.objects.all().filter(title__icontains=request.GET['query'])
        # Сортируем по остальным настройкам
        if 'age_from' in request.GET:
            courses = courses.filter(info__age_from__gte=request.GET['age_from'])
        if 'age_to' in request.GET:
            courses = courses.filter(info__age_from__lte=request.GET['age_to'])
        if 'activity' in request.GET:
            courses = courses.filter(info__activity__in=request.GET.getlist('activity'))
        if 'is_indoors' in request.GET:
            courses = courses.filter(info__is_indoors=request.GET['is_indoors'])
        if 'location' in request.GET:
            courses = courses.filter(info__location__icontains=request.GET['location'])
        if 'price' in request.GET and request.GET['price'] != '0':
            courses = courses.filter(info__price__lte=request.GET['price'])
        if 'length' in request.GET and request.GET['length'] != '0':
            courses = courses.filter(info__length__lte=request.GET['length'])
        if 'frequency' in request.GET and request.GET['frequency'] != '0':
            courses = courses.filter(info__frequency__lte=request.GET['frequency'])

    else:
        form = SearchBarForm()
        courses = Course.objects.all()
    return render(request, 'searchbar.html', {'form': form, 'courses': courses})


def single_course(request, course_id):
    course = Course.objects.get(id=course_id)
    comments = Comment.objects.filter(course=course)

    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.course = course
            comment.author = request.user
            comment.save()
            return HttpResponseRedirect('/course/' + str(course_id))
    form = CommentForm()

    return render(request, 'course_page.html', {'course': course, 'comments': comments, 'form': form})


@login_required(login_url='/authentication/signin/')
def add_course(request):
    if request.method == 'POST':
        form = CourseForm(request.POST, request.FILES)
        form_info = CourseInfoForm(request.POST)
        if form.is_valid() and form_info.is_valid():
            course = form.save(commit=False)
            info = form_info.save()
            course.info = info
            course.author = request.user
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
    data = json.loads(
        serializers.serialize('json', Comment.objects.filter(course__pk=course_id).order_by('added_at'),
                              fields=('author', 'text', 'added_at'),
                              use_natural_foreign_keys=True, ))

    for item in data:
        item['pic'] = UserProfile.objects.get(user=Comment.objects.get(id=item['pk']).author).avatar.url

    return HttpResponse(json.dumps(data), content_type="application/json")


@login_required(login_url='/authentication/signin/')
def delete_comment(request):
    comment = Comment.objects.get(id=request.POST['comment_id'])
    if comment.author == request.user:
        comment.delete()
        pusher_client.trigger('comments', 'new_comment', {})
    return HttpResponse({}, content_type="application/json")


@login_required(login_url='/authentication/signin/')
def post_comment(request):
    course_id = request.POST['course_id']
    comment = Comment(author=request.user, course=Course.objects.get(id=course_id), text=request.POST['text'])
    comment.save()
    pusher_client.trigger('comments', 'new_comment', {})
    return HttpResponse({}, content_type="application/json")


def pinki(request):
    return render(request, 'pinki_drag.html')
