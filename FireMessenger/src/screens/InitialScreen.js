import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Context as AuthContext } from '../contexts/AuthContext';
import { Context as ThemeContext } from '../contexts/ThemeContext';
import { DarkTheme } from '@react-navigation/native';

const InitialScreen = (props) => {

    const { tryLocalAuthDetails } = useContext(AuthContext);
    const { setTheme } = useContext(ThemeContext);

    useEffect(
        () => {
            // replace DarkTheme with DefaultTheme at production time.
            DarkTheme.dark ? setTheme('dark') : setTheme('light');
            tryLocalAuthDetails(
                () => {
                    props.navigation.navigate('Home');
                },
                () => {
                    props.navigation.navigate('Signup');
                }
            )
        }, []
    )

    return <View style={styles.rootStyle}>
        <Image
            source={require('../assets/fire_messenger_logo.png')}
            style={styles.logoStyle}
        />
        <Text style={{ ...styles.textStyle, color: DarkTheme.dark ? 'white' : 'black' }}>Fire Messenger</Text>
    </View>
}

const styles = StyleSheet.create(
    {
        rootStyle: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        textStyle: {
            fontSize: 40,
            fontWeight: 'bold',
        },
        logoStyle: {
            height: 200,
            width: 200
        }
    }
)

export default InitialScreen;