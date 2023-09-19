import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../constants/colors';
import {USER_ROLES} from '../constants/user';
import {connect} from 'react-redux';
import PatientAppointments from '../screens/dashboard/appointments/PatientAppointments';
import BookAppointment from '../screens/dashboard/appointments/BookAppointment';

const AppointmentsStack = createStackNavigator();

const AppointmentsNavigator = ({role}) => {
  return (
    <AppointmentsStack.Navigator
      initialRouteName="AppointmentsNavigator"
      headerMode="none"
      detachInactiveScreens={true}
      screenOptions={{cardStyle: {backgroundColor: COLORS.PRIMARY12}}}>
      <AppointmentsStack.Screen
        name="Appointments"
        component={PatientAppointments}
      />
      <AppointmentsStack.Screen
        name="BookAppointment"
        component={BookAppointment}
      />
    </AppointmentsStack.Navigator>
  );
};

const mapStateProps = store => ({
  role: store.userState.role,
});

export default connect(mapStateProps, null)(AppointmentsNavigator);
