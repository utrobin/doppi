/**
 * Created by egorutrobin and pavelgolubev on 12.07.16.
 */
ymaps.ready(init);
var myMap;
var objectManager;
var ave = {};

const CHEKBOXES = 'CHEKBOXES'
const AGE_FROM = 'AGE_FROM'
const AGE_TO = 'AGE_TO'
const PRICE_FROM = 'PRICE_FROM'
const PRICE_TO = 'PRICE_TO'
const SEARCH_QUERY = 'SEARCH_QUERY'
const SORT_PRICE = 'SORT_PRICE'
const GET_COURSES = 'GET_COURSES'
const ADD_COURSES = 'ADD_COURSES'
const ADD_TODO = 'ADD_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

/*
 * другие константы
 */

const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

/*
 * генераторы действий
 */
function checkboxes(value) {
  return { type: CHEKBOXES, value}
}

function ageFrom(value) {
  return { type: AGE_FROM, value }
}

function ageTo(value) {
  return { type: AGE_TO, value }
}

function searchQuery(value) {
  return { type: SEARCH_QUERY, value }
}

function priceFrom(value) {
  return { type: PRICE_FROM, value }
}

function priceTo(value) {
  return { type: PRICE_TO, value }
}

function sortPrice() {
  return { type: SORT_PRICE }
}

function getCourses(courses) {
  return { type: GET_COURSES, courses }
}

function addCourses(courses) {
  return { type: ADD_COURSES, courses }
}

function get_url(state, action) {
    return "/api/get/courses"

}

function options(state, action) {
  if (typeof state === 'undefined') {

    return  {
                query: "",
                checkboxes: [],
                priceFrom: "",
                priceTo: "",
                ageFrom: "",
                ageTo: ""
            }
  }
  switch (action.type) {
    case CHEKBOXES:
    {
        if (action.value == undefined)
            return state;

        console.log(state, action, 'checbfojbnj')
        var {checkboxes, ...resState0} = state;
        var omg = Object.assign({}, resState0, {checkboxes: action.value})
        console.log(omg, 'kkkпапапапап');

        return omg;
    }
    case SEARCH_QUERY:
    {
        var {query, ...resState} = state;
        return Object.assign({}, resState, {query: action.value});
    }
    case PRICE_FROM:
    {
        var {priceFrom, ...resState1} = state;
        return Object.assign({}, resState1, {priceFrom: action.value});
    }
    case PRICE_TO:
    {
        var {priseTo, ...resState2} = state;
        return Object.assign({}, resState2, {priceTo: action.value});
    }
    case AGE_FROM:
    {
        var {ageFrom, ...resState3} = state;
        return Object.assign({}, resState3, {ageFrom: action.value});
    }
    case AGE_TO:
    {
        var {ageTo, ...resState4} = state;
        return Object.assign({}, resState4, {ageTo: action.value});
    }
    default:
      return state
  }
}

function sort(state, action) {
  if (typeof state === 'undefined') {
    return 'ASC'
  }
  switch (action.type) {
    case SORT_PRICE:
    {
        if (state == 'ASC')
        {
            return 'DESC'
        }
        else
        {
            return 'ASC'
        }
    }

    default:
      return state
  }
}

function courses(state, action) {
  if (typeof state === 'undefined') {
    return []
  }
  switch (action.type) {
    case GET_COURSES:
      return action.courses

    case ADD_COURSES:
        return [
          ...state,
          ...action.courses
        ]

    default:
      return state
  }
}


const todoApp = Redux.combineReducers({
    get_url,
    options,
    sort,
    courses,
})

