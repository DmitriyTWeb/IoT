import { createAPI } from "../services/api";

const EndPoint = {
  GET_DEVICE_STATE: '/get_device_state',
  GET_DEVICE_SETTINGS: '/get_device_settings',
  SET_DEVICE_SETTINGS: '/set_device_settings',
};

const api = createAPI();

export const getUserPosts = (userId) => {
  return api.get(
    `https://jsonplaceholder.typicode.com/users/${10}/posts`
  ).then((response) => response.data);
}

export const getDeviceState = () => {
  return api.get(EndPoint.GET_DEVICE_STATE,
    {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(({ data }) => data);
};
export const getDeviceSettings = () => {
  return api.get(EndPoint.GET_DEVICE_SETTINGS,
    {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(({ data }) => data);
};
export const setDeviceSettings = (settings) => {
  return api.post(EndPoint.SET_DEVICE_SETTINGS, settings)
    .then(({ data }) => data);
};
