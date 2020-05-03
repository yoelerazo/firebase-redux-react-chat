import { combineReducers } from 'redux';
import session from './session';
import users from './users';
import chats from './chats';

export default combineReducers({
  session: session,
  users: users,
  chats: chats
})