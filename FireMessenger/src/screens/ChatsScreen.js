import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TextInput, TouchableOpacity, BackHandler, Image } from 'react-native';
import Button from '../components/Button';
import firestore from '@react-native-firebase/firestore';
import { Context as AuthContext } from '../contexts/AuthContext';
import fireMessengerAPI from '../api/fire-messenger';

const ChatsScreen = (props) => {
    const { state } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [itemToDelete, setItemToDelete] = useState([]);
    const [selection, setSelection] = useState(false);

    React.useLayoutEffect(
        () => {
            props.navigation.setOptions(
                {
                    title: props.route.params.item.data.userName,
                }
            )
        }
    )


    useEffect(
        () => {
            const fetchData = () => {
                firestore()
                    .collection('users')
                    .doc(state.email) //  current user's email address.
                    .collection('active_users')
                    .doc(props.route.params.item.data.email) // another user's email address.
                    .collection('messages')
                    .orderBy('sendAt', 'asc')
                    .onSnapshot(
                        (docSnapShot) => {
                            setMessages(
                                docSnapShot.docs.map(
                                    (msg) => {
                                        return msg.data();
                                    }
                                )
                            )
                            firestore() // for seen feature.
                                .collection('users')
                                .doc(props.route.params.item.data.email)
                                .collection('active_users')
                                .doc(state.email)
                                .collection('messages')
                                .where('senderEmail', '==', props.route.params.item.data.email)
                                .where('seenAt', '==', 'null')
                                .get()
                                .then(
                                    (snapshot) => {
                                        console.log('inside seen')
                                        console.log('seen', snapshot.docs.map(element => element.data), snapshot.docs.length);
                                        for (const doc of snapshot.docs) {
                                            if (snapshot.docs.length != 0) break;
                                            doc.ref.update(
                                                {
                                                    seenAt: new Date().toString()
                                                }
                                            )
                                        }
                                    }
                                )

                        }
                    )
            }
            return () => { fetchData() };
        }, []
    )

    const onSend = async () => {
        const packet = {
            senderEmail: state.email,
            recieverEmail: props.route.params.item.data.email,
            message: newMessage,
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
        const senderRef = firestore()
            .collection('users')
            .doc(messages[i].senderEmail)
            .collection('active_users')
            .doc(messages[i].recieverEmail)
            .collection('messages')

        const receiverRef = firestore()
            .collection('users')
            .doc(messages[i].recieverEmail)
            .collection('active_users')
            .doc(messages[i].senderEmail)
            .collection('messages')

        for (let i = 0; i < messages.length; i++) {
            for (let j = 0; j < itemToDelete.length; j++) {
                if (itemToDelete[j].index != i) {
                    resultantData.push(messages[i]);
                }
                else {

                    if (itemToDelete[j].sender == 'me') {
                        await senderRef
                            .doc(messages[i].sendAt.toString())
                            .update({ visibility: 'false' })
                        await receiverRef
                            .doc(messages[i].sendAt.toString())
                            .update({ visibility: 'false' })
                    }
                    else {
                        await receiverRef
                            .doc(messages[i].createdAt.toString())
                            .update({ visibility: 'false' })
                    }
                }
            }
        }
        setMessages(resultantData);
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
                    items.push(index)
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
                borderRadius: 30
            }}
        />
    }

    const SenderMessageComponent = ({ color, item }) => {
        return <View style={{ paddingLeft: 100, backgroundColor: color, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <View style={styles.senderMessageStyle}>
                <Text
                    style={{ fontSize: 20 }}
                    onLongPress={
                        () => {
                            appendIndex({ index, sender: 'me' });
                            setSelection(true);
                        }
                    }
                    onPress={
                        () => {
                            console.log(selection);
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
            </View>
            <SenderImageComponent />
        </View>
    }

    const RecieverMessageComponent = ({ color, item }) => {
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
                            if ({ index, sender: 'not_me' } in itemToDelete) {
                                deleteIndex(index)
                            }
                            else {
                                appendIndex({ index, sender: 'not_me' });
                            }
                        }
                    }
                }
            >{item.message}</Text>
        </View>
    }

    const InputWidget = () => {
        return <View style={styles.inputWidget}>
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
    }

    return (
        <View style={styles.deleteButtonStyle}>
            {itemToDelete.length != 0
                ? <View style={{ marginHorizontal: 10 }}>
                    <Button
                        label='Delete'
                        onPressCallback={deleteChats}
                    />
                </View>
                : null
            }
            <View style={{ flex: 1, padding: 10 }}>
                <FlatList
                    data={messages}
                    keyExtractor={
                        item => item.sendAt.toString()
                    }

                    renderItem={
                        ({ item, index }) => {
                            if (item.visibility == 'true') {
                                var color = search(index) == true ? 'rgba(0,0,0,0.3)' : ''
                                return <View>
                                    {item.senderEmail == state.email
                                        ? <SenderMessageComponent color={color} item={item} />
                                        // <View style={{ paddingLeft: 100, backgroundColor: color }}>
                                        //     <View style={styles.senderMessageStyle}>
                                        //         <Text
                                        //             style={{ fontSize: 20 }}
                                        //             onLongPress={
                                        //                 () => {
                                        //                     appendIndex({ index, sender: 'me' });
                                        //                     setSelection(true);
                                        //                 }
                                        //             }
                                        //             onPress={
                                        //                 () => {
                                        //                     console.log(selection);
                                        //                     if (selection) {
                                        //                         if (search(index)) {
                                        //                             console.log('true inside onPress')
                                        //                             deleteIndex(index);
                                        //                         }
                                        //                         else {
                                        //                             appendIndex({ index, sender: 'me' });
                                        //                         }
                                        //                     }
                                        //                 }
                                        //             }
                                        //         >{item.message}
                                        //         </Text>
                                        //         <Text style={styles.seenAtStyle}>{item.seenAt != 'null' ? 'Seen' : 'Not Seen'}</Text>
                                        //     </View>
                                        // </View>
                                        : <RecieverMessageComponent color={color} item={item} />
                                        // <View style={{ paddingRight: 100 }}>
                                        //     <Text
                                        //         style={styles.recieverMessageStyle}
                                        //         onLongPress={
                                        //             () => {
                                        //                 appendIndex({ index, sender: 'not_me' });
                                        //                 setSelection(true);
                                        //             }
                                        //         }
                                        //         onPress={
                                        //             () => {
                                        //                 if (selection) {
                                        //                     if ({ index, sender: 'not_me' } in itemToDelete) {
                                        //                         deleteIndex(index)
                                        //                     }
                                        //                     else {
                                        //                         appendIndex({ index, sender: 'not_me' });
                                        //                     }
                                        //                 }
                                        //             }
                                        //         }
                                        //     >{item.message}</Text>
                                        // </View>
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
            {/* <InputWidget /> */}
        </View >
    )
}


const styles = StyleSheet.create(
    {
        deleteButtonStyle: {
            flex: 1,
            justifyContent: 'flex-end'
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