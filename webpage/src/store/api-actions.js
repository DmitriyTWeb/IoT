import { updateDeviceSettings, updateDeviceState } from "./actions";

const EndPoint = {
  GET_DEVICE_STATE: '/get_device_state',
  GET_DEVICE_SETTINGS: '/get_device_settings',
  SET_DEVICE_SETTINGS: '/set_device_settings',
};

const getDeviceState = () => (dispatch, __getState, api) =>
  api.get(EndPoint.GET_DEVICE_STATE,
    {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(({ data }) => {
      dispatch(updateDeviceState(data));
      console.log('updateDeviceState response data = ', data)
    });

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


export { getDeviceState, getDeviceSettings, setDeviceSettings };