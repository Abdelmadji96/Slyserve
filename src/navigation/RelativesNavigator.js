import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../constants/colors';
import Relatives from '../screens/dashboard/relatives/Relatives';
import AddRelative from '../screens/dashboard/relatives/AddRelative';
import EditRelative from '../screens/dashboard/relatives/EditRelative';

const RelativesStack = createStackNavigator();

const RelativesNavigator = () => {
  return (
    <RelativesStack.Navigator
      initialRouteName="RelativesNavigator"
      headerMode="none"
      detachInactiveScreens={true}
      screenOptions={{cardStyle: {backgroundColor: COLORS.PRIMARY12}}}>
      <RelativesStack.Screen name="Relatives" component={Relatives} />
      <RelativesStack.Screen name="AddRelative" component={AddRelative} />
      <RelativesStack.Screen name="EditRelative" component={EditRelative} />
    </RelativesStack.Navigator>
  );
};

export default RelativesNavigator;
