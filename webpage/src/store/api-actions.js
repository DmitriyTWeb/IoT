import { updateDeviceSettings, updateDeviceState } from "./actions";

const ApiActionType = {
  GET_DEVICE_STATE: 'GET_DEVICE_STATE',
  PUT_DEVICE_STATE: 'PUT_DEVICE_STATE',
  USER_POST_FETCH_REQUESTED: 'USER_POST_FETCH_REQUESTED',
  USER_POST_FETCH_SUCCEEDED: 'USER_POST_FETCH_SUCCEEDED',
  USER_POST_FETCH_FAILED: 'USER_POST_FETCH_FAILED',
};
const EndPoint = {
  GET_DEVICE_STATE: '/get_device_state',
  GET_DEVICE_SETTINGS: '/get_device_settings',
  SET_DEVICE_SETTINGS: '/set_device_settings',
};

const getDeviceState = () => {
  return {
    type: ApiActionType.GET_DEVICE_STATE
  }
};
// =============================================
const getDeviceSettings = () => (dispatch, __getState, api) =>
  api.get(EndPoint.GET_DEVICE_SETTINGS,
    {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(({ data }) => {
      dispatch(updateDeviceSettings(data));
      console.log('updateDeviceSettings data = ', data)
    });
const setDeviceSettings = (settings) => (dispatch, __getState, api) =>
  api.post(EndPoint.SET_DEVICE_SETTINGS, settings)
    .then(({ data }) => {
      const newSettings = data.data;
      dispatch(updateDeviceSettings(newSettings));
      console.log('setDeviceSettings data = ', data);
    });

const getPostsFromServer = (userId) => {
  return {
    type: ApiActionType.USER_POST_FETCH_REQUESTED,
    payload: userId
  };
};

export { ApiActionType, getDeviceState, getDeviceSettings, setDeviceSettings, getPostsFromServer };