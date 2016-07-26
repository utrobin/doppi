from django.core.management.base import BaseCommand, CommandError
from search.models import Course, CourseInfo, CourseType, Metro
from authentication.models import UserProfile
from django.contrib.auth.models import User
from faker import Factory
import random

fake = Factory.create('en_US')


class Command(BaseCommand):
    help = 'Fill the database'

    def handle(self, *args, **options):

        for course in CourseInfo.objects.all()[:100]:
            course.title = fake.text(max_nb_chars=128)
            course.introtext = fake.text(max_nb_chars=256)
            course.description = fake.text(max_nb_chars=16384)
            course.save()

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
