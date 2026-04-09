import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import * as types from '../constants';
import { apiClient, endpoints } from '../apiClient';

function* workerFetchData() {
  try {
    const { pagination } = yield select((state) => state.todos);
    const filter = yield select((state) => state.filter);
    const params = {
      _page: pagination._page,
      _limit: pagination._limit,
      _sort: 'id',
      _order: 'desc',
    };
    if (filter === types.FILTER_TYPES.ACTIVE) params.completed = false;
    if (filter === types.FILTER_TYPES.COMPLETED) params.completed = true;

    const response = yield call(apiClient.get, endpoints.todos, { params });
    const totalRow = Number(response.headers['x-total-count'] ?? 0);
    yield put({
      type: types.FETCH_TODOS_SUCCESS,
      payload: {
        data: response.data,
        pagination: {
          _page: pagination._page,
          _limit: pagination._limit,
          _totalRows: totalRow,
        },
      },
    });
  } catch (error) {
    yield put({
      type: types.FETCH_TODOS_FAILURE,
      payload: error.message,
    });
  }
}

function* workerAddTodo(action) {
  try {
    const newTodo = {
      id: Date.now().toString(),
      text: action.payload,
      completed: false,
    };
    yield call(apiClient.post, endpoints.todos, newTodo);
    yield put({ type: types.SET_PAGE, payload: 1 });
    yield put({ type: types.FETCH_TODOS_REQUEST });
  } catch (error) {
    console.error('loi them moi: ', error.message);
  }
}

function* workerDeleteTodo(action) {
  yield put({ type: types.DELETE_TODO_SUCCESS, payload: action.payload });
  try {
    yield call(apiClient.delete, `${endpoints.todos}/${action.payload}`);
    yield put({ type: types.FETCH_TODOS_REQUEST });
  } catch (error) {
    console.error('lỗi xóa: ', error.message);
  }
}

function* workerToggleTodo(action) {
  const { id, status } = action.payload;
  yield put({ type: types.TOGGLE_TODO_SUCCESS, payload: id });
  try {
    yield call(apiClient.patch, `${endpoints.todos}/${id}`, { completed: !status });
  } catch (error) {
    console.error('lỗi toggle: ', error.message);
    yield put({ type: types.TOGGLE_TODO_SUCCESS, payload: id });
  }
}

function* workerSaveEditing(action) {
  try {
    const { text, id } = action.payload;
    yield call(apiClient.patch, `${endpoints.todos}/${id}`, { text });
    yield put({
      type: types.SAVE_EDITING_SUCCESS,
      payload: { text, id },
    });
  } catch (error) {
    console.error('loi mang: ', error.message);
  }
}

function* workerClearCompleted() {
  try {
    const { items } = yield select((state) => state.todos);
    const completedTodos = items.filter((todo) => todo.completed);
    yield all(completedTodos.map((todo) => call(apiClient.delete, `${endpoints.todos}/${todo.id}`)));
    yield put({ type: types.CLEAR_COMPLETED_SUCCESS });
    yield put({ type: types.FETCH_TODOS_REQUEST });
  } catch (error) {
    console.error('loi mang: ', error.message);
  }
}

export function* watchTodoSaga() {
  yield takeLatest(types.FETCH_TODOS_REQUEST, workerFetchData);
  yield takeLatest(types.ADD_TODOS_REQUEST, workerAddTodo);
  yield takeEvery(types.DELETE_TODO_REQUEST, workerDeleteTodo);
  yield takeEvery(types.TOGGLE_TODO_REQUEST, workerToggleTodo);
  yield takeLatest(types.SAVE_EDITING_REQUEST, workerSaveEditing);
  yield takeLatest(types.CLEAR_COMPLETED_REQUEST, workerClearCompleted);
}
