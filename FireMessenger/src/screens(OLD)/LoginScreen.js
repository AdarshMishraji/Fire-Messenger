import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useReducer, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { EmailPasswordAuthLogin } from '../auth/EmailPasswordAuth';
import {
    Button,
    ErrorMsg,
    Input,
    AuthNavigationForNot
} from '../components'
import { Context as AuthContext } from '../contexts/AuthContext';

const reducer = (authState, action) => {
    switch (action.type) {
        case 'set_password': {
            return { ...authState, password: action.payload };
        }
        case 'set_error': {
            return { ...authState, error: action.payload };
        }
        case 'set_email': {
            return { ...authState, email: action.payload };
        }
        default: {
            return authState;
        }
    }
}

const LoginScreen = (props) => {

    const getParams = () => {
        return props.route.params
    }

    console.log(props.route.params)

    const { state, setAuthDetails } = useContext(AuthContext);
    const [authState, dispatch] = useReducer(
        reducer,
        {
            email: getParams() ? getParams().email ? getParams().email : '' : '',
            password: '',
            error: ''
        }
    )

    const [loader, setLoader] = useState(false);

    const onLoginPress = () => {
        setLoader(true);
        console.log(authState.email, authState.password);
        EmailPasswordAuthLogin(
            {
                email: authState.email,
                password: authState.password,
                FCMToken: state.fcmToken
            },
            async (data) => {
                const dataToSend = {
                    email: authState.email,
                    password: authState.password,
                    photoURL: data.photoURL,
                    userName: data.userName,
                }
                setAuthDetails(dataToSend);
                await AsyncStorage.setItem('activeUser', JSON.stringify(dataToSend));
                setLoader(false);
                props.navigation.navigate('Home');
            },
            (err) => {
                console.log('error', err, err.response.data);
                setLoader(false);
                dispatch({ type: 'set_error', payload: err.response.data.errMsg });
            }
        );
    }


    return <View style={styles.rootStyle}>
        <Input
            value={authState.email}
            label='Enter your email address:'
            onChangeTextCallback={
                (newEmail) => {
                    // setEmail(newEmail);
                    dispatch({ type: 'set_email', payload: newEmail });
                }
            }
        />
        <Input
            value={authState.password}
            label='Enter your password:'
            onChangeTextCallback={
                (newPassword) => {
                    dispatch({ type: 'set_password', payload: newPassword });
                }
            }
            type='password'
        />
        {authState.error ? <ErrorMsg
            text={authState.error}
            clearError={(string) => dispatch({ type: 'set_error', payload: string })} />
            : <ErrorMsg />
        }
        <Button
            label='Login'
            onPressCallback={onLoginPress}
            visible={authState.email != '' && authState.password != ''}
            loading={loader}
        />
        <AuthNavigationForNot
            type='Login'
            navigation={() => props.navigation.navigate('Signup')}
        />
    </View>
}

const styles = StyleSheet.create(
    {
        rootStyle: {
            flex: 1,
            padding: 20
        }
    }
)

export default LoginScreen;


//blind alley in DFS: not getting a node, but just going on for searching.