/* eslint-disable prettier/prettier */
import { GoogleSignin } from '@react-native-community/google-signin';
import fireMessengerAPI from '../api/fire-messenger';
import jwt_decode from 'jwt-decode';;

export const GoogleAuthSignup = async (setData, setError) => {
    await GoogleSignin.configure(
        {
            webClientId: '1017171902033-2vjkrh3bvvcp8oecevg5ed2td0hi472j.apps.googleusercontent.com'
        }
    );

    GoogleSignin.signIn()
        .then(
            async ({ idToken }) => {
                await fireMessengerAPI.post('/auth/signup/withGoogleJWT', { token: idToken })
                    .then(
                        (value) => {
                            const data = jwt_decode(value.data.token);
                            console.log(data);
                            setData('Google', data);
                        }
                    )
                    .catch(
                        (err) => {
                            setError(err);
                        }
                    )
            }
        )
        .catch(
            (err) => {
                console.log(err);
                setError(err);
            }
        )

}