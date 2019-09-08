import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Dimensions, StatusBar, Alert } from 'react-native';
//360x640

export default class MainMenu extends React.Component {
    constructor(props) {
        super(props);

    }


    static navigationOptions = {
        header: null
    }

    renderButtonText(text) {
        return (
            <View style={{ padding: 10 }}>

                <Text style={styles.buttonText}>{text}</Text>
            </View>

        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.title}>Space Game</Text>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: '25%' }}>
                    <TouchableOpacity onPress={() => { this.startGame() }} >
                        {this.renderButtonText('Start')}

                    </TouchableOpacity>

                    {this.renderButtonText('How to play')}
                    {this.renderButtonText('Settings')}
                </View>

            </View>
        )
    }

    startGame() {
        this.props.navigation.navigate('Game');
    }
}

const styles = StyleSheet.create({
    buttonText: {
        color: 'green',
        fontSize: 20,
    },

    title: {
        color: 'green',
        fontSize: 30
    },
    container: {
        flex: 1,
        backgroundColor: 'black',

    },


});

