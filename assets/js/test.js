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

var Test = React.createClass({
    getInitialState: function () {
        return {

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
                }.bind(this),

            error: function (xrh, status, error) {
                console.error(this.props.get_url_activity, status, err.toString());
            }.bind(this)
        });
    },

    render: function () {
        return (
            <ul>

            </ul>
        )
    }
});


render(
    <Test get_url_test="/authentication/get/questions"/>,
    document.getElementById("test")
);