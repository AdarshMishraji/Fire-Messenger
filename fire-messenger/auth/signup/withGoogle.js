const router = require('express').Router();
const adminApp = require('../../fireApp');
const jwt = require('jsonwebtoken')

router.post('/withGoogleJWT',
    async (req, res) => {
        const { token } = req.body;
        const { name, email, picture } = await jwt.decode(token);
        await adminApp.firestore()
            .collection('users')
            .where('email', '==', email)
            .get()
            .then(
                (value) => {
                    if (value.docs.length == 0) {
                        const data = {
                            userName: name,
                            email,
                            photoURL: picture
                        }
                        res.status(200).send({ token: jwt.sign(data, 'NuRsInHa') });
                    }
                    else {
                        res.status(409).send({ errMsg: 'Send to Login', email: email });
                    }
                }
            )
    }
)

module.exports = router;