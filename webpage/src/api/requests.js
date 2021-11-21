import { createAPI } from "../services/api";

const api = createAPI();
const EndPoint = {
  GET_DEVICE_STATE: '/get_device_state',
  GET_DEVICE_SETTINGS: '/get_device_settings',
  SET_DEVICE_SETTINGS: '/set_device_settings',
};

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
    .then(({ data }) => {
      return data;
    });
};
// const getDeviceState = () => (dispatch, __getState, api) =>
//   api.get(EndPoint.GET_DEVICE_STATE,
//     {
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     })
//     .then(({ data }) => {
//       dispatch(updateDeviceState(data));
//       console.log('updateDeviceState response data = ', data)
//     });