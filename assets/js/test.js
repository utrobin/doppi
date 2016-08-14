/**
 * Created by egorutrobin on 14.08.16.
 */
import 'babel-polyfill'
import React from 'react'
import {render} from 'react-dom'
import {Provider, connect} from 'react-redux'
import {createStore, combineReducers} from 'redux'
var asyncDone = require('async-done');

var currentAjax = $.ajax();
var test_id = document.getElementById('test_id').innerHTML;

var Answer = React.createClass({

    render: function () {
        return (
            <li>
                <input
                    type="checkbox"
                    value={this.props.answer}
                />
                {this.props.answer}
            </li>
        )
    }
});

var CurrentQuestion = React.createClass({

    render: function () {
        var temp = [];
        if (this.props.question.answers !== undefined)
        {
            temp = this.props.question.answers;
        }
        return (
            <div>
                <p>{this.props.question.question}</p>
                {
                    temp.map(function (el) {
                        return (
                            <ul>
                                <Answer
                                    key={el.id}
                                    answer={el.answer}
                                />
                            </ul>
                        )
                    }, this)
                }

            </div>
        )
    }
});


var Test = React.createClass({
    getInitialState: function () {
        return {
            data: [],
            currentQuestion: {},
            currentId: 0
        }
    },

    componentWillMount: function () {
        $.ajax({
            url: this.props.get_url_test,
            type: 'GET',
            data: {test_id: test_id},
            dataType: 'json',
            cache: false,

            success: function (data) {
                console.log(data)

                this.setState({
                    data: data,
                    currentQuestion: data[this.state.currentId]
                });
            }.bind(this),
        })
    },

    nextQuestion: function () {
        if (this.state.currentId + 1 < this.state.data.length)
        {
            this.setState({
                currentId: ++this.state.currentId,
                currentQuestion: this.state.data[this.state.currentId],
            });
        }
        else
        {
           this.setState({
                currentId: 0,
                currentQuestion: this.state.data[0],
            });
        }

        console.log(this.state)
    },

    render: function () {
        return (
            <div>
                <CurrentQuestion
                    question={this.state.currentQuestion}
                />
                <input type="button" value="Пропустить вопрос" onClick={this.nextQuestion}/>
            </div>
        )
    }
});


render(
    <Test get_url_test="/authentication/get/questions"/>,
    document.getElementById("test")
);