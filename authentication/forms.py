# -*- coding: utf-8 -*-

from django.contrib.auth import authenticate
from django import forms


class LoginForm(forms.Form):
    login = forms.CharField(
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Email address', }),
        max_length=30, label='Логин'
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password', })
        , label='Пароль'
    )

    def clean(self):
        data = self.cleaned_data
        user = authenticate(username=data.get('login', ''), password=data.get('password', ''))

        if user is not None:
            if user.is_active:
                data['user'] = user
            else:
                raise forms.ValidationError('Данный пользователь не активен')
        else:
            raise forms.ValidationError("Указан неверный логин или пароль")
