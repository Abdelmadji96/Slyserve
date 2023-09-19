import { LANAGUAGES_LIST, LANGUAGES } from "../../constants/languages";
import { APPLICATION_STATE_ACTIONS } from "../types/index";

const initialState = {
  application: {
    language: { key: LANAGUAGES_LIST.ARABIC, data: LANGUAGES.AR },
    onBoarding: true,
  },
};

export const application = (state = initialState, action) => {
  switch (action.type) {
    case APPLICATION_STATE_ACTIONS.GET_APPLICATION:
      return {
        ...state,
        application: action.application,
      };

    case APPLICATION_STATE_ACTIONS.SET_APPLICATION:
      return {
        ...state,
        application: action.application,
      };
      break;

    default:
      return {
        ...state,
      };
      break;
  }
};
