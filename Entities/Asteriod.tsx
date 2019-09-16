import React from 'react';
import SpriteSheet from 'rn-sprite-sheet';
import { StyleSheet, Text, View, Dimensions, Image, Animated } from 'react-native';

export default class Asteriod extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      velocity: 5,
      health: 1,
      damage: 1,
    };
  }

  componentDidMount() {
    // this.refs.rock.play({ type: 'left', fps: 60, loop: false, resetAfterFinish: false })
  }


  loadSprite() {
    return (<SpriteSheet
      ref={"rock"}
      source={require('../assets/hjm-asteroids.png')}
      columns={4}
      rows={4}

      height={80} // set either, none, but not both

      animations={{
        forward: [2],
        left: [2],
        right: [4]
      }
      }
    />)
  }

  componentWillUnmount() {
    console.log('unmounted')
  }

  render() {

    const Radius = this.props.body.radius;
    const x = this.props.body.position.x;
    const y = this.props.body.position.y;

    return (
      <View style={{ position: "absolute", backgroundColor: 'brown', width: 80, height: 80, left: x, top: y }}>
        <View>
          <Image style={{width:80,height:80}} source={require('../assets/asteroid_1.png')}/>
        </View>

      </View>
    );
  }

}

