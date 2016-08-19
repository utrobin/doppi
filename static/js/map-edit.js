/**
 * Created by egorutrobin on 15.07.16.
 */
var myMap;
var searchControl;
ymaps.ready(init);

function init() {
    var coordinate = [document.getElementById('coordinate_x').value, document.getElementById('coordinate_y').value];

    myMap = new ymaps.Map('map', {
        center: coordinate,
        zoom: 12,
         controls: ['zoomControl', 'typeSelector', 'fullscreenControl', 'geolocationControl']
    });

    // Создадим экземпляр элемента управления «поиск по карте»
    // с установленной опцией провайдера данных для поиска по организациям.
    searchControl = new ymaps.control.SearchControl({
        options: {
            provider: 'yandex#search'
        }
    });

    myMap.geoObjects
        .add(new ymaps.Placemark(coordinate, {
        }, {
            preset: 'islands#circleIcon',
            iconColor: 'rgb(72, 0, 72)'
        }));

    myMap.controls.add(searchControl);
}

var cor = function ()
{
    if (searchControl.getRequestString()!== null){
        ymaps.geocode(searchControl.getRequestString(), {results: 1}).then(function (res)
            {
                // Выбираем первый результат геокодирования.
                    var firstGeoObject = res.geoObjects.get(0),
                        // Координаты геообъекта.
                        coords = firstGeoObject.geometry.getCoordinates(),
                        // Область видимости геообъекта.
                        bounds = firstGeoObject.properties.get('boundedBy');
                    searchControl.getRequestString()
                    // Добавляем первый найденный геообъект на карту.
                    myMap.geoObjects.add(firstGeoObject);
                    // Масштабируем карту на область видимости геообъекта.
                    myMap.setBounds(bounds, {
                        // Проверяем наличие тайлов на данном масштабе+|mn
                        checkZoomRange: true
                    });

                document.getElementsByName('coordinate_x')[0].value = coords[0];
                document.getElementsByName('coordinate_y')[0].value = coords[1];
            });
    }
};
