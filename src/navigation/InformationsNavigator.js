import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../constants/colors';
import Informations from '../screens/dashboard/informations/Informations';
import EditInformations from '../screens/dashboard/informations/EditInformations';

const InformationsStack = createStackNavigator();

const InformationsNavigator = () => {
  return (
    <InformationsStack.Navigator
      initialRouteName="InformationsNavigator"
      headerMode="none"
      detachInactiveScreens={true}
      screenOptions={{cardStyle: {backgroundColor: COLORS.PRIMARY12}}}>
      <InformationsStack.Screen name="Informations" component={Informations} />
      <InformationsStack.Screen
        name="EditInformations"
        component={EditInformations}
      />
    </InformationsStack.Navigator>
  );
};

export default InformationsNavigator;
