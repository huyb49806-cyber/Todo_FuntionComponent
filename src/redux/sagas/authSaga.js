import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from '../constants';
import { apiClient, endpoints } from '../apiClient';

function* workerLogin(action) {
  try {
    const { email, password, navigate } = action.payload;
    const response = yield call(apiClient.post, endpoints.login, { email, password });
    yield put({ type: types.LOGIN_SUCCESS, payload: response.data });
    if (navigate) navigate('/');
  } catch (error) {
    yield put({
      type: types.LOGIN_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
}

function* workerCheckAuth() {
  try {
    const response = yield call(apiClient.get, endpoints.checkAuth);
    yield put({ type: types.LOGIN_SUCCESS, payload: response.data });
  } catch {
    yield put({ type: types.LOGIN_FAILURE, payload: null });
  }
}

function* workerLogout() {
  try {
    yield call(apiClient.post, endpoints.logout);
    yield put({ type: types.LOGOUT_SUCCESS });
  } catch (error) {
    console.error('Lỗi mạng: ', error.message);
  }
}

function* workerRegister(action) {
  try {
    const { user, navi } = action.payload;
    yield call(apiClient.post, endpoints.register, user);
    alert('Đăng kí thành công');
    navi('/login');
  } catch (error) {
    console.error('dang ki that bai: ', error.message);
  }
}

export function* watchAuthSaga() {
  yield takeLatest(types.LOGIN_REQUEST, workerLogin);
  yield takeLatest(types.CHECK_AUTH_REQUEST, workerCheckAuth);
  yield takeLatest(types.LOGOUT_REQUEST, workerLogout);
  yield takeLatest(types.REGISTER_REQUEST, workerRegister);
}
