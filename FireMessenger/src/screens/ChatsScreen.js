import React, { useEffect } from 'react';
import { AppState, View, FlatList, Text, TextInput, TouchableOpacity, BackHandler, Image, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Button, Spinner } from '../components';
import { connect } from 'react-redux';
import {
    actionCreator,
    fetchData,
    onSend,
    appendChatsIndex,
    deleteChatsIndex,
    deleteChats
} from '../actions'
import { chatsScreenStyle as styles } from '../styles';

const ChatsScreen = (props) => {
    React.useLayoutEffect(
        () => {
            props.navigation.setOptions(
                {
                    title: props.route.params.item.data.userName,
                }
            )
        }, []
    )

    useEffect(
        () => {
            props.fetchData(props.route.params.item.data.email);
            const onBackPress = () => {
                if (props.selections) {
                    props.actionCreator('set_items_to_delete', []);
                    props.actionCreator('set_selections', false);
                }
                return true;
            }
            const onAppStateChange = (state) => {
                console.log('onAppStateCHange', state);
                if (state != 'background' && state != 'inactive') {
                    props.fetchData(props.route.params.item.data.email);
                }
            }
            const y = AppState.addEventListener('change', onAppStateChange)
            const x = BackHandler.addEventListener('hardwareBackPress', onBackPress)
            return () => {
                x;
                y;
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
                AppState.removeEventListener('change', onAppStateChange);
            }
        }, []
    )

    useEffect(
        () => {
            if (props.itemsToDelete.length === 0) {
                props.actionCreator('set_selections', false);
                props.actionCreator('set_is_deleting', false);
            }
        }, [props.itemsToDelete]
    )

    const onSend = () => {
        props.onSend(props.route.params.item.data);
    }

    const appendIndex = (index) => {
        props.appendChatsIndex(index);
    }

    const deleteChats = () => {
        props.actionCreator('set_is_deleting', true);
        props.deleteChats(props.route.params.item.data.email);
    }

    const search = (item) => {
        for (let i = 0; i < props.itemsToDelete.length; i++) {
            if (props.itemsToDelete[i].index == item) {
                return true;
            }
        }
        return false;
    }

    const deleteIndex = (index) => {
        props.deleteChatsIndex(index);
    }

    const SenderImageComponent = () => {
        return <Image
            source={props.photoURL ? { uri: props.photoURL } : require('../assets/userImage.png')}
            style={styles.userImageStyle}
        />
    }

    const RecieverImageComponent = () => {
        return <Image
            source={props.route.params.item.data.photoURL ? { uri: props.route.params.item.data.photoURL } : require('../assets/userImage.png')}
            style={styles.userImageStyle}
        />
    }

    const SenderMessageComponent = ({ color, item, index }) => {
        return <View style={{ ...styles.senderMessageComponentStyle, backgroundColor: color }}>
            <View style={styles.senderMessageStyle}>
                <Text
                    style={styles.senderMessageTextStyle}
                    onLongPress={
                        () => {
                            appendIndex({ index, sender: 'me' });
                            props.actionCreator('set_selections', true);
                        }
                    }
                    onPress={
                        () => {
                            if (props.selections) {
                                if (search(index)) {
                                    deleteIndex(index);
                                }
                                else {
                                    appendIndex({ index, sender: 'me' });
                                }
                            }
                        }
                    }
                >{item.message}
                </Text>
                <Text style={styles.seenAtStyle}>{item.seenAt != 'null' ? 'Seen' : 'Not Seen'}</Text>
                {item.seenAt != 'null' ? <Text>{item.seenAt.substr(4, 20)}</Text> : null}
            </View>
            <SenderImageComponent />
        </View>
    }

    const RecieverMessageComponent = ({ color, item, index }) => {
        return <View style={{ ...styles.recieverMessageComponentStyle, backgroundColor: color }}>
            <RecieverImageComponent />
            <Text
                style={styles.recieverMessageStyle}
                onLongPress={
                    () => {
                        appendIndex({ index, sender: 'not_me' });
                        // setSelection(true);
                        props.actionCreator('set_selections', true);
                    }
                }
                onPress={
                    () => {
                        if (props.selections) {
                                if (search(index)) {
                                    console.log('true inside onPress')
                                    deleteIndex(index);
                                }
                                else {
                                    appendIndex({ index, sender: 'me' });
                                }
                            }
                    }
                }
            >{item.message}</Text>
        </View>
    }

    const ModalContext = () => {
        return <View>
            <Text>Message: {props.messages[props.itemsToDelete[0].index].message}</Text>
            <Text>Sender Email: {props.messages[props.itemsToDelete[0].index].senderEmail}</Text>
            <Text>Receiver Email: {props.messages[props.itemsToDelete[0].index].recieverEmail}</Text>
            <Text>Send At: {props.messages[props.itemsToDelete[0].index].sendAt}</Text>
            <Text>Seen At: {props.messages[props.itemsToDelete[0].index].seenAt != 'null' ? props.messages[itemsToDelete[0].index].seenAt : 'Not seen yet'}</Text>
        </View>
    }

    const DetailsModal = () => {
        return <Modal
            visible={props.showDetails}
            transparent={true}
        >
            <View style={styles.modalRootStyle}>
                <View style={styles.modalViewStyle}>
                    <ScrollView style={{ flex: 1 }}>
                        {props.itemsToDelete.length ? <ModalContext /> : null}
                    </ScrollView>
                    <Button
                        label='Close'
                        onPressCallback={
                            () => {
                                props.actionCreator('set_show_details', false)
                            }
                        }
                        visible={true}
                    />
                </View>
            </View>
        </Modal>
    }

    return (

        <View style={styles.rootStyle}>
            <Spinner isVisible={props.isDeleting} />
            {props.itemsToDelete.length != 0
                ? <View
                    style={style.tempHeaderStyle}
                >
                    <Button
                        label='Delete'
                        onPressCallback={deleteChats}
                        visible={true}
                        additionStyling={styles.additionButtonStylingForTempHeader}
                    />
                    <Button
                        label='Info'
                        onPressCallback={() => props.actionCreator('set_show_details', true)}
                        visible={props.itemsToDelete.length == 1}
                        additionStyling={styles.additionButtonStylingForTempHeader}
                    />
                </View>
                : null
            }
            <View style={styles.subRootStyle}>
                <DetailsModal />
                <FlatList
                    data={props.messages}
                    keyExtractor={
                        item => item.sendAtTimeStamp.toString()
                    }
                    renderItem={
                        ({ item, index }) => {
                            if (item.visibility == 'true') {
                                var color = search(index) == true ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0)'
                                return <View>
                                    {
                                        item.senderEmail == props.email
                                            ?
                                            <SenderMessageComponent color={color} item={item} index={index} />
                                            :
                                            <RecieverMessageComponent color={color} item={item} index={index} />
                                    }
                                </View>
                            }
                        }
                    }
                />
            </View>
            <View style={styles.inputWidget}>
                <TextInput
                    style={styles.inputStyle}
                    value={props.newMessage}
                    onChangeText={
                        (newMsg) => {
                            // setNewMessage(newMsg);
                            props.actionCreator('set_new_message', newMsg);
                        }
                    }
                    placeholderTextColor='white'
                    placeholder='Type your message...'
                />
                {props.isSending ?
                    <TouchableOpacity
                        style={
                            styles.sendButtonStyle
                        }
                    >
                        <ActivityIndicator size='small' color='white' />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={styles.sendButtonStyle}
                        onPress={
                            () => {
                                onSend();
                                // setNewMessage('');
                                props.actionCreator('set_new_message', '');
                            }
                        }
                    >
                        <Text style={{ color: 'white' }}>Send</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

const mapStatesToProps = (state) => {
    return {
        photoURL: state.auth.user.photoURL,
        itemsToDelete: state.chats.itemsToDelete,
        messages: state.chats.messages,
        selections: state.chats.selections,
        showDetails: state.chats.showDetails,
        newMessge: state.chats.newMessage,
        isSending: state.chats.isSending,
        isDeleting: state.chats.isDeleting,
        email: state.auth.user.email
    }
}

export default connect(mapStatesToProps,
    {
        actionCreator,
        fetchData,
        onSend,
        appendChatsIndex,
        deleteChatsIndex,
        deleteChats
    }
)(ChatsScreen);