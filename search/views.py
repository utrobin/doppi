# -*- coding: utf-8 -*-
from django.shortcuts import render
from search.forms import SearchBarForm, CommentForm, CourseForm, CourseInfoForm
from authentication.models import UserProfile
from search.models import *
from authentication.models import test, Results
from django.http.response import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.db.models import Q
import random
import operator
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


def fish(request):
    return render(request, 'fish.html')


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


def mk_level(level):
    if len(level) != 0:
        return [level]
    else:
        return [1, 2, 3]


def main(request):
    completedProfile = True
    completedTests = True

    if request.user.is_authenticated():
        profile = UserProfile.objects.get(user=request.user)

        if profile.user_type == 'PA' or profile.user_type == 'CH':
            if profile.info.age == 0:
                completedProfile = False

            for t in test.objects.all():
                try:
                    Results.objects.get(results=request.user, idTest=t.id)
                except:
                    completedTests = False
                    break
                else:
                    completedTests = True


    return render(request, 'main.html', {
        'profile': completedProfile,
        'tests': completedTests
    })


def selection_courses(request):
    return render(request, 'selection_courses.html', )

def get_courses(request):
    data = []
    options = json.loads(request.GET['options'])
    page = int(request.GET['page'])
    for course in Course.objects.filter(
        Q(description__icontains=(options['query'])) | Q(title__icontains=options['query']),
        Q(price__gte=mk_int(options['priceFrom'], False)),
        Q(info__activity__title__in=mk_checkboxes(options['checkboxes'])),
        Q(price__lte=mk_int(options['priceTo'], True)),
        Q(info__age_to__lte=mk_int(options['ageTo'], True)),
        Q(info__level__in=mk_level(options['level'])),
        Q(moderation=True)
    ).order_by(options['sortValue']).distinct()[page * 9:(page + 1) * 9]:
        data.append({'id': course.id,
                     'author': course.author.user.username,
                     'title': course.title,
                     'introtext': course.description[:200].replace('<br>', ' ') + '...' if len(course.description) > 200 else course.description,
                     'pic': course.pic.url,
                     'age_from': course.info.age_from,
                     'age_to': course.info.age_to,
                     'time_from': course.info.time_from,
                     'activity': course.info.activity.title if course.info.activity else 'fgfjhgifh',
                     'time_to': course.info.time_to,
                     'location': course.location.title if course.location else '',
                     'price': course.price,
                     'frequency': course.info.frequency,
                     'is_authenticated': True if request.user.is_authenticated() else False,
                     'rating': course.rating,
                     'liked': False if not request.user.is_authenticated() or len(Like.objects.filter(user = UserProfile.objects.get(user = request.user)).filter(course=course).filter(is_liked=True)) == 0 else True})

    return HttpResponse(json.dumps(data), content_type="application/json")


@login_required()
def do_like(request):
    course = Course.objects.get(id = request.GET['course_id'])
    likes = Like.objects.filter(user = UserProfile.objects.get(user = request.user)).filter(course = course)
    if len(likes) != 0:
        likes[0].is_liked = not likes[0].is_liked
        likes[0].save()
        course.rating = course.rating + 1  if likes[0].is_liked else course.rating - 1
        course.save()

    else:
        l = Like(course = course, user = UserProfile.objects.get(user = request.user), is_liked=True)
        l.save()
        course.rating += 1
        course.save()

    return HttpResponse(json.dumps({}), content_type="application/json")


def get_courses_map(request):
    coordinates = json.loads(request.GET['coordinates'])
    options = json.loads(request.GET['options'])
    data = {}
    data['features'] = []
    data['type'] = 'FeatureCollection'
    i = 0
    for course in Course.objects.filter(
            Q(info__coordinate_x__gte = coordinates[0][0]),
            Q(info__coordinate_x__lte = coordinates[1][0]),
            Q(info__coordinate_y__gte = coordinates[0][1]),
            Q(info__coordinate_y__lte = coordinates[1][1]),

            Q(description__icontains=(options['query'])) | Q(title__icontains=options['query']),
            Q(price__gte=mk_int(options['priceFrom'], False)),
            Q(info__activity__title__in=mk_checkboxes(options['checkboxes'])),
            Q(price__lte=mk_int(options['priceTo'], True)),
            Q(info__level__in=mk_level(options['level'])),
            Q(info__age_to__lte=mk_int(options['ageTo'], True))
    ):
        data['features'].append({'type': 'Feature', 'id': course.id, 'geometry':
            {'type': 'Point', 'coordinates': [course.info.coordinate_x,course.info.coordinate_y]},
                                 'properties': {'balloonContent': "<a href='http://doppi.info/course/" + str(
                                     course.id) + "'>" + course.title + "</a>", 'clusterCaption': course.title,
                                                'hintContent': course.title}})
        i += 1

    return HttpResponse(json.dumps(data), content_type="application/json")


def get_activity(request):
    data = []
    for cluster in CourseCluster.objects.all():
        data.append({'id': cluster.id, 'title': cluster.title,
                     'content': [{'id': course.id, 'title': course.title} for course in
                                 CourseType.objects.filter(cluster=cluster)]})

    return HttpResponse(json.dumps(data), content_type="application/json")


def searchbar(request):
    completedProfile = True
    completedTests = True

    if request.user.is_authenticated():
        profile = UserProfile.objects.get(user=request.user)

        if profile.user_type == 'PA' or profile.user_type == 'CH':
            if profile.info.age == 0:
                completedProfile = False

            for t in test.objects.all():
                try:
                    Results.objects.get(results=request.user, idTest=t.id)
                except:
                    completedTests = False
                    break
                else:
                    completedTests = True


    return render(request, 'pinki_drag.html', {
        'profile': completedProfile,
        'tests': completedTests
    })


