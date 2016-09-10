import search.management.swimming as swimming
from django.core.management.base import BaseCommand, CommandError
from search.models import Course, CourseInfo, CourseType, Metro
from authentication.models import UserProfile
from django.contrib.auth.models import User
import requests
import json
import random

urls = [
        ('Футбол','http://zoon.ru/msk/trainings/type/sektsiya_futbola/'),
        ('Теннис','http://zoon.ru/msk/trainings/type/sektsiya_tennisa/'),
        ('Хоккей','http://zoon.ru/msk/trainings/type/sektsiya_hokkej/'),
        ('Борьба','http://zoon.ru/msk/trainings/type/sektsiya_borby/'),
        ('Гитара','http://zoon.ru/msk/trainings/network/uroki_gitary_i_kursy_vokala/'),
        ('Английский','http://zoon.ru/msk/trainings/type/anglijskij/'),
        ('Бассейн','http://zoon.ru/msk/entertainment/type/bassejn/'),
        ('Бассейн','http://zoon.ru/msk/trainings/type/sektsiya_plavaniya/'),
        ('Легкая атлетика','http://zoon.ru/msk/fitness/type/trenazhernyj_zal/'),
        ('Современные','http://zoon.ru/msk/fitness/type/tantsy/'),
        ('Вокал','http://zoon.ru/msk/trainings/type/kursy_vokala/'),
        ('Актерское мастерство','http://zoon.ru/msk/trainings/type/kursy_akterskogo_masterstva/'),
        ('Художественное слово','http://zoon.ru/msk/education/type/hudozhestvennye_shkoly/'),
        ('По ткани','http://zoon.ru/msk/trainings/type/kursy_shitya/'),
        ('Немецкий','http://zoon.ru/msk/trainings/type/nemetskij/'),
        ('Французский','http://zoon.ru/msk/trainings/type/frantsuzskij/'),
        ('Испанский','http://zoon.ru/msk/trainings/type/ispanskij/'),
        ('Психология','http://zoon.ru/msk/trainings/type/kursy_psihologii/'),
        ('Фото','http://zoon.ru/msk/trainings/type/fotoshkoly/'),
        ('Фото', 'http://zoon.ru/msk/trainings/type/kursy_fotografiya/'),
        ('Фото', 'http://zoon.ru/msk/trainings/type/kursy_fotoshop/'),
        ('Вождения','http://zoon.ru/msk/m/kursy_vozhdeniya/'),
]

def int0(str):
    try:
        i = int(str[0]) * 1000
    except:
        return 0
    else:
        return i

def get_metro(address):
    try:
        geoapi = 'https://geocode-maps.yandex.ru/1.x/'
        ps = {'geocode': '+'.join(address.split()), 'format': 'json'}
        r = requests.get(geoapi, params=ps)
        point = json.loads(r.text)['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']['Point']['pos']
        ps2 = {'geocode': ' '.join(point.split()), 'format': 'json', 'kind': 'metro'}
        r = requests.get(geoapi, params=ps2)
        metro = json.loads(r.text)['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']['metaDataProperty']['GeocoderMetaData']['AddressDetails']['Country']['AdministrativeArea']['Locality']['Thoroughfare']['Premise']['PremiseName']
        m = Metro.objects.get(title=metro.split()[1])
    except:
        return None
    else:
        return m

class Command(BaseCommand):
    help = 'Fill the real database'

    def handle(self, *args, **options):
        for item in urls:
            cs = swimming.getCourseCluster(item[1])
            for j, k in enumerate(cs):
                print(j, k)
                i = CourseInfo(activity = CourseType.objects.get(title=item[0]),
                        level=Level.objects.get(id = random.randint(1, 3)),
                        frequency = random.randint(3,7), age_to = random.randint(10, 18),
                        age_from = random.randint(1, 10),
                        time_from = random.randint(7, 12), time_to = random.randint(13, 20))
                i.save()
                c = Course(info = i, price=int0(k['price']), title=k['title'], description=k['desc'],
                        introtext = k['addr'], pic=k['pic'], author=UserProfile.objects.get(pk=1),
                        location=get_metro(k['addr']), site=k['site'], phone=k['phone'],
                        likes = random.randint(1,100),
                        moderation=True)
                c.save()

