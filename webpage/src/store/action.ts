export const ActionType = {
  SET_SETTINGS: 'SET_SETTINGS',
  UPDATE_DEVICE_STATE: 'UPDATE_DEVICE_STATE',
  UPDATE_DEVICE_SETTINGS: 'UPDATE_DEVICE_SETTINGS',
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

interface deviceSettings {
  mode: string,
  tempIn: string,
  tempOut: string,
  tempDelta: string,
}

export const setSetting = (settings: object): actionObj => ({
  type: ActionType.SET_SETTINGS,
  payload: settings,
});
export const updateDeviceState = (state: deviceState): actionObj => ({
  type: ActionType.UPDATE_DEVICE_STATE,
  payload: state
});
export const updateDeviceSettings = (state: deviceSettings): actionObj => ({
  type: ActionType.UPDATE_DEVICE_SETTINGS,
  payload: state
});
