
import { ApiActionType } from "./api-actions";
import { updateDeviceState, updateDeviceSettings, updateError } from "./actions";
import { call, put, takeEvery, all } from "redux-saga/effects";
import { getDeviceState, getDeviceSettings, getUserPosts } from "../api/requests";


const workerGetPosts = function* (action) {
  try {
    const userPosts = yield call(getUserPosts, action.payload);
    yield put({
      type: ApiActionType.USER_POST_FETCH_SUCCEEDED,
      payload: userPosts
    });
  } catch (error) {
    yield put({
      type: ApiActionType.USER_POST_FETCH_FAILED,
      payload: error.message,
    });
  }
};

const workerGetDeviceState = function* (action) {
  try {
    const deviceState = yield call(getDeviceState, action.payload);
    yield put(updateDeviceState(deviceState));
  } catch (error) {
    yield put(updateError(error));
  }
};
const workerGetDeviceSettings = function* (action) {
  try {
    const deviceSettings = yield call(getDeviceSettings, action.payload);
    yield put(updateDeviceSettings(deviceSettings));
  } catch (error) {
    yield put(updateError(error));
  }
};
// -----------------
const watchGetPosts = function* () {
  yield takeEvery(ApiActionType.USER_POST_FETCH_REQUESTED, workerGetPosts);
};
const watchGetDeviceState = function* () {
  yield takeEvery(ApiActionType.GET_DEVICE_STATE, workerGetDeviceState);
};
const watchGetDeviceSettings = function* () {
  yield takeEvery(ApiActionType.GET_DEVICE_SETTINGS, workerGetDeviceSettings);
};
// -----------------

export function* rootSaga() {
  yield all([
    watchGetDeviceState(),
    watchGetDeviceSettings(),
    watchGetPosts()
  ]);
};