/**
 * Created by egorutrobin on 15.07.16.
 */


var myMap;
ymaps.ready(init);

function init() {
    var title = document.getElementById('title').innerHTML;
    var coordinate_x = document.getElementsByName('coordinate_x')[0].value;
    var coordinate_y = document.getElementsByName('coordinate_y')[0].value;
    var coordinate = [coordinate_x, coordinate_y];

    myMap = new ymaps.Map('map', {
        center: coordinate,
        zoom: 14,
        controls: ['smallMapDefaultSet']
    });

    myMap.geoObjects
        .add(new ymaps.Placemark(coordinate, {
            balloonContent: title
        }, {
            preset: 'islands#circleIcon',
            iconColor: 'rgb(72, 0, 72)'
        }));
}
