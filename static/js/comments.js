/**
 * Created by pavelgolubev345 on 05.07.16.
 */

var username = document.getElementById('name').innerHTML;
var courseid = document.getElementById('course_id').innerHTML;

var Comment = React.createClass({
    dateTransformer: function (date) {
        //2016-07-03T14:46:20Z
        // return date;
        return date.slice(8,10) + '.' + date.slice(5,7) + '.' + date.slice(0,4) + ' в ' + date.slice(11,19) + ' ';
    },
    render: function () {
        var owner = (username == this.props.author);
        return (
            <div>
                <p>{this.props.author} отставил комментарий {this.dateTransformer(this.props.added_at)}
                    <a onClick={this.props.onRemove} href="#" className={owner ? '' : 'none'}>Удалить</a>
                </p>
                <p>{this.props.children}</p>
            </div>
        );
    }
});

var CommentList = React.createClass({
    onRemove: function (comment, e) {
        this.props.onCommentRemove(comment);
    },

    render: function () {
        var comments = this.props.data.map(function (comment) {
            return (
                <Comment key={comment.pk} author={comment.fields.author} added_at={comment.fields.added_at}
                         onRemove={this.onRemove.bind(this, comment)}>
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
            <form onSubmit={this.handleSubmit}>
                <input type="text" value={this.state.text} placeholder="Enter you comment"
                       onChange={this.handleTextChange} ref="commentInput"/>
                <input type="submit" value="Post"/>
            </form>
        );
    }
});

var CommentWidget = React.createClass({
    handleCommentRemove: function (comment) {
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
                this.setState({data: data});
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
                this.setState({data: data});
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
    componentDidMount: function () {
        // this.setState({data: data});
        this.getComments();
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