import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../constants/colors';
import Planning from '../screens/dashboard/planning/Planning';
import AddAppointment from '../screens/dashboard/planning/AddAppointment';

const PlanningStack = createStackNavigator();

const PlanningNavigator = () => {
  return (
    <PlanningStack.Navigator
      initialRouteName="PlanningNavigator"
      headerMode="none"
      detachInactiveScreens={true}
      screenOptions={{cardStyle: {backgroundColor: COLORS.PRIMARY12}}}>
      <PlanningStack.Screen name="Planning" component={Planning} />
      <PlanningStack.Screen name="AddAppointment" component={AddAppointment} />
    </PlanningStack.Navigator>
  );
};

export default PlanningNavigator;
