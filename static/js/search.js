/**
 * Created by egorutrobin and pavelgolubev on 12.07.16.
 */
ymaps.ready(init);
var myMap;
var objectManager;
var ave = {};

function init () {
    myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });
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
        $.ajax
        ({
            url: "/coordinates", type: 'GET', dataType: 'json', cache: false,
            data: {coordinates: JSON.stringify(myMap.getBounds()), options: JSON.stringify(ave)}
        }).done(function(data) {
                    objectManager.add(data);
                });
    });

    $.ajax({
        url: "/coordinates", type: 'GET', dataType: 'json', cache: false,
        data: {coordinates: JSON.stringify(myMap.getBounds()), options: JSON.stringify(ave)}
    }).done(function(data) {
            objectManager.add(data);
        });
    console.log(myMap.getBounds());
}



var currentAjax = $.ajax();



var Courses = React.createClass({
    render: function () {
        return (
            <div className="course">
                <div className="course-wrapper">
                    <img className="course-image" src={this.props.image} width="250px"/>
                    <div className="Golubev"></div>
                    <div className="course-wrapper-title">
                        <div className="course-name">{this.props.author}</div>
                        <a href={'/course/'+this.props.id}>
                            <div className="course-title">{this.props.title}</div>
                        </a>
                    </div>
                    
                    <div className="course-info">
                        <div className="course-description">{this.props.description}</div>
                        <div className="course-activity">
                            <b>Категория:</b>
                            <span>{this.props.activity}</span>
                        </div>
                        <div className="course-price">
                            <b>Стоимость:</b>
                            <span>{this.props.price} руб.</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var Leaf = React.createClass({
    getInitialState: function () {
        return {
            activeValue: false
        }
    },

    handleClick: function (event) {
        this.setState({
            activeValue: !this.state.activeValue
        }, console.log(this.state.activeValue));

        this.props.handleClick(this.props.title, this.state.activeValue);
    },

    render: function () {
        return (
            <li onClick={this.handleClick} className={this.state.activeValue? 'active': ''}><a>{this.props.title}</a></li>
        )
    }
});


var Branch = React.createClass({

    getInitialState: function () {
        return {
            isDisplayed: false,
            activeValueLeaf: false
        }
    },

    activeLeaf: function (title, activeValue) {
        this.props.handleClick([title]);
    },

    handleClick: function (event) {
        this.setState({
            isDisplayed: !this.state.isDisplayed
        });
        this.props.handleClick(this.props.leaves.map(function (el) {
            return el.title;
        }));
    },

    render: function () {
        return (

                <li>
                    <a className="parent-menu" onClick={this.handleClick}>{this.props.branch}</a>
                    <ul style={this.state.isDisplayed ? {display:'block'}:{display:'none'}}>
                        {
                            this.props.leaves.map(function (el) {
                                return (
                                    <Leaf key={el.id} title={el.title} handleClick={this.activeLeaf}/>
                                )
                            }, this)
                        }
                    </ul>
                </li>
        )
    }
});

var Tree = React.createClass({
    getInitialState: function () {
        return {
            tree: []
        }
    },

    handleTree: function (leaves) {
        this.props.handleSearch(leaves);
    },

    componentWillMount: function () {
        $.ajax({
            url: this.props.get_url_activity, type: 'GET', dataType: 'json', cache: false,
            success: function (data) {
                this.setState({tree: data});
            }.bind(this),
            error: function (xrh, status, error) {
                console.error(this.props.get_url_activity, status, err.toString());
            }.bind(this)
        });
    },

    render: function () {
        return (
            <ul>{
                this.state.tree.map(function (el) {
                    return (
                        <Branch key={el.id} leaves={el.content} branch={el.title} handleClick={this.handleTree}/>
                    )
                }, this)
            }</ul>
        )
    }
});

var CoursesOptions = React.createClass({
    getInitialState: function () {
        return {
            options: {
                searchQuery: "",
                checkboxes: [],
                priceFrom: "",
                priceTo: "",
                ageFrom: "",
                ageTo: ""
            }
        }
    },

    componentDidMount: function () {
        this.props.applySearch(this.state.options);
    },

    handleSearchQuery: function (event) {
        var tmp = this.state.options;
        tmp.searchQuery = event.target.value.toLowerCase().trim();
        this.setState({
            options: tmp
        }, this.props.applySearch(this.state.options));
    },

    handleCheckbox: function (values) {
        var tmp = this.state.options;
        tmp.checkboxes = values;
        this.setState({
            options: tmp
        }, this.props.applySearch(this.state.options));
    },

    handleNumberInput: function (event) {
        var inputValue = event.target.value.toLowerCase().trim();
        var tmp = this.state.options;

        switch (event.target.name) {
            case 'priceFrom':
                tmp.priceFrom = inputValue;
                break;
            case 'priceTo':
                tmp.priceTo = inputValue;
                break;
            case 'ageFrom':
                tmp.ageFrom = inputValue;
                break;
            case 'ageTo':
                tmp.ageTo = inputValue;
                break;
            default:
                console.log("Number input switch error")
        }

        this.setState({
            options: tmp
        }, this.props.applySearch(this.state.options));
    },

    render: function () {
        return (
        <div>
            <div className="tree-menu">
                <span>Категории</span>
                <Tree get_url_activity="/api/get/activity" handleSearch={this.handleCheckbox}/>
            </div>
            <div className="filters">
                <label>Поиск</label><input type="text" className="search-field" onChange={this.handleSearchQuery}/>
                <br />
                <label>цена от</label><input type="text" name="priceFrom" onChange={this.handleNumberInput}/>
                <label>цена до</label><input type="text" name="priceTo" onChange={this.handleNumberInput}/>
                <br />
                <label>возраст от</label><input type="text" name="ageFrom" onChange={this.handleNumberInput}/>
                <label>возраст до</label><input type="text" name="ageTo" onChange={this.handleNumberInput}/>
                <br />
            </div>
        </div>)
    }

});

var CoursesList = React.createClass({
    getInitialState: function () {
        return {
            coursesActivity: [],
            displayedCourses: [],
            isLoading: false,
            isLoadingMap: false,
            page: 0,
            currentOptions: {}
        };
    },

    refreshMap: function () {
        if(!!objectManager)
        {
            this.setState({
                isLoadingMap: true
            });
            objectManager.removeAll();
            $.ajax
                ({
                    url: "/coordinates", type: 'GET', dataType: 'json', cache: false,
                    data: {coordinates: JSON.stringify(myMap.getBounds()), options: JSON.stringify(ave)}
                }).done(function(data) {
                            objectManager.add(data);
                            this.setState({
                                isLoadingMap: false
                            });
                        }.bind(this));
        }
    },

    getCourses: function (options) {
        ave = options;
        this.refreshMap();
        this.setState({displayedCourses: [], isLoading: true, currentOptions: options, page: 0});
        currentAjax.abort();
        currentAjax = $.ajax({
            url: this.props.get_url, type: 'GET', dataType: 'json', cache: false,
            data: {page: 0, options: JSON.stringify(options)},
            success: function (data) {
                this.setState({
                    displayedCourses: data,
                    isLoading: false,
                    page: 1
                });
            }.bind(this),
            error: function (xrh, error) {
                if (error !== 'abort')
                    console.error(this.props.get_url, status, error.toString());
            }.bind(this)
        });
    },

    componentWillMount: function () {

    },

    loadMoreCourses: function () {
        console.log(objectManager);
        this.setState({isLoading: true});
        currentAjax.abort();
        currentAjax = $.ajax({
            url: this.props.get_url, type: 'GET', dataType: 'json', cache: false,
            data: {page: this.state.page, options: JSON.stringify(this.state.currentOptions)},
            success: function (data) {
                var tmp = this.state.displayedCourses.concat(data);
                this.setState({
                    displayedCourses: tmp,
                    isLoading: false,
                    page: this.state.page + 1
                });
            }.bind(this),
            error: function (xrh, error) {
                if (error !== 'abort')
                    console.error(this.props.get_url, status, error.toString());
            }.bind(this)
        });
    },

    sortCourses: function (comparator) {
        this.setState({
            displayedCourse: this.state.displayedCourses.sort(comparator)
        });
    },

    render: function () {
        return (
            <div>
                <div className="row">
                    <CoursesOptions courseActivities={this.state.coursesActivity} applySearch={this.getCourses}/>
                    <div className="sort-price">
                        <a id="priceAsc"
                           onClick={this.sortCourses.bind(this, function(a, b) {return (a.price >= b.price)? 1 : -1})}>
                            Сортировка по цене возрастанию
                        </a>

                        <a id="priceDesk"
                           onClick={this.sortCourses.bind(this, function(a, b) {return (a.price <= b.price)? 1 : -1})}
                           style={{display: 'none'}}>
                            Сортировка по цене убыванию
                        </a>
                    </div>

                    <div className="courses">
                        <div className="wrapper-map">
                            <input id="click-map" value="Поиск по карте" type="button"/>
                            <div id="map" className="search-map" style={{display: 'none'}}></div>
                        </div>

                        {
                            this.state.displayedCourses.map(function (el) {
                                return (
                                    <Courses
                                        key={el.id}
                                        id={el.id}
                                        author={el.author}
                                        image={el.pic}
                                        title={el.title}
                                        description={el.description}
                                        age_from={el.age_from}
                                        age_to={el.age_to}
                                        time_from={el.time_from}
                                        time_to={el.time_to}
                                        activity={el.activity}
                                        location={el.location}
                                        price={el.price}
                                        frequency={el.frequency}
                                    />
                                )
                            })
                        }

                        <div className="loading">
                            <div className={this.state.isLoading? '': 'none'}>
                                <div className="cssload-fond">
                                    <div className="cssload-container-general">
                                            <div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_1"> </div></div>
                                            <div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_2"> </div></div>
                                            <div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_3"> </div></div>
                                            <div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_4"> </div></div>
                                    </div>
                                </div>
                            </div>
                            <button className={this.state.isLoading? 'none': ''} onClick={this.loadMoreCourses}>Загрузить еще</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
        <CoursesList get_url="/api/get/courses"/>,
    document.getElementById("content")
);


var priceAsc = document.getElementById('priceAsc');
var priceDesk = document.getElementById('priceDesk');
var clickMap = document.getElementById('click-map');

priceAsc.onclick = function () {
    priceDesk.style.display = 'block';
    priceAsc.style.display = 'none';
};
priceDesk.onclick = function () {
    priceDesk.style.display = 'none';
    priceAsc.style.display = 'block';
};
clickMap.onclick = function () {
    if(document.getElementById('map').style.display == 'none')
    {
        clickMap.value = 'Скрыть карту';
        document.getElementById('map').style.display = 'block';
    }
    else
    {
        clickMap.value = 'Поиск по карте';
        document.getElementById('map').style.display = 'none';
    }
};

