const router = require('express').Router();
const firebase = require('firebase').default;

router.post('/fetchActiveUsers',
    async (req, res) => {
        const { currentUserEmail } = req.body;
        console.log('currentUserEmail', currentUserEmail);
        await firebase.firestore()
            .collection('users')
            .doc(currentUserEmail)
            .collection('active_users')
            .orderBy('recentTimeStamp', 'desc')
            .get()
            .then(
                (querySnapShot) => {
                    // console.log('query', querySnapShot.docs);
                    if (querySnapShot.docs.length != 0) {
                        var users = [];
                        querySnapShot.docs.forEach(
                            (doc) => {
                                let noOfUnseen = -1;
                                firebase.firestore()
                                    .collection('users')
                                    .doc(currentUserEmail)
                                    .collection('active_users')
                                    .doc(doc.id)
                                    .collection('messages')
                                    .where('seenAt', '!=', 'null')
                                    .get()
                                    .then(
                                        (data) => {
                                            noOfUnseen = data.docs.length;
                                        }
                                    )
                                console.log(doc.data());
                                users.push({ data: { ...doc.data(), noOfUnseen } });
                            }
                        )
                        res.status(200).send({ users });
                    }
                    else {
                        res.status(404).send({ errMsg: 'No other user Found' });
                    }
                }
            )
            .catch(
                (err) => {
                    console.log(err);
                    res.status(500).send({ errMsg: 'Internal Error' });
                }
            )
    }
)

module.exports = router;