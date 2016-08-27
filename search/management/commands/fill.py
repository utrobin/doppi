from django.core.management.base import BaseCommand, CommandError
from search.models import Course, CourseInfo, CourseType, Metro
from authentication.models import UserProfile
from django.contrib.auth.models import User
from faker import Factory
import random
import json


fake = Factory.create('en_US')


class Command(BaseCommand):
    help = 'Fill the database'

    def handle(self, *args, **options):

        with open('/home/pgolubev/PycharmProjects/doppi/doppi/search/management/commands/stations.json') as json_file:
            stations = json.loads(json_file.read())
        for line in stations:
            for st in line['stations']:
                print(st)
        #for c in CourseInfo.objects.all():
        #    c.level_id = random.randint(1, 3)
        #    c.activity = CourseType.objects.get(id = random.randint(1, 27))
        #    c.save()
        #    for course in CourseInfo.objects.all():
        #    course.coordinate = '5' + str(random.randint(4, 6)) + '.' + str(random.randint(0, 900000)) + ',3' + str(random.randint(6, 8)) + '.' + str(random.randint(0, 900000))
        #    course.save()
        #  generating questions
        # for i in range(0, 1000):
        #     user = User.objects.get(id=1)
        #     profile = UserProfile.objects.get(user=user)
        #     q = Course(
        #      author=profile,
        #      title=fake.street_address(),
        #      description=fake.text(),
        #     )
        #
        #     info = CourseInfo(
        #          age_from = random.randint(0, 9),
        #          age_to = random.randint(9, 18),
        #          time_from = random.randint(0, 11),
        #          time_to = random.randint(12, 24),
        #          price = random.randint(0, 10000),
        #          frequency = random.randint(1, 14),
        #          coordinate_x=float('5' + str(random.randint(4, 6)) + '.' + str(random.randint(0, 900000))),
        #          coordinate_y=float('3' + str(random.randint(6, 8)) + '.' + str(random.randint(0, 900000)))
        #     )
        #     info.save()
        #
        #     q.info = info
        #     q.save()
        #
        #     random_tag_id = random.randint(1, 27)
        #     q.info.activity.add(
        #         CourseType.objects.get(id=random_tag_id),
        #         CourseType.objects.get(id=random_tag_id + 1),
        #     )
        #
        #     random_tag_id = random.randint(1, 4)
        #     q.info.location.add(
        #         Metro.objects.get(id=random_tag_id),
        #     )
        #     q.save()
