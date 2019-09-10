import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import SpriteSheet from 'rn-sprite-sheet';

export default class SpaceShip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      velocity: 5,
      health: 1,
      damage: 1,
    };
  }

  componentDidMount(){
    this.refs.ship.play({type:'left',fps:13,loop:false})
  }

  render() {

    const x = this.props.body.position.x;
    const y = this.props.body.position.y;
    return (
      <View style={{ position: "absolute", width: 50, height: 50, left: x, top: y }}>
        <SpriteSheet
          ref={"ship"}
          source={require('../assets/player.png')}
          columns={5}
          rows={1}
          // height={200} // set either, none, but not both
          // width={200}
          imageStyle={{ marginTop: -1 }}
          animations={{
            normal:[0],
            left:[2,1,0],
            right:[2,3,4]
          }
          }
        />
      </View>
    );
  }
}


