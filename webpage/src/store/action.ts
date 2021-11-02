export const ActionType = {
  SET_SETTINGS: 'SET_SETTINGS',
  CHANGE_STORE_STATE: 'CHANGE_STORE_STATE'
};

interface actionObj {
  type: string;
  payload?: string | Object;
}

export const setSetting = (settings: object): actionObj => ({
  type: ActionType.SET_SETTINGS,
  payload: settings,
});
export const changeStoreState = (): actionObj => ({
  type: ActionType.CHANGE_STORE_STATE
});

// export const setPredictions = (predictions: Array<Object>): actionObj => ({
//   type: ActionType.SET_PREDICTIONS,
//   payload: predictions,
// });
// export const resetPredictions = (): actionObj => ({
//   type: ActionType.RESET_PREDICTIONS,
// });

// export const setError = (error: Object): actionObj => ({
//   type: ActionType.SET_ERROR,
//   payload: error,
// });
// export const resetError = (): actionObj => ({
//   type: ActionType.RESET_ERROR,
// });

// export const setActiveClass = (activePredict: Object): actionObj => ({
//   type: ActionType.SET_ACTIVE_CLASS,
//   payload: activePredict,
// });
// export const resetActiveClass = (): actionObj => ({
//   type: ActionType.RESET_ACTIVE_CLASS,
// });
// export const resetAll = (): actionObj => ({
//   type: ActionType.RESET_ALL,
// });
