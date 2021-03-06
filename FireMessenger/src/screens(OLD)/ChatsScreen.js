import React, { useContext, useState, useEffect } from 'react';
import { AppState, View, FlatList, Text, StyleSheet, TextInput, TouchableOpacity, BackHandler, Image, Modal, ScrollView } from 'react-native';
import { Button } from '../components';
import firestore from '@react-native-firebase/firestore';
import { Context as AuthContext } from '../contexts/AuthContext';
import fireMessengerAPI from '../api/fire-messenger';

const ChatsScreen = (props) => {
    const { state } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [itemToDelete, setItemToDelete] = useState([]);
    const [selection, setSelection] = useState(false);
    const [showDetails, setShowDetails] = useState(null);

    React.useLayoutEffect(
        () => {
            props.navigation.setOptions(
                {
                    title: props.route.params.item.data.userName,
                }
            )
        }, []
    )

    const fetchData = async () => {
        await firestore()
            .collection('users')
            .doc(state.email) //  current user's email address.
            .collection('active_users')
            .doc(props.route.params.item.data.email) // another user's email address.
            .collection('messages')
            .orderBy('sendAtTimeStamp', 'asc')
            .onSnapshot(
                async (docSnapShot) => {
                    setMessages(
                        docSnapShot.docs.map(
                            (msg) => {
                                return msg.data();
                            }
                        )
                    )
                    await firestore() // for seen feature.
                        .collection('users')
                        .doc(props.route.params.item.data.email)
                        .collection('active_users')
                        .doc(state.email)
                        .collection('messages')
                        .where('senderEmail', '==', props.route.params.item.data.email)
                        .where('seenAt', '==', 'null')
                        .where('visibility', '==', 'true')
                        .get()
                        .then(
                            (snapshot) => {
                                for (const doc of snapshot.docs) {
                                    if (snapshot.docs.length == 0) break;
                                    else {
                                        doc.ref.update(
                                            {
                                                seenAt: new Date().toString()
                                            }
                                        )
                                    }
                                }
                            }
                    )
                }
            )
    }

    useEffect(
        () => {
            const onBackPress = () => {
                if (selection) {
                    setSelection(false);
                }
            }
            const onAppStateChange = (state) => {
                if (state != 'background' && state != 'inactive') {
                    fetchData();
                }
            }
            AppState.addEventListener('change', onAppStateChange)
            BackHandler.addEventListener('hardwareBackPress', onBackPress)
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
                AppState.removeEventListener('change', onAppStateChange);
            }
        }, []
    )


    const onSend = async () => {
        const packet = {
            senderEmail: state.email,
            recieverEmail: props.route.params.item.data.email,
            message: newMessage,
            sendAtTimeStamp: new Date().getTime().toString(),
            sendAt: new Date().toString(),
            visibility: 'true',
            seenAt: 'null'
        }

        await fireMessengerAPI.post('/messages/sendMessage',
            {
                message: packet,
                currentUserDetails: state,
                receiverDetails: props.route.params.item.data
            }
        )
    }

    const appendIndex = (index) => {
        setItemToDelete([...itemToDelete, index]);
    }

    const deleteChats = async () => {
        console.log('messages', messages);
        console.log('toDelete', itemToDelete);
        const resultantData = [];

        for (let i = 0; i < messages.length; i++) {
            for (let j = 0; j < itemToDelete.length; j++) {
                if (itemToDelete[j].index != i) {
                    resultantData.push(messages[i]);
                }
                else {
                    console.log('message to delete', messages[i])
                    if (itemToDelete[j].sender == 'me') {
                        await firestore()
                            .collection('users')
                            .doc(state.email)
                            .collection('active_users')
                            .doc(props.route.params.item.data.email)
                            .collection('messages')
                            .doc(messages[i].sendAtTimeStamp.toString())
                            .update({ visibility: 'false' })
                        await firestore()
                            .collection('users')
                            .doc(props.route.params.item.data.email)
                            .collection('active_users')
                            .doc(state.email)
                            .collection('messages')
                            .doc(messages[i].sendAtTimeStamp.toString())
                            .update({ visibility: 'false' })
                    }
                    else {
                        await firestore()
                            .collection('users')
                            .doc(props.route.params.item.data.email)
                            .collection('active_users')
                            .doc(state.email)
                            .collection('messages')
                            .doc(messages[i].createdAt.toString())
                            .update({ visibility: 'false' })
                    }
                }
            }
        }
        // setMessages(resultantData);
        setItemToDelete([]);
    }


    const search = (item) => {
        for (let i = 0; i < itemToDelete.length; i++) {
            if (itemToDelete[i].index == item) {
                return true;
            }
        }
        return false;
    }

    const deleteIndex = (index) => {
        var items = []
        itemToDelete.forEach(
            (data) => {
                if (data.index != index) {
                    items.push(data)
                }
            }
        )
        setItemToDelete(items);
    }

    const SenderImageComponent = () => {
        return <Image
            source={state.photoURL ? { uri: state.photoURL } : require('../assets/userImage.png')}
            style={{
                height: 40,
                width: 40,
                borderRadius: 30,
                backgroundColor: 'white'
            }}
        />
    }

    const RecieverImageComponent = () => {
        return <Image
            source={props.route.params.item.data.photoURL ? { uri: props.route.params.item.data.photoURL } : require('../assets/userImage.png')}
            style={{
                height: 40,
                width: 40,
                borderRadius: 30,
                backgroundColor: 'white'
            }}
        />
    }

    const SenderMessageComponent = ({ color, item, index }) => {
        return <View style={{ paddingLeft: 100, backgroundColor: color, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <View style={styles.senderMessageStyle}>
                <Text
                    style={{ fontSize: 20, textAlign: 'right' }}
                    onLongPress={
                        () => {
                            appendIndex({ index, sender: 'me' });
                            setSelection(true);
                        }
                    }
                    onPress={
                        () => {
                            console.log('selection', selection);
                            if (selection) {
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
                >{item.message}
                </Text>
                <Text style={styles.seenAtStyle}>{item.seenAt != 'null' ? 'Seen' : 'Not Seen'}</Text>
                {item.seenAt != 'null' ? <Text>{item.seenAt.substr(4, 20)}</Text> : null}
            </View>
            <SenderImageComponent />
        </View>
    }

    const RecieverMessageComponent = ({ color, item, index }) => {
        return <View style={{ paddingRight: 100, backgroundColor: color, flexDirection: 'row', justifyContent: 'flex-start' }}>
            <RecieverImageComponent />
            <Text
                style={styles.recieverMessageStyle}
                onLongPress={
                    () => {
                        appendIndex({ index, sender: 'not_me' });
                        setSelection(true);
                    }
                }
                onPress={
                    () => {
                        if (selection) {
                            if (selection) {
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
                }
            >{item.message}</Text>
        </View>
    }

    return (

        <View style={styles.rootStyle}>
            {itemToDelete.length != 0
                ? <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around'
                    }}
                >
                    <Button
                        label='Delete'
                        onPressCallback={deleteChats}
                        visible={true}
                        additionStyling={{ marginHorizontal: 10, width: '40%' }}
                    />
                    <Button
                        label='Info'
                        onPressCallback={() => setShowDetails(true)}
                        visible={itemToDelete.length == 1}
                        additionStyling={{ marginHorizontal: 10, width: '40%' }}
                    />
                </View>
                : null
            }
            <View style={{ flex: 1, padding: 10 }}>
                <Modal
                    visible={showDetails}
                    transparent={true}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                        }}
                    >
                        <View
                            style={{
                                padding: 15,
                                borderWidth: 1,
                                width: 350,
                                backgroundColor: 'white',
                                borderRadius: 20,
                                height: 250
                            }}
                        >
                            <ScrollView
                                style={{
                                    flex: 1,
                                }}
                            >
                                {itemToDelete.length ?
                                    <View>
                                        <Text>Message: {messages[itemToDelete[0].index].message}</Text>
                                        <Text>Sender Email: {messages[itemToDelete[0].index].senderEmail}</Text>
                                        <Text>Receiver Email: {messages[itemToDelete[0].index].recieverEmail}</Text>
                                        <Text>Send At: {messages[itemToDelete[0].index].sendAt}</Text>
                                        <Text>Seen At: {messages[itemToDelete[0].index].seenAt != 'null' ? messages[itemToDelete[0].index].seenAt : 'Not seen yet'}</Text>
                                    </View> : null
                                }
                            </ScrollView>
                            <Button
                                label='Close'
                                onPressCallback={
                                    () => {
                                        setShowDetails(false)
                                    }
                                }
                                visible={true}
                            />
                        </View>
                    </View>
                </Modal>
                <FlatList
                    data={messages}
                    keyExtractor={
                        item => item.sendAtTimeStamp.toString()
                    }

                    renderItem={
                        ({ item, index }) => {
                            if (item.visibility == 'true') {
                                var color = search(index) == true ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0)'
                                return <View>
                                    {
                                        item.senderEmail == state.email
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
                    value={newMessage}
                    onChangeText={
                        (newMsg) => {
                            setNewMessage(newMsg);
                        }
                    }
                    placeholderTextColor='white'
                    placeholder='Type your message...'
                />
                <TouchableOpacity
                    style={styles.sendButtonStyle}
                    onPress={
                        () => {
                            onSend();
                            setNewMessage('');
                        }
                    }
                >
                    <Text style={{ color: 'white' }}>Send</Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}


const styles = StyleSheet.create(
    {
        rootStyle: {
            flex: 1,
            justifyContent: 'space-between'

        },
        senderMessageStyle: {
            borderRadius: 10,
            backgroundColor: 'lightblue',
            color: 'black',
            alignSelf: 'flex-end',
            textAlign: 'right',
            padding: 5,
            margin: 10
        },
        recieverMessageStyle: {
            borderRadius: 10,
            backgroundColor: 'lightgreen',
            color: 'black',
            fontSize: 20,
            alignSelf: 'flex-start',
            padding: 5,
            margin: 10
        },
        inputWidget: {
            flexDirection: 'row',
            marginVertical: 10,
            marginStart: 10,
            justifyContent: 'space-between'
        },
        inputStyle: {
            height: 50,
            borderWidth: 1,
            borderRadius: 10,
            paddingStart: 10,
            fontSize: 20,
            marginRight: 10,
            flex: 1,
            borderColor: 'white',
            color: 'white'
        },
        sendButtonStyle: {
            borderRadius: 10,
            borderWidth: 1,
            padding: 10,
            marginHorizontal: 10,
            height: 50,
            width: 75,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: 'white',
        },
        seenAtStyle: {
            marginRight: 10,
            textAlign: 'right'
        }
    }
);

export default ChatsScreen;