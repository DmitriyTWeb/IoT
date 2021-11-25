import { updateDeviceSettings, updateDeviceState } from "./actions";

export const ApiActionType = {
  GET_DEVICE_STATE: 'GET_DEVICE_STATE',
  GET_DEVICE_SETTINGS: 'GET_DEVICE_SETTINGS',
  SET_DEVICE_SETTINGS: 'SET_DEVICE_SETTINGS',

  USER_POST_FETCH_REQUESTED: 'USER_POST_FETCH_REQUESTED',
  USER_POST_FETCH_SUCCEEDED: 'USER_POST_FETCH_SUCCEEDED',
  USER_POST_FETCH_FAILED: 'USER_POST_FETCH_FAILED',
};

export const getDeviceState = () => {
  return {
    type: ApiActionType.GET_DEVICE_STATE
  }
};
export const getDeviceSettings = () => {
  return {
    type: ApiActionType.GET_DEVICE_SETTINGS
  }
};
export const setDeviceSettings = (newSettings) => {
  return {
    type: ApiActionType.SET_DEVICE_SETTINGS,
    payload: newSettings
  }
};
// ===============================================
export const getPostsFromServer = (userId) => {
  return {
    type: ApiActionType.USER_POST_FETCH_REQUESTED,
    payload: userId
  };
};