import { combineReducers } from 'redux';
import todosReducer from './todosReducer';
import filterReducer from './filterReducer';
import editingReducer from './editingReducer';
import authReducer from './authReducer';
import { adminReducer } from './adminReducer';

const rootReducer = combineReducers({
  admin: adminReducer,
  auth: authReducer,
  todos: todosReducer,
  filter: filterReducer,
  editing: editingReducer
});

export default rootReducer;