import fireMessengerAPI from '../api/fire-messenger';

export const getActiveUsers = (email) => {
    return async (dispatch) => {

        await fireMessengerAPI.post('/users/fetchActiveUsers',
            {
                currentUserEmail: email
            }
        )
            .then(
                (value) => {
                    dispatch({ type: 'set_active_users', payload: value.data.users });
                }
            )
            .catch(
                (err) => {
                    console.log(err.response.data);
                    dispatch({ type: 'set_chat_room_error', payload: err.response.data.errMsg });
                }
            )
    }
}


export const getAllUsers = (email) => {
    return async (dispatch) => {
        await fireMessengerAPI.post('/users/fetchAllUsers',
            {
                currentUserEmail: email
            }
        )
            .then(
                (value) => {
                    dispatch({ type: 'set_users', payload: value.data.users });
                }
            )
            .catch(
                (err) => {
                    console.log(err.response.data);
                    dispatch({ type: 'set_chat_roomerror', payload: err.response.data.errMsg });
                }
            )
    }
}