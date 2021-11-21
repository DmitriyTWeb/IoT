import { ApiActionType } from '../api-actions';

const initState = {
  posts: null,
};

const sagaReducer = (state = initState, action) => {
  switch (action.type) {
    case ApiActionType.USER_POST_FETCH_SUCCEEDED: {
      const  posts = action.payload;

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
