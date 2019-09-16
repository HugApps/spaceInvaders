import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import SpriteSheet from 'rn-sprite-sheet';
import { createNativeWrapper } from 'react-native-gesture-handler';

export default class SpaceShip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: this.props.body.position.x,
      y: this.props.body.position.y,
      velocity: 5,
      health: 1,
      damage: 1,
    };
  }


  startAnimationBasedOnDirection(direction) {
    this.refs.ship.stop(() => {
      this.refs.ship.play({ type: direction, fps: 13, loop: false, resetAfterFinish: false })
    })

  }

  componentDidMount() {
    //this.refs.ship.play({type:'forward',fps:60,loop:false,  resetAfterFinish:false})
  }

  componentDidUpdate(nextProps, nextState) {
    /*  let deltaX = nextProps.body.position.x
      let deltaY = nextProps.body.position.y
  
      if (deltaY != this.state.y) {
        this.refs.ship.stop(() => { this.refs.ship.play({ type: 'forward', fps: 60, loop: false, resetAfterFinish: false }) })
      } else {
        if (deltaX > this.state.x) {
  
  
          this.refs.ship.stop(() => { this.refs.ship.play({ type: 'right', fps: 60, loop: false, resetAfterFinish: false }) })
  
  
        } else {
          this.refs.ship.stop(() => { this.refs.ship.play({ type: 'left', fps: 60, loop: false, resetAfterFinish: false }) })
        }
  
      }
  */



  }

  renderSprite() {
    return (<SpriteSheet
      ref={"ship"}
      source={require('../assets/ship_crop.jpg')}
      columns={4.9}
      rows={1}
      width={35}
      imageStyle={{ padding: 5 }}
      // height={200} // set either, none, but not both
      // width={200}

      animations={{
        forward: [2],
        left: [0],
        right: [4]
      }
      }
    />)
  }
  render() {

    const x = this.props.body.position.x;
    const y = this.props.body.position.y;



    return (
      <View style={{ position: "absolute", width: 50, height: 50, left: x, top: y }}>
        <Image style={{ width: 50, height: 50 }} source={require('../assets/player1.png')} />
      </View>
    );
  }
}


