import {RECEIVE_ARTICLE} from '../../../actions/types';

export const articleReducer = (state = {}, action) => {
  Object.freeze(state);
  let newState;
  switch (action.type) {
    case RECEIVE_ARTICLE:
      return Object.assign({}, state, action.article.data);
    default:
      return state;
  }
};
