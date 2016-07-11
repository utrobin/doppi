# -*- coding: utf-8 -*-
from django import forms
from search.models import CourseInfo, Course, Comment
from django.forms.widgets import CheckboxSelectMultiple, Textarea, TextInput, NumberInput, CheckboxInput, RadioSelect, \
    Select
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
    # location = forms.CharField(widget=TextInput(attrs={'class': 'form-control', 'placeholder': u'Адрес',}),
    #                            label=u'Местоположение', required=False)

    class Meta:
        model = CourseInfo
        fields = ['age_from', 'age_to', 'activity', 'location',
                                                    'price', 'frequency']
        widgets = {
            'age_from': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Минимальный возраст',}),
            'age_to': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Максимальный возраст',}),
            'activity': CheckboxSelectMultiple(attrs={'class': ['form-control', 'radio-inline']}),
            'location': Select(attrs={'class': 'form-control'}),
            'price': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Цена',}),
            'frequency': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Частота',}),
        }
        labels = {
            'age_from': u'Минимальный возраст',
            'age_to': u'Максимальный возраст',
            'location': u'Ближайшая станция метро',
            'activity': u'Тематика',
            'price': u'Цена',
            'frequency': u'Количество занятий в неделю',
        }
