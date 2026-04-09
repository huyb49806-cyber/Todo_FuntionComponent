import { all, fork } from 'redux-saga/effects';
import { watchTodoSaga } from './sagas/todoSaga';
import { watchAuthSaga } from './sagas/authSaga';
import { watchAdminSaga } from './sagas/adminSaga';

export default function* rootSaga() {
  yield all([
    fork(watchTodoSaga),
    fork(watchAuthSaga),
    fork(watchAdminSaga),
  ]);
}