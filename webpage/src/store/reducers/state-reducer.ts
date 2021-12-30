import { Reducer } from 'redux';
import { ActionType } from '../actions';

export interface DeviceStateProps {
  currentTemp: string,
  sensorStatus: string,
  pumpState: string
};

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

const stateReducer: Reducer = (state:DeviceStateProps = initialState, action) => {
  switch (action.type) {
    case ActionType.UPDATE_DEVICE_STATE:
      return extend(state, action.payload);
    case ActionType.UPDATE_ERROR:
      return extend(state, action.payload);
    default:
      return state;
  }
};

export default stateReducer;
