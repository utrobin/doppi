# -*- coding: utf-8 -*-
from django import forms
from django.forms import NumberInput, CheckboxSelectMultiple, TextInput, Textarea, HiddenInput, RadioSelect
from search.models import CourseInfo, Course, Comment
from django.contrib.auth.models import User
from django.contrib.flatpages.models import FlatPage
from tinymce.widgets import TinyMCE



class SearchBarForm(forms.ModelForm):
    query = forms.CharField(max_length=50)

    class Meta:
        model = CourseInfo
        fields = ['age_from', 'age_to',
                  'price', 'frequency']



class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text']


class CourseForm(forms.ModelForm):
    description = forms.CharField(
        widget=TinyMCE(
            attrs={'cols': 10, 'rows': 10, 'id': 'TinyMCE', 'class': 'TinyMCE'}
        ),
        label=u'Описание'
    )
    introtext = forms.CharField(
        widget=Textarea(
            attrs={'class': 'introtext', 'placeholder': u'Краткое описание',}
        ),
        label=u'Краткое описание'
    )
    pic = forms.FileField(
        widget=forms.FileInput(
            attrs={'class': 'ask-signup-avatar-input', 'data-filename-placement': 'inside'}
        ),
        required=False,
        label=u'Картинка'
    )

    class Meta:
        model = Course
        fields = ['title', 'introtext', 'description', 'pic']
        widgets = {
            'title': Textarea(attrs={'class': 'title', 'placeholder': u'Название',}),
        }
        labels = {
            'title': u'Название',
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
    price = forms.IntegerField(
        widget=NumberInput(
            attrs={'class': 'form-control'}
        ),
        required=False,
        label=u'Цена'
    )


    class Meta:
        model = CourseInfo
        fields = ['age_from', 'age_to', 'activity', 'price', 'frequency', 'coordinate_x', 'coordinate_y']
        widgets = {
            'age_from': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Минимальный возраст',}),
            'age_to': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Максимальный возраст',}),
            'activity': HiddenInput(),
            'frequency': NumberInput(attrs={'class': 'form-control', 'placeholder': u'Частота',}),
            'coordinate_x': HiddenInput(attrs={'id': 'coordinate_x'}),
            'coordinate_y': HiddenInput(attrs={'id': 'coordinate_y'}),
        }
        labels = {
            'age_from': u'Минимальный возраст',
            'age_to': u'Максимальный возраст',
            'activity': '',
            'frequency': u'Количество занятий в неделю',
            'coordinate_x': '',
            'coordinate_y': '',
        }



