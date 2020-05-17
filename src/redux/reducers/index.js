import { combineReducers } from 'redux';
import session from './session';
import users from './users';
import chats from './chats';

const appReducer = combineReducers({
  session: session,
  users: users,
  chats: chats
})

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = undefined;
  }

  return appReducer(state, action);
}

export default rootReducer;