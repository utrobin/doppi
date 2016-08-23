import search.management.swimming as swimming
from django.core.management.base import BaseCommand, CommandError
from search.models import Course, CourseInfo, CourseType, Metro
from authentication.models import UserProfile
from django.contrib.auth.models import User


urls = {
        'Футбол':'http://zoon.ru/msk/trainings/type/sektsiya_futbola/',
        'Теннис':'http://zoon.ru/msk/trainings/type/sektsiya_tennisa/',
        'Хоккей':'http://zoon.ru/msk/trainings/type/sektsiya_hokkej/',
        'Борьба':'http://zoon.ru/msk/trainings/type/sektsiya_borby/',
        'Гитара':'http://zoon.ru/msk/trainings/network/uroki_gitary_i_kursy_vokala/',
        'Английский':'http://zoon.ru/msk/trainings/type/anglijskij/',
}

def int0(str):
    try:
        i = int(str[0]) * 1000
    except:
        return 0
    else:
        return i

class Command(BaseCommand):
    help = 'Fill the real database'

    def handle(self, *args, **options):
        for key, value in urls.items():
            cs = swimming.getCourseCluster(value)
            for j, k in enumerate(cs):
                print(j, k)
                i = CourseInfo(activity = CourseType.objects.get(title=key))
                i.save()
                c = Course(info = i, price=int0(k['price']), title=k['title'], description=k['desc'],
                        introtext = k['addr'], pic=k['pic'], author=UserProfile.objects.get(pk=1))
                c.save()

