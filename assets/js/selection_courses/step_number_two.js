/**
 * Created by egorutrobin on 27.08.16.
 */
import React from 'react';
import Chip from 'material-ui/Chip';
import AutoComplete from 'material-ui/AutoComplete';
import Question from './test/question';
import CircularProgress from 'material-ui/CircularProgress';

export default class StepTwo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
    };
  }

  componentWillMount() {
    $.ajax({
      url: this.props.get_url_test,
      type: 'GET',
      data: {test_id: 1},
      dataType: 'json',
      cache: false,

      success: function (data) {
        this.setState({
          data: data.slice(0, 8),
          isLoading: false
        });
      }.bind(this),
    })
  }

  render() {
    if (this.state.isLoading === true)
    {
      return (
        <div style={{textAlign: 'center'}}>
          <CircularProgress size={0.6} />
        </div>
      );
    }
    else
    {
      return (
        <div>
          <span style={{color: 'rgb(0, 188, 212)', fontSize: 20}}>Выберите, пожалуйста, из двух вариантов ответа в паре, тот, который встречается у вашего ... чаще. Если оба варианта встречаются одинаково часто, выбираете оба, если ни один - не выбираете.</span>
          {
            this.state.data.map(function (el) {
              return (
                <Question
                  answers={el}
                  key={el.id}
                />
              )
            })
          }
        </div>
      );
    }
  }
}