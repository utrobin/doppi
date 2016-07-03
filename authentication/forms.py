# -*- coding: utf-8 -*-

from django.contrib.auth import authenticate
from django import forms
from django.contrib.auth.forms import UserCreationForm
from authentication.models import UserProfile
from django.contrib.auth.models import User

class LoginForm(forms.Form):
    login = forms.CharField(
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Login', }),
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


class SignupForm(UserCreationForm):

    username = forms.CharField(
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nickname', }),
        max_length=30, label=u'Логин'
    )
    email = forms.EmailField(
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ваша почта', }),
        max_length=254, label=u'E-mail',
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': '*******'}),
        min_length=6, label=u'Пароль'
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': '*******'}),
        min_length=6, label=u'Повторите пароль'
    )

    class Meta:
        model = User
        fields = ('username', 'email')


class UserProfileSignupForm(forms.ModelForm):

    info = forms.CharField(
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Пара слов о себе',}),
        required=False, label='Пара слов о себе'
    )
    avatar = forms.ImageField(
        widget=forms.ClearableFileInput(attrs={'class': 'ask-signup-avatar-input', 'data-filename-placement': 'inside',}),
        required=False, label='Аватар'
    )

    def clean_avatar(self):
        avatar = self.cleaned_data.get('avatar')
        if avatar is None:
            raise forms.ValidationError('Добавьте картинку')
        if 'image' not in avatar.content_type:
            raise forms.ValidationError('Неверный формат картинки')
        return avatar

    class Meta:
        model = UserProfile
        fields = ('info', 'avatar')


class UserProfileSignupForm(forms.ModelForm):

    info = forms.CharField(
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Пара слов о себе',}),
        required=False, label='Пара слов о себе'
    )
    avatar = forms.ImageField(
        widget=forms.ClearableFileInput(attrs={'class': 'ask-signup-avatar-input', 'data-filename-placement': 'inside'}),
        required=False, label='Аватар'
    )

    def clean_avatar(self):
        avatar = self.cleaned_data.get('avatar')
        if avatar is None:
            raise forms.ValidationError('Добавьте картинку')
        if 'image' not in avatar.content_type:
            raise forms.ValidationError('Неверный формат картинки')
        return avatar

    class Meta:
        model = UserProfile
        fields = ('info', 'avatar')


class ProfileEditForm(forms.Form):
    first_name = forms.CharField(
            widget=forms.TextInput( attrs={ 'class': 'form-control', 'placeholder': 'Иван', }),
            max_length=30, label=u'Имя', required=False
            )
    last_name = forms.CharField(
            widget=forms.TextInput( attrs={ 'class': 'form-control', 'placeholder': 'Иванов', }),
            max_length=30, label=u'Фамилия', required=False
            )
    email = forms.EmailField(
            widget=forms.TextInput( attrs={ 'class': 'form-control', 'placeholder': 'me@gmail.com', }),
            max_length=254, label=u'E-mail'
            )
    password1 = forms.CharField(
            widget=forms.PasswordInput( attrs={ 'class': 'form-control', 'placeholder': '*****' }),
            min_length=6, label=u'Пароль', required=False
            )
    password2 = forms.CharField(
            widget=forms.PasswordInput( attrs={ 'class': 'form-control', 'placeholder': '*****' }),
            min_length=6, label=u'Повторите пароль', required=False
            )
    info = forms.CharField(
            widget=forms.TextInput( attrs={ 'class': 'form-control', 'placeholder': 'Молод и горяч', }),
            required=False, label=u'Пара слов о себе'
            )
    avatar = forms.FileField(
            widget=forms.ClearableFileInput( attrs={ 'class': 'ask-signup-avatar-input', 'data-filename-placement': 'inside'}),
            required=False, label=u'Аватар'
            )

    def clean_password2(self):
        pass1 = self.cleaned_data.get('password1', '')
        pass2 = self.cleaned_data.get('password2', '')

        if pass1 != pass2:
            raise forms.ValidationError(u'Пароли не совпадают')

    def save(self, user):
        data = self.cleaned_data
        user.first_name = data.get('first_name')
        user.last_name = data.get('last_name')
        user.email = data.get('email')

        pass1 = self.cleaned_data.get('password1', '')
        if pass1 != '':
            user.set_password(pass1)

        user.save()

        up = user.userprofile
        up.info = data.get('info')

        if data.get('avatar') is not None:
            avatar = data.get('avatar')
            up.avatar.save('%s_%s' % (user.username, avatar.name), avatar, save=True)

        up.save()

        return self