/**
 * Created by egorutrobin on 01.08.16.
 */
import 'babel-polyfill'
import React from 'react'
import {render} from 'react-dom'
import {Provider, connect} from 'react-redux'
import {createStore, combineReducers} from 'redux'
var asyncDone = require('async-done');

var currentAjax = $.ajax();

var Leaf = React.createClass({

    handleClick: function (event) {
        var omg = event.target.name;
        document.getElementById('id_activity').value = event.target.name;
        this.props.activeValue(omg);
    },

    render: function () {
        return (
            <li onClick={this.handleClick}  name={this.props.name} className={this.props.activeId == this.props.name ? 'active' : ''}>
                <a name={this.props.name}>{this.props.title}</a>
            </li>
        )
    }
});


var Branch = React.createClass({

    getInitialState: function () {
        return {
            isDisplayed: false,
        }
    },

    handleClick: function (event) {
        this.setState({
            isDisplayed: !this.state.isDisplayed
        });

    },

    render: function () {
        return (

            <li>
                <a className="parent-menu" onClick={this.handleClick}>{this.props.branch}</a>
                <ul style={this.state.isDisplayed ? {display: 'block'} : {display: 'none'}}>
                    {
                        this.props.leaves.map(function (el) {
                            return (
                                <Leaf key={el.id} name={el.id} title={el.title} activeValue={this.props.activeValue} activeId={this.props.activeId}/>
                            )
                        }, this)
                    }
                </ul>
            </li>
        )
    }
});

var Tree = React.createClass({
    getInitialState: function () {
        return {
            tree: [],
            activeValue: -1
        }
    },

    activeValue: function (value) {
        console.log(value);
        this.setState({
            activeValue: value
        });
    },

    componentWillMount: function () {
        $.ajax({
            url: this.props.get_url_activity, type: 'GET', dataType: 'json', cache: false,
            success: function (data) {
                this.setState({tree: data});
            }.bind(this),
            error: function (xrh, status, error) {
                console.error(this.props.get_url_activity, status, err.toString());
            }.bind(this)
        });
    },

    render: function () {
        return (
            <ul>{
                this.state.tree.map(function (el) {
                    return (
                            <Branch
                                key={el.id}
                                name={el.id}
                                leaves={el.content}
                                branch={el.title}
                                activeValue={this.activeValue}
                                activeId={this.state.activeValue}
                            />
                    )
                }, this)
            }</ul>
        )
    }
});


render(
    <Tree get_url_activity="/api/get/activity"/>,
    document.getElementById("menu")
);