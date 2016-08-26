/**
 * Created by egorutrobin on 25.08.16.
 */
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Course from './Course';
import Offer from './offer';

var currentAjax = $.ajax();

var CoursesList = React.createClass({
    getInitialState: function () {
        return {
            isLoading: false,
            courses: [],
            page: 0,
        };
    },

    componentWillMount: function () {
        this.getCourses()
    },

    getCourses: function () {
        this.setState({isLoading: true, page: 0});

        currentAjax.abort();

        var options = {
            query: "",
            checkboxes: [],
            priceFrom: "",
            priceTo: "",
            ageFrom: "",
            ageTo: "",
            level: "",
            sortValue: "-id"
        };

        currentAjax = $.ajax({
            url: this.props.get_url, type: 'GET', dataType: 'json', cache: false,
            data: {
                page: 0,
                options: JSON.stringify(options),
            },
            success: function (data) {
                this.setState({
                    courses: data,
                    isLoading: false,
                    page: 1
                });

            }.bind(this),
        });

    },

    loadMoreCourses: function () {
        this.setState({
            isLoading: true,
        });

        currentAjax.abort();

        var options = {
            query: "",
            checkboxes: [],
            priceFrom: "",
            priceTo: "",
            ageFrom: "",
            ageTo: "",
            level: "",
            sortValue: "-id"
        };

        currentAjax = $.ajax({
            url: this.props.get_url, type: 'GET', dataType: 'json', cache: false,
            data: {page: this.state.page, options: JSON.stringify(options)},
            success: function (data) {
                var temp = this.state.courses;
                temp.push(...data);

                this.setState({
                    isLoading: false,
                    courses: temp,
                    page: this.state.page + 1
                });
            }.bind(this),
        });
    },



    render: function () {
        return (
            <div>
                <Offer />
                <div className="courses">
                    {
                        this.state.courses.map(function (el) {
                            return (
                                <Course
                                    key={el.id}
                                    id={el.id}
                                    author={el.author}
                                    image={el.pic}
                                    title={el.title}
                                    introtext={el.introtext}
                                    age_from={el.age_from}
                                    age_to={el.age_to}
                                    time_from={el.time_from}
                                    time_to={el.time_to}
                                    activity={el.activity}
                                    location={el.location}
                                    price={el.price}
                                    frequency={el.frequency}
                                    rating={el.rating}
                                    liked={el.liked}
                                    authenticated={el.is_authenticated}
                                />
                            )
                        })
                    }

                    <div className="loading">
                        <div className={this.state.isLoading ? '' : 'none'}>
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
                        <RaisedButton onTouchTap={this.loadMoreCourses} className={this.state.isLoading ? 'none' : ''} label="Загрузить еще" primary={true} />
                    </div>
                </div>
                <div className="clear"></div>
            </div>
        );
    }
});

export default CoursesList;