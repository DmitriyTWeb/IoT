export const ActionType = {
  SET_SETTINGS: 'SET_SETTINGS',
  UPDATE_DEVICE_STATE: 'UPDATE_DEVICE_SETTINGS'
};

interface actionObj {
  type: string;
  payload?: string | Object;
}
interface deviceState {
  floorTemp: string,
  pumpState: string,
  sensorStatus: string,
}

export const setSetting = (settings: object): actionObj => ({
  type: ActionType.SET_SETTINGS,
  payload: settings,
});
export const updateDeviceState = (state: deviceState): actionObj => ({
  type: ActionType.UPDATE_DEVICE_STATE,
  payload: state
});
