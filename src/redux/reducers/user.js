import {USER_STATE_ACTIONS} from '../types';

const initialState = {
  currentUser: undefined,
  token: undefined,
  role: undefined,
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_ACTIONS.USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    case USER_STATE_ACTIONS.USER_SIGN_OUT:
      return {
        ...state,
        currentUser: action.currentUser,
      };
      break;
    case USER_STATE_ACTIONS.USER_SIGN_IN:
      return {
        ...state,
        currentUser: action.currentUser,
      };
      break;
    case USER_STATE_ACTIONS.USER_UPDATE:
      return {
        ...state,
        currentUser: action.currentUser,
      };
      break;
    case USER_STATE_ACTIONS.SET_TOKEN:
      return {
        ...state,
        token: action.token,
      };
      break;
    case USER_STATE_ACTIONS.SET_ROLE:
      return {
        ...state,
        role: action.role,
      };
      break;
    default:
      return {
        ...state,
      };
      break;
  }
};
