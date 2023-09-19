import {CALL_STATE_ACTIONS} from '../types';

const initialState = {
  call: {
    calling: false,
    callee: null,
    callAnswered: false,
    callEnded: false,
  },
};

export const call = (state = initialState, action) => {
  switch (action.type) {
    case CALL_STATE_ACTIONS.GET_CALL:
      return {
        ...state,
      };

    case CALL_STATE_ACTIONS.SET_CALL:
      return {
        ...state,
        call: action.call,
      };
      break;

    default:
      return {
        ...state,
      };
      break;
  }
};
