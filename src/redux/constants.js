export const FILTER_TYPES={
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed'
};
export const FETCH_TODOS_REQUEST = 'todo/fetchRequest';
export const FETCH_TODOS_SUCCESS = 'todo/fetchSuccess';

export const DELETE_TODO_REQUEST='todos/deleteTodoRequest';
export const DELETE_TODO_SUCCESS='todos/deleteTodoSuccess';
export const TOGGLE_TODO_REQUEST='todos/toggleTodoRequest';
export const TOGGLE_TODO_SUCCESS='todos/toggleTodoSuccess';
export const CLEAR_COMPLETED_SUCCESS = 'todos/clearCompletedSuccess';
export const CLEAR_COMPLETED_REQUEST = 'todos/clearCompletedRequest';
export const ADD_TODOS_REQUEST = 'todo/addRequest';
export const ADD_TODOS_SUCCESS = 'todo/addSuccess';

export const SET_FILTER = 'filters/setFilter';
export const SET_PAGE = 'pagination/setPage';

export const SET_EDITING_ID='editing/setEditing';
export const CANCEL_EDITING='editing/cancelEditing';
export const SAVE_EDITING_REQUEST='editing/saveEditingRequest';
export const SAVE_EDITING_SUCCESS='editing/saveEditingSuccess';

export const LOGIN_REQUEST ='auth/loginRequest';
export const LOGIN_SUCCESS ='auth/loginSuccess';
export const LOGIN_FAILURE ='auth/loginFailure';

export const CHECK_AUTH_REQUEST='auth/checkauth';

export const LOGOUT_REQUEST ='auth/logoutRequest';
export const LOGOUT_SUCCESS ='auth/logoutSuccess';

export const GET_USER_REQUEST='admin/getUserRequest'
export const GET_USER_SUCCESS='admin/getUserSuccess'

export const DELETE_USER_REQUEST ='admin/deleteUserRequest'
export const DELETE_USER_SUCCESS ='admin/deleteUserSuccess'

export const REGISTER_REQUEST='user/registerRequest'
