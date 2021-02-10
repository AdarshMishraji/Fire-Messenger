const fireApp = require('../fireApp');
const router = require('express').Router();

router.post('/signout',
    async (req, res) => {
        const { email } = req.body;
        await fireApp.firestore()
            .collection('users')
            .where('email', '==', email)
            .where('signedIn', '==', true)
            .get()
            .then(
                (data) => {
                    if (data.size == 0) {
                        res.status(404).send({ errMsg: 'User not logged in. / Not existed.' });
                    }
                    else if (data.size == 1) {
                        data.docs.forEach(
                            async (element) => {
                                await fireApp.firestore()
                                    .collection('users')
                                    .doc(element.data().email)
                                    .update(
                                        {
                                            signedIn: false,
                                            FCMToken: null
                                        }
                                    )
                            }
                        )
                        res.status(200).send({ msg: 'User signed out' });
                    }
                    else {
                        res.status(500).send({ errMsg: 'Contact the developer. Some Internal Error has occured. Unable to sign out' });
                    }
                }
            )
            .catch(
                (err) => {
                    console.log(err);
                    res.status(404).send({ errMsg: 'No user found.' });
                }
            )
    }
)

module.exports = router;