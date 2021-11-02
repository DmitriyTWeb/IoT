import axios from "axios";

const BACKEND_URL = `/`;
const REQUEST_TIMEOUT = 5000;

const HttpCode = {
  UNAUTHORIZED: 401,
  NOT_FOUNT: 404,
  OK: 200
};

export const createAPI = () => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
    widthCredentials: true,
  });

  const onSuccess = (response) => response;
  const onFail = (err) => {
    const {response} = err;
    if(response.status !== HttpCode.OK) {
      console.log('ATTENTION!!! Some error occured while Http request: ', err);
    }

    throw err;
  };

  api.interceptors.response.use(onSuccess, onFail);
};