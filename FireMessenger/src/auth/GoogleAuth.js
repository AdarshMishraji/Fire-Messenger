import { GoogleSignin } from '@react-native-community/google-signin';
import fireMessengerAPI from '../api/fire-messenger';
import jwt_decode from 'jwt-decode';;

export default GoogleAuthSignup = async (setData, setError) => {
    await GoogleSignin.configure(
        {
            webClientId: "1017171902033-2vjkrh3bvvcp8oecevg5ed2td0hi472j.apps.googleusercontent.com"
        }
    )

    GoogleSignin.signIn()
        .then(
            async ({ idToken }) => {
                await fireMessengerAPI.post('/auth/signup/withGoogleJWT', { token: idToken })
                    .then(
                        (value) => {
                            // console.log(value.data);
                            const data = jwt_decode(value.data.token);
                            console.log(data);
                            setData('Google', data);
                        }
                    )
                    .catch(
                        (err) => {
                            // console.log(err);
                            // dispatch({ type: 'set_error', payload: err.response.data.errMsg });
                            setError(err);
                        }
                    )
            }
        )
        .catch(
            (err) => {
                console.log(err);
                // dispatch({ type: 'set_error', payload: 'Unable to Signin from Google' });
                setError(err);
            }
        )

}