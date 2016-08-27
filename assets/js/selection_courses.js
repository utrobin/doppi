/**
 * Created by egorutrobin on 27.08.16.
 */
import 'babel-polyfill'
import React from 'react';
import {render} from 'react-dom'
import {Provider, connect} from 'react-redux'
import {createStore, combineReducers} from 'redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import StepOne  from './selection_courses/step_number_one';
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <StepOne />
  </MuiThemeProvider>
);

render(
  <App />,
  document.getElementById('content')
);