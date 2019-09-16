import React from 'react';
import * as Font from 'expo-font';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";
import { TouchableOpacity, StyleSheet, Text, View, Dimensions, StatusBar, Alert } from 'react-native';
import MainMenu from './MainMenu';
import Game from './Game';
//360x640
const APPNAVIGATOR = createStackNavigator({
  MainMenu: {
    screen: MainMenu,
    header: null,
  },
  Game: {
    screen: Game,
    header: null,
  },

},
  {
    initialRouteName: "MainMenu"
  }
);

const AppContainer = createAppContainer(APPNAVIGATOR);
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false }

  }

  componentDidMount() {
    Font.loadAsync({
      'SpaceInvaders': require('./assets/fonts/space_invaders.ttf')
    }).then((a, b) => {  this.setState({ loaded: true }); });

  }

  render() {
    if (this.state.loaded == true) {
      return (<AppContainer />);
    } else {
      return (<View><Text>Loading</Text></View>)
    }
  }
}
