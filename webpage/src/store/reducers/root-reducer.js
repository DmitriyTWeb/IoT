import { combineReducers } from "redux";
import sagaReducer from "./saga-reducer";
import stateReducer from "./state-reducer";

export const NameSpace = {
  SAGA: `SAGA`,
  DEV_STATE: `DEV_STATE`,
  SETTINGS: `SETTINGS`
};

export default combineReducers({
  [NameSpace.SAGA]: sagaReducer,
  [NameSpace.DEV_STATE]: stateReducer,
});