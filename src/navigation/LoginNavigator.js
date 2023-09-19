import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/authentication/Login';
import LoginChoice from '../screens/authentication/LoginChoice';
import ForgotPassword from '../screens/authentication/ForgotPassword';
import {COLORS} from '../constants/colors';
import ProfessionalLoginCoice from '../screens/authentication/ProfessionalLoginCoice';

const LoginStack = createStackNavigator();
export const LoginNavigator = () => {
  return (
    <LoginStack.Navigator
      initialRouteName="LoginChoice"
      headerMode="none"
      detachInactiveScreens={true}
      screenOptions={{cardStyle: {backgroundColor: COLORS.PRIMARY12}}}>
      <LoginStack.Screen name="LoginChoice" component={LoginChoice} />
      <LoginStack.Screen name="ProfessionalLoginChoice" component={ProfessionalLoginCoice} />
      <LoginStack.Screen name="Login" component={Login} />
      <LoginStack.Screen name="ForgotPassword" component={ForgotPassword} />
    </LoginStack.Navigator>
  );
};
