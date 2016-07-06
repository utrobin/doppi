/**
 * Created by pavelgolubev345 on 05.07.16.
 */

var username = document.getElementById('name').innerHTML;
var courseid = document.getElementById('course_id').innerHTML;

var Comment = React.createClass({
    dateTransformer: function (date) {
        if (date[0] == '2') {
            return date.slice(8, 10) + '.' + date.slice(5, 7) + '.' + date.slice(0, 4) + ' в ' + date.slice(11, 19) + ' ';
        } else {
            return "";
        }
    },
    render: function () {
        var owner = (username == this.props.author);
        return (
            <div className="row">
                <div className="col-xs-2">
                    <div className="thumbnail">
                        <img className="img-responsive user-photo"
                             src={this.props.pic}/>
                    </div>
                </div>

                <div className="col-xs-10">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <strong>{this.props.author}</strong> <span
                            className="text-muted">прокомментировал {this.dateTransformer(this.props.added_at)}<a
                            onClick={this.props.onRemove} href="#" className={owner ? '' : 'none'}>Удалить</a></span>
                        </div>
                        <div className="panel-body">
                            <p>{this.props.children}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var CommentList = React.createClass({
    onRemove: function (comment, e) {
        e.preventDefault();
        this.props.onCommentRemove(comment);
    },

    render: function () {
        var comments = this.props.data.map(function (comment) {
            return (
                <Comment key={comment.pk} author={comment.fields.author} added_at={comment.fields.added_at}
                         pic={comment.pic} onRemove={this.onRemove.bind(this, comment)}>
                    {comment.fields.text}
                </Comment>
            );
        }, this);
        return (
            <div>
                {comments}
            </div>
        )
    }
});

var CommentForm = React.createClass({
    getInitialState: function () {
        return {text: ''};
    },
    componentDidMount: function () {
        this.refs.commentInput.focus();
    },
    handleTextChange: function (e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var text = this.state.text.trim();
        if (!text)
            return;
        this.props.onCommentSumbit({fields: {text: text}});
        this.setState({text: ''});
        this.refs.commentInput.focus();
    },
    render: function () {
        return (
            <form className={(username.length == 0) ? 'none' : ''} onSubmit={this.handleSubmit}>
                <input type="text" value={this.state.text} placeholder="Enter you comment"
                       onChange={this.handleTextChange} ref="commentInput"/>
                <input type="submit" value="Post"/>
            </form>
        );
    }
});

var CommentWidget = React.createClass({
    handleCommentRemove: function (comment) {
        //Если пытаются удалить еще не добавленный коментарий ничего не делаем
        if (comment.pk > 10000000)
            return;
        var comments = this.state.data;
        var newComments = this.state.data;
        newComments.splice(newComments.indexOf(comment), 1);
        this.setState({data: newComments});
        $.ajax({
            url: this.props.removeurl,
            type: 'POST',
            data: {
                commentid: comment.pk,
                csrfmiddlewaretoken: Cookies.get('csrftoken'),
                courseid: courseid
            },
            dataType: 'json',
            success: function (data) {
                // this.setState({data: data});
                console.log("success");
            }.bind(this),
            error: function (xth, status, error) {
                this.setState({data: comments});
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    handleCommentSubmit: function (comment) {
        var comments = this.state.data;
        comment.pk = Date.now();
        comment.fields.added_at = Date.now().toString();
        comment.fields.author = username;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
        $.ajax({
            url: this.props.geturl,
            type: 'POST',
            data: {
                text: comment.fields.text,
                csrfmiddlewaretoken: Cookies.get('csrftoken'),
                courseid: courseid
            },
            dataType: 'json',
            success: function (data) {
                // this.setState({data: data});
                console.log("success");
            }.bind(this),
            error: function (xth, status, error) {
                this.setState({data: comments});
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    getComments: function () {
        $.ajax({
            url: this.props.geturl,
            type: 'GET',
            data: {courseid: courseid},
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xrh, status, error) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {data: []};
    },
    componentWillMount: function () {
        this.pusher = new Pusher('3140ed0ba3ff0af4856a', {
            cluster: 'eu',
            encrypted: true
        });
        this.channel = this.pusher.subscribe('comments');

    },
    componentDidMount: function () {
        this.getComments();
        this.channel.bind('new_comment', function (comment) {
            this.getComments();
        }, this)
    },
    render: function () {
        return (
            <div>
                <CommentList data={this.state.data} onCommentRemove={this.handleCommentRemove}/>
                <CommentForm onCommentSumbit={this.handleCommentSubmit}/>
            </div>
        );
    }
});

ReactDOM.render(
    <CommentWidget geturl="/get/comments" removeurl="/remove/comments"/>,
    document.getElementById('root')
);