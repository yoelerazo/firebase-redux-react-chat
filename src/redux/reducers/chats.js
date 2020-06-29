import {fromJS} from 'immutable'; 

const initialState = fromJS({
    list: [],
    currentChatId: null,
    loadingMessages: false
})

export default (state = initialState, action) => {
    switch (action.type) {
        case "SET_CHATS":
            return state.updateIn(['list'], list => list.concat(fromJS(action.chats)))
        case "SET_CURRENT_CHAT":
            return state.setIn(['currentChatId'], action.currentChatId)
        case "UPDATE_MESSAGES_BY_CHAT":
            return state.updateIn(['list', action.chatIndex, 'messages'], list => fromJS(action.messages).concat(list))
        case "UPDATE_MESSAGES_PAGINATE_BY_CHAT":
            return state.updateIn(['list', action.chatIndex, 'messages'], list => fromJS(action.messages).concat(list))
        case "SET_LAST_MESSAGE_BY_CHAT":
            return state.setIn(['list', action.chatIndex, 'lastMessage'], action.lastMessage)
        case "SET_PREVIOUS_LAST_MESSAGE_BY_CHAT":
            return state.setIn(['list', action.chatIndex, 'previousLastMessage'], action.previousLastMessage)
        case "LOADING_MESSAGES":
            return state.setIn(['loadingMessages'], action.loading)
        case "PENDING_MESSAGES_BY_CHAT":
            return state.updateIn(['list', action.chatIndex, 'pending'], value => value + action.pendingMessages)
        case "UPDATE_MESSAGE":
            return state.setIn(['list', action.chatIndex, 'messages', action.messageIndex], fromJS(action.message))
        default:
            return state;
    }
}