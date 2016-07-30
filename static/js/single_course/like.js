/**
 * Created by egorutrobin on 30.07.16.
 */

var id = document.getElementById('id').innerHTML;

var Like = React.createClass({
    getInitialState: function() {
        return ({
            liked: false,
            rating: 0,
            authenticated: false,
        });
    },

    componentDidMount: function () {
        $.ajax({
            url: "/rating",
            type: 'GET',
            dataType: 'json',
            cache: false,
            data: {course_id: id}
        }).done(function(data) {
            this.setState({
                liked: data[0].liked,
                rating: data[0].rating,
                authenticated: data[0].is_authenticated,
            });
            console.log(this.state)
        }.bind(this));
    },

    handleLike: function(event) {
        this.setState({
            liked: !this.state.liked,
            rating: this.state.liked ? this.state.rating - 1 : this.state.rating + 1
        });
        $.ajax({
            url: "/like",
            type: 'GET',
            dataType: 'json',
            cache: false,
            data: {course_id: id}
        }).done(function(data) {
            //
        }.bind(this));
    },
    render: function () {
        return (
            <div className="rating">
                <div className="wrapper-like" onClick={this.state.authenticated ? this.handleLike : ''}>
                    <div className={this.state.liked ? "heart heart_red" : "heart"} ></div>
                </div>
                <div className="rating-number">{this.state.rating}</div>
            </div>
        );
    }
});

ReactDOM.render(
    <Like />,
    document.getElementById("like")
);





