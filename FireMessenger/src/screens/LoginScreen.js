/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import {
    Button,
    ErrorMsg,
    Input,
    AuthNavigationForNot,
} from '../components';
import {
    onLogin,
    actionCreator,
} from '../actions/';

const LoginScreen = (props) => {

    useEffect(
        () => {
            if (props.route.params) {
                props.actionCreator('clear');
                props.actionCreator('set_email', props.route.params.email);
            }
            else {
                props.actionCreator('clear');
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    );

    return <View style={styles.rootStyle}>
        <Input
            value={props.email}
            label="Enter your email address:"
            onChangeTextCallback={
                (newEmail) => {
                    // setEmail(newEmail);
                    // dispatch({ type: 'set_email', payload: newEmail });
                    props.actionCreator('set_email', newEmail);
                }
            }
        />
        <Input
            value={props.password}
            label="Enter your password:"
            onChangeTextCallback={
                (newPassword) => {
                    // dispatch({ type: 'set_password', payload: newPassword });
                    props.actionCreator('set_password', newPassword);
                }
            }
            type="password"
        />
        {props.error ? <ErrorMsg
            text={props.error}
            clearError={(string) => props.actionCreator('set_error', string)} />
            : <ErrorMsg />
        }
        <Button
            label="Login"
            visible={props.email !== '' && props.password !== ''}
            loading={props.loader}
            onPressCallback={
                () => {
                    props.onLogin({
                        email: props.email,
                        password: props.password,
                        fcmToken: props.fcmToken,
                        onSuccess: () => {
                            props.navigation.navigate('Main');
                        },
                    });
                }
            }
        />
        <AuthNavigationForNot
            type="Login"
            navigation={() => props.navigation.navigate('Signup')}
        />
    </View>;
};

const styles = StyleSheet.create(
    {
        rootStyle: {
            flex: 1,
            padding: 20,
        },
    }
);

const mapStateToProps = (state) => {
    return {
        email: state.auth.email,
        password: state.auth.password,
        fcmToken: state.auth.user.fcmToken,
        loader: state.auth.loader
    };
};

export default connect(mapStateToProps, { actionCreator, onLogin })(LoginScreen);


//blind alley in DFS: not getting a node, but just going on for searching.
