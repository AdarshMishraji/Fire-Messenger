const router = require('express').Router();
const firebase = require('firebase').default;

router.post('/fetchAllUsers',
    async (req, res) => {
        const { currentUserEmail } = req.body;
        await firebase.firestore()
            .collection('users')
            .get()
            .then(
                (querySnapShot) => {
                    if (querySnapShot.docs.length != 0) {
                        var users = [];
                        querySnapShot.docs.forEach(
                            (doc) => {
                                if (doc.data().email != currentUserEmail) {
                                    users.push({ data: doc.data() });
                                }
                            }
                        )
                        res.status(200).send({ users });
                    }
                    else {
                        res.status(404).send({ errMsg: 'No active users found' });
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