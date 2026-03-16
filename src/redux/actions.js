import * as types from './constants';
import axios from 'axios';


export const fetchData = () => ({ type: types.FETCH_TODOS_REQUEST });

export const addTodo = (text) => ({
  type: types.ADD_TODOS_REQUEST,
  payload: text
})

export const setFilter = (filterTypes) => ({
  type: types.SET_FILTER,
  payload: filterTypes
  // dispatch(setPage(1));
});
//không setpage ở đây vì filter và page thay đổi làm useEffect chạy->callApi GET gây rerender 2 lần
//cross-reducer-handling do action đc dispatch thì mọi reducer đều nhận được action

export const setPage = (page) => ({
  type: types.SET_PAGE,
  payload: page
});

export const deleteTodo = (id) => ({
  type: types.DELETE_TODO_REQUEST,
  payload: id
})

export const toggleTodo = (id, currentCompleteStatus) => ({
  type: types.TOGGLE_TODO_REQUEST,
  payload: {
    id: id,
    status: currentCompleteStatus
  }
})

export const setEditingId = (id) => ({
  type: types.SET_EDITING_ID,
  payload: id
})

export const saveEditing = (text, id) => ({
  type: types.SAVE_EDITING_REQUEST,
  payload: {
    text: text,
    id: id
  }
})

export const cancelEditing = () => ({
  type: types.CANCEL_EDITING
})

export const clearCompleted = () => ({
  type: types.CLEAR_COMPLETED_REQUEST
});


export const login = (email, password, navigate) => ({
  type: types.LOGIN_REQUEST,
  payload: {
    email: email,
    password: password,
    navigate: navigate
  }
})

export const logout = () => ({
  type: types.LOGOUT_REQUEST
});

export const checkAuth = () => ({
  type: types.CHECK_AUTH_REQUEST
})

export const getallUsers = () => ({
  type: types.GET_USER_REQUEST
})

export const deleteUser = (userId) => ({
  type: types.DELETE_USER_REQUEST,
  payload: userId
})

export const register = (user, nav) => ({
  type: types.REGISTER_REQUEST,
    payload: {
    user: user,
    navi: nav
  }
})