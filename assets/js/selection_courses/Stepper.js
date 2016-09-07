/**
 * Created by egorutrobin on 27.08.16.
 */
import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import StepOne  from './step_number_one';
import StepTwo  from './step_number_two';
import StepThree  from './step_number_three';
import Paper from 'material-ui/Paper';


class HorizontalLinearStepper extends React.Component {
  constructor(props) {
    super(props);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.state = {
      finished: false,
      stepIndex: 0,
    };
  }

  componentWillMount() {
    if (localStorage.getItem('stepIndex') === null)
      localStorage.setItem('stepIndex', 0);
    else {
      this.setState({
        stepIndex: JSON.parse(localStorage.getItem('stepIndex')),
        finished: JSON.parse(localStorage.getItem('stepIndex')) > 2,
      });
    }
  }

  handleNext = () => {
    const {stepIndex} = this.state;
    localStorage.setItem('stepIndex', stepIndex + 1);
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      localStorage.setItem('stepIndex', stepIndex - 1);
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  errorStep = () => {
    localStorage.setItem('stepIndex', 0);
    this.setState({stepIndex: 0});
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return <StepOne />;
      case 1:
        return <StepTwo get_url_test="/authentication/get/questions" />;
      case 2:
        return <StepThree get_url_test="/authentication/get/questions" />;
      default:
        return this.errorStep;
    }
  }

  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px', paddingBottom: 25};

    return (
      <Paper zDepth={1} style={{width: '100%', maxWidth: 700, margin: 'auto', marginTop: '25px'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Первый шаг</StepLabel>
          </Step>
          <Step>
            <StepLabel>Второй шаг</StepLabel>
          </Step>
          <Step>
            <StepLabel>Финал</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {finished ? (
            <p>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({stepIndex: 0, finished: false});
                  localStorage.setItem('stepIndex', 0);
                }}
                style={{color: 'rgb(255, 64, 129)'}}
              >
                Вернуться на первый шаг
              </a> Далее тут ещё не доделали.
            </p>
          ) : (
            <div>
              <div>{this.getStepContent(stepIndex)}</div>
              <div style={{marginTop: 25, textAlign: 'right'}}>
                <FlatButton
                  label="Назад"
                  disabled={stepIndex === 0}
                  onTouchTap={this.handlePrev}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  label={stepIndex === 2 ? 'Закончить' : 'Вперед'}
                  primary={true}
                  onTouchTap={this.handleNext}
                />
              </div>
            </div>
          )}
        </div>
      </Paper>
    );
  }
}

export default HorizontalLinearStepper;