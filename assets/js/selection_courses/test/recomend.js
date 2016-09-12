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
    console.log(this.props.data.amount)
    return (
      <div>
        <RaisedButton
          label="Toggle Drawer"
          onTouchTap={this.handleToggle}
        />
        <Drawer width={200} openSecondary={true} open={this.state.open} overlayClassName='gfgfgfgf'>

        </Drawer>
        <div className="fix-recom">
          <span>Для вас подобрано более {this.props.data.amount} курсов</span>
        </div>
      </div>
    );
  }
}