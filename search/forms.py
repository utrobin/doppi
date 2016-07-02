from django import forms


class SearchBarForm(forms.Form):
    query = forms.CharField(max_length=50)
    isLanguage = forms.BooleanField(label='Занятия языком')
    isSports = forms.BooleanField(label='Занятия спортом')
    place = forms.ChoiceField(choices=[('indoors', 'В помещении'), ('outdoors', 'На улице')], widget=forms.RadioSelect())

