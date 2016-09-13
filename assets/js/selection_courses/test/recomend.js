import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

export default class DrawerOpenRightExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    return (
      <div style={{marginLeft: 26}}>
        <div className="fix-recom">
          <span>Для вас подобрано более {this.props.data.amount} курсов</span>
        </div>
      </div>
    );
  }
}