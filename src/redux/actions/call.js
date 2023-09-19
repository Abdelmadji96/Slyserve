import {CALL_STATE_ACTIONS} from '../types';

export const getCall = () => {
  return async dispatch => {
    dispatch({
      type: CALL_STATE_ACTIONS.GET_CALL,
    });
  };
};

export const setCall = call => {
  return async dispatch => {
    dispatch({
      type: CALL_STATE_ACTIONS.SET_CALL,
      call,
    });
  };
};
