import fireMessengerAPI from '../api/fire-messenger';
import firestore from '@react-native-firebase/firestore';
import store from '../../ReduxStore';

export const fetchData = (otherUserEmail) => {
    const currentUserData = store.getState().auth.user;
    console.log(currentUserData, otherUserEmail);
    return async (dispatch) => {
        await firestore()
            .collection('users')
            .doc(currentUserData.email) //  current user's email address.
            .collection('active_users')
            .doc(otherUserEmail) // another user's email address.
            .collection('messages')
            .orderBy('sendAtTimeStamp', 'asc')
            .onSnapshot(
                async (docSnapShot) => {
                    console.log('fetchData', docSnapShot.docs.map(ele => ele.data()));
                    dispatch(
                        {
                            type: 'set_messages',
                            payload: docSnapShot.docs.map(
                                (msg) => {
                                    return msg.data();
                                }
                            )
                        }
                    )
                    await firestore() // for seen feature.
                        .collection('users')
                        .doc(otherUserEmail)
                        .collection('active_users')
                        .doc(currentUserData.email)
                        .collection('messages')
                        .where('senderEmail', '==', otherUserEmail)
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
}

export const onSend = (otherUserData) => {
    const currentUserData = store.getState().auth.user;
    const newMessage = store.getState().chats.newMessage;
    return async (dispatch) => {
        dispatch({ type: 'set_is_sending', payload: true });
        const packet = {
            senderEmail: currentUserData.email,
            recieverEmail: otherUserData.email,
            message: newMessage,
            sendAtTimeStamp: new Date().getTime().toString(),
            sendAt: new Date().toString(),
            visibility: 'true',
            seenAt: 'null'
        }

        await fireMessengerAPI.post('/messages/sendMessage',
            {
                message: packet,
                currentUserDetails: currentUserData,
                receiverDetails: otherUserData
            }
        )
    }
}

export const appendChatsIndex = (index) => {
    const chatsState = store.getState().chats;
    return (dispatch) => {
        dispatch({ type: 'set_items_to_delete', payload: [...chatsState.itemsToDelete, index] });
    }
}

export const deleteChatsIndex = (index) => {
    const itemsToDelete = store.getState().chats.itemsToDelete;
    return (dispatch) => {
        var items = []
        itemsToDelete.forEach(
            (data) => {
                if (data.index != index) {
                    items.push(data)
                }
            }
        )
        dispatch({ type: 'set_items_to_delete', payload: items });
    }
}

export const deleteChats = (otherUserEmail) => {
    const currentUserData = store.getState().auth.user;
    const chatsState = store.getState().chats;
    const itemsToDelete = chatsState.itemsToDelete
    const messages = store.getState().chats.messages;
    return async (dispatch) => {
        // const chatsState = store.getState().chats;
        console.log('messages', messages);
        console.log('toDelete', itemsToDelete);
        const resultantData = [];

        for (let i = 0; i < messages.length; i++) {
            for (let j = 0; j < itemsToDelete.length; j++) {
                if (itemsToDelete[j].index != i) {
                    resultantData.push(messages[i]);
                }
                else {
                    console.log('message to delete', messages[i])
                    if (itemsToDelete[j].sender == 'me') {
                        await firestore()
                            .collection('users')
                            .doc(currentUserData.email)
                            .collection('active_users')
                            .doc(otherUserEmail)
                            .collection('messages')
                            .doc(messages[i].sendAtTimeStamp.toString())
                            .update({ visibility: 'false' })
                        await firestore()
                            .collection('users')
                            .doc(otherUserEmail)
                            .collection('active_users')
                            .doc(currentUserData.email)
                            .collection('messages')
                            .doc(messages[i].sendAtTimeStamp.toString())
                            .update({ visibility: 'false' })
                    }
                    else {
                        await firestore()
                            .collection('users')
                            .doc(otherUserEmail)
                            .collection('active_users')
                            .doc(currentUserData.email)
                            .collection('messages')
                            .doc(messages[i].createdAt.toString())
                            .update({ visibility: 'false' })
                    }
                }
            }
        }
        dispatch({ type: 'set_items_to_delete', payload: [] });
    }
}

