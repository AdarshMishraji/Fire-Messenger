const router = require('express').Router();
const adminApp = require('../../fireApp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/withEmailAndPassword', async (req, res) => {
    const { email, password } = req.body;

    console.log(1);
    await adminApp.firestore()
        .collection('users')
        .where('email', '==', email)
        .where('signedIn', '==', false)
        .get()
        .then(
            (data) => {
                console.log(2);
                data.docs.forEach(element => console.log(element));
                if (data.docs.length == 0) {
                    console.log('No user found')
                    res.status(404).send({ errMsg: 'No user found.' });
                }
                else if (data.docs.length == 1) {
                    data.docs.forEach(
                        (element) => {
                            console.log(3);
                            const encryptedPassword = element.data().password;
                            bcrypt.compare(password, encryptedPassword)
                                .then(
                                    async (isSame) => {
                                        console.log(4);
                                        if (isSame) {
                                            await adminApp.firestore()
                                                .collection('users')
                                                .doc(email)
                                                .update(
                                                    {
                                                        signedIn: true
                                                    }
                                                )
                                            console.log(5);
                                            const dataToSend = {
                                                photoURL: element.data().photoURL,
                                                userName: element.data().userName
                                            }
                                            const token = jwt.sign(dataToSend, 'NuRsInHa');
                                            res.status(200).send({ msg: 'User Logged In', token: token });
                                        }
                                        else {
                                            console.log(6);
                                            res.status(400).send({ errMsg: 'Invalid Password.' });
                                        }
                                    }
                                )
                                .catch(
                                    (err) => {
                                        console.log(7);
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
                console.log(8);
                console.log(err);
                res.status(404).send({ errMsg: 'No user found.' });
            }
        )
})

module.exports = router;