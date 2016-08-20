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
        var temp = '';
        if (this.props.several)
        {
            temp = 'checkbox';
        }
        else {
            temp = 'radio';
        }

        return (
            <label>
                <input
                    type={temp}
                    value={this.props.id}
                    onClick={this.addAnswer}
                    name="answer"
                />
                {this.props.answer}
            </label>

        )
    }
});

var CurrentQuestion = React.createClass({

    render: function () {
        var temp = [];
        if (this.props.question.answers !== undefined)
        {
            if(this.props.question.yesno === true){
                temp = [
                    {
                        id: 1,
                        answer: 'Да'
                    }, {
                        id: 0,
                        answer: 'Нет'
                    }
                ]
            }
            else
                temp = this.props.question.answers;
        }

        if (this.props.question.yesno === true)
        {
            var answer
        }
        return (
            <div>
                <p>{this.props.currentId + 1}. {this.props.question.question}</p>
                {
                    temp.map(function (el) {
                        return (
                            <Answer
                                key={el.id}
                                id={el.id}
                                several={this.props.question.several}
                                answer={el.answer}
                                activeButton={this.props.activeButton}
                            />
                        )
                    }, this)
                }

            </div>
        )
    }
});

var Number = React.createClass({

    choiceQuestion: function () {
        this.props.choiceQuestion(this.props.number - 1, this.props.element)
    },

    render: function () {
        var temp;

        if(this.props.element.answered === true){
            temp = 'green'
        }
        else if(this.props.currentQuestionId == this.props.element.id)
        {
            temp = 'orange'
        }
        else if(this.props.element.answered === 8)
        {
            temp = 'grey'
        }

        return (
            <i className={temp === 'green' || temp === 'orange' ? temp + ' dis' : temp }
               onClick={temp === 'green' || temp === 'orange' ? (0) : this.choiceQuestion }>
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
                                currentQuestionId={this.props.currentQuestionId}
                                number={i}
                                element={el}
                                key={el.id}
                                choiceQuestion={this.props.choiceQuestion}
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
        console.log('wepback живи');
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

        while (temp === true)
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

    missQuestion: function () {
        var temp = this.state.data;
        temp[this.state.currentId].answered = 8;
        this.setState({
            data: temp
        });
        if (this.state.amountQuestion > 0)
            this.nextQuestion();
        else {
            this.setState({
                finish: true
            });
            console.log(this.state.results)
        }
    },

    answerQuestion: function () {
        var selectedAnswers = [];
        if (this.state.currentQuestion.several)
        {
            selectedAnswers = $("input:checkbox:checked");
        }
        else {
            selectedAnswers = $("input:radio:checked");
        }

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
            this.finish()
        }

    },

    choiceQuestion: function (a, b) {
        var temp = this.state.data;
        temp[this.state.currentId].answered = 8;

        this.setState({
            data: temp,
            currentId: a,
            currentQuestion: b,
            selected: 0
        });
    },

    finish: function () {
        console.log(this.state.results)
        this.setState({
            finish: true
        });

        $.ajax({
            url: this.props.save_test,
            type: 'GET',
            data: {data: JSON.stringify(this.state.results)},
            dataType: 'json',
            cache: false,
        })
    },

    render: function () {
        if (!this.state.finish){
            return (
                <div>
                    <div className="info_test">
                        <span>Вопросы:</span>
                        <Info
                            data={this.state.data}
                            currentQuestionId={this.state.currentQuestion.id}
                            choiceQuestion={this.choiceQuestion}
                        />
                        <a onClick={this.finish}>Завершить тест</a>
                    </div>
                    <div className="main">
                        <CurrentQuestion
                            question={this.state.currentQuestion}
                            activeButton={this.activeButton}
                            currentId={this.state.currentId}
                        />
                        <input type="button" value="Ответить"
                            onClick={this.answerQuestion}
                            disabled={this.state.selected <= 0 ? 'disabled' : ''}
                            className={this.state.selected <= 0 ? 'disabled answer_button' : 'answer_button'}/>

                        <input type="button" className="answer_puss" value="Пропустить вопрос" onClick={this.missQuestion}/>
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
    <Test get_url_test="/authentication/get/questions" save_test="/authentication/test/save"/>,
    document.getElementById("test")
);