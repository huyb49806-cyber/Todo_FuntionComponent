import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as types from '../constants';
import { apiClient, endpoints } from '../apiClient';

function* getUser() {
  try {
    const response = yield call(apiClient.get, endpoints.users);
    yield put({ type: types.GET_USER_SUCCESS, payload: response.data });
  } catch (error) {
    console.error('Loi: ', error.message);
  }
}

function* deleteUser(action) {
  try {
    yield call(apiClient.delete, `${endpoints.users}/${action.payload}`);
    yield put({ type: types.DELETE_USER_SUCCESS, payload: action.payload });
  } catch (error) {
    alert('lỗi xóa: ' + error.message);
  }
}

export function* watchAdminSaga() {
  yield takeLatest(types.GET_USER_REQUEST, getUser);
  yield takeEvery(types.DELETE_USER_REQUEST, deleteUser);
}
