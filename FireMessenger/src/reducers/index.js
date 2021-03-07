/* eslint-disable prettier/prettier */
import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { chatsReducer } from './chatsReducer';
import { chatsRoomReducer } from './chatsRoomReducer';

export default combineReducers({
    auth: authReducer,
    chatsRoom: chatsRoomReducer,
    chats: chatsReducer
});
