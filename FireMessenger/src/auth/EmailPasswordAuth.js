/* eslint-disable prettier/prettier */
import fireMessengerAPI from '../api/fire-messenger';
import jwt_decode from 'jwt-decode';

export const EmailPasswordAuthSignup = async ({ userName, email, password, photoURL, FCMToken }, setData, setError) => {
    await fireMessengerAPI.post('/auth/signup/withEmailAndPassword',
        {
            userName: userName,
            email: email,
            password: password,
            photoURL: photoURL ? photoURL : null,
            FCMToken,
        }
    ).then(
        (value) => {
            const data = jwt_decode(value.data.token);
            console.log('EmailPasswordAuthSignup', data);
            setData(data);
        }
    )
        .catch(
            (err) => {
                console.log(err);
                setError(err);
            }
    );
};

export const EmailPasswordAuthLogin = async ({ email, password, FCMToken }, setData, setError) => {
    await fireMessengerAPI.post('/auth/login/withEmailAndPassword',
        {
            email,
            password,
            FCMToken,
        }
    )
        .then(
            (value) => {
                const data = jwt_decode(value.data.token);
                setData(data);
            }
        )
        .catch(
            (err) => {
                setError(err);
            }
    );
};
