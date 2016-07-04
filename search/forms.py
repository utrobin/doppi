# -*- coding: utf-8 -*-
from django import forms
from search.models import CourseInfo, Course, Comment
from django.forms.widgets import CheckboxSelectMultiple, Textarea, TextInput, NumberInput, CheckboxInput, RadioSelect
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
    pic = forms.FileField(
        widget=forms.ClearableFileInput(
            attrs={'class': 'ask-signup-avatar-input', 'data-filename-placement': 'inside'}),
        required=False, label=u'Картинка'
    )

    class Meta:
        model = Course
        fields = ['title', 'description', 'phone_number', 'pic']
        widgets = {
            'title': TextInput(attrs={'class': 'form-control', 'placeholder': u'Название',}),
            'description': Textarea(attrs={'class': 'form-control', 'placeholder': u'Описание',}),
            'phone_number': TextInput(attrs={'class': 'form-control', 'placeholder': u'Телефон',}),
        }
        labels = {
            'title': u'Название',
            'description': u'Описание',
            'phone_number': u'Номер телефона',
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
    location = forms.CharField(widget=TextInput(attrs={'class': 'form-control', 'placeholder': u'Адрес',}),
                               label=u'Местоположение', required=False)

    class Meta:
        model = CourseInfo
        fields = ['age_from', 'age_to', 'is_indoors', 'activity',
                  'location', 'price', 'length', 'frequency']
        widgets = {
            'age_from': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Минимальный возраст',}),
            'age_to': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Максимальный возраст',}),
            'is_indoors': CheckboxInput(attrs={'class': ['form-control', 'checkbox-inline'],}),
            'activity': RadioSelect(attrs={'class': ['form-control', 'radio-inline']}),
            'price': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Цена',}),
            'length': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Длительность',}),
            'frequency': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Частота',}),
        }
        labels = {
            'age_from': u'Минимальный возраст',
            'age_to': u'Максимальный возраст',
            'is_indoors': u'В помещении',
            'activity': u'Тематика',
            'price': u'Цена',
            'length': u'Длительность в днях',
            'frequency': u'Количество занятий в неделю',
        }
