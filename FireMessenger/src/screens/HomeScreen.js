import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { connect } from 'react-redux';
import { Button, ErrorMsg } from '../components';
import {
    onSignout,
    actionCreator,
} from '../actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = (props) => {

    const [showImage, setShowImage] = useState(false);

    const ImageComponent = (style) => {
        return <Image
            style={{ ...style.style, backgroundColor: 'white' }}
            source={props.photoURL ? { uri: props.photoURL } : require('../assets/userImage.png')}
        />;
    };

    return <View style={styles.rootStyle}>
        <Text>Home Screen</Text>
        {props.error ? <ErrorMsg text={props.error} clearError={string => props.actionCreator('set_error', string)} /> : <ErrorMsg />}
        <Modal
            visible={showImage}
            transparent={true}
            onRequestClose={() => setShowImage(false)}
        >
            <View style={{ backgroundColor: 'white', justifyContent: 'center', flex: 1 }}>
                <ImageComponent style={{ height: 500, width: 450 }} />
            </View>
        </Modal>
        <TouchableOpacity
            onPress={() => setShowImage(true)}
        >
            <ImageComponent
                style={{
                    height: 200,
                    width: 200,
                    alignSelf: 'center',
                    borderRadius: 50,
                    marginBottom: 20,
                }}
            />
            <Text style={styles.userNameStyle}>{props.userName}</Text>
        </TouchableOpacity>
        <Button
            label="Chats"
            visible={true}
            onPressCallback={() => props.navigation.navigate('ChatsRoom')}
        />
        <Button
            label="Sign Out"
            visible={true}
            onPressCallback={
                () => {
                    props.onSignout(props.email, () => props.navigation.navigate('Initial'));
                }
            }
            loading={props.loader}
        />
    </View>;
};

const styles = StyleSheet.create(
    {
        rootStyle: {
            flex: 1,
            padding: 20,
        },
        imageStyle: {
            height: 200,
            width: 200,
            alignSelf: 'center',
            borderRadius: 50,
            marginBottom: 20,
        },
        userNameStyle: {
            color: 'white',
            fontSize: 30,
            alignSelf: 'center',
            fontWeight: 'bold',
        },
    }
);

const mapStateToProps = (state) => {
    return {
        email: state.auth.user.email,
        userName: state.auth.user.userName,
        loader: state.auth.loader,
        photoURL: state.auth.user.photoURL,
        error: state.auth.error,
    };
};

export default connect(mapStateToProps, { actionCreator, onSignout })(HomeScreen);
