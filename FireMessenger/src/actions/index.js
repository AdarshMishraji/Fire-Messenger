export * from './AuthActions';
export * from './ChatsRoomAction';
export * from './ChatsAction';

export const actionCreator = (type, payload) => {
    return { type, payload };
}