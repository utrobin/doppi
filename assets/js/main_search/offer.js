/**
 * Created by egorutrobin on 25.08.16.
 */
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
    height: 70,
    width: 350
};

const labelStyle = {
    fontSize: 26,
    fontWeight: 700
};


const Offer = () => (
  <div>
    <RaisedButton label="Пройдите тест" primary={true} style={style} labelStyle={labelStyle} />
  </div>
);


export default Offer;