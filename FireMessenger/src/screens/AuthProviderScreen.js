import React, { useContext, useReducer, useState } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button'
import ErrorMsg from '../components/ErrorMsg';
import { Context as AuthContext } from '../contexts/AuthContext';
import { EmailPasswordAuthSignup } from '../auth/EmailPasswordAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const reducer = (authState, action) => {
    switch (action.type) {
        case 'set_password': {
            return { ...authState, password: action.payload };
        }
        case 'set_confirm_password': {
            console.log(action.payload);
            return { ...authState, confirmPassword: action.payload };
        }
        case 'set_error': {
            return { ...authState, error: action.payload };
        }
        default: {
            console.log('default case');
            return authState;
        }
    }
}

const AuthProviderScreen = (props) => {

    const [authState, dispatch] = useReducer(reducer,
        {
            password: '',
            confirmPassword: '',
            error: ''
        }
    )

    const [loader, setLoader] = useState(false);

    const { state, setAuthDetails } = useContext(AuthContext);

    const getParams = () => {
        return props.route.params;
    }

    const signupDetailsSetter = () => {
        setLoader(true);
        const emailREGEX = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (getParams().data.email.match(emailREGEX)) {
            if (authState.password == authState.confirmPassword) {
                const dataToSend = {
                    userName: getParams().data.userName,
                    email: getParams().data.email,
                    password: authState.password,
                    photoURL: getParams().data.photoURL
                }
                EmailPasswordAuthSignup(
                    {
                        ...dataToSend,
                        FCMToken: state.fcmToken
                    },
                    async (data) => {
                        setAuthDetails(dataToSend);
                        console.log('data for async storage', dataToSend);
                        await AsyncStorage.setItem('activeUser', JSON.stringify(dataToSend));
                        console.log('all done');
                        setLoader(false);
                        props.navigation.navigate('Home');
                    },
                    (err) => {
                        dispatch({ type: 'set_error', payload: err });
                    }
                )
            }
            else {
                dispatch({ type: 'set_error', payload: 'password not matched' });
            }
        }
        else {
            dispatch({ type: 'set_error', payload: 'Email not valid' });
        }
    }

    return <View style={styles.rootStyle}>
        <ScrollView>
            {getParams().from ?
                <Image
                    source={getParams().data.photoURL ? { uri: getParams().data.photoURL } : require('../assets/userImage.png')}
                />
                : null
            }
            <Input
                value={authState.password}
                label={`Enter password for your ${getParams().from} account`}
                onChangeTextCallback={
                    (newPassword) => {
                        dispatch({ type: 'set_password', payload: newPassword });
                    }
                }
                type='password'
            />
            <Input
                value={authState.confirmPassword}
                label='Confirm your password'
                onChangeTextCallback={
                    (newConfirmPassword) => {
                        console.log('eafvaerfs');
                        dispatch({ type: 'set_confirm_password', payload: newConfirmPassword });
                    }
                }
                type='password'
            />
            {
                authState.error ? <ErrorMsg
                    text={authState.error}
                    clearError={(string) => dispatch({ type: 'set_error', payload: string })} />
                    : <ErrorMsg />
            }
            <Button
                label='Sign Up'
                visible={authState.password != ''}
                onPressCallback={signupDetailsSetter}
                loading={loader}
            />
        </ScrollView>
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

export default AuthProviderScreen;
