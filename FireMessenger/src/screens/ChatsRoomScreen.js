import React, { useEffect } from 'react';
import { View, FlatList, Modal, Text, TouchableOpacity, Image, UIManager, LayoutAnimation } from 'react-native';
import {
    Button,
    Spinner,
} from '../components';
import { chatsRoomScreenStyles as styles } from '../styles';
import {
    getActiveUsers,
    getAllUsers,
    actionCreator
} from '../actions'
import { connect } from 'react-redux';

UIManager.setLayoutAnimationEnabledExperimental ? UIManager.setLayoutAnimationEnabledExperimental(true) : null;

const ChatsRoomScreen = (props) => {

    useEffect(
        () => {
            const unsuscribe = props.navigation.addListener('focus', () => {
                props.actionCreator('set_spinner', true);
                props.getAllUsers(props.email);
                props.getActiveUsers(props.email);
                setTimeout(() => props.actionCreator('set_spinner', false), 5000);
            })
            return () => {
                unsuscribe;
            }
        }, []
    )

    console.log('chatsRoomScreen', props.spinner, props.activeUsers, props.allUsers);


    return <View style={{ flex: 1 }}>
        <Spinner
            isVisible={!props.spinner || props.activeUsers.length != 0 || props.allUsers.length != 0 ? false : true}
        />
        <Modal
            visible={props.showUsers}
            transparent={true}
        >
            <View
                style={styles.modalRootStyle}
            >
                <View
                    style={styles.modalViewStyle}
                    >
                    {
                        props.allUsers.length == 0
                            ? <Text style={styles.modalNoUserStyle}>No Users</Text>
                            :
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={styles.modalHeaderStyle}
                                > Select the Reciever </Text>
                                <FlatList
                                    data={props.allUsers}
                                    keyExtractor={
                                        (item) => {
                                            return item.data.email
                                        }
                                    }
                                    renderItem={
                                        ({ item }) => {
                                            if (item.data.email != props.email) {
                                                return (
                                                    <View style={styles.userChatContainer}>
                                                        <TouchableOpacity
                                                            style={styles.userChatButton}
                                                            onPress={
                                                                () => {
                                                                    // dispatch({ type: 'set_show_users', payload: false });
                                                                    props.actionCreator('set_show_users', false);
                                                                    props.navigation.navigate('Chat', { item });
                                                                }
                                                            }
                                                        >
                                                            <View style={styles.modalUsersContainer}>
                                                                <Image
                                                                    source={item.data.photoURL ? { uri: item.data.photoURL } : require('../assets/userImage.png')}
                                                                    style={styles.modalUserImageStyle}
                                                                />
                                                                <Text style={styles.modalUsername}>{item.data.userName}</Text>
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
                                    // dispatch({ type: 'set_show_users', payload: false });
                                    props.actionCreator('set_show_users', false);
                                }
                            }
                            visible={true}
                    />
                </View>
            </View>
        </Modal>
        {props.activeUsers.length == 0 ? <Text style={styles.noUserStyle}>No Active Users</Text> : null}

        <View style={styles.mainRootStyle}>
        <FlatList
                data={props.activeUsers}
            keyExtractor={
                (item) => {
                    return item.data.email
                }
            }
            renderItem={
                ({ item }) => {
                    if (item.email != props.email) {
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
                                    <View style={styles.usersContainer}>
                                        <Image
                                            source={item.data.photoURL ? { uri: item.data.photoURL } : require('../assets/userImage.png')}
                                            style={styles.userImageStyle}
                                        />
                                        <View>
                                            <Text style={styles.userNameStyle}>{item.data.userName}</Text>
                                            <Text style={styles.recentMessageStyle}>{item.data.recentMessage}</Text>
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
                        // dispatch({ type: 'set_show_users', payload: true });
                        LayoutAnimation.configureNext(LayoutAnimation.create(250, LayoutAnimation.Types.easeOut, LayoutAnimation.Properties.scaleXY));
                        props.actionCreator('set_show_users', true);
                    }
                }
            />
        </View>
    </View>
}


const mapStateToProps = (state) => {
    return {
        userDetails: state.auth.user,
        allUsers: state.chatsRoom.allUsers,
        activeUsers: state.chatsRoom.activeUsers,
        showUsers: state.chatsRoom.showUsers,
        error: state.chatsRoom.error,
        spinner: state.chatsRoom.spinner,
        email: state.auth.user.email
    }
}

export default connect(mapStateToProps, { actionCreator, getActiveUsers, getAllUsers })(ChatsRoomScreen);