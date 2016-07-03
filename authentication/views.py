# -*- coding: utf-8 -*-

from django.shortcuts import render
from django.contrib import auth
from django.db import transaction
from django.http import HttpResponseRedirect
from django.forms.models import model_to_dict
from authentication.forms import SignupForm, UserProfileSignupForm, LoginForm, ProfileEditForm


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
                user = signup_form.save()
                user_profile = user_profile_signup_form.save(commit=False)
                user_profile.user = user
                user_profile.save()
                user = auth.authenticate(username=signup_form.cleaned_data['username'], password=signup_form.cleaned_data['password1'])
                auth.login(request, user)
                return HttpResponseRedirect('/')

    context = {
        'signup_form': signup_form,
        'user_profile_signup_form': user_profile_signup_form,
        'title': 'Signup'
    }
    return render(request, 'signup.html', context)

def profile_edit(request):
    if request.method == "POST":
        form = ProfileEditForm(request.POST, request.FILES)
        if form.is_valid():
            form.save(request.user)
            return HttpResponseRedirect('/')
    else:
        u = model_to_dict(request.user)
        up = request.user.userprofile
        u['info'] = up.info
        form = ProfileEditForm(u)

    return render(request, 'profile_edit.html', {
            'form': form,
            'u': request.user,
            'title': 'Именить профиль'
        })