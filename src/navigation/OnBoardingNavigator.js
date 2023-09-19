import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LanguageChoice from '../screens/onBoarding/LanguageChoice';
import OnBoarding from '../screens/onBoarding/OnBoarding';

const OnBoardingStack = createStackNavigator();
export const OnBoardingNavigator = () => {
  return (
    <OnBoardingStack.Navigator
      initialRouteName="LanguageChoice"
      headerMode="none"
      detachInactiveScreens={true}>
      <OnBoardingStack.Screen
        name="LanguageChoice"
        component={LanguageChoice}
      />
      <OnBoardingStack.Screen name="OnBoarding" component={OnBoarding} />
    </OnBoardingStack.Navigator>
  );
};
