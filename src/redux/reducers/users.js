import { fromJS} from 'immutable'; 

const initialState = fromJS({
    list: []
})

export default (state = initialState, action) => {
    switch (action.type) {
        case "GET_USERS":
            return state.updateIn(['list'], list => list.concat(fromJS(action.users)))
        default:
            return state;
    }
}
