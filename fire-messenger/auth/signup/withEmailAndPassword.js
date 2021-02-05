const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const adminApp = require('../../fireApp');

router.post('/withEmailAndPassword',
    async (req, res) => {
        const { userName, email, password, photoURL } = req.body;

        await adminApp.firestore()
            .collection('users')
            .where('email', '==', email)
            .get()
            .then(
                (value) => {
                    if (value.size != 0) {
                        console.log(value.size);
                        res.status(409).send({ errMsg: 'Email already exists.' })
                    }
                    else {
                        bcrypt.genSalt(13)
                            .then(
                                (salt) => {
                                    bcrypt.hash(password, salt)
                                        .then(
                                            async (encrypted) => {
                                                const token = jwt.sign({ email, password }, 'NuRsInHa');
                                                console.log(token, encrypted);
                                                await adminApp.firestore()
                                                    .collection('users')
                                                    .doc(email)
                                                    .set(
                                                        {
                                                            userName: userName ? userName : null,
                                                            email,
                                                            password: encrypted,
                                                            photoURL: photoURL ? photoURL : null,
                                                            signedIn: true
                                                        }
                                                    )
                                                res.status(201).send({ msg: 'User Created', token: token });
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
                            .catch(
                                (err) => {
                                    console.log(err);
                                    res.status(500).send({ errMsg: 'Internal Error' });
                                }
                            )
                    }
                }
            )
    }
)

module.exports = router;