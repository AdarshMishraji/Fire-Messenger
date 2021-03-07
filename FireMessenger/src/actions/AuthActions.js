import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    EmailPasswordAuthSignup,
    EmailPasswordAuthLogin,
    GoogleAuthSignup,
    FacebookAuthSignup,
    Signout,
} from '../auth';

const onResponse = (dispatch, message = '') => {
    dispatch({ type: 'set_other_auth_loader', payload: { value: false } });
    dispatch({ type: 'set_loader', payload: { value: false, message } });
};

const signupDetailsSetter = (dispatch, onSuccess, mannualData = null) => {
    return {
        setData: (from, data) => {
            dispatch({ type: 'set_other_auth_loader', payload: { value: false } });
            onSuccess('AuthProvider', { from, data });
        },
        setError: (err) => {
            console.log('setError', err, err.response, err.response.status);
            if (err.response) {
                if (err.response.status === 409) {
                    onResponse(dispatch);
                    onSuccess('Login', { alreadySignedUp: true, email: err.response.data.email ? err.response.data.email : mannualData });
                }
                else if (err.response.status === 500) {
                    onResponse(dispatch, err.response.data.errMsg);
                }
            }
            else {
                console.log(err);
                try {
                    onResponse(dispatch, err.response.data.errMsg);
                }
                catch (error) {
                    onResponse(dispatch, JSON.stringify(error));
                }
            }
        },
        setEmailPasswordData: async (data) => {
            const dataToSend = {
                userName: data.userName,
                email: data.email,
                password: data.password,
                photoURL: data.photoURL,
            };
            dispatch({ type: 'set_auth_details', payload: mannualData ? mannualData : dataToSend });
            await AsyncStorage.setItem('activeUser', JSON.stringify(mannualData ? mannualData : dataToSend));
            dispatch({ type: 'set_loader', payload: { value: false } });
            onSuccess('Main');
        },
    };
};

export const onEmailPasswordSignup = ({ password, confirmPassword, userName, email, fcmToken, onSuccess }) => {
    return (dispatch) => {
        dispatch({ type: 'set_loader', payload: { value: true } });
        const emailREGEX = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (email.match(emailREGEX)) {
            if (password === confirmPassword) {
                EmailPasswordAuthSignup(
                    {
                        userName,
                        email,
                        password,
                        FCMToken: fcmToken,
                    },
                    signupDetailsSetter(dispatch, onSuccess, {
                        email,
                        password,
                        userName,
                    }).setEmailPasswordData,
                    signupDetailsSetter(dispatch, onSuccess, email).setError
                );
            }
            else {
                dispatch({ type: 'set_loader', payload: { value: false, message: 'password not matched' } });
            }
        }
        else {
            dispatch({ type: 'set_loader', payload: { value: false, message: 'Email not valid' } });
        }
    };
};

export const onFacebookSignup = (onSuccess) => {
    return (dispatch) => {
        dispatch({ type: 'set_other_auth_loader', payload: { value: true } });
        FacebookAuthSignup(
            signupDetailsSetter(dispatch, onSuccess).setData,
            signupDetailsSetter(dispatch, onSuccess).setError
        );
    };
};

export const onGoogleSignup = (navigation) => {
    return (dispatch) => {
        dispatch({ type: 'set_other_auth_loader', payload: { value: true } });
        GoogleAuthSignup(
            signupDetailsSetter(dispatch, navigation).setData,
            signupDetailsSetter(dispatch, navigation).setError
        );
    };
};

export const tryLocalAuthDetails = (onSuccess, onFailure) => {
    return async (dispatch) => {
        const data = JSON.parse(await AsyncStorage.getItem('activeUser'));
        if (data) {
            dispatch({ type: 'set_auth_details', payload: data });
            onSuccess();
        }
        else {
            dispatch({ type: 'set_auth_details', payload: {} });
            onFailure();
        }
    };
};

export const onLogin = ({ email, password, fcmToken, onSuccess }) => {
    return (dispatch) => {
        dispatch({ type: 'set_loader', payload: { value: true } });
        const dataToSend = {
            email: email,
            password: password,
        };

        EmailPasswordAuthLogin(
            {
                ...dataToSend,
                FCMToken: fcmToken,
            },
            async (data) => {
                dispatch({ type: 'set_auth_details', payload: { ...dataToSend, photoURL: data.photoURL, userName: data.userName } });
                await AsyncStorage.setItem('activeUser', JSON.stringify({ ...dataToSend, photoURL: data.photoURL, userName: data.userName }));
                dispatch({ type: 'set_loader', payload: { value: false } });
                onSuccess();
            },
            (err) => {
                console.log('error', err, err.response.data);
                dispatch({ type: 'set_loader', payload: { value: false, message: err.response.data.errMsg } });
            }
        );
    };
};

export const otherAuthDetailsSetter = ({ email, password, confirmPassword, userName, photoURL, fcmToken, onSuccess }) => {
    console.log('otherAuthDetailsSetter', email, password, confirmPassword, userName, photoURL, fcmToken, onSuccess);
    return (dispatch) => {
        dispatch({ type: 'set_loader', payload: { value: true } });
        const emailREGEX = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (email.match(emailREGEX)) {
            if (password === confirmPassword) {
                const dataToSend = {
                    userName,
                    email,
                    password,
                    photoURL,
                };
                EmailPasswordAuthSignup(
                    {
                        ...dataToSend,
                        FCMToken: fcmToken,
                    },
                    async (data) => {
                        dispatch({ type: 'set_auth_details', payload: dataToSend });
                        console.log('data for async storage', dataToSend);
                        await AsyncStorage.setItem('activeUser', JSON.stringify(dataToSend));
                        console.log('all done');
                        dispatch({ type: 'set_loader', payload: { value: false } });
                        onSuccess();
                    },
                    (err) => {
                        dispatch({ type: 'set_error', payload: err });
                    }
                );
            }
            else {
                dispatch({ type: 'set_error', payload: 'password not matched' });
            }
        }
        else {
            dispatch({ type: 'set_error', payload: 'Email not valid' });
        }
    };
};

export const onSignout = (email, onSuccess) => {
    return (dispatch) => {
        dispatch({ type: 'set_loader', payload: { value: true } });
        Signout(
            email,
            async (data) => {
                console.log(data);
                await AsyncStorage.removeItem('activeUser');
                dispatch({ type: 'clear_user' });
                onSuccess();
            },
            (err) => {
                if (err.message) {
                    dispatch({ type: 'set_loader', payload: { value: false, message: err.message } });
                }
                else if (err.response) {
                    dispatch({ type: 'set_loader', payload: { value: false, message: err.response.data.errMsg } });
                }
            }
        );
    };
};
