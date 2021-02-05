import createDataContext from './createDataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const reducer = (state, action) => {
    switch (action.type) {
        case 'set_userName': {
            return { ...state, userName: action.payload };
        }

        case 'set_email': {
            return { ...state, email: action.payload };
        }

        case 'set_password': {
            return { ...state, password: action.payload };
        }

        case 'set_photoURL': {
            return { ...state, photoURL: action.payload };
        }

        case 'set_auth_details': {
            return {
                userName: action.payload.userName,
                email: action.payload.email,
                password: action.payload.password,
                photoURL: action.payload.photoURL,
            }
        }
        default: {
            console.warn('Default Case Reached, No Matching Action');
            return state;
        }
    }
}

const setUserName = (dispatch) => {
    return (username) => {
        return dispatch({ type: 'set_userName', payload: username });
    }
}

const setEmail = (dispatch) => {
    return (email) => {
        return dispatch({ type: 'set_email', payload: email });
    }
}

const setPassword = (dispatch) => {
    return (password) => {
        return dispatch({ type: 'set_password', payload: password });
    }
}

const setPhotoURL = (dispatch) => {
    return (photoURL) => {
        return dispatch({ type: 'set_photoURL', payload: photoURL });
    }
}

const setAuthDetails = (dispatch) => {
    return (userDetails) => {
        return dispatch({ type: "set_auth_details", payload: userDetails });
    }
}

const tryLocalAuthDetails = dispatch => {
    return async (onSuccess, onFailure) => {
        const data = JSON.parse(await AsyncStorage.getItem('activeUser'));
        if (data) {
            dispatch({ type: 'set_auth_details', payload: data });
            onSuccess();
        }
        else {
            onFailure();
        }
    }
}

export const { Context, Provider } = createDataContext(
    reducer,
    {
        setUserName,
        setEmail,
        setPassword,
        setPhotoURL,
        tryLocalAuthDetails,
        setAuthDetails
    },
    {
        userName: '',
        email: '',
        password: '',
        photoURL: '',
    }
)