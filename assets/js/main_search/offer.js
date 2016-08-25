/**
 * Created by egorutrobin on 25.08.16.
 */
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
    height: 50
};



const Offer = () => (
  <div>
    <RaisedButton label="Пройти тест" primary={true} style={style} />
  </div>
);


export default Offer;