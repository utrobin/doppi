from django.core.management.base import BaseCommand, CommandError
from search.models import Course, CourseInfo, CourseType, Metro
from authentication.models import UserProfile
from django.contrib.auth.models import User
from faker import Factory
import random

fake = Factory.create('ru_RU')


class Command(BaseCommand):
    help = 'Fill the database'

    def handle(self, *args, **options):

        # generating questions
        for i in range(0, 100):
            user = User.objects.get(id=1)
            profile = UserProfile.objects.get(user=user)
            q = Course(
                author=profile,
                title=fake.text(),
                description=fake.street_address(),
            )

            info = CourseInfo(
                age_from = random.randint(0, 9),
                age_to = random.randint(9, 18),
                time_from = random.randint(0, 11),
                time_to = random.randint(12, 24),
                price = random.randint(0, 10000),
                frequency = random.randint(1, 14),
            )
            info.save()

            q.info = info
            q.save()

            random_tag_id = random.randint(1, 4)
            q.info.activity.add(
                CourseType.objects.get(id=random_tag_id),
                CourseType.objects.get(id=random_tag_id + 1),
            )

            random_tag_id = random.randint(1, 4)
            q.info.location.add(
                Metro.objects.get(id=random_tag_id),
            )
            q.save()
