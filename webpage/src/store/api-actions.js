import { updateDeviceSettings, updateDeviceState } from "./actions";

export const ApiActionType = {
  GET_DEVICE_STATE: 'GET_DEVICE_STATE',
  GET_DEVICE_SETTINGS: 'GET_DEVICE_STATE',

  USER_POST_FETCH_REQUESTED: 'USER_POST_FETCH_REQUESTED',
  USER_POST_FETCH_SUCCEEDED: 'USER_POST_FETCH_SUCCEEDED',
  USER_POST_FETCH_FAILED: 'USER_POST_FETCH_FAILED',
};

const EndPoint = {
  GET_DEVICE_STATE: '/get_device_state',
  GET_DEVICE_SETTINGS: '/get_device_settings',
  SET_DEVICE_SETTINGS: '/set_device_settings',
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
// =============================================
// const getDeviceSettings = () => (dispatch, __getState, api) =>
//   api.get(EndPoint.GET_DEVICE_SETTINGS,
//     {
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     })
//     .then(({ data }) => {
//       dispatch(updateDeviceSettings(data));
//       console.log('updateDeviceSettings data = ', data)
//     });
export const setDeviceSettings = (settings) => (dispatch, __getState, api) =>
  api.post(EndPoint.SET_DEVICE_SETTINGS, settings)
    .then(({ data }) => {
      const newSettings = data.data;
      dispatch(updateDeviceSettings(newSettings));
      console.log('setDeviceSettings data = ', data);
    });

export const getPostsFromServer = (userId) => {
  return {
    type: ApiActionType.USER_POST_FETCH_REQUESTED,
    payload: userId
  };
};