const initialValues = {
    messages: [],
    newMessage: '',
    itemsToDelete: [],
    selections: false,
    showDetails: false,
    isSending: false,
    isDeleting: false
};

export const chatsReducer = (state = initialValues, action) => {
    switch (action.type) {
        case 'set_messages': {
            return {
                ...state,
                messages: action.payload,
                isSending: false
            }
        }
        case 'set_new_message': {
            return {
                ...state,
                newMessage: action.payload,
                // isSending: false
            }
        }
        case 'set_items_to_delete': {
            console.log(action.payload, 'set_item_to_delete')
            return {
                ...state,
                itemsToDelete: action.payload
            }
        }
        case 'set_selections': {
            return {
                ...state,
                selections: action.payload
            }
        }
        case 'set_show_details': {
            return {
                ...state,
                showDetails: action.payload
            }
        }
        case 'set_is_sending': {
            return {
                ...state,
                isSending: action.payload
            }
        }
        case 'set_is_deleting': {
            return {
                ...state,
                isDeleting: action.payload
            }
        }
        default: {
            return state;
        }
    }
}