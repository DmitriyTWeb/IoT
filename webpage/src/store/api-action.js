import { updateDeviceSettings, updateDeviceState } from "./action";

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

// fetch('/set_device_settings', {
//   method: 'POST',
//   mode: 'no-cors',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     "mode": mode,
//     "tempIn": tempIn,
//     "tempOut": tempOut,
//     "tempDelta": tempDelta,
//   })
// })
//   .then(response => response.json())
//   .then(data => console.log('response data = ', data))
//   .catch(err => console.log(err));

export { getDeviceState, getDeviceSettings, setDeviceSettings };