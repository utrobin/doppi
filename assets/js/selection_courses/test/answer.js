/**
 * Created by utrobin on 07.09.16.
 */
import React from 'react';
import Checkbox from 'material-ui/Checkbox';

export default class Answer extends React.Component {

  constructor(props) {
    super(props);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.state = {
        data: {},
        value: false
    };
  }

  componentWillMount() {
    let id = 'id' + this.props.id;
    if (localStorage.getItem(id) === null)
      localStorage.setItem(id, this.state.value);
    else {
      this.setState({
        value: JSON.parse(localStorage.getItem(id))
      });
    }
  }

  onCheck(event, isInputChecked) {
    let id = 'id' + this.props.id;
    localStorage.setItem(id, isInputChecked);
    this.setState({
        value: isInputChecked
    });
    this.props.getCourses;
  }

  render() {
    return (
      <Checkbox
        label={this.props.answer}
        checked={this.state.value}
        onCheck={(event, isInputChecked) => (this.onCheck(event, isInputChecked))}
      />
    );
  }
};