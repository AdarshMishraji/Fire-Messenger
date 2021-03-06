import React, { useEffect, useReducer, useContext, useLayoutEffect, useState } from 'react';
import { View, FlatList, Modal, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Context as AuthContext } from '../contexts/AuthContext';
import fireMessengerAPI from '../api/fire-messenger';
import {
    Button,
    Spinner,
    ErrorMsg
} from '../components'

const reducer = (state, action) => {
    switch (action.type) {
        case 'set_users': {
            return { ...state, users: action.payload };
        }
        case 'set_active_users': {
            return { ...state, activeUsers: action.payload };
        }
        case 'set_show_users': {
            return { ...state, showUsers: action.payload };
        }
        case 'error': {
            return { ...state, error: action.payload };
        }
        default: {
            return state;
        }
    }
}

const ChatsRoomScreen = (props) => {

    const [usersContainer, dispatch] = useReducer(reducer,
        {
            users: [],
            activeUsers: [],
            showUsers: false,
            error: ''
        }
    )

    const { state } = useContext(AuthContext);
    const [spinner, setSpinner] = useState(true);

    const getActiveUsers = async () => {
        await fireMessengerAPI.post('/users/fetchActiveUsers',
            {
                currentUserEmail: state.email
            }
        )
            .then(
                (value) => {
                    dispatch({ type: 'set_active_users', payload: value.data.users });
                }
            )
            .catch(
                (err) => {
                    console.log(err.response.data);
                    dispatch({ type: 'set_error', payload: err.response.data });
                }
            )
    }


    const getAllUsers = async () => {
        await fireMessengerAPI.post('/users/fetchAllUsers',
            {
                currentUserEmail: state.email
            }
        )
            .then(
                (value) => {
                    dispatch({ type: 'set_users', payload: value.data.users });
                }
            )
            .catch(
                (err) => {
                    console.log(err.response.data);
                    dispatch({ type: 'set_error', payload: err.response.data });
                }
            )
    }

    useEffect(
        () => {
            const unsuscribe = props.navigation.addListener('focus', () => {
                getAllUsers();
                getActiveUsers();
                setTimeout(() => setSpinner(false), 5000)
            })
            return () => {
                unsuscribe;
            }
        }, []
    )


    return <View style={{ flex: 1 }}>
        <Spinner
            isVisible={!spinner || usersContainer.activeUsers.length != 0 || usersContainer.users.length != 0 ? false : true}
        />
        <Modal
            visible={usersContainer.showUsers}
            transparent={true}
        >
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.3)'
                }}
            >
                <View
                    style={{
                        padding: 10,
                        borderWidth: 1,
                        width: 300,
                        backgroundColor: 'white',
                        borderRadius: 20,
                        height: 500
                    }}
                    >
                    {
                        usersContainer.users.length == 0
                            ? <Text style={{ fontSize: 30, fontWeight: 'bold', alignSelf: 'center', color: 'black' }}>No Users</Text>
                            :
                            <View
                                style={{
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: 20,
                                        alignSelf: 'center',
                                        marginBottom: 10
                                    }}
                                > Select the Reciever </Text>
                                <FlatList
                                    data={usersContainer.users}
                                    keyExtractor={
                                        (item) => {
                                            return item.data.email
                                        }
                                    }
                                    renderItem={
                                        ({ item }) => {
                                            if (item.data.email != state.email) {
                                                return (
                                                    <View style={styles.userChatContainer}>
                                                        <TouchableOpacity
                                                            style={styles.userChatButton}
                                                            onPress={
                                                                () => {
                                                                    dispatch({ type: 'set_show_users', payload: false });
                                                                    props.navigation.navigate('Chat', { item });
                                                                }
                                                            }
                                                        >
                                                            <View style={{
                                                                flexDirection: 'row',
                                                                alignItems: 'center'
                                                            }}>
                                                                <Image
                                                                    source={require('../assets/userImage.png')}
                                                                    style={{
                                                                        height: 50,
                                                                        width: 50,
                                                                        borderRadius: 30,
                                                                        margin: 10
                                                                    }}
                                                                />
                                                                <Text style={{ fontSize: 20, color: 'black' }}>{item.data.userName}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }
                                            else {
                                                return null;
                                            }
                                        }
                                    }
                                />
                            </View>
                    }
                        <Button
                        label='Close'
                            onPressCallback={
                                () => {
                                    dispatch({ type: 'set_show_users', payload: false });
                                }
                            }
                            visible={true}
                    />
                </View>
            </View>
        </Modal>
        {usersContainer.activeUsers.length == 0 ? <Text style={{ fontSize: 30, fontWeight: 'bold', alignSelf: 'center', marginVertical: 300, color: 'white' }}>No Active Users</Text> : null}
        {usersContainer.error
            ? <ErrorMsg
                text={usersContainer.error}
                clearError={(string) => {
                    dispatch({ type: 'set_error', payload: string });
                }}
            />
            : <ErrorMsg />}
        <View style={{ padding: 20, flex: 1, justifyContent: 'space-between' }}>
        <FlatList
                data={usersContainer.activeUsers}
            keyExtractor={
                (item) => {
                    return item.data.email
                }
            }
            renderItem={
                ({ item }) => {
                    if (item.email != state.email) {
                        return (
                            <View style={styles.userChatContainer}>
                                <TouchableOpacity
                                    style={styles.userChatButton}
                                    onPress={
                                        () => {
                                            props.navigation.navigate('Chat', { item });
                                        }
                                    }
                                >
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Image
                                            source={item.data.photoURL ? { uri: item.data.photoURL } : require('../assets/userImage.png')}
                                            style={{
                                                height: 50,
                                                width: 50,
                                                borderRadius: 20,
                                                marginVertical: 10,
                                                marginRight: 10,
                                                backgroundColor: 'white'
                                            }}
                                        />
                                        <View>
                                            <Text style={{ fontSize: 20, color: 'white' }}>{item.data.userName}</Text>
                                            <Text style={{ fontSize: 15, color: 'white' }}>{item.data.recentMessage}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                    else {
                        return null;
                    }
                }
            }
        />
            <Button
                label='Show Users'
                visible={true}
                onPressCallback={
                    () => {
                        dispatch({ type: 'set_show_users', payload: true });
                    }
                }
            />
        </View>
    </View>
}

const styles = StyleSheet.create(
    {
        userChatContainer: {
            margin: 5,
            borderRadius: 10,
            borderColor: 'blue',
            borderWidth: 1,
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
        userChatButton: {
            width: '100%',
            justifyContent: 'center'
        },
        userChatName: {
            fontSize: 20,
            color: 'white'
        }
    }
)

export default ChatsRoomScreen;