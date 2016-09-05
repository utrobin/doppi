import React from 'react';
import AppBar from 'material-ui/AppBar';
import {render} from 'react-dom';
import Logo from 'material-ui/svg-icons/social/school';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Menu from './header/header_menu_right';

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

function handleTouchTap() {
  document.location.href = '/';
}

const AppBarExampleIconMenu = () => (
  <MuiThemeProvider>
    <AppBar
      style={{width:1000, paddingLeft: 20, paddingRight: 20, margin: 'auto', boxShadow: 'none'}}
      className='new-logo'
      titleStyle={{fontWeight: 700, fontSize: 48}}
      iconStyleLeft={{width: 50}}
      onTitleTouchTap={handleTouchTap}
      title="Doppi"
      iconElementLeft={
          <a href="/"><Logo style={{height: 48, width: 48, color: "#fff"}}/></a>
      }
      iconElementRight={<Menu style={{marginTop: 3}}
      />}
    />
  </MuiThemeProvider>
);

render(
  <AppBarExampleIconMenu />,
  document.getElementById('nav')
);