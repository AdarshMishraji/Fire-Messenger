import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { Signout } from '../auth/Signout';
import { Button, ErrorMsg } from '../components';
import { Context as AuthContext } from '../contexts/AuthContext';

const HomeScreen = (props) => {

    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const { state } = useContext(AuthContext);

    const onSignoutPress = () => {
        setLoader(true);
        Signout(
            state.email,
            async (data) => {
                console.log(data);
                await AsyncStorage.removeItem('activeUser');
                setLoader(false);
                props.navigation.navigate('Signup');
            },
            (err) => {
                // console.log(err.response.status, err.response.data.errMsg);
                if (err.message) {
                    setError(err.message);
                    setLoader(false);
                }
                else if (err.response) {
                    setError(err.response.data.errMsg);
                    setLoader(false);
                }
            }
        )
    }

    const ImageComponent = (style) => {
        return <Image
            style={{ ...style.style, backgroundColor: 'white' }}
            source={state.photoURL ? { uri: state.photoURL } : require('../assets/userImage.png')}
        />
    }

    return <View style={styles.rootStyle}>
        <Text>Home Screen</Text>
        {error ? <ErrorMsg text={error} clearError={string => setError(string)} /> : <ErrorMsg />}
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
                    marginBottom: 20
                }}
            // source={{ uri: state.photoURL }}
            />
            <Text style={styles.userNameStyle}>{state.userName}</Text>
        </TouchableOpacity>
        <Button
            label='Chats'
            visible={true}
            onPressCallback={() => props.navigation.navigate('ChatsRoom')}
        />
        <Button
            label='Sign Out'
            visible={true}
            onPressCallback={onSignoutPress}
            loading={loader}
        />
    </View>
}

const styles = StyleSheet.create(
    {
        rootStyle: {
            flex: 1,
            padding: 20
        },
        imageStyle: {
            height: 200,
            width: 200,
            alignSelf: 'center',
            borderRadius: 50,
            marginBottom: 20
        },
        userNameStyle: {
            color: 'white',
            fontSize: 30,
            alignSelf: 'center',
            fontWeight: 'bold'
        }
    }
)

export default HomeScreen;
