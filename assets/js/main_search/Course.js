
import React from 'react';

var Course = React.createClass({
    getInitialState: function () {
        return ({
            liked: this.props.liked,
            rating: this.props.rating
        });
    },

    handleLike: function (event) {
        this.setState({
            liked: !this.state.liked,
            rating: this.state.liked ? this.state.rating - 1 : this.state.rating + 1
        });
        $.ajax({
            url: "/like",
            type: 'GET',
            dataType: 'json',
            cache: false,
            data: {course_id: this.props.id}
        }).done(function (data) {
            //
        }.bind(this));
    },

    render: function () {
        return (
          <div className="course">
              <div className="course-wrapper">
                  <img className="course-image" src={this.props.image} width="250px"/>
                  <div className="Golubev"></div>
                  <div className="course-wrapper-title">
                      <div className="rating">
                          <div className="rating-number">{this.state.rating}</div>
                          <div className="wrapper-like" onClick={this.props.authenticated ? this.handleLike : ''}>
                              <div className={this.state.liked ? "heart heart_red" : "heart"}></div>
                          </div>
                      </div>
                      <div className="course-name">{this.props.author}</div>
                      <a href={'/course/' + this.props.id}>
                          <div className="course-title">{this.props.title}</div>
                      </a>
                      <div className="age">{this.props.age_from}+</div>
                  </div>

                  <div className="course-info">
                      <div className="course-description">{this.props.introtext}</div>
                      <div className="course-activity">
                          <b>Категория:</b>
                          <span>{this.props.activity}</span>
                      </div>
                      {this.props.location !== '' ? (
                        <div className="course-price">
                            <b>Метро:</b>
                            <span>{this.props.location}</span>
                        </div>
                      ) : ''}

                  </div>
              </div>
          </div>
        );
    }
});

export default Course;