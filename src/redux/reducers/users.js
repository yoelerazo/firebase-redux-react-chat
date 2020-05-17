import { fromJS} from 'immutable'; 

const initialState = fromJS({
    usersByCurrentUser: []
})

export default (state = initialState, action) => {
    switch (action.type) {
        case "SET_USERS_BY_CURRENT_USER":
            return state.updateIn(['usersByCurrentUser'], list => list.concat(fromJS(action.users)))
        default:
            return state;
    }
}
