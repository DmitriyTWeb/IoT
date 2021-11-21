import { Reducer } from 'redux';
import { ActionType } from './actions';

const initialState = {
  currentTemp: '--',
  pumpState: '--',
  sensorStatus: "--",
  error: '',
};

const extend = (a: Object, b: Object) => ({
  ...a,
  ...b,
});

const stateReducer: Reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.SET_SETTINGS:
      return extend(state, action.payload);
    case ActionType.UPDATE_DEVICE_STATE:
      return extend(state, action.payload);
    case ActionType.UPDATE_DEVICE_SETTINGS:
      return extend(state, action.payload);
    default:
      return state;
  }
};

export default stateReducer;
