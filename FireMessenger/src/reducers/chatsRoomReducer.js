const initialValues = {
    allUsers: [],
    activeUsers: [],
    showUsers: false,
    error: '',
    spinner: true
}

export const chatsRoomReducer = (state = initialValues, action) => {
    switch (action.type) {
        case 'set_users': {
            return {
                ...state,
                allUsers: action.payload
            };
        }
        case 'set_active_users': {
            return {
                ...state,
                activeUsers: action.payload
            };
        }
        case 'set_show_users': {
            return {
                ...state,
                showUsers: action.payload
            };
        }
        case 'set_chat_room_error': {
            return {
                ...state,
                error: action.payload
            };
        }
        case 'set_spinner': {
            return {
                ...state,
                spinner: action.payload
            }
        }
        default: {
            return state;
        }
    }
}