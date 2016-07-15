from search.models import Course
import random


f = open('static/json/data.json', 'w')


f.write('{' + '\n' + '"type": "FeatureCollection",' + '\n' + '"features": [' + '\n')

i = 0
j = 0
for course in Course.objects.all():
    j += 1
    if j != 2000:
        if len(course.info.coordinate) != 0:
            f.write('{"type": "Feature", "id": ' + str(
                i) + ', "geometry": {"type": "Point", "coordinates": ' + ' [55.' + str(random.randint(0, 90000)) + ',37.' + str(random.randint(0, 90000)) + ']'
                    + '}, "properties": {"balloonContent": "<a href=' + "'http://doppi.info/course/" + str(
                course.id) + "'>" + str(course.title) + '</a>", "clusterCaption": "' + str(
                course.title) + '", "hintContent": "' + str(course.title) + '"}},' + '\n')
            i += 1
    else:
        break
        #if len(course.info.coordinate) != 0:
        #    f.write(
        #        '{"type": "Feature", "id": ' + str(i) + ', "geometry": {"type": "Point", "coordinates": ' + '[' + str(
        #            course.info.coordinate) + ']}, "properties": {"balloonContent": "<a href=' + "'http://doppi.info/course/" + str(
        #            course.id) + "'>" + str(course.title) + '</a>", "clusterCaption": "' + str(
        #            course.title) + '", "hintContent": "' + str(course.title) + '"}}' + '\n')
        #    i += 1
f.write(' ]' + '\n' + '}')

f.close()