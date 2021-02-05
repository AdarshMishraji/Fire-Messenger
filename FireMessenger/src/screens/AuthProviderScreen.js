import React, { useContext, useReducer, useState } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button'
import ErrorMsg from '../components/ErrorMsg';
import { Context as AuthContext } from '../contexts/AuthContext';
import { EmailPasswordAuthSignup } from '../auth/EmailPasswordAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const reducer = (state, action) => {
    switch (action.type) {
        case 'set_password': {
            return { ...state, password: action.payload };
        }
        case 'set_confirm_password': {
            console.log(action.payload);
            return { ...state, confirmPassword: action.payload };
        }
        case 'set_error': {
            return { ...state, error: action.payload };
        }
        default: {
            console.log('default case');
            return state;
        }
    }
}

const AuthProviderScreen = (props) => {

    const [state, dispatch] = useReducer(reducer,
        {
            password: '',
            confirmPassword: '',
            error: ''
        }
    )

    const [loader, setLoader] = useState(false);

    const { setAuthDetails } = useContext(AuthContext);

    const getParams = () => {
        return props.route.params;
    }

    const signupDetailsSetter = () => {
        setLoader(true);
        const emailREGEX = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (getParams().data.email.match(emailREGEX)) {
            if (state.password == state.confirmPassword) {
                const dataToSend = {
                    userName: getParams().data.userName,
                    email: getParams().data.email,
                    password: state.password,
                    photoURL: getParams().data.photoURL
                }
                EmailPasswordAuthSignup(
                    dataToSend,
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
                value={state.password}
                label={`Enter password for your ${getParams().from} account`}
                onChangeTextCallback={
                    (newPassword) => {
                        dispatch({ type: 'set_password', payload: newPassword });
                    }
                }
                type='password'
            />
            <Input
                value={state.confirmPassword}
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
                state.error ? <ErrorMsg
                    text={state.error}
                    clearError={(string) => dispatch({ type: 'set_error', payload: string })} />
                    : <ErrorMsg />
            }
            <Button
                label='Sign Up'
                visible={state.password != ''}
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
