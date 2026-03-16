import axios from "axios";
import * as types from './constants'
import { call, all, fork, takeEvery, takeLatest, take, select, put } from 'redux-saga/effects'

axios.defaults.withCredentials = true;

const api_url = 'http://localhost:8000/todos';
const login_api_url = 'http://localhost:8000/login';
const check_auth_url = 'http://localhost:8000/check-auth';
const logout_api_url = 'http://localhost:8000/logout';
const users_api_url = 'http://localhost:8000/users';
const register_api_url = 'http://localhost:8000/register';

function* workerFetchData() {
    try {
        const { pagination } = yield select(state => state.todos);
        const filter = yield select(state => state.filter);
        const params = {
            _page: pagination._page,
            _limit: pagination._limit,
            _sort: 'id',
            _order: 'desc'
        }
        switch (filter) {
            case 'active':
                params.completed = false
                break;
            case 'completed':
                params.completed = true
                break;
        }
        const response = yield call(axios.get, api_url, { params });
        const totalRow = response.headers['x-total-count'];
        yield put({
            type: types.FETCH_TODOS_SUCCESS,
            payload: {
                data: response.data,
                pagination: {
                    _page: pagination._page,
                    _limit: pagination._limit,
                    _totalRows: parseInt(totalRow)
                }
            }
        })
        return response.data
    } catch (error) {
        console.error('loi fetch; ', error.message);
    }
}
//watch lắng nghe action và ném toàn bộ action vào worker
function* workerAddTodo(action) {
    try {
        const newTodo = {
            id: Date.now().toString(),
            text: action.payload,
            completed: false
        }
        const { pagination } = yield select(state => state.todos)
        yield call(axios.post, api_url, newTodo);
        yield put({
            type: types.SET_PAGE,
            payload: 1
        })
    } catch (error) {
        console.error('loi them moi: ', error.message);
    }
}
function* workerDeleteTodo(action) {
    yield put({
        type: types.DELETE_TODO_SUCCESS,
        payload: action.payload
    })
    try {
        yield call(axios.delete, `${api_url}/${action.payload}`);
        yield put({type: types.FETCH_TODOS_REQUEST})
    } catch(error) {
        console.error('lỗi xóa: ', error.message);
    }
}
function* workerToggleTodo(action) {
    const {id, status}=action.payload
    yield put({
        type: types.TOGGLE_TODO_SUCCESS,
        payload: id
    })
    try {
        yield call(axios.patch, `${api_url}/${id}`, {
            completed: !status
        });
    }
    catch (error) {
        console.error('lỗi toggle: ', error.message);
        yield put({ 
            type: types.TOGGLE_TODO_SUCCESS, 
            payload: status
        })
    }
}
function* workerSaveEditing(action) {
    try {
        const {text,id}=action.payload;
        yield call(axios.patch, `${api_url}/${id}`, {
            text: text
        })
        yield put({
            type: types.SAVE_EDITING_SUCCESS,
            payload: { text: action.payload.text, id: action.payload.id }
        })
    } catch(error) {
        console.error('loi mang: ', error.message);
    }
}
function* workerClearCompleted() {
    try {
        const todos = yield select(state => state.todos)
        const newTodos = todos.filter(todo => !todo.completed)
        for (const todo of newTodos) {
            yield call(axios.delete, `${api_url}/${todo.id}`)
            yield put({
                type: types.CLEAR_COMPLETED_SUCCESS
            })
        }
    } catch (error) {
        console.error('loi mang: ', error.message);
    }
}
function* workerLogin(action) {
    try {
        const { email, password, navigate } = action.payload
        const response = yield call(axios.post, login_api_url, { email, password })
        yield put({
            type: types.LOGIN_SUCCESS,
            payload: response.data
        })
        if (navigate) navigate('/');
        return response.data;
    } catch (error) {
        yield put({
            type: types.LOGIN_FAILURE,
            payload: error.response?.data?.error || error.message
        })
        console.error('login fail');
    }
}
function* workerCheckAuth() {
    try {
        const response = yield call(axios.get, check_auth_url);
        yield put({
            type: types.LOGIN_SUCCESS,
            payload: response.data
        })
        return response.data
    } catch (error) {
        yield put({
            type: types.LOGIN_FAILURE
        })
    }
}
function* workerLogout() {
    try {
        yield call(axios.post, logout_api_url);
        yield put({ type: types.LOGOUT_SUCCESS });
    } catch (e) {
        console.error("Lỗi mạng: ");
    }
}
function* getUser() {
    try {
        const response = yield call(axios.get, users_api_url)
        yield put({
            type: types.GET_USER_SUCCESS,
            payload: response.data
        })
    } catch (error) {
        console.error('Loi: ', error.message);
    }
}
function* deleteUser(action) {
    try {
        yield call(axios.delete, `${users_api_url}/${action.payload}`);
        yield put({
            type: types.DELETE_USER_SUCCESS,
            payload: action.payload
        })
    } catch (error) {
        alert("lỗi xóa: ", error.message);
    }
}
function* register(action) {
    try {
        const {user,navi}=action.payload
        yield call(axios.post,register_api_url, user)
        alert("Đăng kí thành công");
        navi('/login');
    } catch (error) {
        console.error('dang ki that bai: ',error.message);
    }
}

function* watcherFetchData() {
    yield takeEvery(types.FETCH_TODOS_REQUEST, workerFetchData);
}
function* watcherTodo() {
    yield takeEvery(types.ADD_TODOS_REQUEST, workerAddTodo);
    yield takeEvery(types.DELETE_TODO_REQUEST, workerDeleteTodo);
    yield takeEvery(types.TOGGLE_TODO_REQUEST, workerToggleTodo);
    yield takeEvery(types.SAVE_EDITING_REQUEST, workerSaveEditing);
    yield takeEvery(types.CLEAR_COMPLETED_REQUEST, workerClearCompleted)
}

function* watcherAuthen() {
    yield takeLatest(types.LOGIN_REQUEST, workerLogin);
    yield takeEvery(types.CHECK_AUTH_REQUEST, workerCheckAuth)
    yield takeLatest(types.LOGOUT_REQUEST, workerLogout);
}

function* watcherAuthor() {
    yield takeEvery(types.GET_USER_REQUEST, getUser)
    yield takeEvery(types.DELETE_USER_REQUEST, deleteUser)
}

function* watcherRegister() {
    yield takeEvery(types.REGISTER_REQUEST,register);
}

export default function* rootSaga() {
    yield all([
        fork(watcherFetchData),
        fork(watcherTodo),
        fork(watcherAuthen),
        fork(watcherAuthor),
        fork(watcherRegister)
    ])
}