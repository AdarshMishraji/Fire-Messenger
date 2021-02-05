import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';

const PushNotification = () => {

    const getFcmToken = async () => {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log(fcmToken);
        }
        else {
            console.log('Noting');
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
        }, []
    )

}

export default PushNotification;