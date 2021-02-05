const router = require('express').Router();
const firebase = require('firebase').default;

router.post('/setActiveUserForAUser',
    async (req, res) => {
        const { senderEmail, recieverEmail, item } = req.body;
        try {
            await firebase.firestore()
                .collection('users')
                .doc(senderEmail)
                .collection('active_users')
                .doc(recieverEmail)
                .set(item)
            await firebase.firestore()
                .collection('users')
                .doc(recieverEmail)
                .collection('active_users')
                .doc(senderEmail)
                .set(item)
            res.status(200).send({ msg: 'Active user set' });
        }
        catch (err) {
            res.status(500).send({ errMsg: 'Internal Error' });
        }
    }
)

module.exports = router;