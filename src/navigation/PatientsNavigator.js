import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../constants/colors';
import Patients from '../screens/dashboard/patients/Patients';
import AddPatient from '../screens/dashboard/patients/AddPatient';
import EditPatient from '../screens/dashboard/patients/EditPatient';

const PatientsStack = createStackNavigator();

const PatientsNavigator = () => {
  return (
    <PatientsStack.Navigator
      initialRouteName="PatientsNavigator"
      headerMode="none"
      detachInactiveScreens={true}
      screenOptions={{cardStyle: {backgroundColor: COLORS.PRIMARY12}}}>
      <PatientsStack.Screen name="Patients" component={Patients} />
      <PatientsStack.Screen name="AddPatient" component={AddPatient} />
      <PatientsStack.Screen name="EditPatient" component={EditPatient} />
    </PatientsStack.Navigator>
  );
};

export default PatientsNavigator;
