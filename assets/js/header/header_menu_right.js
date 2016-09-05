/**
 * Created by utrobin on 02.09.16.
 */
import React from 'react';
import {render} from 'react-dom';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const style = {
    marginTop: 6,
};


export default class Menu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        chipData: [],
        value: 0,
        searchText: ''
    };
  }

  render() {
    return (
    <div>
      {
        window.auth ? (
          <div style={{color: '#fff'}}>

            <IconMenu
              className="logoK"
              iconButtonElement={
                <IconButton
                  iconClassName="material-icons"
                >
                  {window.username.innerHTML}
                </IconButton>
              }
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              >
              <MenuItem primaryText="Мой профиль" href="/authentication/edit" />
              <MenuItem primaryText="Настройки" href="/authentication/settings" />
              <MenuItem primaryText="Выйти" href="/authentication/logout" />
            </IconMenu>
          </div>
        ) : (
          <div style={style}>
            <RaisedButton label="Войти" href="/authentication/signin"/>
            <RaisedButton label="Зарегистрироваться" href="/authentication/signup" secondary={true} style={{marginLeft: 10}}/>
          </div>
        )
      }
    </div>
    );
  }
}
