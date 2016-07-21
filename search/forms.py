# -*- coding: utf-8 -*-
from django import forms
from django.forms import NumberInput, CheckboxSelectMultiple, TextInput, Textarea, HiddenInput, RadioSelect

from search.models import CourseInfo, Course, Comment
from django.contrib.auth.models import User


class SearchBarForm(forms.ModelForm):
    query = forms.CharField(max_length=50)

    class Meta:
        model = CourseInfo
        fields = ['age_from', 'age_to', 'activity',
                  'price', 'frequency']
        widgets = {
            'activity': CheckboxSelectMultiple(),
        }


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text']


class CourseForm(forms.ModelForm):
    pic = forms.FileField(
        widget=forms.ClearableFileInput(
            attrs={'class': 'ask-signup-avatar-input', 'data-filename-placement': 'inside'}),
        required=False, label=u'Картинка'
    )

    class Meta:
        model = Course
        fields = ['title', 'description', 'pic']
        widgets = {
            'title': TextInput(attrs={'class': 'form-control', 'placeholder': u'Название',}),
            'description': Textarea(attrs={'class': 'form-control', 'placeholder': u'Описание',}),
        }
        labels = {
            'title': u'Название',
            'description': u'Описание',
        }

    def save(self, commit=True):
        instance = super(CourseForm, self).save(commit=False)
        if self.cleaned_data.get('pic') is not None:
            instance.pic = self.cleaned_data.get('pic')
            # instance.pic.save('%s_%s' % (instance.author.username, instance.pic.name), instance.pic, save=True)
        if commit:
            instance.save()
        return instance


class CourseInfoForm(forms.ModelForm):

    class Meta:
        model = CourseInfo
        fields = ['age_from', 'age_to', 'activity', 'location',
                                                    'price', 'frequency', 'level', 'skill']
        widgets = {
            'age_from': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Минимальный возраст',}),
            'age_to': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Максимальный возраст',}),
            'activity': CheckboxSelectMultiple(attrs={'class': ['form-control', 'radio-inline']}),
            'location': CheckboxSelectMultiple(attrs={'class': ['form-control', 'radio-inline']}),
            'price': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Цена',}),
            'frequency': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Частота',}),
            'level': RadioSelect(attrs={'class': ['form-control', 'radio-inline']}),
            'skill': CheckboxSelectMultiple(attrs={'class': ['form-control', 'radio-inline']}),
        }
        labels = {
            'age_from': u'Минимальный возраст',
            'age_to': u'Максимальный возраст',
            'activity': u'Тематика',
            'price': u'Цена',
            'frequency': u'Количество занятий в неделю',
            'level': u'Уровень подготовки',
            'skill': u'Развиваемые навыки',
        }


