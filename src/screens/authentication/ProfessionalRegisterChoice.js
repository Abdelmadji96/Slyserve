import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../constants/colors';
import {HEIGHT, WIDTH} from '../../constants/dimensions';
import {useTheme} from '../../context/theme';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {USER_ROLES} from '../../constants/user';
import DrawerHiddenView from '../../components/drawerHiddenView/DrawerHiddenView';

const choiceItemHeight = HEIGHT / 12.5;
const choiceItemWidth = WIDTH * 0.8;
const iconSize = 30;

const ProfessionalSignUpChoice = ({navigation, application}) => {
  const {drawer} = useTheme();

  return (
    <>
      <DrawerHiddenView />
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{scale: drawer.scale}],
            borderTopLeftRadius: drawer.radius,
            borderBottomLeftRadius: drawer.radius,
          },
        ]}>
        <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={35}
            color={COLORS.PRIMARY12}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>
            {application.language.data.REGISTER}
          </Text>
          <View />
        </View>
        <View style={styles.subContainer}>
          <Text style={styles.title}>
            {application.language.data.REGISTER_AS}
          </Text>
          <TouchableOpacity
            style={styles.choiceItemContainer}
            onPress={() =>
              navigation.navigate('Register', {choice: USER_ROLES.DOCTOR})
            }>
            <FontAwesome5
              name="stethoscope"
              size={iconSize}
              color={COLORS.SECONDARY}
              style={styles.icon}
            />
            <Text style={[styles.choiceItemText, {color: COLORS.SECONDARY}]}>
              {application.language.data.DOCTOR}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.choiceItemContainer}
            onPress={() =>
              navigation.navigate('Register', {choice: USER_ROLES.PARAMEDICAL})
            }>
            <FontAwesome5
              name="briefcase-medical"
              size={iconSize}
              color={COLORS.SECONDARY}
              style={styles.icon}
            />
            <Text style={[styles.choiceItemText, {color: COLORS.SECONDARY}]}>
              {application.language.data.PARAMEDICAL}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.choiceItemContainer}
            onPress={() =>
              navigation.navigate('Register', {
                choice: USER_ROLES.CLINIC_HOSPITAL,
              })
            }>
            <FontAwesome5
              name="hospital"
              size={iconSize}
              color={COLORS.SECONDARY}
              style={styles.icon}
            />
            <Text style={[styles.choiceItemText, {color: COLORS.SECONDARY}]}>
              {application.language.data.CLINIC_HOSPITAL}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.choiceItemContainer}
            onPress={() =>
              navigation.navigate('Register', {
                choice: USER_ROLES.LABORATORY,
              })
            }>
            <Fontisto
              name="test-tube"
              size={iconSize}
              color={COLORS.SECONDARY}
              style={styles.icon}
            />
            <Text style={[styles.choiceItemText, {color: COLORS.SECONDARY}]}>
              {application.language.data.LABORATORY}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.choiceItemContainer}
            onPress={() =>
              navigation.navigate('Register', {choice: USER_ROLES.PHARMACY})
            }>
            <Fontisto
              name="drug-pack"
              size={iconSize}
              color={COLORS.SECONDARY}
              style={styles.icon}
            />
            <Text style={[styles.choiceItemText, {color: COLORS.SECONDARY}]}>
              {application.language.data.PHARMACY}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.choiceItemContainer}
            onPress={() =>
              navigation.navigate('Register', {choice: USER_ROLES.AMBULANCE})
            }>
            <FontAwesome5
              name="ambulance"
              size={iconSize}
              color={COLORS.SECONDARY}
              style={styles.icon}
            />
            <Text style={[styles.choiceItemText, {color: COLORS.SECONDARY}]}>
              {application.language.data.AMBULANCE}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.choiceItemContainer}
            onPress={() =>
              navigation.navigate('Register', {choice: USER_ROLES.BLOOD_DONOR})
            }>
            <Fontisto
              name="blood-drop"
              size={iconSize}
              color={COLORS.SECONDARY}
              style={styles.icon}
            />
            <Text style={[styles.choiceItemText, {color: COLORS.SECONDARY}]}>
              {application.language.data.BLOOD_DONOR}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
});

const mapDispatchProps = dispatch => ({
  login: () => {},
});

export default connect(
  mapStateProps,
  mapDispatchProps,
)(ProfessionalSignUpChoice);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
  },
  header: {
    height: HEIGHT / 10,
    width: WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.PRIMARY12,
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY25,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: HEIGHT / 15,
  },
  choiceItemContainer: {
    height: choiceItemHeight,
    width: choiceItemWidth,
    borderRadius: 15,
    backgroundColor: COLORS.PRIMARY12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.PRIMARY12,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  choiceItemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
});
