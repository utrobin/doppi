/**
 * Created by egorutrobin on 25.08.16.
 */
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
    height: 70,
    width: 350,
    display: "block",
    margin: "auto",
    marginTop: 25
};

const labelStyle = {
    fontSize: 26,
    fontWeight: 700
};


const Offer = () => (
  <div className="offer">
    <RaisedButton label="Пройдите тест" primary={true} style={style} labelStyle={labelStyle} />
    <span className="span">и мы поможем найти оптимальный курс для вашего ребенка</span>
  </div>
);


export default Offer;