def get_recommend_courses(request):
    data = []
    page = int(request.GET['page'])
    mount = int(request.GET['mount'])
    for course in Course.objects.all()[page * 3:page * 3 + mount]:
        data.append({'id': course.id, 'author': course.author.user.username, 'title': course.title,
                     'introtext': course.introtext, 'pic': course.pic.url,
                     'age_from': course.info.age_from, 'age_to': course.info.age_to,
                     'time_from': course.info.time_from, 'time_to': course.info.time_to,
                     'activity': course.info.activity.title,
                     'location': course.location.title if course.location else '',
                     'price': course.price, 'frequency': course.info.frequency,
                     'is_authenticated': True if request.user.is_authenticated() else False,
                     'rating': course.rating,
                     'liked': False if not request.user.is_authenticated() or len(Like.objects.filter(user=UserProfile.objects.get(user=request.user)).filter(course=course).filter(is_liked=True)) == 0 else True})

    return HttpResponse(json.dumps(data), content_type="application/json")

def get_raiting(request):
    data = []
    course = Course.objects.get(id = request.GET['course_id'])

    data.append({'is_authenticated': True if request.user.is_authenticated() else False,
                 'rating': course.rating,
                 'liked': False if not request.user.is_authenticated() or len(Like.objects.filter(user=UserProfile.objects.get(user=request.user)).filter(course=course).filter(is_liked=True)) == 0 else True})
    return HttpResponse(json.dumps(data), content_type="application/json")


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
        return render(request, 'pinki_drag.html')
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
    return render(request, 'pinki_drag.html')


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

def damn(x):
    return {
            '1': 'ЧХО',
            '2': 'ЧП',
            '3': 'ЧХО',
            '4': 'ЧЗ',
            '5': 'ЧХО',
            '6': 'ЧЧ',
            '7': 'ЧХО',
            '8': 'ЧТ',
            '9': 'ЧХО',
            '10': 'ЧС',
            '11': 'ЧП',
            '12': 'ЧЗ',
            '13': 'ЧП',
            '14': 'ЧЧ',
            '15': 'ЧП',
            '16': 'ЧТ',
            '17': 'ЧП',
            '18': 'ЧС',
            '19': 'ЧЗ',
            '20': 'ЧЧ',
            '21': 'ЧЗ',
            '22': 'ЧТ',
            '23': 'ЧЗ',
            '24': 'ЧС',
            '25': 'ЧЧ',
            '26': 'ЧТ',
            '27': 'ЧЧ',
            '28': 'ЧС',
            '29': 'ЧС',
            '30': 'ЧТ',
    }[x]

def get_types(t):
    if t == 'ЧХО':
        return ['Художественное слово', 'Актерское мастерство', 'Фото']
    if t == 'ЧП':
        return ['Футбол', 'Теннис', 'Бассейн', 'Легкая атлетика', 'Фото']
    if t == 'ЧТ':
        return ['Вождение', 'Английский', 'Гитара']
    if t == 'ЧС':
        return ['Бассейн', 'Борьба', 'Футбол', 'Теннис', 'Хоккей', 'Бассейн', 'Легкая атлетика']
    if t == 'ЧЧ':
        return ['Английский', 'Немецкий', 'Французский', 'Испанский', 'Психология']
    if t == 'ЧЗ':
        return ['Cовременные', 'Вокал', 'Актерское мастерство', 'Художественное слово', 'Гитара' ]

def test_to_ctype(request):
    test = json.loads(request.GET['data'])
    print(test)
    damns = {'ЧХО': 0, 'ЧП': 0, 'ЧТ': 0, 'ЧС': 0, 'ЧЧ': 0, 'ЧЗ': 0}
    ids = []
    sick_types = []
    res = {'amount': 0, 'data': []}

    for k in test:
        if test[k] == 'true':
            ids.append(int(k[2:])-108)
    for a in ids:
        damns[damn(str(a))] += 1

    sick_types = get_types(max(damns.keys(), key=(lambda k: damns[k])))
    sick_courses = Course.objects.filter(
            Q(info__activity__title__in=sick_types),
            Q(info__age_to__gte=mk_int(test['age'], False)),
            Q(info__age_from__lte=mk_int(test['age'], True)),
            Q(moderation=True)
            ).distinct()
    res['amount'] = len(sick_courses)
    for course in sick_courses[:6]:
        res['data'].append({'id': course.id,
                     'author': course.author.user.username,
                     'title': course.title,
                     'introtext': course.description[:200].replace('<br>', ' ') + '...' if len(course.description) > 200 else course.description,
                     'pic': course.pic.url,
                     'age_from': course.info.age_from,
                     'age_to': course.info.age_to,
                     'time_from': course.info.time_from,
                     'activity': course.info.activity.title if course.info.activity else 'fgfjhgifh',
                     'time_to': course.info.time_to,
                     'location': course.location.title if course.location else '',
                     'price': course.price,
                     'frequency': course.info.frequency,
                     'is_authenticated': True if request.user.is_authenticated() else False,
                     'rating': course.rating,
                     'liked': False if not request.user.is_authenticated() or len(Like.objects.filter(user = UserProfile.objects.get(user = request.user)).filter(course=course).filter(is_liked=True)) == 0 else True})
    print(res)

    return HttpResponse(json.dumps(res), content_type="application/json")


