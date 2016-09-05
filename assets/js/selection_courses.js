/**
 * Created by egorutrobin on 27.08.16.
 */
import 'babel-polyfill'
import React from 'react';
import {render} from 'react-dom'
import {Provider, connect} from 'react-redux'
import {createStore, combineReducers} from 'redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import HorizontalLinearStepper  from './selection_courses/Stepper';

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <HorizontalLinearStepper />
  </MuiThemeProvider>
);

render(
  <App />,
  document.getElementById('content')
);