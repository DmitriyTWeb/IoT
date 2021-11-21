import { combineReducers } from "redux";
import sagaReducer from "./saga-reducer";
import stateReducer from "./state-reducer";

const NameSpace = {
  SAGA: `SAGA`,
  STATE: `STATE`,
  SETTINGS: `SETTINGS`
};

export default combineReducers({
  [NameSpace.SAGA]: sagaReducer,
  [NameSpace.STATE]: stateReducer,
});