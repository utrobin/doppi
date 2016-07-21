# -*- coding: utf-8 -*-

from django.contrib.auth import authenticate
from django import forms
from django.contrib.auth.forms import UserCreationForm
from authentication.models import UserProfile, UserInfo, Child
from django.contrib.auth.models import User
from django.forms.widgets import CheckboxInput, RadioSelect, TextInput, PasswordInput, CheckboxSelectMultiple, \
    NumberInput, EmailInput, HiddenInput


class LoginForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('username', 'password')
        widgets = {
            'username': TextInput(attrs={'class': 'form-control', 'placeholder': 'email',}),
            'password': PasswordInput(attrs={'class': 'form-control', 'placeholder': '*********',}),
        }
        labels = {
            'username': 'Адрес email',
            'password': 'Пароль',
        }

    def clean(self):
        data = self.cleaned_data
        user = authenticate(username=data.get('username', ''), password=data.get('password', ''))

        if user is not None:
            if user.is_active:
                data['user'] = user
            else:
                raise forms.ValidationError('Данный пользователь не активен')
        else:
            raise forms.ValidationError("Указан неверный логин или пароль")


class SignupForm(UserCreationForm):
    username = forms.CharField(required=False, label='', widget=HiddenInput())
    email = forms.EmailField(
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ваша почта',}),
        max_length=254, label=u'Адрес email',
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': '*******'}),
        min_length=6, label=u'Пароль'
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': '*******'}),
        min_length=6, label=u'Повторите пароль'
    )

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if len(User.objects.filter(email=email)) != 0:
            raise forms.ValidationError('Пользователь с таким email уже зарегистрирован')
        return email

    class Meta:
        model = User
        fields = ('username', 'email',)


class UserProfileSignupForm(forms.ModelForm):
    avatar = forms.ImageField(
        widget=forms.ClearableFileInput(
            attrs={'class': 'ask-signup-avatar-input', 'data-filename-placement': 'inside',}),
        required=False, label='Аватар'
    )

    class Meta:
        model = UserProfile
        fields = ('user_type', 'avatar', 'subscribed',)
        widgets = {
            'subscribed': CheckboxInput(attrs={'class': ['form-control', 'checkbox-inline']}),
                    'user_type': RadioSelect(attrs={'class': ['form-control', 'radio-inline']}),
        }
        labels = {
            'subscribed': 'Получать уведомления на электронную почту',
            'user_type': 'Кто вы?',
        }

    def save(self, commit=True):
        instance = super(UserProfileSignupForm, self).save(commit=False)
        if self.cleaned_data.get('avatar') is not None:
            instance.pic = self.cleaned_data.get('pic')
            # instance.pic.save('%s_%s' % (instance.author.username, instance.pic.name), instance.pic, save=True)
        if commit:
            instance.save()
        return instance


class ProfileEditForm(forms.Form):
    email = forms.EmailField(
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'me@gmail.com',}),
        max_length=254, label=u'E-mail', required=False
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': '*****'}),
        min_length=6, label=u'Пароль', required=False
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': '*****'}),
        min_length=6, label=u'Повторите пароль', required=False
    )

    def clean_password2(self):
        pass1 = self.cleaned_data.get('password1', '')
        pass2 = self.cleaned_data.get('password2', '')

        if pass1 != pass2:
            raise forms.ValidationError(u'Пароли не совпадают')

    def save(self, user):
        data = self.cleaned_data
        user.name = user.email = data.get('email')

        pass1 = self.cleaned_data.get('password1', '')
        if pass1 != '':
            user.set_password(pass1)

        user.save()
        return self


class ParentForm(forms.ModelForm):
    class Meta:
        model = UserInfo
        fields = ['name', 'phone_number', 'is_payable', ]
        widgets = {
            'name': TextInput(attrs={'class': 'form-control', 'placeholder': 'ФИО'}),
            'phone_number': TextInput(attrs={'class': 'form-control', 'placeholder': 'Телефон'}),
            'is_payable': CheckboxInput(attrs={'class': ['form-control', 'checkbox-inline']}),
        }
        labels = {
            'name': 'ФИО',
            'phone_number': 'Номер телефона',
            'is_payable': 'Хотели бы вы воспользоваться платными услугами психологов?',
        }


class CompanyForm(forms.ModelForm):
    class Meta:
        model = UserInfo
        fields = ['title', 'phone_number', 'is_photo', 'is_notify', 'activity']
        widgets = {
            'title': TextInput(attrs={'class': 'form-control', 'placeholder': 'ФИО'}),
            'phone_number': TextInput(attrs={'class': 'form-control', 'placeholder': 'Телефон'}),
            'is_photo': CheckboxInput(attrs={'class': ['form-control', 'checkbox-inline']}),
            'is_notify': CheckboxInput(attrs={'class': ['form-control', 'checkbox-inline']}),
            'activity': CheckboxSelectMultiple(attrs={'class': ['form-control', 'checkbox-inline']}),
        }
        labels = {
            'name': 'ФИО',
            'phone_number': 'Номер телефона',
            'is_photo': 'Готовы ли вы выкладывать фото с преведенных мероприятий?',
            'is_notify': 'Готовы ли вы оповещать родителей об успехах их детей?',
            'activity': 'Сфера услуг:',
        }


class ChildForm(forms.ModelForm):
    class Meta:
        model = Child
        fields = ['name', 'birth_year', 'metro', 'phone_number', 'email', 'good_at', 'prev_activities', ]
        widgets = {
            'name': TextInput(attrs={'class': 'form-control', 'placeholder': 'Имя'}),
            'birth_year': NumberInput(attrs={'class': 'form-control'}),
            'metro': TextInput(attrs={'class': 'form-control', 'placeholder': 'Метро'}),
            'phone_number': TextInput(attrs={'class': 'form-control', 'placeholder': 'Телефон'}),
            'email': EmailInput(attrs={'class': 'form-control', 'placeholder': 'email'}),
            'good_at': TextInput(attrs={'class': 'form-control', 'placeholder': 'Качества'}),
            'prev_activities': CheckboxSelectMultiple(attrs={'class': ['form-control', 'checkbox-inline']})
        }
        labels = {
            'name': 'Имя',
            'birth_year': 'Год рождения',
            'metro': 'Ближайшее метро',
            'phone_number': 'Номер телефона',
            'email': 'Адрес email',
            'good_at': 'Хорошие качества',
            'prev_activities': 'Раньше занимались:',
        }
