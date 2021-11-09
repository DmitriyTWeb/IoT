import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';
import { createAPI } from './services/api';
import reducer from './store/reducer';
import { getDeviceSettings, getDeviceState } from './store/api-action';

import App from './components/app/app';

const STATE_UPDATE_INTERVAL = 2000;

const api = createAPI();
const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk.withExtraArgument(api))
  )
);

store.dispatch(getDeviceState());
store.dispatch(getDeviceSettings());

setInterval(() => {
  store.dispatch(getDeviceState());
}, STATE_UPDATE_INTERVAL);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root'),
);
