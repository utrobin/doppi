/**
 * Created by egorutrobin on 27.08.16.
 */
import React from 'react';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import ChipExampleArray from './selection_words';

const fruit = [
  'Apple', 'Apricot', 'Avocado',
  'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry',
  'Boysenberry', 'Blood Orange',
  'Cantaloupe', 'Currant', 'Cherry', 'Cherimoya', 'Cloudberry',
  'Coconut', 'Cranberry', 'Clementine',
  'Damson', 'Date', 'Dragonfruit', 'Durian',
  'Elderberry',
  'Feijoa', 'Fig',
  'Goji berry', 'Gooseberry', 'Grape', 'Grapefruit', 'Guava',
  'Honeydew', 'Huckleberry',
  'Jabouticaba', 'Jackfruit', 'Jambul', 'Jujube', 'Juniper berry',
  'Kiwi fruit', 'Kumquat',
  'Lemon', 'Lime', 'Loquat', 'Lychee',
  'Nectarine',
  'Mango', 'Marion berry', 'Melon', 'Miracle fruit', 'Mulberry', 'Mandarine',
  'Olive', 'Orange',
  'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Physalis', 'Plum', 'Pineapple',
  'Pumpkin', 'Pomegranate', 'Pomelo', 'Purple Mangosteen',
  'Quince',
  'Raspberry', 'Raisin', 'Rambutan', 'Redcurrant',
  'Salal berry', 'Satsuma', 'Star fruit', 'Strawberry', 'Squash', 'Salmonberry',
  'Tamarillo', 'Tamarind', 'Tomato', 'Tangerine',
  'Ugli fruit',
  'Watermelon',
];

const styles = {
  block: {
	maxWidth: 250,
  },
  radioButton: {
	marginBottom: 10,
    marginLeft: 10,
  },
};


export default class StepOne extends React.Component {

  constructor(props) {
    super(props);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.state = {
      sex: '',
      name: '',
    };
  }

  componentWillMount() {
    if (localStorage.getItem('name') === null)
      localStorage.setItem('name', '');
    else {
      this.setState({
        name: localStorage.getItem('name')
      });
    }

    if (localStorage.getItem('sex') === null)
      localStorage.setItem('sex', '');
    else {
      this.setState({
        sex: localStorage.getItem('sex')
      });
    }
  }

  onUpdateInput(searchText, value) {
    localStorage.setItem('name', value);
    this.setState({
        name: value
    });
  }

  onChangeRadio(event, value) {
    localStorage.setItem('sex', value);
    this.setState({
        value: value
    });
  }

  render() {
    return (
      <div>
        <TextField
          onChange={(searchText, value) => {
              this.onUpdateInput(searchText, value)
          }}
          hintText="Имя"
          defaultValue={this.state.name}
          style={{marginBottom: '15px'}}
          floatingLabelText="Введите имя вашего ребенка"
        />

        <div style={{marginBottom: '35px', marginTop: '10px'}}>
          <label style={{marginBottom: '15px', display: 'block'}}>Выберите пол:</label>
          <RadioButtonGroup
            name="shipSpeed"
            onChange={(event, value) => {
              this.onChangeRadio(event, value)
            }}
            defaultSelected={this.state.sex}
          >
            <RadioButton
              value="man"
              label="Мальчик"
              style={styles.radioButton}
            />
            <RadioButton
              value="women"
              label="Девочка"
              style={styles.radioButton}
            />
          </RadioButtonGroup>
        </div>

        <ChipExampleArray />
      </div>
    );
  }
}
