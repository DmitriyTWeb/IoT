import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from "./store/sagas";
import { composeWithDevTools } from 'redux-devtools-extension';
import { createAPI } from './services/api';
import rootReducer from './store/reducers/root-reducer';
import { getDeviceSettings, getDeviceState } from './store/api-actions';
// import { getDeviceState } from './api/requests';

import App from './components/app/app';

const STATE_UPDATE_INTERVAL = 2000;

const sagaMiddleware = createSagaMiddleware();

const api = createAPI();
const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(sagaMiddleware),
    applyMiddleware(thunk.withExtraArgument(api))
  )
);

sagaMiddleware.run(rootSaga);
store.dispatch(getDeviceState());
// store.dispatch(getDeviceSettings());

setInterval(() => {
  store.dispatch(getDeviceState());
}, STATE_UPDATE_INTERVAL);

// CORS -request WIP
// fetch('http://192.168.1.99/get_device_state', {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })
//   .then(response => console.log('response = ', response.json()))
//   .then(data => console.log('data = ', data));


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root'),
);
