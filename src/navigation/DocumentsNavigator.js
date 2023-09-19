import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../constants/colors';
import {USER_ROLES} from '../constants/user';
import {connect} from 'react-redux';
import Documents from '../screens/dashboard/documents/Documents';
import AddDocument from '../screens/dashboard/documents/AddDocument';

const DocumentsStack = createStackNavigator();

const DocumentsNavigator = ({role}) => {
  return (
    <DocumentsStack.Navigator
      initialRouteName="DocumentsNavigator"
      headerMode="none"
      detachInactiveScreens={true}
      screenOptions={{cardStyle: {backgroundColor: COLORS.PRIMARY12}}}>
      <DocumentsStack.Screen name="Documents" component={Documents} />
      <DocumentsStack.Screen name="AddDocument" component={AddDocument} />
    </DocumentsStack.Navigator>
  );
};

const mapStateProps = store => ({
  role: store.userState.role,
});

export default connect(mapStateProps, null)(DocumentsNavigator);
