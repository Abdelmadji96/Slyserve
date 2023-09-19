import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/dashboard/home/Home';
import {COLORS} from '../constants/colors';
import {USER_ROLES} from '../constants/user';
import {connect} from 'react-redux';
import BookAppointment from '../screens/dashboard/appointments/BookAppointment';

const HomeStack = createStackNavigator();

const HomeNavigator = ({role}) => {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      headerMode="none"
      detachInactiveScreens={true}
      screenOptions={{cardStyle: {backgroundColor: COLORS.PRIMARY12}}}>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="BookAppointment" component={BookAppointment} />
    </HomeStack.Navigator>
  );
};

const mapStateProps = store => ({
  role: store.userState.role,
});

export default connect(mapStateProps, null)(HomeNavigator);
