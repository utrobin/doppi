/**
 * Created by utrobin on 13.09.16.
 */
import React from 'react';
import Course from './course';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

export default class Finish extends React.Component {

  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.state = {
      data: [],
      isLoading: true,
      location: '',
      getLocation: true
    };
  }

  init = () => {
    ymaps.geolocation.get({
      provider: 'browser',
      mapStateAutoApply: true
    }).then(function (result) {
      localStorage.setItem('coor_x', result.geoObjects.position[0]);
      localStorage.setItem('coor_y', result.geoObjects.position[1]);
    });
    if (localStorage.getItem('coor_x') !== null && localStorage.getItem('coor_x') !== '')
    {
      this.props.getCourses();
      localStorage.setItem('rad', 10);
    }
    else
      this.setState({getLocation: false});
  };

  componentDidMount() {
    ymaps.ready(this.init);
  }

  radChange = (e) => {
    localStorage.setItem('rad', e.target.value);
    this.props.getCourses();
  };

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
      <div>
        <div style={{fontSize: 24, textAlign: 'center'}}>
          <p>
            <strong style={{color: 'rgb(255, 64, 129)', fontSize: 26, fontStyle: 'italic'}}>
              {this.getName()}</strong> подойдут следующие дополнительные курсы:
          </p>

          { this.state.getLocation ? (
            <span>В радиусе  <TextField
              onChange={this.radChange}
              style={{width: 35, textAlign: 'center', fontSize: '30px'}}
              defaultValue="10"
            />  км</span>
          ) : (<span style={{color: 'rgb(255, 64, 129)'}}>не удалось получить геопозицию</span>)}
          <br/>
        </div>

        <div className="recom">
          {
            this.props.loading ? (
              <div style={{textAlign: 'center'}}>
                <CircularProgress size={0.6} />
              </div>
            ) : (
              this.props.data.data.map(function (el) {
                return (
                  <Course
                    key={el.id}
                    id={el.id}
                    author={el.author}
                    image={el.pic}
                    title={el.title}
                    introtext={el.introtext}
                    age_from={el.age_from}
                    age_to={el.age_to}
                    time_from={el.time_from}
                    time_to={el.time_to}
                    activity={el.activity}
                    location={el.location}
                    price={el.price}
                    frequency={el.frequency}
                    rating={el.rating}
                    liked={el.liked}
                    authenticated={el.is_authenticated}
                  />
                )
              })
            )
          }
        </div>

        <div className="recreg">
           <a href="/authentication/signup">Зарегистрируйтесь</a>, чтобы сохранить результаты и получить больше курсов<br/>
          <a href="#" onClick={(event) => {
            event.preventDefault();
            this.props.back()
          }} style={{fontSize: 16, marginTop: 20}}>
            Вернуться на первый шаг 
          </a>
        </div>

      </div>
    );
  }
}