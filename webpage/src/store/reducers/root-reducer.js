import { combineReducers } from "redux";
import sagaReducer from "./saga-reducer";
import stateReducer from "./state-reducer";
import settingsReducer from "./settings-reducer";

export const NameSpace = {
  SAGA: `SAGA`,
  DEV_STATE: `DEV_STATE`,
  DEV_SETTINGS: `DEV_SETTINGS`
};

export default combineReducers({
  [NameSpace.SAGA]: sagaReducer,
  [NameSpace.DEV_STATE]: stateReducer,
  [NameSpace.DEV_SETTINGS]: settingsReducer,
});