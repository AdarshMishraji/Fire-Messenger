const router = require('express').Router();
// const firebase = require('firebase').default;
const adminApp = require('../fireApp');

router.post('/sendMessage',
    async (req, res) => {
        const { message, currentUserDetails, receiverDetails } = req.body;
        console.log(message, currentUserDetails, receiverDetails);
        const currentTime = message.sendAt;

        const senderRef = adminApp.firestore()
            .collection('users')
            .doc(currentUserDetails.email)
            .collection('active_users')
            .doc(receiverDetails.email)

        const receiverRef = adminApp.firestore()
            .collection('users')
            .doc(receiverDetails.email)
            .collection('active_users')
            .doc(currentUserDetails.email)

        try {
            await senderRef
                .collection('messages')
                .doc(message.sendAtTimeStamp.toString())
                .set(message);

            await receiverRef
                .collection('messages')
                .doc(message.sendAtTimeStamp.toString())
                .set(message);

            await senderRef
                .set(
                    {
                        email: receiverDetails.email,
                        photoURL: receiverDetails.photoURL,
                        userName: receiverDetails.userName,
                        recentTimeStamp: currentTime,
                        recentMessage: message.message,
                        FCMToken: receiverDetails.FCMToken
                    }
                )
            await receiverRef
                .set(
                    {
                        email: currentUserDetails.email,
                        photoURL: currentUserDetails.photoURL,
                        userName: currentUserDetails.userName,
                        recentTimeStamp: currentTime,
                        recentMessage: message.message,
                        FCMToken: receiverDetails.FCMToken
                    }
                )
            await adminApp
                .messaging()
                .sendToDevice(receiverDetails.FCMToken,
                    {
                        notification: {
                            title: `Message From: ${currentUserDetails.userName}`,
                            body: `${message.message}`,
                        },
                    },
                    {
                        timeToLive: 86400,
                        priority: 'high',
                    }
            ).catch((err) => console.log('No FCM Code Found. Might be the user is not logged in', err));

            res.status(200).send({ msg: 'Message send successfully' });
        }
        catch (err) {
            console.log('err at send message', err);
            res.status(500).send({ errMsg: 'Internal Error' });
        }
    }
)

module.exports = router;