import 'babel-polyfill'
import React from 'react';
import {render} from 'react-dom'
import {Provider, connect} from 'react-redux'
import {createStore, combineReducers} from 'redux'
var asyncDone = require('async-done');

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CoursesList from './main_search/CoursesList';
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <CoursesList get_url="/api/get/courses" />
  </MuiThemeProvider>
);

render(
  <App />,
  document.getElementById('content')
);