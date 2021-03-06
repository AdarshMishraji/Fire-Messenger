/* eslint-disable prettier/prettier */
const initialValues = {
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    loader: false,
    otherAuthLoader: false,
    photoURL: '',
    error: '',
    user: {
        email: '',
        userName: '',
        password: '',
        photoURL: '',
        fcmToken: '',
    },
};


export const authReducer = (state = initialValues, action) => {
    console.log(action.type, action.payload, state);
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
        case 'set_confirm_password': {
            return { ...state, confirmPassword: action.payload };
        }
        case 'set_photoURL': {
            return { ...state, photoURL: action.payload };
        }
        case 'set_loader': {
            return { ...state, loader: action.payload.value, error: action.payload.message };
        }
        case 'set_other_auth_loader': {
            return { ...state, otherAuthLoader: action.payload.value };
        }
        case 'set_error': {
            return { ...state, error: action.payload };
        }
        case 'set_auth_details': {
            return {
                ...state,
                user: {
                    ...state.user,
                    userName: action.payload.userName,
                    email: action.payload.email,
                    password: action.payload.password,
                    photoURL: action.payload.photoURL ? action.payload.photoURL : null,
                },
            };
        }
        case 'set_fcm_token': {
            return { ...state, user: { ...state.user, fcmToken: action.payload } };
        }
        case 'clear': {
            return {
                ...state,
                email: '',
                password: '',
                confirmPassword: '',
                error: '',
                userName: '',
                loader: false,
                otherAuthLoader: false,
            };
        }
        case 'clear_user': {
            return { ...initialValues, user: { ...initialValues.user, fcmToken: state.user.fcmToken } };
        }
        default: {
            return state;
        }
    }
};
