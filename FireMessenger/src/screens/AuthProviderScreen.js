/* eslint-disable prettier/prettier */
import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import {
    Button,
    Input,
    ErrorMsg,
} from '../components';
import {
    actionCreator,
    otherAuthDetailsSetter,
} from '../actions';

const AuthProviderScreen = (props) => {

    const getParams = () => {
        return props.route.params;
    };

    return <View style={styles.rootStyle}>
        <ScrollView>
            {getParams().from ?
                <Image
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                        height: 200,
                        width: 200,
                        alignSelf: 'center',
                        borderRadius: 50,
                        marginBottom: 20,
                        backgroundColor: 'white',
                    }}
                    source={getParams().data.photoURL ? { uri: getParams().data.photoURL } : require('../assets/userImage.png')}
                />
                : null
            }
            <Input
                value={props.password}
                label={`Enter password for your ${getParams().from === 'email' ? 'email address' : `${getParams().from} account`}`}
                onChangeTextCallback={
                    (newPassword) => {
                        // dispatch({ type: 'set_password', payload: newPassword });
                        props.actionCreator('set_password', newPassword);
                    }
                }
                type="password"
            />
            <Input
                value={props.confirmPassword}
                label="Confirm your password"
                onChangeTextCallback={
                    (newConfirmPassword) => {
                        // dispatch({ type: 'set_confirm_password', payload: newConfirmPassword });
                        props.actionCreator('set_confirm_password', newConfirmPassword);
                    }
                }
                type="password"
            />
            {
                props.error ? <ErrorMsg
                    text={props.error}
                    clearError={(string) => props.actionCreator('set_error', string)} />
                    : <ErrorMsg />
            }
            <Button
                label="Sign Up"
                visible={props.password !== ''}
                onPressCallback={
                    () => {
                        props.otherAuthDetailsSetter({
                            email: getParams().data.email,
                            password: props.password,
                            confirmPassword: props.confirmPassword,
                            userName: getParams().data.userName,
                            photoURL: getParams().photoURL,
                            fcmToken: props.fcmToken,
                            onSuccess: () => props.navigation.navigate('Main'),
                        });
                    }
                }
                loading={props.loader}
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
        password: state.auth.password,
        confirmPassword: state.auth.confirmPassword,
        fcmToken: state.auth.user.fcmToken,
        error: state.auth.error,
    };
};

export default connect(mapStateToProps, { actionCreator, otherAuthDetailsSetter })(AuthProviderScreen);
