/**
 * Created by egorutrobin on 15.07.16.
 */
ymaps.ready(init);
var myMap

function init () {
    myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 32
        });

    // Чтобы задать опции одиночным объектам и кластерам,
    // обратимся к дочерним коллекциям ObjectManager.
    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);

    myMap.events.add('boundschange', function () {
        alert('О, событие!');
    });

    console.log(myMap.getBounds());



    $.ajax({
        url: "/coordinates", type: 'GET', dataType: 'json', cache: false,
        data: {coordinates: JSON.stringify(myMap.getBounds())}
    }).done(function(data) {
        objectManager.add(data);
    });

}

