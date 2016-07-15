/**
 * Created by egorutrobin on 15.07.16.
 */
var myMap;
ymaps.ready(init);

function init() {
    var coordinate = document.getElementsByName('coordinate')[0].value.split(',');
    console.log(coordinate);

    myMap = new ymaps.Map('map', {
        center: coordinate,
        zoom: 13,
        controls: []
    });
    

    myMap.geoObjects
        .add(new ymaps.Placemark(coordinate, {
            balloonContent: 'цвет <strong>влюбленной жабы</strong>'
        }, {
            preset: 'islands#circleIcon',
            iconColor: '#3caa3c'
        }));
}
