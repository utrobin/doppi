/**
 * Created by egorutrobin on 12.07.16.
 */

var select = [
    {
        id: 1,
        value: 'Павел',
        label: 'Павел'
    }, {
        id: 2,
        value: 'Егор',
        label: 'Егор'
    }, {
        id: 3,
        value: 'Маша',
        label: 'Маша'
    }
];

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

        this.props.filter(isCheck, value);
    },

    render: function () {
        return (
            <div>
                <label>
                    <input type="checkbox" value={this.props.value} checked={this.state.checked} onChange={this.handleClick}/>
                    {this.props.label}
                </label>
            </div>
        );
    }
});

var selectOption = React.createClass({
    getInitialState: function() {
        return {
            options: optionsService.getoptions()
        };
    },

    render: function () {
        return(
            <option value={this.props.value}>{this.props.label}</option>
        );
    }
});

var Courses = React.createClass({
    render: function() {
        return (
            <div className="course col-xs-4">
                <img className="course-image" src={this.props.image} width="60px" height="60px" />
                <div className="course-info">

                    <div className="course-name">автор курса {this.props.author}</div>
                    <a href={'/course/'+this.props.id}><div className="course-title">название {this.props.title} </div></a>
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

var CoursesList = React.createClass({
    getInitialState: function() {
        return {
            checkboxes: [],
            querySet: "",
            changeSelect: "",
            data: [],
            data_activity: [],
            displayedCourses: [],
            obj: {
                searchPriceLower: 0,
                searchPriceHigh: 100000000000,
                ageLower: 0,
                ageHigh: 100000000000
            }
        };
    },

    getCourses: function () {
        $.ajax({
            url: this.props.get_url,
            type: 'GET',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data,
                                displayedCourses: data});
            }.bind(this),
            error: function (xrh, status, error) {
                console.error(this.props.get_url, status, err.toString());
            }.bind(this)
        });
    },

    getActivity: function () {
        $.ajax({
            url: this.props.get_url_activity,
            type: 'GET',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data_activity: data});
            }.bind(this),
            error: function (xrh, status, error) {
                console.error(this.props.get_url_activity, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function () {
        this.getActivity();
        this.getCourses();
    },

    filter: function(isCheck, value) {
        var temp = this.state.checkboxes;
        if (isCheck)
        {
            temp.push(value);
            this.setState({
                checkboxes: temp
            }, this.handleSearch);

        }
        else
        {
            temp.splice(this.state.checkboxes.indexOf(value), 1);
            this.setState({
                checkboxes: temp
            }, this.handleSearch)
        }

    },

    handleInput: function (event) {
        var searchQuery = event.target.value.toLowerCase().trim();
        this.setState({
            querySet: searchQuery
        }, this.handleSearch);
    },

    handleNumber: function (event) {
        var searchQuery = event.target.value.toLowerCase().trim();

        var temp = this.state.obj;
        switch (event.target.className) {
                case 'searchPriceLower':
                {
                    temp.searchPriceLower = searchQuery;
                    break;
                }
                case 'searchPriceHigh':
                {
                    temp.searchPriceHigh = searchQuery;
                    break;
                }
                case 'ageLower':
                    temp.ageLower = searchQuery;
                    break;
                case 'ageHigh':
                    temp.ageHigh = searchQuery;
                    break;
                default:
                    alert('Сорян что-то пошло не так')
            }

        this.setState({
            obj: temp
        }, this.handleSearch);
    },

    handleSelect: function (event) {
        var select = event.target.value.toLowerCase().trim();
        this.setState({
            changeSelect: select
        }, this.handleSearch);
    },

    check: function (searchValue3, temp) {
        var end = false;
        for(var i = 0; i < searchValue3.length; i++)
        {
            for(var j = 0; j < temp.length; j++)
            {
                if(temp[j] == searchValue3[i])
                {
                    end = true;
                    if(end == true)
                        break;
                }
            }
            if(end == true)
                break;
        }
        return end;
    },

    handleSearch: function() {
        var displayedCourses = this.state.data.filter(function(el) {
            console.log(this.state.obj);
            var searchValue1 = el.title.toLowerCase();
            var searchValue2 = el.description.toLowerCase();


            var searchValue3 = el.activity;
            var c = this.check(searchValue3, this.state.checkboxes);

            var searchValue4 = el.location;
            var searchValue5 = el.price;
            var searchValue6 = el.age_from;
            var searchValue7 = el.age_to;

            return (searchValue1.indexOf(this.state.querySet) && searchValue2.indexOf(this.state.querySet)) !== -1
                        && (this.state.checkboxes.length == 0 || c == true) 

                                && (searchValue5 >= +this.state.obj.searchPriceLower) 
                                    && (searchValue5 <= +this.state.obj.searchPriceHigh || this.state.obj.searchPriceHigh == '')
                                        && (searchValue6 >= +this.state.obj.ageLower) 
                                            && (searchValue7 <= +this.state.obj.ageHigh || this.state.obj.ageHigh == '');
        }, this);

        this.setState({
            displayedCourses: displayedCourses
        });
    },

    render: function() {
        return (
            <div className="courses">
                <label>Поиск</label><input type="text" className="search-field" onChange={this.handleInput} ref="pinki"/>

                <div>
                    {
                        this.state.data_activity.map(function (option) {
                            return <CheckOption
                                key={option.id}
                                value={option.title}
                                label={option.title}
                                filter={this.filter}
                            />
                        },this)
                    }
                </div>

                <label>цена от</label><input type="text" className="searchPriceLower" onChange={this.handleNumber} ref="price-lower"/>
                <label>цена до</label><input type="text" className="searchPriceHigh" onChange={this.handleNumber} ref="price-high"/>
                <br />
                <label>возраст от</label><input type="text" className="ageLower" onChange={this.handleNumber} ref="price-lower"/>
                <label>возраст до</label><input type="text" className="ageHigh" onChange={this.handleNumber} ref="price-high"/>

                <div className="courses-list">
                    {
                        this.state.displayedCourses.map(function(el) {
                            return <Courses
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
                            />;
                        })
                    }
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <CoursesList get_url="/api/get/courses" get_url_activity="/api/get/activity" />,
    document.getElementById("content")
);