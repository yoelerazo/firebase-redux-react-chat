import { Map } from 'immutable'; 

const initialState = Map({
    currentUser: null,
    authenticated: false,
});

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_USER':
            return state.set('currentUser', action.currentUser);
        case 'IS_AUTH':
            return state.set('authenticated', action.authenticated);
        default:
            return state
    }
}