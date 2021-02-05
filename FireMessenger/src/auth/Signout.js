import fireMessengerAPI from '../api/fire-messenger';

export const Signout = async (email, setData, setError) => {
    await fireMessengerAPI.post('/auth/signout',
        {
            email
        }
    )
        .then(
            (value) => {
                setData('User Signed out');
            }
        )
        .catch(
            (err) => {
                setError(err);
            }
        )
}