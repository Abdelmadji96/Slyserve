   
import {APPLICATION_STATE_ACTIONS} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getApplication = () => {
  return async dispatch => {
    let application = await AsyncStorage.getItem('application');
    if (application) {
      application = JSON.parse(application);
      console.log(application);
      dispatch({
        type: APPLICATION_STATE_ACTIONS.GET_APPLICATION,
        application,
      });
    }
  };
};

export const setApplication = application => {
  return async dispatch => {
    await AsyncStorage.setItem('application', JSON.stringify(application));
    dispatch({
      type: APPLICATION_STATE_ACTIONS.SET_APPLICATION,
      application,
    });
  };
};