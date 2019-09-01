import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

export default class SpaceShip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      velocity:5,
      health:1,
      damage:1,
    };
  }


  render() {

    const x = this.props.body.position.x;
    const y =  this.props.body.position.y;
    return (
      <View  style={{position:"absolute", backgroundColor:'black',width:50,height:50, left: x, top: y }}/>
    );
  
}

}


