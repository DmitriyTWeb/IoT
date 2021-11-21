import { ActionType } from './actions';

const initState = {
  posts: null,
};

const sagaReducer = (state = initState, action) => {
  switch (action.type) {
    case ActionType.USER_POST_FETCH_SUCCEEDED: {
      const  posts = action.payload.data;

      return {
        ...state,
        posts
      }
    }
    default:
      return state;
  }
};

export default sagaReducer;
