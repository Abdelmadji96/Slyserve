import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../constants/colors';
import Subscription from '../screens/dashboard/subscription/Subscription';
import ChangeSubscription from '../screens/dashboard/subscription/ChangeSubscription';

const SubscriptionStack = createStackNavigator();

const SubscriptionNavigator = () => {
  return (
    <SubscriptionStack.Navigator
      initialRouteName="SubscriptionNavigator"
      headerMode="none"
      detachInactiveScreens={true}
      screenOptions={{cardStyle: {backgroundColor: COLORS.PRIMARY12}}}>
      <SubscriptionStack.Screen name="Subscription" component={Subscription} />
      <SubscriptionStack.Screen
        name="ChangeSubscription"
        component={ChangeSubscription}
      />
    </SubscriptionStack.Navigator>
  );
};

export default SubscriptionNavigator;
