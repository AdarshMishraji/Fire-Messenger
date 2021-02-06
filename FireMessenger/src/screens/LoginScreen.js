import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useReducer, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { EmailPasswordAuthLogin } from '../auth/EmailPasswordAuth';
import AuthNavigationForNot from '../components/AuthNavigationForNot';
import Button from '../components/Button';
import ErrorMsg from '../components/ErrorMsg';
import Input from '../components/Input';
import { Context as AuthContext } from '../contexts/AuthContext';

const reducer = (state, action) => {
    switch (action.type) {
        case 'set_password': {
            return { ...state, password: action.payload };
        }
        case 'set_error': {
            return { ...state, error: action.payload };
        }
        case 'set_email': {
            return { ...state, email: action.payload };
        }
        default: {
            return state;
        }
    }
}

const LoginScreen = (props) => {

    const getParams = () => {
        return props.route.params
    }

    const { setAuthDetails } = useContext(AuthContext);
    const [state, dispatch] = useReducer(
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
        console.log(state.email, state.password);
        EmailPasswordAuthLogin(
            {
                email: state.email,
                password: state.password
            },
            async (data) => {
                const dataToSend = {
                    email: state.email,
                    password: state.password,
                    photoURL: data.photoURL,
                    userName: data.userName
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
            value={state.email}
            label='Enter your email address:'
            onChangeTextCallback={
                (newEmail) => {
                    // setEmail(newEmail);
                    dispatch({ type: 'set_email', payload: newEmail });
                }
            }
        />
        <Input
            value={state.password}
            label='Enter your password:'
            onChangeTextCallback={
                (newPassword) => {
                    dispatch({ type: 'set_password', payload: newPassword });
                }
            }
            type='password'
        />
        {state.error ? <ErrorMsg
            text={state.error}
            clearError={(string) => dispatch({ type: 'set_error', payload: string })} />
            : <ErrorMsg />
        }
        <Button
            label='Login'
            onPressCallback={onLoginPress}
            visible={state.email != '' && state.password != ''}
            loading={loader}
        />
        <AuthNavigationForNot
            type='login'
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