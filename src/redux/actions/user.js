import {USER_STATE_ACTIONS} from '../types';
import * as SecureStore from 'expo-secure-store';
//import {registerForPushNotifications} from '../../functions/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebase} from '../../../firebase';
import {USER_ROLES} from '../../constants/user';
import {patientUpdateNotificationsToken} from '../../api/patients';
import {doctorUpdateNotificationsToken} from '../../api/doctors';
import {clinicUpdateNotificationsToken} from '../../api/clinics';
import {paramedicalUpdateNotificationsToken} from '../../api/paramedicals';
import {pharmacyUpdateNotificationsToken} from '../../api/pharmacies';
import {ambulanceUpdateNotificationsToken} from '../../api/ambulances';
import {bloodDonnorUpdateNotificationsToken} from '../../api/bloodDonors';
import {laboratoryUpdateNotificationsToken} from '../../api/laboratories';

export const getUser = () => {
  return async dispatch => {
    //let currentUser = await SecureStore.getItemAsync('currentUser');
    let currentUser = await AsyncStorage.getItem('currentUser');
    //const notificationsToken = ""; //await registerForPushNotifications();
    /*const response = await updateNotificationToken(currentUser.id,
      notificationsToken
    );*/
    /*if (response["status"] == "notifications initialized successfully") {
      alert(
        JSON.stringify({ ...JSON.parse(currentUser), notificationToken: notificationsToken })
      );
    }*/
    if (currentUser) {
      currentUser = JSON.parse(currentUser);
      console.log(currentUser);
      dispatch({
        type: USER_STATE_ACTIONS.USER_STATE_CHANGE,
        currentUser: {...currentUser, notificationToken: token},
      });
    }
    //let token = await SecureStore.getItemAsync('token');
    let token = await AsyncStorage.getItem('token');
    if (token) {
      token = JSON.parse(token);
      dispatch({
        type: USER_STATE_ACTIONS.SET_TOKEN,
        token,
      });
    }
    //let role = await SecureStore.getItemAsync('role');
    let role = await AsyncStorage.getItem('role');
    if (role) {
      role = JSON.parse(role);
      dispatch({
        type: USER_STATE_ACTIONS.SET_ROLE,
        role,
      });
    }
  };
};

export const signIn = (currentUser, token, role) => {
  return async dispatch => {
    // await SecureStore.setItemAsync('currentUser', JSON.stringify(currentUser));
    // await SecureStore.setItemAsync('token', JSON.stringify(token));
    // await SecureStore.setItemAsync('role', JSON.stringify(role));
    await AsyncStorage.setItem('currentUser', JSON.stringify(currentUser));
    await AsyncStorage.setItem('token', JSON.stringify(token));
    await AsyncStorage.setItem('role', JSON.stringify(role));
    const notificationsToken = await firebase.messaging().getToken();
    let response;
    switch (role) {
      case USER_ROLES.PATIENT:
        response = await patientUpdateNotificationsToken(
          token,
          notificationsToken,
        );
        console.log(response);
        break;

      case USER_ROLES.DOCTOR:
        response = await doctorUpdateNotificationsToken(
          token,
          notificationsToken,
        );
        console.log(response);
        break;

      case USER_ROLES.CLINIC_HOSPITAL:
        response = await clinicUpdateNotificationsToken(
          token,
          notificationsToken,
        );
        console.log(response);
        break;

      case USER_ROLES.PARAMEDICAL:
        response = await paramedicalUpdateNotificationsToken(
          token,
          notificationsToken,
        );
        console.log(response);
        break;

      case USER_ROLES.PHARMACY:
        response = await pharmacyUpdateNotificationsToken(
          token,
          notificationsToken,
        );
        console.log(response);
        break;

      case USER_ROLES.AMBULANCE:
        response = await ambulanceUpdateNotificationsToken(
          token,
          notificationsToken,
        );
        console.log(response);
        break;

      case USER_ROLES.BLOOD_DONOR:
        response = await bloodDonnorUpdateNotificationsToken(
          token,
          notificationsToken,
        );
        console.log(response);
        break;

      case USER_ROLES.LABORATORY:
        response = await laboratoryUpdateNotificationsToken(
          token,
          notificationsToken,
        );
        console.log(response);
        break;

      default:
        break;
    }
    dispatch({
      type: USER_STATE_ACTIONS.USER_SIGN_IN,
      currentUser: {...currentUser, notificationToken: notificationsToken},
    });
    dispatch({
      type: USER_STATE_ACTIONS.SET_TOKEN,
      token,
    });
    dispatch({
      type: USER_STATE_ACTIONS.SET_ROLE,
      role,
    });
  };
};

export const signOut = () => {
  return async dispatch => {
    //SecureStore.deleteItemAsync('currentUser');
    AsyncStorage.removeItem('currentUser');
    dispatch({
      type: USER_STATE_ACTIONS.USER_SIGN_OUT,
      currentUser: undefined,
    });
    //SecureStore.deleteItemAsync('token');
    AsyncStorage.removeItem('token');
    dispatch({
      type: USER_STATE_ACTIONS.SET_TOKEN,
      token: undefined,
    });
    //SecureStore.deleteItemAsync('role');
    AsyncStorage.removeItem('role');
    dispatch({
      type: USER_STATE_ACTIONS.SET_ROLE,
      role: undefined,
    });
  };
};

export const updateUser = user => {
  return async dispatch => {
    //await SecureStore.setItemAsync('currentUser', JSON.stringify(user));
    await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    dispatch({
      type: USER_STATE_ACTIONS.USER_UPDATE,
      currentUser: user,
    });
  };
};

export const setRole = role => {
  return async dispatch => {
    //await SecureStore.setItemAsync('role', JSON.stringify(role));
    await AsyncStorage.setItem('role', JSON.stringify(role));
    dispatch({
      type: USER_STATE_ACTIONS.SET_ROLE,
      role,
    });
  };
};
