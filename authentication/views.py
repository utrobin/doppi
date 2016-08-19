# -*- coding: utf-8 -*-

from django.shortcuts import render
from django.contrib import auth
from django.db import transaction
from django.forms.models import model_to_dict
from authentication.forms import SignupForm, UserProfileSignupForm, LoginForm, ProfileEditForm, ParentForm, CompanyForm, \
    ChildForm
from authentication.models import UserInfo, UserProfile, Child, test, Question, Answer
from django.http.response import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

import json


def signin(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/')

    args = {}
    args['form'] = LoginForm()
    if request.POST:
        newuser_form = LoginForm(request.POST)
        if newuser_form.is_valid():
            auth.login(request, newuser_form.cleaned_data['user'])
            return HttpResponseRedirect('/')
        else:
            args['form'] = newuser_form
    return render(request, 'login.html', args)


def logout(request):
    redirect = request.GET.get('continue', '/')
    auth.logout(request)
    return HttpResponseRedirect(redirect)


def signup(request):
    signup_form = SignupForm(request.POST or None)
    user_profile_signup_form = UserProfileSignupForm(request.POST or None, request.FILES or None)

    if request.method == 'POST':
        if signup_form.is_valid() and user_profile_signup_form.is_valid():
            with transaction.atomic():
                user = signup_form.save(commit=False)
                user.username = user.email
                user.save()
                user_profile = user_profile_signup_form.save(commit=False)
                user_profile.user = user
                ui = UserInfo()
                ui.save()
                user_profile.info = ui
                user_profile.save()
                user = auth.authenticate(username=signup_form.cleaned_data['email'],
                                         password=signup_form.cleaned_data['password1'])
                auth.login(request, user)
                return HttpResponseRedirect('/')

    context = {
        'signup_form': signup_form,
        'user_profile_signup_form': user_profile_signup_form,
        'title': 'Signup'
    }
    return render(request, 'signup.html', context)

@login_required(login_url='/authentication/signin/')
def profile_edit(request):
    profile = UserProfile.objects.get(user=request.user)
    if request.method == "POST":

        if profile.user_type == 'PA':
            form_info = ParentForm(request.POST, instance=profile.info)
        elif profile.user_type == 'CO':
            form_info = CompanyForm(request.POST, instance=profile.info)
        else:
            form_info = ParentForm(request.POST, instance=profile.info)

        if form_info.is_valid():
            form_info.save()
            return HttpResponseRedirect('/')
    else:
        if profile.user_type == 'PA':
            form_info = ParentForm(instance=profile.info)
        elif profile.user_type == 'CO':
            form_info = CompanyForm(instance=profile.info)
        else:
            form_info = ParentForm(instance=profile.info)

    return render(request, 'profile_edit.html', {
        'form_info': form_info,
        'u': request.user,
    })


def add_child(request):
    if request.method == 'POST':
        form = ChildForm(request.POST)
        if form.is_valid():
            child = form.save(commit=False)
            child.parent = UserProfile.objects.get(user=request.user)
            child.save()
            return HttpResponseRedirect('/')
    else:
        form = ChildForm()
    return render(request, 'add_child.html', {'form': form})


def edit_child(request, child_id):
    child = Child.objects.get(id=child_id)
    if request.method == 'POST':
        form = ChildForm(request.POST, instance=child)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/')
    else:
        form = ChildForm(instance=child)
    return render(request, 'edit_child.html', {'form': form, 'child': child})

@login_required(login_url='/authentication/signin/')
def settings(request):
    profile = UserProfile.objects.get(user=request.user)
    form = ProfileEditForm()
    form_profile = UserProfileSignupForm(instance=profile)

    if request.method == "POST":
        form = ProfileEditForm(request.POST)
        form_profile = UserProfileSignupForm(request.POST)
        if form.is_valid() and form_profile.is_valid():
            form.save(request.user)
            form_profile.save()
            return HttpResponseRedirect('/')

    return render(request, 'settings.html', {
        'form': form,
        'form_profile': form_profile,
        'u': request.user,
        'title': 'Именить профиль'
    })


@login_required(login_url='/authentication/signin/')
def single_test(request, test_id):
    t = test.objects.get(id=test_id)
    return render(request, 'test/test.html', {'test': t})


def get_questions_test(request):
    test_id = request.GET['test_id']
    data = []
    for qt in Question.objects.filter(question__id=test_id).order_by('id'):
        answers = []
        for a in Answer.objects.filter(question__id=qt.id):
            answers.append({
                'id': a.id,
                'answer': a.answer
            })

        data.append({
            'id': qt.id,
            'question': qt.text,
            'several': qt.several,
            'answers': answers,
            'answered': False,
        })

    return HttpResponse(json.dumps(data), content_type="application/json")


def save_test(request):
    profile = UserProfile.objects.get(user=request.user)
    data = request.GET['data']
    profile.results = data
    profile.save()

    return HttpResponse(json.dumps(data), content_type="application/json")