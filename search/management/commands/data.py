from search.models import Course



f = open('static/json/data.json', 'w')


f.write('{' + '\n' + '"type": "FeatureCollection",' + '\n' + '"features": [' + '\n')

i = 0
j = 0
for course in Course.objects.all():
    j += 1
    if len(Course.objects.all()) != j:
        if len(course.info.coordinate) != 0:
            f.write('{"type": "Feature", "id": ' + str(i) + ', "geometry": {"type": "Point", "coordinates": ' + '[' + str(
                course.info.coordinate) + ']}, "properties": {"balloonContent": "<a href=' + "'http://doppi.info/course/" + str(
                course.id) + "'>" + str(course.title) + '</a>", "clusterCaption": "' + str(
                course.title) + '", "hintContent": "' + str(course.title) + '"}},' + '\n')
            i += 1
    else:
        if len(course.info.coordinate) != 0:
            f.write(
                '{"type": "Feature", "id": ' + str(i) + ', "geometry": {"type": "Point", "coordinates": ' + '[' + str(
                    course.info.coordinate) + ']}, "properties": {"balloonContent": "<a href=' + "'http://doppi.info/course/" + str(
                    course.id) + "'>" + str(course.title) + '</a>", "clusterCaption": "' + str(
                    course.title) + '", "hintContent": "' + str(course.title) + '"}}' + '\n')
            i += 1
f.write(' ]' + '\n' + '}')

f.close()