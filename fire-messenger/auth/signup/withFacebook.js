const router = require('express').Router();
const adminApp = require('../../fireApp');
const firebase = require('firebase');
const jwt = require('jsonwebtoken');

router.post('/withFacebookToken',
    async (req, res) => {
        const { token } = req.body;
        console.log(token);
        const facebookCredentials = firebase.default.auth.FacebookAuthProvider.credential(token);
        await firebase.default.auth().signInWithCredential(facebookCredentials)
            .then(
                async (value) => {
                    const { displayName, email, photoURL } = value.user;
                    await firebase.firestore()
                        .collection('users')
                        .where('email', '==', email)
                        .get()
                        .then(
                            async (data) => {
                                if (data.docs.length == 0) {
                                    const dataToSend = {
                                        userName: displayName,
                                        email,
                                        photoURL
                                    }
                                    await adminApp.auth().deleteUser(value.user.uid);
                                    res.status(200).send({ token: jwt.sign(dataToSend, 'NuRsInHa') });
                                }
                                else {
                                    res.status(409).send({ errMsg: 'Send to Login', email: email });
                                }
                            }
                        )
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