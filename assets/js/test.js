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
    getInitialState: function () {
        return {
            check: false
        }
    },

    addAnswer: function (event) {
        if (this.state.check === false)
        {
            this.props.activeButton(1)
        }
        else {
            this.props.activeButton(-1)
        }

        this.setState({
            check: !this.state.check
        });
    },

    render: function () {
        return (
            <div>
                <label>
                    <input
                        type="checkbox"
                        value={this.props.id}
                        name={this.props.answer}
                        onClick={this.addAnswer}
                    />
                    <span>{this.props.answer}</span>
                </label>
            </div>
        )
    }
});

var CurrentQuestion = React.createClass({
    getInitialState: function () {
        return {
            data: [],
            currentQuestion: {},
            currentId: 0,
        }
    },

    render: function () {
        var temp = [];
        if (this.props.question.answers !== undefined)
        {
            temp = this.props.question.answers;
        }
        return (
            <div>
                <p>{this.state.currentId + 1}. {this.props.question.question}</p>
                {
                    temp.map(function (el) {
                        return (
                            <div>
                                <Answer
                                    key={el.id}
                                    id={el.id}
                                    answer={el.answer}
                                    activeButton={this.props.activeButton}
                                />
                            </div>
                        )
                    }, this)
                }

            </div>
        )
    }
});

var Number = React.createClass({
    render: function () {
        console.log(this.props)
        return (
            <i className={this.props.element.answered === true ? 'green' : ''}>
                {this.props.number}
            </i>
        )
    }
});

var Info = React.createClass({

    render: function () {
        var i = 0;
        return (
            <div>
                {
                    this.props.data.map(function(el) {
                        i++;
                        return (
                            <Number
                                currentId={this.props.currentId}
                                number={i}
                                element={el}
                                key={el.id}
                            />
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
            currentId: 0,
            selected: 0,
            results: {},
            amountQuestion: 0,
            finish: false
        }
    },

    activeButton: function (value) {
        var temp = this.state.selected + value;

        this.setState({
            selected: temp
        });
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

                var temp = {};
                data.map(function (el) {
                    temp[el.id] = [];
                });

                this.setState({
                    data: data,
                    currentQuestion: data[this.state.currentId],
                    results: temp,
                    amountQuestion: data.length
                });

            }.bind(this),
        })

    },

    nextQuestion: function () {
        var idQ = this.state.currentId;
        var temp = true;
        var i = 1;

        while (temp)
        {
            if (idQ + i < this.state.data.length)
            {
                temp = this.state.data[idQ + i].answered;
                i++;
            }
            else
            {
                temp = this.state.data[0].answered;
                idQ = 0;
                i = 1;
            }
        }
        this.setState({
            currentId: idQ + i - 1,
            currentQuestion: this.state.data[idQ + i - 1],
            selected: 0
        });
    },

    answerQuestion: function () {
        var selectedAnswers = $("input:checkbox:checked");
        var temp = [];
        for (var i = 0; i < selectedAnswers.length; i++) {
            temp.push(selectedAnswers[i].value)
        }

        var realtor = this.state.results;
        realtor[this.state.currentQuestion.id] = temp;
        this.setState({
            results: realtor,
            amountQuestion: --this.state.amountQuestion
        });

        temp = this.state.data;
        temp[this.state.currentId].answered = true;
        this.setState({
            data: temp
        });

        if (this.state.amountQuestion > 0)
            this.nextQuestion();
        else {
            this.setState({
                finish: true
            });
        }

    },

    render: function () {
        if (!this.state.finish){
            return (
                <div>
                    <div className="info_test">
                        <Info
                            data={this.state.data}
                            currentId={this.state.currentId}
                        />
                    </div>
                    <div className="main">
                        <CurrentQuestion
                            question={this.state.currentQuestion}
                            activeButton={this.activeButton}
                        />
                        <input type="button" value="Ответить" onClick={this.answerQuestion}
                            disabled={this.state.selected <= 0 ? 'disabled' : ''}
                            className={this.state.selected <= 0 ? 'disabled answer_button' : 'answer_button'}/>
                        <input type="button" className="answer_puss" value="Пропустить вопрос" onClick={this.nextQuestion}/>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div>
                    <h1>Вы успешно прошли тест</h1>
                </div>
            )
        }

    }
});

render(
    <Test get_url_test="/authentication/get/questions"/>,
    document.getElementById("test")
);