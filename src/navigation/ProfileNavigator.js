import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../constants/colors';
import Profile from '../screens/dashboard/profile/Profile';
import EditProfile from '../screens/dashboard/profile/EditProfile';
import ParamedicalProfile from '../screens/dashboard/profile/ParamedicalProfile';
import ParamedicalEditProfile from '../screens/dashboard/profile/ParamedicalEditProfile';
import {connect} from 'react-redux';
import {USER_ROLES} from '../constants/user';
import ClinicProfile from '../screens/dashboard/profile/ClinicProfile';
import ClinicEditProfile from '../screens/dashboard/profile/ClinicEditProfile';
import PharmacyProfile from '../screens/dashboard/profile/PharmacyProfile';
import PharmacyEditProfile from '../screens/dashboard/profile/PharmacyEditProfile';
import AmbulanceProfile from '../screens/dashboard/profile/AmbulanceProfile';
import AmbulanceEditProfile from '../screens/dashboard/profile/AmbulanceEditProfile';
import LaboratoryProfile from '../screens/dashboard/profile/LaboratoryProfile';
import LaboratoryEditProfile from '../screens/dashboard/profile/LaboratoryEditProfile';

const ProfileStack = createStackNavigator();

const ProfileNavigator = ({role}) => {
  switch (role) {
    case USER_ROLES.DOCTOR:
      return (
        <ProfileStack.Navigator
          initialRouteName="ProfileNavigator"
          headerMode="none"
          detachInactiveScreens={true}
          screenOptions={{cardStyle: {backgroundColor: COLORS.PRIMARY12}}}>
          <ProfileStack.Screen name="Profile" component={Profile} />
          <ProfileStack.Screen name="EditProfile" component={EditProfile} />
        </ProfileStack.Navigator>
      );
      break;

    case USER_ROLES.PARAMEDICAL:
      return (
        <ProfileStack.Navigator
          initialRouteName="ProfileNavigator"
          headerMode="none"
          detachInactiveScreens={true}
          screenOptions={{cardStyle: {backgroundColor: COLORS.PRIMARY12}}}>
          <ProfileStack.Screen
            name="ParamedicalProfile"
            component={ParamedicalProfile}
          />
          <ProfileStack.Screen
            name="ParamedicalEditProfile"
            component={ParamedicalEditProfile}
          />
        </ProfileStack.Navigator>
      );
      break;

    case USER_ROLES.CLINIC_HOSPITAL:
      return (
        <ProfileStack.Navigator
          initialRouteName="ProfileNavigator"
          headerMode="none"
          detachInactiveScreens={true}
          screenOptions={{cardStyle: {backgroundColor: COLORS.PRIMARY12}}}>
          <ProfileStack.Screen name="ClinicProfile" component={ClinicProfile} />
          <ProfileStack.Screen
            name="ClinicEditProfile"
            component={ClinicEditProfile}
          />
        </ProfileStack.Navigator>
      );
      break;

    case USER_ROLES.PHARMACY:
      return (
        <ProfileStack.Navigator
          initialRouteName="ProfileNavigator"
          headerMode="none"
          detachInactiveScreens={true}
          screenOptions={{cardStyle: {backgroundColor: COLORS.PRIMARY12}}}>
          <ProfileStack.Screen
            name="PharmacyProfile"
            component={PharmacyProfile}
          />
          <ProfileStack.Screen
            name="PharmacyEditProfile"
            component={PharmacyEditProfile}
          />
        </ProfileStack.Navigator>
      );
      break;

    case USER_ROLES.AMBULANCE:
      return (
        <ProfileStack.Navigator
          initialRouteName="ProfileNavigator"
          headerMode="none"
          detachInactiveScreens={true}
          screenOptions={{cardStyle: {backgroundColor: COLORS.PRIMARY12}}}>
          <ProfileStack.Screen
            name="AmbulanceProfile"
            component={AmbulanceProfile}
          />
          <ProfileStack.Screen
            name="AmbulanceEditProfile"
            component={AmbulanceEditProfile}
          />
        </ProfileStack.Navigator>
      );
      break;

    case USER_ROLES.LABORATORY:
      return (
        <ProfileStack.Navigator
          initialRouteName="ProfileNavigator"
          headerMode="none"
          detachInactiveScreens={true}
          screenOptions={{cardStyle: {backgroundColor: COLORS.PRIMARY12}}}>
          <ProfileStack.Screen
            name="LaboratoryProfile"
            component={LaboratoryProfile}
          />
          <ProfileStack.Screen
            name="LaboratoryEditProfile"
            component={LaboratoryEditProfile}
          />
        </ProfileStack.Navigator>
      );
      break;

    default:
      return null;
      break;
  }
};

const mapStateProps = store => ({
  role: store.userState.role,
});

export default connect(mapStateProps, null)(ProfileNavigator);
