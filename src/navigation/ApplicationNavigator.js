import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {OnBoardingNavigator} from './OnBoardingNavigator';
import DashboardNavigator from './DashboardNavigator';
import Splash from '../screens/Splash';
import {connect} from 'react-redux';
import {getApplication} from '../redux/actions/application';
import {getUser} from '../redux/actions/user';
import {getCall} from '../redux/actions/call';

const AppStack = createStackNavigator();

const ApplicationNavigator = ({
  application,
  loadApplication,
  loadUser,
  loadCall,
}) => {
  const [initializing, setInitializing] = useState(true);

  const initialize = async () => {
    await loadApplication();
    await loadUser();
    await loadCall();

    if (initializing)
      setTimeout(() => {
        setInitializing(false);
      }, 3000);
  };

  useEffect(() => {
    initialize();
  }, []);

  if (initializing) {
    return <Splash />;
  }

  if (application.onBoarding) {
    return (
      <AppStack.Navigator
        headerMode="none"
        initialRouteName="OnBoarding"
        detachInactiveScreens={true}>
        <AppStack.Screen name="OnBoarding" component={OnBoardingNavigator} />
        <AppStack.Screen name="Dashboard" component={DashboardNavigator} />
      </AppStack.Navigator>
    );
  } else {
    return (
      <AppStack.Navigator
        headerMode="none"
        initialRouteName="Dashboard"
        detachInactiveScreens={true}>
        <AppStack.Screen name="Dashboard" component={DashboardNavigator} />
      </AppStack.Navigator>
    );
  }
};

const mapStateProps = store => ({
  application: store.applicationState.application,
});

const mapDispatchProps = dispatch => ({
  loadApplication: () => dispatch(getApplication()),
  loadUser: () => dispatch(getUser()),
  loadCall: () => dispatch(getCall()),
});

export default connect(mapStateProps, mapDispatchProps)(ApplicationNavigator);
