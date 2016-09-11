/**
 * Created by egorutrobin on 27.08.16.
 */
import React from 'react';
import Answer from './answer';

export default class Question extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        data: {},
    };
  }

  render() {
    return (
      <div className="question" style={{marginTop: 25}}>
        {
          this.props.answers.answers.map(function (el) {
            return (
              <Answer
                answer={el.answer}
                id={el.id}
                key={el.id}
                getCourses={this.props.getCourses}
              />
            )
          }.bind(this))
        }
      </div>
    );
  }
}