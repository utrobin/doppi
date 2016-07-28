/**
 * Created by egorutrobin on 27.07.16.
 */

var currentAjax = $.ajax();

var Courses = React.createClass({
    render: function () {
        return (
            <div className="Rcourse">
                <div className="Rcourse-wrapper">
                    <img className="Rcourse-image" src={this.props.image} width="250px"/>
                    <div className="RGolubev"></div>
                    <div className="Rcourse-wrapper-title">
                        <div className="age">{this.props.age_from}+</div>
                        <div className="Rcourse-name">{this.props.author}</div>
                        <span>{this.props.activity}</span>
                        <a href={'/course/'+this.props.id}>
                            <div className="Rcourse-title">{this.props.title}</div>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
});

var CoursesList = React.createClass({
    getInitialState: function () {
        return {
            isLoading: false,
            data: [],
            page: 0,
        };
    },

    componentDidMount: function () {

        var browserWindow = $(window);
        var height = browserWindow.height();

        var begin = Math.floor((height - 150)/202);
        this.getCourses(begin);
        var temp = 202*begin;

        var hCourse = $('#page-course').css('height');
        hCourse = +hCourse.slice(0, hCourse.length - 2);



        window.onscroll = function() {
            var scrolled = window.pageYOffset || document.documentElement.scrollTop;
            if(scrolled == undefined)
                scrolled = 1;

            if (scrolled + height >= temp && temp < hCourse - 202*begin )
            {
                var mount = Math.floor((scrolled + height - temp) / 202);
                if (mount < 4) {
                    mount = 3;
                    temp = temp + 202*3;
                    this.loadMoreCourses(mount);
                }
                if (mount > 3) {
                    temp = temp + 202 * mount;
                    this.loadMoreCourses(mount);
                }
            }



            var pageY = window.pageYOffset || document.documentElement.scrollTop;
              var innerHeight = document.documentElement.clientHeight;

              switch (updownElem.className) {
                case '':
                  if (pageY > innerHeight) {
                    updownElem.className = 'up';
                  }
                  break;

                case 'up':
                  if (pageY < innerHeight) {
                    updownElem.className = '';
                  }
                  break;

                case 'down':
                  if (pageY > innerHeight) {
                    updownElem.className = 'up';
                  }
                  break;

              }
        }.bind(this)
    },


    getCourses: function (mount) {
        this.setState({isLoading: true, page: 0});
        currentAjax.abort();
        currentAjax = $.ajax({
            url: this.props.get_url, type: 'GET', dataType: 'json', cache: false,
            data: {page: 0, mount: mount},
            success: function (data) {

                this.setState({
                    isLoading: false,
                    page: 1,
                    data: data,
                });
            }.bind(this),
            error: function (xrh, error) {
                if (error !== 'abort')
                    console.error(this.props.get_url, status, error.toString());
            }.bind(this)
        });

    },

    loadMoreCourses: function (mount) {
        this.setState({isLoading: true});
        currentAjax.abort();
        currentAjax = $.ajax({
            url: this.props.get_url, type: 'GET', dataType: 'json', cache: false,
            data: {page: this.state.page, mount: mount},
            success: function (data) {
                var tmp = this.state.data.concat(data);
                var p = Math.ceil(mount/3);
                this.setState({
                    data: tmp,
                    isLoading: false,
                    page: this.state.page + p
                });
            }.bind(this),
            error: function (xrh, error) {
                if (error !== 'abort')
                    console.error(this.props.get_url, status, error.toString());
            }.bind(this)
        });
    },

    render: function () {
        return (
            <div>
                {
                    this.state.data.map(function (el) {
                        return (
                            <Courses
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
                        </div>
                    </div>
        );
    }
});

ReactDOM.render(
    <CoursesList get_url="/api/get/recommendcourses" />,
    document.getElementById("recommend_courses")
);



var updownElem = document.getElementById('updown');

    var pageYLabel = 0;

    updownElem.onclick = function() {
      var pageY = window.pageYOffset || document.documentElement.scrollTop;

      switch (this.className) {
        case 'up':
          pageYLabel = pageY;
          window.scrollTo(0, 0);
          this.className = 'down';
          break;

        case 'down':
          window.scrollTo(0, pageYLabel);
          this.className = 'up';
      }

    }




