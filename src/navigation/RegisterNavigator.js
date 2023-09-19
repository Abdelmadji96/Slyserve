import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Register from '../screens/authentication/Register';
import RegisterChoice from '../screens/authentication/RegisterChoice';
import { COLORS } from '../constants/colors';
import ProfessionalRegisterChoice from '../screens/authentication/ProfessionalRegisterChoice';

const RegisterStack = createStackNavigator();
export const RegisterNavigator = () => {
    return (
        <RegisterStack.Navigator
            initialRouteName="RegisterChoice"
            headerMode="none"
            detachInactiveScreens={true}
            screenOptions={{ cardStyle: { backgroundColor: COLORS.PRIMARY12 } }}>
            <RegisterStack.Screen name="RegisterChoice" component={RegisterChoice} />
            <RegisterStack.Screen name="ProfessionalRegisterChoice" component={ProfessionalRegisterChoice} />
            <RegisterStack.Screen name="Register" component={Register} />
        </RegisterStack.Navigator>
    );
};
