import React, { useContext, useLayoutEffect, useReducer, useState } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
    Input,
    Button,
    ErrorMsg,
    Spinner,
    AuthNavigationForNot
} from '../components'
import { GoogleSigninButton } from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context as AuthContext } from '../contexts/AuthContext';
import { GoogleAuthSignup } from '../auth/GoogleAuth';
import { EmailPasswordAuthSignup } from '../auth/EmailPasswordAuth';
import { FacebookAuthSignup } from '../auth/FacebookAuth';

const reducer = (authState, action) => {
    switch (action.type) {
        case 'set_userName': {
            return { ...authState, userName: action.payload };
        }
        case 'set_email': {
            return { ...authState, email: action.payload };
        }
        case 'set_password': {
            return { ...authState, password: action.payload };
        }
        case 'set_confirmPassword': {
            return { ...authState, confirmPassword: action.payload };
        }
        case 'set_error': {
            return { ...authState, error: action.payload };
        }
        case 'clear_all': {
            return {}
        }
        default: {
            console.log('default case reached');
            return authState;
        }
    }
}

const SignupScreen = (props) => {

    const [authState, dispatch] = useReducer(reducer,
        {
            userName: '',
            email: '',
            password: '',
            confirmPassword: '',
            error: ''
        }
    )

    const [signupLoader, setSignupLoader] = useState(false);
    const [otherAuthLoader, setOtherAuthLoader] = useState(false);

    const { state, setAuthDetails } = useContext(AuthContext);

    const signupDetailsSetter = {
        setData: (from, data) => {
            setOtherAuthLoader(false);
            props.navigation.navigate('AuthProvider', { from, data });
        },
        setError: (err) => {
            if (err.response) {
                if (err.response.status == 409) {
                    setOtherAuthLoader(false);
                    setSignupLoader(false);
                    props.navigation.navigate('Login', { alreadySignedUp: true, email: err.response.data.email ? err.response.data.email : authState.email });
                }
                else if (err.response.status == 500) {
                    dispatch({ type: 'set_error', payload: err.response.data.errMsg });
                    setOtherAuthLoader(false);
                    setSignupLoader(false);
                }
            }
            else {
                console.log(err);
                try {
                    dispatch({ type: 'set_error', payload: err.response.data.errMsg });
                    setOtherAuthLoader(false);
                    setSignupLoader(false);
                }
                catch (err) {
                    dispatch({ type: 'set_error', payload: JSON.stringify(err)});
                    setOtherAuthLoader(false);
                    setSignupLoader(false);
                }
            }
        },
        setEmailPasswordData: async (data) => {
            const dataToSend = {
                userName: authState.userName,
                email: authState.email,
                password: authState.password,
                photoURL: null,
            }
            setAuthDetails(dataToSend);
            await AsyncStorage.setItem('activeUser', JSON.stringify(dataToSend));
            setSignupLoader(false);
            props.navigation.navigate('Home');
        }
    }

    const onFacebookSignupPress = () => {
        setOtherAuthLoader(true);
        FacebookAuthSignup(
            signupDetailsSetter.setData,
            signupDetailsSetter.setError
        )
    }

    const onGoogleSignupPress = () => {
        setOtherAuthLoader(true);
        GoogleAuthSignup(
            signupDetailsSetter.setData,
            signupDetailsSetter.setError
        )
    }

    const onEmailPasswordSignupPress = () => {
        setSignupLoader(true);
        const emailREGEX = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (authState.email.match(emailREGEX)) {
            if (authState.password == authState.confirmPassword) {
                EmailPasswordAuthSignup(
                    {
                        userName: authState.userName,
                        email: authState.email,
                        password: authState.password,
                        FCMToken: state.fcmToken
                    },
                    signupDetailsSetter.setEmailPasswordData,
                    signupDetailsSetter.setError
                )
            }
            else {
                setSignupLoader(false);
                dispatch({ type: 'set_error', payload: 'password not matched' });
            }
        }
        else {
            setSignupLoader(false);
            dispatch({ type: 'set_error', payload: 'Email not valid' });
        }
    }

    return <View style={styles.rootStyle}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <Input
                label='Enter your name'
                value={authState.userName}
                onChangeTextCallback={
                    (newName) => {
                        dispatch({ type: 'set_userName', payload: newName });
                    }
                }
            />
            <Input
                label='Enter your email address'
                value={authState.email}
                onChangeTextCallback={
                    (newEmail) => {
                        dispatch({ type: 'set_email', payload: newEmail });
                    }
                }
            />
            <Input
                label='Enter your password'
                value={authState.password}
                onChangeTextCallback={
                    (newPassword) => {
                        dispatch({ type: 'set_password', payload: newPassword });
                    }
                }
                type='password'
            />
            <Input
                label='Confirm password'
                value={authState.confirmPassword}
                onChangeTextCallback={
                    (newConfirmPassword) => {
                        dispatch({ type: 'set_confirmPassword', payload: newConfirmPassword });
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
                label='Sign Up'
                loading={signupLoader}
                visible={authState.userName != '' && authState.email != '' && authState.pasword != '' && authState.confirmPassword != ''}
                onPressCallback={onEmailPasswordSignupPress}
            />
            <GoogleSigninButton
                style={{ width: '100%' }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={onGoogleSignupPress}
            />
            <Spinner isVisible={otherAuthLoader} />
            <Button
                label='Facebook Login'
                visible={true}
                onPressCallback={onFacebookSignupPress}
            />
            <AuthNavigationForNot
                type='signup'
                navigation={() => props.navigation.navigate('Login')}
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

export default SignupScreen;