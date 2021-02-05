import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
export const FetchData = async (senderEmail, recieverEmail) => {

    const [senderData, setSenderData] = useState([]);
    const [recieverData, setRecieverData] = useState([]);
    const [chatData, setChatData] = useState([]);

    await firestore()
        .collection('messages')
        .where('sender.email', '==', senderEmail)
        .where('reciever.email', '==', recieverEmail)
        // .orderBy('createdAt', 'desc')
        // .where('reciever.email', 'in', ['adarshmishra969@gmail.com', 'asdfghjkl@gmail.com'])
        .get()
        .then(
            (value) => {
                setSenderData(value.docs.map(doc => doc.data()));
            }
        )
    await firestore()
        .collection('messages')
        .where('sender.email', '==', recieverEmail)
        .where('reciever.email', '==', senderEmail)
        .get()
        .then(
            (value) => {
                setRecieverData(value.docs.map(doc => doc.data()));
            }
        )

    setChatData([...senderData, ...recieverData].sort(
        (a, b) => {
            return b.createdAt - a.createdAt;
        }
    ))

    console.log(senderData);
    console.log(recieverData);
    console.log(chatData);
    return chatData;
}