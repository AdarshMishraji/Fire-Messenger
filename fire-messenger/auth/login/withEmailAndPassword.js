const router = require('express').Router();
const adminApp = require('../../fireApp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/withEmailAndPassword', async (req, res) => {
    console.log('withEmailAndPassword Login', req.body);
    const { email, password, FCMToken } = req.body;

    await adminApp.firestore()
        .collection('users')
        .where('email', '==', email)
        .where('signedIn', '==', false)
        .get()
        .then(
            (data) => {
                data.docs.forEach(element => console.log(element));
                if (data.docs.length == 0) {
                    console.log('No user found')
                    res.status(404).send({ errMsg: 'No user found.' });
                }
                else if (data.docs.length == 1) {
                    data.docs.forEach(
                        (element) => {
                            const encryptedPassword = element.data().password;
                            bcrypt.compare(password, encryptedPassword)
                                .then(
                                    async (isSame) => {
                                        if (isSame) {
                                            await adminApp.firestore()
                                                .collection('users')
                                                .doc(email)
                                                .update(
                                                    {
                                                        signedIn: true,
                                                        FCMToken
                                                    }
                                            )
                                            const dataToSend = {
                                                photoURL: element.data().photoURL,
                                                userName: element.data().userName
                                            }
                                            const token = jwt.sign(dataToSend, 'NuRsInHa');
                                            res.status(200).send({ msg: 'User Logged In', token: token });
                                        }
                                        else {
                                            res.status(400).send({ errMsg: 'Invalid Password.' });
                                        }
                                    }
                                )
                                .catch(
                                    (err) => {
                                        console.log(err);
                                        res.status(500).send({ errMsg: 'Internal Error.' });
                                    }
                                )
                        }
                    )
                }
            }
        )
        .catch(
            (err) => {
                console.log(err);
                res.status(404).send({ errMsg: 'No user found.' });
            }
        )
})

module.exports = router;