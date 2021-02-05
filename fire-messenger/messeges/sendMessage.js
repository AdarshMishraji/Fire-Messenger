const router = require('express').Router();
const firebase = require('firebase').default;

router.post('/sendMessage',
    async (req, res) => {
        const { message, currentUserDetails, receiverDetails } = req.body;
        console.log(message, currentUserDetails, receiverDetails);
        const currentTimeStamp = new Date().getTime().toString();
        const senderRef = firebase.firestore()
            .collection('users')
            .doc(currentUserDetails.email)
            .collection('active_users')
            .doc(receiverDetails.email)

        const receiverRef = firebase.firestore()
            .collection('users')
            .doc(receiverDetails.email)
            .collection('active_users')
            .doc(currentUserDetails.email)

        try {
            await senderRef
                .collection('messages')
                .doc(currentTimeStamp)
                .set(message);

            await receiverRef
                .collection('messages')
                .doc(currentTimeStamp)
                .set(message);

            await senderRef
                .set(
                    {
                        email: receiverDetails.email,
                        photoURL: receiverDetails.photoURL,
                        userName: receiverDetails.userName,
                        recentTimeStamp: currentTimeStamp,
                        recentMessage: message.message
                    }
                )
            await receiverRef
                .set(
                    {
                        email: currentUserDetails.email,
                        photoURL: currentUserDetails.photoURL,
                        userName: currentUserDetails.userName,
                        recentTimeStamp: currentTimeStamp,
                        recentMessage: message.message
                    }
                )
            res.status(200).send({ msg: 'Message send successfully' });
        }
        catch (err) {
            console.log('err at send message', err);
            res.status(500).send({ errMsg: 'Internal Error' });
        }
    }
)

module.exports = router;