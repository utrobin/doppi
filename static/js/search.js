/**
 * Created by egorutrobin and pavelgolubev on 12.07.16.
 */


var currentAjax = $.ajax();


var CheckOption = React.createClass({
    getInitialState: function () {
        return {checked: false};
    },

    handleClick: function (event) {
        this.setState(
            {
                checked: !this.state.checked
            }
        );
        var isCheck = !this.state.checked;
        var value = this.props.value;

        this.props.setCheckbox(isCheck, value);
    },

    render: function () {
        return (
            <div>
                <label>
                    <input type="checkbox" value={this.props.value} checked={this.state.checked}
                           onChange={this.handleClick}/>
                    {this.props.label}
                </label>
            </div>
        );
    }
});

var Courses = React.createClass({
    render: function () {
        return (
            <div className="course">

                <div className="course-info">
                    <img className="course-image" src={this.props.image} width="60px" height="60px"/>
                    <div className="course-name">автор курса {this.props.author}</div>
                    <a href={'/course/'+this.props.id}>
                        <div className="course-title">название {this.props.title} </div>
                    </a>
                    <div className="course-descreption">описание {this.props.description} </div>
                    <div className="course-age_from">возраст от {this.props.age_from} </div>
                    <div className="course-age_to">возратс до {this.props.age_to} </div>
                    <div className="course-time_from">время от {this.props.time_from} </div>
                    <div className="course-time_to">время до {this.props.time_to} </div>
                    <div className="course-activity">какая категория {this.props.activity} </div>
                    <div className="course-price">цена {this.props.price} </div>
                    <div className="course-frequency">количество занятий в неделю {this.props.frequency} </div>
                    <div className="course-location">какое метро {this.props.location}</div>
                </div>
            </div>
        );
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

    handleCheckbox: function (isCheck, value) {
        var tmp = this.state.options;
        if (isCheck) {
            tmp.checkboxes.push(value);
            this.setState({
                options: tmp
            }, this.props.applySearch(this.state.options));
        }
        else {
            tmp.checkboxes.splice(this.state.options.checkboxes.indexOf(value), 1);
            this.setState({
                options: tmp
            }, this.props.applySearch(this.state.options))
        }
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
        return (<div>
            <label>Поиск</label><input type="text" className="search-field" onChange={this.handleSearchQuery}/>
            <div>{
                this.props.courseActivities.map(function (option) {
                    return <CheckOption
                        key={option.id}
                        value={option.title}
                        label={option.title}
                        setCheckbox={this.handleCheckbox}
                    />
                }, this)
            }</div>
            <label>цена от</label><input type="text" name="priceFrom" onChange={this.handleNumberInput}/>
            <label>цена до</label><input type="text" name="priceTo" onChange={this.handleNumberInput}/>
            <br />
            <label>возраст от</label><input type="text" name="ageFrom" onChange={this.handleNumberInput}/>
            <label>возраст до</label><input type="text" name="ageTo" onChange={this.handleNumberInput}/>
            <br />
        </div>)
    }

});

var CoursesList = React.createClass({
    getInitialState: function () {
        return {
            coursesActivity: [],
            displayedCourses: [],
            isLoading: false,
            page: 0,
            currentOptions: {}
        };
    },

    getCourses: function (options) {
        this.setState({displayedCourses: [], isLoading: true, currentOptions: options, page: 0});
        currentAjax.abort();
        currentAjax = $.ajax({
            url: this.props.get_url, type: 'GET', dataType: 'json', cache: false,
            data: {page: 0, options: JSON.stringify(options)},
            success: function (data) {
                this.setState({
                    displayedCourses: data,
                    isLoading: false
                });
                console.log(this.state.displayedCourses)
            }.bind(this),
            error: function (xrh, error) {
                if (error!=='abort')
                    console.error(this.props.get_url, status, error.toString());
            }.bind(this)
        });
    },

    loadMoreCourses: function () {
        this.setState({isLoading: true});
        currentAjax.abort();
        currentAjax = $.ajax({
            url: this.props.get_url, type: 'GET', dataType: 'json', cache: false,
            data: {page: this.state.page+1, options: JSON.stringify(this.state.currentOptions)},
            success: function (data) {
                var tmp = this.state.displayedCourses.concat(data);
                this.setState({
                    displayedCourses: tmp,
                    isLoading: false,
                    page: this.state.page+1
                });
            }.bind(this),
            error: function (xrh, error) {
                if (error!=='abort')
                    console.error(this.props.get_url, status, error.toString());
            }.bind(this)
        });
    },

    getActivity: function () {
        $.ajax({
            url: this.props.get_url_activity, type: 'GET', dataType: 'json', cache: false,
            success: function (data) {
                this.setState({coursesActivity: data});
            }.bind(this),
            error: function (xrh, status, error) {
                console.error(this.props.get_url_activity, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function () {
        this.getActivity();
    },

    sortCourses: function (comparator) {
        this.setState({
            displayedCourse: this.state.displayedCourses.sort(comparator)
        });
    },

    render: function () {
        return (
            <div className="courses">
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
                <div className="courses-list">
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
                </div>
                <div className="loading">
                    <div className={this.state.isLoading? '': 'none'}>
                        <div className="cssload-fond">
                            <div className="cssload-container-general">
                                <div className="cssload-internal">
                                    <div className="cssload-ballcolor cssload-ball_1"></div>
                                </div>
                                <div className="cssload-internal">
                                    <div className="cssload-ballcolor cssload-ball_2"></div>
                                </div>
                                <div className="cssload-internal">
                                    <div className="cssload-ballcolor cssload-ball_3"></div>
                                </div>
                                <div className="cssload-internal">
                                    <div className="cssload-ballcolor cssload-ball_4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className={this.state.isLoading? 'none' : ''} onClick={this.loadMoreCourses}>Загрузить еще</button>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <CoursesList get_url="/api/get/courses" get_url_activity="/api/get/activity"/>,
    document.getElementById("content")
);


var priceAsc = document.getElementById('priceAsc');
var priceDesk = document.getElementById('priceDesk');

priceAsc.onclick = function () {
    priceDesk.style.display = 'block';
    priceAsc.style.display = 'none';
};
priceDesk.onclick = function () {
    priceDesk.style.display = 'none';
    priceAsc.style.display = 'block';
};

