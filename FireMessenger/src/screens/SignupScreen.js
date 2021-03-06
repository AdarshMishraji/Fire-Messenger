/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
    Input,
    Button,
    ErrorMsg,
    Spinner,
    AuthNavigationForNot,
} from '../components';
import {
    onEmailPasswordSignup,
    onGoogleSignup,
    onFacebookSignup,
    actionCreator,
} from '../actions';
import { GoogleSigninButton } from '@react-native-community/google-signin';

const SignupScreen = (props) => {

    useEffect(
        () => {
            props.actionCreator('clear');
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    );

    return <View style={styles.rootStyle}>
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            <Input
                label="Enter your name"
                value={props.userName}
                onChangeTextCallback={
                    (newName) => {
                        props.actionCreator('set_userName', newName);
                    }
                }
            />
            <Input
                label="Enter your email address"
                value={props.email}
                onChangeTextCallback={
                    (newEmail) => {
                        props.actionCreator('set_email', newEmail);
                    }
                }
            />
            <Input
                label="Enter your password"
                value={props.password}
                onChangeTextCallback={
                    (newPassword) => {
                        props.actionCreator('set_password', newPassword);
                    }
                }
                type="password"
            />
            <Input
                label="Confirm password"
                value={props.confirmPassword}
                onChangeTextCallback={
                    (newConfirmPassword) => {
                        props.actionCreator('set_confirm_password', newConfirmPassword);
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
                label="Sign Up"
                loading={props.loader}
                visible={props.userName !== '' && props.email !== '' && props.pasword !== '' && props.confirmPassword !== ''}
                onPressCallback={
                    () => {
                        props.onEmailPasswordSignup(
                            {
                                email: props.email,
                                password: props.password,
                                userName: props.userName,
                                confirmPassword: props.confirmPassword,
                                fcmToken: props.fcmToken,
                                onSuccess: props.navigation.navigate,
                            }
                        );
                    }
                }
            />
            <GoogleSigninButton
                style={{ width: '100%' }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={
                    () => {
                        props.onGoogleSignup(props.navigation.navigate);
                    }
                }
            />
            <Spinner isVisible={props.otherAuthLoader} />
            <Button
                label="Facebook Login"
                visible={true}
                onPressCallback={
                    () => {
                        props.onFacebookSignup(props.navigation.navigate);
                    }
                }
            />
            <AuthNavigationForNot
                type="signup"
                navigation={() => props.navigation.navigate('Login')}
            />
        </ScrollView>
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
        confirmPassword: state.auth.confirmPassword,
        userName: state.auth.userName,
        fcmToken: state.auth.user.fcmToken,
        loader: state.auth.loader,
        otherAuthLoader: state.auth.otherAuthLoader,
    };
};

export default connect(mapStateToProps, { actionCreator, onEmailPasswordSignup, onFacebookSignup, onGoogleSignup })(SignupScreen);
