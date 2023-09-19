import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {COLORS} from '../../constants/colors';
import {useTheme} from '../../context/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {HEIGHT, WIDTH} from '../../constants/dimensions';
import {connect} from 'react-redux';
import {USER_ROLES} from '../../constants/user';
import DrawerHiddenView from '../../components/drawerHiddenView/DrawerHiddenView';

const choiceItemHeight = HEIGHT / 10;
const choiceItemWidth = WIDTH * 0.8;
const iconSize = 30;
const logoSize = WIDTH / 3;

const LoginChoice = ({navigation, application}) => {
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
            name="menu"
            size={35}
            color={COLORS.PRIMARY12}
            onPress={() => navigation.openDrawer()}
          />
          <Text style={styles.headerTitle}>
            {application.language.data.SIGN_IN}
          </Text>
          <View />
        </View>
        <View style={styles.subcontainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assests/logos/logo.png')}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.title}>{application.language.data.LOGIN_AS}</Text>
          <TouchableOpacity
            style={[
              styles.choiceItemContainer,
              {borderColor: COLORS.PRIMARY12, borderWidth: 2},
            ]}
            onPress={() =>
              navigation.navigate('Login', {choice: USER_ROLES.PATIENT})
            }>
            <Feather
              name="user"
              size={iconSize}
              color={COLORS.PRIMARY12}
              style={styles.icon}
            />
            <Text style={[styles.choiceItemText, {color: COLORS.PRIMARY12}]}>
              {application.language.data.PATIENT}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.choiceItemContainer,
              {
                backgroundColor: COLORS.PRIMARY12,
                shadowColor: COLORS.PRIMARY12,
                shadowOffset: {
                  width: 0,
                  height: 12,
                },
                shadowOpacity: 0.58,
                shadowRadius: 16.0,
                elevation: 24,
              },
            ]}
            onPress={() => navigation.navigate('ProfessionalLoginChoice')}>
            <FontAwesome5
              name="hand-holding-medical"
              size={iconSize}
              color={COLORS.SECONDARY}
              style={styles.icon}
            />
            <Text style={[styles.choiceItemText, {color: COLORS.SECONDARY}]}>
              {application.language.data.PROFESSIONAL}
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

export default connect(mapStateProps, null)(LoginChoice);

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
  subcontainer: {
    height: HEIGHT - HEIGHT / 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  logoContainer: {
    height: logoSize,
    width: logoSize,
    borderRadius: logoSize,
    shadowColor: COLORS.PRIMARY12,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  logo: {
    height: logoSize,
    width: logoSize,
    borderRadius: logoSize,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceItemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
});
