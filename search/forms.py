# -*- coding: utf-8 -*-
from django import forms
from search.models import CourseInfo, Course

class SearchBarForm(forms.Form):
    OTHER = 'OR'
    LANGUAGE = 'LN'
    SPORTS = 'SP'
    ART = 'AR'
    EDUCATION = 'ED'
    ENTERTAINMENT = 'ET'
    COURSE_ACTIVITIES = (
        (OTHER, u'Другое'),
        (LANGUAGE, u'Иностранные языки'),
        (SPORTS, u'Спорт'),
        (ART, u'Искусство'),
        (EDUCATION, u'Образование'),
        (ENTERTAINMENT, u'Развлечения'),
    )
    query = forms.CharField(max_length=50)
    # Возраст (может быть несолько одновременно)
    is_0_3_age = forms.BooleanField()
    is_4_6_age = forms.BooleanField()
    is_7_11_age = forms.BooleanField()
    is_12_15_age = forms.BooleanField()
    is_16_18_age = forms.BooleanField()
    # Вид курса
    activity = forms.MultipleChoiceField(choices=COURSE_ACTIVITIES)
    # На улице или в здании
    is_indoors = forms.BooleanField()
    # Местоположение
    location = forms.CharField(max_length=50)
    # Цена
    price = forms.DecimalField(min_value=0, max_value=100000)
    # Длительность в днях
    length = forms.DecimalField(min_value=1, max_value=1000)
    # Частота занятий в днях недели
    frequency = forms.DecimalField(min_value=1, max_value=7)
