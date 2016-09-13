/**
 * Created by utrobin on 13.09.16.
 */
import React from 'react';
import TextField from 'material-ui/TextField';

export default class Finish extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      location: '',
      getLocation: true
    };
  }

  success = (position) => {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log(latitude, longitude)
    this.setState({getLocation: true});
  };

  error = () => {
    console.log('jjjnj')
    this.setState({getLocation: false});
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.success, this.error);
  }

  getName = () => {
    console.log('gfg');
    let name = localStorage.getItem('inputName');
    try {
        var rn = new RussianName(name);
        var pred = rn.fullName(rn.gcaseDat);
        return pred
    } catch(e) {
        return 'Вашему ребенку'
    }
  };

  render() {
    return (
      <div style={{fontSize: 24, textAlign: 'center'}}>
        <p>
          <strong style={{color: 'rgb(255, 64, 129)', fontSize: 26, fontStyle: 'italic'}}>
            {this.getName()}</strong> подойдут следующие дополнительные курсы:
        </p>
        <span>В радиусе </span>
        { this.state.getLocation ? (
          <TextField
            hintText="Hint Text"
          />
        ) : (<span style={{color: 'crimson'}}>(не удалось получить геопозицию)</span>)}
        <span> км</span><br/>

        <a href="#" onClick={(event) => {
          event.preventDefault();
          this.props.back()
        }} style={{color: 'rgb(255, 64, 129)'}}>
          Вернуться на первый шаг 
        </a>
      </div>
    );
  }
}