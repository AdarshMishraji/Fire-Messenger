import fireMessengerAPI from '../api/fire-messenger';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import jwt_decode from 'jwt-decode';

export default FacebookAuthSignup = async (setData, setError) => {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    try {
        if (result.isCancelled) {
            throw 'User cancelled the login process.';
        }
        else {
            const data = await AccessToken.getCurrentAccessToken();
            if (!data) {
                throw 'Something went wrong for obtaining access token';
            }
            else {
                await fireMessengerAPI.post('/auth/signup/withFacebookToken', { token: data.accessToken })
                    .then(
                        (value) => {
                            const data = jwt_decode(value.data.token);
                            console.log(data);
                            setData('Facebook', data);
                        }
                    )
                    .catch(
                        (err) => {
                            // console.log(err.response.data, err.response.status)
                            // dispatch({ type: 'set_error', payload: err.response.data.errMsg });
                            setError(err);
                        }
                    )
            }
        }
    }
    catch (err) {
        console.log(err);
        // dispatch({ type: 'set_error', payload: err });
        setError(err);
    }
}