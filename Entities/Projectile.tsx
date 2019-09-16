import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

export default class Projectile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      velocity: 5,
      health: 1,
      damage: 1,
    };
  }

  render() {
    const x = this.props.body.position.x;
    const y = this.props.body.position.y;
    return (
      <View style={{ position: "absolute", width: 10, height: 100, left: x, top: y }}>
        <Image style={{ width: 10, height: 100 }} source={require('../assets/laser_1.png')} />
      </View>
    );

  }

}

