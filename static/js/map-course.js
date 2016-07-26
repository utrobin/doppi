/**
 * Created by egorutrobin on 15.07.16.
 */
var myMap;
ymaps.ready(init);

function init() {
    var coordinate_x = document.getElementsByName('coordinate_x')[0].value;
    var coordinate_y = document.getElementsByName('coordinate_y')[0].value;
    var coordinate = [coordinate_x, coordinate_y];
    console.log([coordinate_x, coordinate_y]);

    myMap = new ymaps.Map('map', {
        center: coordinate,
        zoom: 14,
        controls: ['smallMapDefaultSet']
    });

    myMap.geoObjects
        .add(new ymaps.Placemark(coordinate, {
            balloonContent: 'цвет <strong>влюбленной жабы</strong>'
        }, {
            preset: 'islands#circleIcon',
            iconColor: '#3caa3c'
        }));
}
