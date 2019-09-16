import React from 'react';
import * as Font from 'expo-font';
import { TouchableOpacity, StyleSheet, Text, View, Dimensions, StatusBar, Alert } from 'react-native';
//360x640

export default class ScoreCounter extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            score:this.props.score
        }
    }

    updateScore(points){
        this.setState({score:this.state.score+points});
    }
    render() {
        const { score } = this.state
      
        return (
            <View>
                 <Text style={{ fontSize:20,marginTop:20,color: 'green' , fontFamily:'SpaceInvaders' }}>{this.state.score}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonText: {
        color: 'green',
        fontSize: 20,
        fontFamily: 'SpaceInvaders'
    },
});

