import { Reducer } from 'redux';
import { ActionType } from './action';

const initialState = {
  floorTemp: -99,
  pumpState: 'OFF',
  sensorStatus: "WORK",
  error: '',
};

const extend = (a: Object, b: Object) => ({
  ...a,
  ...b,
});

const reducer: Reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.SET_SETTINGS:
      return extend(state, {
        ...action.payload,
      });
    case ActionType.CHANGE_STORE_STATE:
      return extend(state, {
        floorTemp: state.floorTemp + 1,
        pumpState: 'ON',
        sensorStatus: "SENSOR_BROKEN"
      });
    default:
      return state;
  }
};

export default reducer;