let store = Redux.createStore(todoApp)

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
        });
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

    activeLeaf: function (title) {
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
                checkboxes: [],
                priceFrom: "",
                priceTo: "",
                ageFrom: "",
                ageTo: "",
            }
        }
    },

    componentDidMount: function () {
        this.props.applySearch();
    },

    handleSearchQuery: function (event) {
        this.props.dispatch(searchQuery(event.target.value.toLowerCase().trim()));
        this.props.Search()
    },

    handleCheckbox: function (values) {
        this.props.applySearch(values);
    },

    handleNumberInput: function (event) {
        var inputValue = event.target.value.toLowerCase().trim();

        switch (event.target.name) {
            case 'priceFrom':
                this.props.dispatch(priceFrom(inputValue));
                break;
            case 'priceTo':
                this.props.dispatch(priceTo(inputValue));
                break;
            case 'ageFrom':
                this.props.dispatch(ageFrom(inputValue));
                break;
            case 'ageTo':
                this.props.dispatch(ageTo(inputValue));
                break;
            default:
                console.log("Number input switch error")
        }
        this.props.Search()
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
            isLoading: false,
            isLoadingMap: false,
            page: 0,
        };
    },

    tabur: function (parametr) {
       return new Promise((resolve, reject) => {

                this.props.dispatch(checkboxes(parametr));

            });
    },

    omg: function (values) {

        if(values == undefined)
        {
            var t = this
            this.props.dispatch(checkboxes([]))
            setTimeout(t.getCourses, 50)

        }
        else {
            console.log(values);
            var that = this;
            this.props.dispatch(checkboxes(values));
            setTimeout(function () {
                that.getCourses()
            }, 50);
        }

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
                    data: {coordinates: JSON.stringify(myMap.getBounds()), options: JSON.stringify(this.props.user.options)}
                }).done(function(data) {
                            objectManager.add(data);
                            this.setState({
                                isLoadingMap: false
                            });
                        }.bind(this));
        }
    },

    getCourses: function () {
        console.log(this.props.user, 1)
        this.props.dispatch(getCourses([]));
        ave = this.props.user.options;
        this.refreshMap();

        this.setState({isLoading: true, page: 0});
        currentAjax.abort();
        console.log(this.props.user, 2)
        currentAjax = $.ajax({
            url: this.props.user.get_url, type: 'GET', dataType: 'json', cache: false,
            data: {
                page: 0,
                options: JSON.stringify(this.props.user.options),
                sort: this.props.user.sort
            },
            success: function (data) {
                console.log(data, 'gfgfg')

                console.log(this.props.user, 3)
                this.props.dispatch(getCourses(data));
                console.log(this.props.user, 4)

                this.setState({
                    isLoading: false,
                    page: 1
                });
                console.log(this.props.user, 5)
            }.bind(this),
            error: function (xrh, error) {
                if (error !== 'abort')
                    console.error(this.props.get_url, status, error.toString());
            }.bind(this)
        });

    },

    loadMoreCourses: function () {
        this.setState({isLoading: true});
        console.log(this.props.user.options)
        currentAjax.abort();
        currentAjax = $.ajax({
            url: this.props.user.get_url, type: 'GET', dataType: 'json', cache: false,
            data: {page: this.state.page, options: JSON.stringify(this.props.user.options), sort: this.props.user.sort},
            success: function (data) {
                console.log(data)
                this.props.dispatch(addCourses(data));
                this.setState({
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
        console.log(this.props.user)

    },

    render: function () {
        return (
            <div>
                <div className="row">
                    <CoursesOptions
                        courseActivities={this.state.coursesActivity}
                        applySearch={this.omg}
                        Search={this.getCourses}
                        dispatch={this.props.dispatch}
                    />

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
                            this.props.user.courses.map(function (el) {
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
                                            <div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_1"> </div></div>
                                            <div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_2"> </div></div>
                                            <div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_3"> </div></div>
                                            <div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_4"> </div></div>
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

function mapStateToProps (state) {
    return {user: state}
}

var ConnectedCoursesList = ReactRedux.connect(mapStateToProps)(CoursesList)
//var ConnectedCoursesOptions = ReactRedux.connect(mapStateToProps)(CoursesOptions)

ReactDOM.render(
    <ReactRedux.Provider store={store}>
        <ConnectedCoursesList />
    </ReactRedux.Provider>,
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