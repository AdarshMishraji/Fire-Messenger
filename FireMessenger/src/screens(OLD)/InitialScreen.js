import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Context as AuthContext } from '../contexts/AuthContext';
import { Context as ThemeContext } from '../contexts/ThemeContext';
import { DarkTheme } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging'
import { ErrorMsg } from '../components';

const InitialScreen = (props) => {

    const { tryLocalAuthDetails, setFCMToken } = useContext(AuthContext);
    const { setTheme } = useContext(ThemeContext);
    const [error, setError] = useState(null)

    const getFcmToken = async () => {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log(fcmToken);
            setFCMToken(fcmToken);
        }
        else {
            setError('Please connect to Internet or Relaunch the App.');
        }
    }

    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus == messaging.AuthorizationStatus.AUTHORIZED || authStatus == messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            getFcmToken();
        }
    }

    useEffect(
        () => {
            requestUserPermission();
            DarkTheme.dark ? setTheme('dark') : setTheme('light');
            tryLocalAuthDetails(
                () => {
                    props.navigation.navigate('Main');
                    props.navigation.reset({ index: 0, routes: [{ name: 'Main' }] })
                },
                () => {
                    props.navigation.navigate('Auth');
                    props.navigation.reset({ index: 0, routes: [{ name: 'Auth' }] })
                }
            )
        }, []
    )

    return <View style={styles.rootStyle}>
        {error ? <ErrorMsg text={error} clearError={(string) => setError(string)} /> : <ErrorMsg />}
        <View style={styles.rootStyle}>
        <Image
            source={require('../assets/fire_messenger_logo.png')}
            style={styles.logoStyle}
        />
        <Text style={{ ...styles.textStyle, color: DarkTheme.dark ? 'white' : 'black' }}>Fire Messenger</Text>
        </View>
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