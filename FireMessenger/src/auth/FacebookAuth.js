import fireMessengerAPI from '../api/fire-messenger';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import jwt_decode from 'jwt-decode';

export const FacebookAuthSignup = async (setData, setError) => {
    const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
    ]);
  try {
    if (result.isCancelled) {
      throw 'User cancelled the login process.';
    } else {
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw 'Something went wrong for obtaining access token';
      } else {
          await fireMessengerAPI
              .post('/auth/signup/withFacebookToken', { token: data.accessToken })
              .then((value) => {
                  const new_data = jwt_decode(value.data.token);
                  console.log(new_data);
                  setData('Facebook', new_data);
              })
            .catch((err) => {
            setError(err);
          });
      }
    }
  } catch (err) {
    console.log(err);
    setError(err);
  }
};
