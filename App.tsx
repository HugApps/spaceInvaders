import React from 'react';
import { StyleSheet, Text, View, Dimensions, StatusBar, Alert } from 'react-native';
import SpaceShip from './Entities/SpaceShip';
import ProjectTile from './Entities/Projectile';
import Asteroid from './Entities/Asteriod';
import { GameEngine, GameLoop, } from "react-native-game-engine";
import Matter from "matter-js";
import { createStackNavigator } from 'react-navigation-stack';
import {  createAppContainer } from "react-navigation";
import Asteriod from './Entities/Asteriod';
import MainMenu from './MainMenu';
import Game from './Game';
//360x640


const APPNAVIGATOR = createStackNavigator({
  MainMenu: {
    screen: MainMenu,
    header:null,
  },
  Game: {
    screen: Game,
    header:null,
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


  }


  render() {
    return (<AppContainer/>)
  }
    
}


