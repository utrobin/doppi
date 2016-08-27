/**
 * Created by egorutrobin on 27.08.16.
 */
import React from 'react';
import Chip from 'material-ui/Chip';
import AutoComplete from 'material-ui/AutoComplete';

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

export default class ChipExampleArray extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        chipData: [],
        value: 0,
    };
    this.styles = {
      chip: {
        margin: 4,
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };
  }

  handleRequestDelete = (key) => {
    this.chipData = this.state.chipData;
    const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(key);
    this.chipData.splice(chipToDelete, 1);
    this.setState({chipData: this.chipData});
  };

  renderChip(data) {
    return (
      <Chip
        key={data.key}
        onRequestDelete={() => this.handleRequestDelete(data.key)}
        style={this.styles.chip}
      >
        {data.label}
      </Chip>
    );
  }

  getRed(event){
      console.log(event.target)
      let temp = this.state.chipData;

      temp.push({key: this.state.value, label: event.target.value});
      event.target.value = '';
    console.log(event.target)
      this.setState({
          chipData: temp,
          value: ++this.state.value
      });
  }

  render() {
    return (
        <div>
            <div style={this.styles.wrapper}>
            {this.state.chipData.map(this.renderChip, this)}
            </div>

            <AutoComplete
              floatingLabelText="Type 'peah', fuzzy search"
              filter={AutoComplete.fuzzyFilter}
              value={this.state.value}
              dataSource={fruit}
              maxSearchResults={5}
              onBlur={this.getRed.bind(this)}
              onNewRequest={() => {}}
            />
          <input type="text" onBlur={this.getRed.bind(this)}/>
        </div>
    );
  }
}