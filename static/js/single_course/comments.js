/**
 * Created by pavelgolubev345 on 05.07.16.
 */

var username = document.getElementById('name').innerHTML;
var courseid = document.getElementById('course_id').innerHTML;

var Comment = React.createClass({
    render: function () {
        var owner = (username == this.props.author);
        return (
            <div className="comment">
                <div className="thumbnail">
                    <img className="img-responsive user-photo" src={this.props.pic} width="50"/>
                </div>

                <div className="panel panel-default">
                    <div className="panel-heading">
                        <strong>{this.props.author} </strong>
                        <dd className="data">прокомментировал {this.props.added_at}</dd>
                        <a onClick={this.props.onRemove} href="#" className={owner ? '' : 'none'}>   Удалить</a>
                    </div>
                    <div className="panel-body">
                        <p>{this.props.children}</p>
                    </div>
                </div>
                <div className="clear"></div>
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
                <Comment key={comment.id} author={comment.author} added_at={comment.added_at}
                         pic={comment.pic} onRemove={this.onRemove.bind(this, comment)}>
                    {comment.text}
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
    handleTextChange: function (e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var text = this.state.text.trim();
        if (!text)
            return;
        this.props.onCommentSumbit({text: text});
        this.setState({text: ''});
    },
    render: function () {
        return (
            <form className={(username.length == 0) ? 'none' : ''} onSubmit={this.handleSubmit}>
                <textarea type="textarea" value={this.state.text} placeholder="Enter you comment"
                       onChange={this.handleTextChange} ref="commentInput"/>
                <input type="submit" value="Отправить"/>
                <div className="clear"></div>
            </form>
        );
    }
});

var CommentWidget = React.createClass({
    handleCommentRemove: function (comment) {
        //Если пытаются удалить еще не добавленный коментарий ничего не делаем
        if (comment.id > 10000000)
            return;
        var comments = this.state.data;
        var newComments = this.state.data;
        newComments.splice(newComments.indexOf(comment), 1);
        this.setState({data: newComments});
        $.ajax({
            url: this.props.delete_url,
            type: 'POST',
            data: {
                comment_id: comment.id,
                csrfmiddlewaretoken: Cookies.get('csrftoken'),
            },
            dataType: 'json',
            success: function (data) {
                //Комментарий удален из базы
            }.bind(this),
            error: function (xth, status, error) {
                this.setState({data: comments});
                console.error(this.props.delete_url, status, err.toString());
            }.bind(this)
        });
    },

    handleCommentSubmit: function (comment) {
        var comments = this.state.data;
        comment.id = Date.now();
        comment.added_at = Date.now().toString();
        comment.author = username;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
        $.ajax({
            url: this.props.post_url,
            type: 'POST',
            data: {
                text: comment.text,
                csrfmiddlewaretoken: Cookies.get('csrftoken'),
                course_id: courseid
            },
            dataType: 'json',
            success: function (data) {
                //Коментарий добавлен в базу
                console.log("success");
            }.bind(this),
            error: function (xth, status, error) {
                this.setState({data: comments});
                console.error(this.props.post_url, status, err.toString());
            }.bind(this)
        });
    },

    getComments: function () {
        $.ajax({
            url: this.props.get_url,
            type: 'GET',
            data: {course_id: courseid},
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xrh, status, error) {
                console.error(this.props.get_url, status, err.toString());
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
    <CommentWidget get_url="/api/get/comments" delete_url="/api/delete/comment" post_url="/api/post/comment"/>,
    document.getElementById('root')
);