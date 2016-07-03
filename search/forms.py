# -*- coding: utf-8 -*-
from django import forms
from search.models import CourseInfo, Course, Comment
from django.forms.widgets import CheckboxSelectMultiple, Textarea
from django.contrib.auth.models import User


class SearchBarForm(forms.ModelForm):
    query = forms.CharField(max_length=50)

    class Meta:
        model = CourseInfo
        fields = ['age_from', 'age_to', 'is_indoors', 'activity',
                  'location', 'price', 'length', 'frequency']
        widgets = {
            'activity': CheckboxSelectMultiple(),
        }


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text']


class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = ['title', 'description', 'phone_number']


class CourseInfoForm(forms.ModelForm):
    class Meta:
        model = CourseInfo
        fields = ['age_from', 'age_to', 'is_indoors', 'activity',
                  'location', 'price', 'length', 'frequency']
