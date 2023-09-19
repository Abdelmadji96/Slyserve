import {DrawerItem, useDrawerProgress} from '@react-navigation/drawer';
import {useTheme} from '../../context/theme';
import React, {useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import {COLORS} from '../../constants/colors';
import {interpolateNode} from 'react-native-reanimated';
import {HEIGHT, WIDTH} from '../../constants/dimensions';
import logo from '../../assests/logos/logo.png';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import {signOut} from '../../redux/actions/user';
import {USER_ROLES} from '../../constants/user';

const logoContainerSize = WIDTH / 5;
const logoSize = WIDTH / 6;
const socialIconSize = 30;

const DrawerContent = ({
  navigation,
  application,
  state,
  user,
  role,
  logOut,
}) => {
  const progress = useDrawerProgress();
  const {setDrawer} = useTheme();

  const scale = interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  const radius = interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [0, 25],
  });

  // const height = interpolateNode(progress, {
  //   inputRange: [0, 1],
  //   outputRange: [HEIGHT, HEIGHT * 0.7],
  // });

  // const top = interpolateNode(progress, {
  //   inputRange: [0, 1],
  //   outputRange: [0, HEIGHT * 0.15],
  // });

  // const left = interpolateNode(progress, {
  //   inputRange: [0, 1],
  //   outputRange: [0, 15],
  // });

  const triggerDrawer = async () => {
    setDrawer({scale, radius /*, height, top, left*/});
  };

  useEffect(() => {
    triggerDrawer();
  }, [progress]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} resizeMode="cover" />
      </View>
      <View style={styles.bottomContainer}>
        <DrawerItem
          pressColor="transparent" //{COLORS.SECONDARY}
          activeTintColor={COLORS.SECONDARY}
          inactiveTintColor={COLORS.UNDERLAY}
          icon={({color, size, focused}) => (
            <Feather name="home" color={color} size={size} />
          )}
          label={application.language.data.HOME}
          labelStyle={styles.label}
          onPress={() => {
            navigation.navigate('HomeNavigator');
          }}
          style={styles.drawerItem}
        />

        {!user && (
          <>
            <DrawerItem
              pressColor="transparent" //{COLORS.SECONDARY}
              activeTintColor={COLORS.SECONDARY}
              inactiveTintColor={COLORS.UNDERLAY}
              icon={({color, size, focused}) => (
                <Feather name="log-in" color={color} size={size} />
              )}
              label={application.language.data.SIGN_IN}
              labelStyle={styles.label}
              onPress={() => {
                navigation.navigate('LoginNavigator');
              }}
              style={styles.drawerItem}
            />
            <DrawerItem
              pressColor="transparent" //{COLORS.SECONDARY}
              activeTintColor={COLORS.SECONDARY}
              inactiveTintColor={COLORS.UNDERLAY}
              icon={({color, size, focused}) => (
                <Feather name="user-plus" color={color} size={size} />
              )}
              label={application.language.data.REGISTER}
              labelStyle={styles.label}
              onPress={() => {
                navigation.navigate('RegisterNavigator');
              }}
              style={styles.drawerItem}
            />
          </>
        )}
        {user && role == USER_ROLES.DOCTOR && (
          <>
            <DrawerItem
              pressColor="transparent" //{COLORS.SECONDARY}
              activeTintColor={COLORS.SECONDARY}
              inactiveTintColor={COLORS.UNDERLAY}
              icon={({color, size, focused}) => (
                <Feather name="calendar" color={color} size={size} />
              )}
              label={application.language.data.MY_APPOINTMENTS}
              labelStyle={styles.label}
              onPress={() => {
                navigation.navigate('PlanningNavigator');
              }}
              style={styles.drawerItem}
            />
            <DrawerItem
              pressColor="transparent" //{COLORS.SECONDARY}
              activeTintColor={COLORS.SECONDARY}
              inactiveTintColor={COLORS.UNDERLAY}
              icon={({color, size, focused}) => (
                <Feather name="users" color={color} size={size} />
              )}
              label={application.language.data.MY_PATIENTS}
              labelStyle={styles.label}
              onPress={() => {
                navigation.navigate('PatientsNavigator');
              }}
              style={styles.drawerItem}
            />
            <DrawerItem
              pressColor="transparent" //{COLORS.SECONDARY}
              activeTintColor={COLORS.SECONDARY}
              inactiveTintColor={COLORS.UNDERLAY}
              icon={({color, size, focused}) => (
                <AntDesign name="filetext1" color={color} size={size} />
              )}
              label={application.language.data.SUBSCRIPTION}
              labelStyle={styles.label}
              onPress={() => {
                navigation.navigate('SubscriptionNavigator');
              }}
              style={styles.drawerItem}
            />
          </>
        )}
        {user && role == USER_ROLES.PATIENT && (
          <>
            <DrawerItem
              pressColor="transparent" //{COLORS.SECONDARY}
              activeTintColor={COLORS.SECONDARY}
              inactiveTintColor={COLORS.UNDERLAY}
              icon={({color, size, focused}) => (
                <Feather name="calendar" color={color} size={size} />
              )}
              label={application.language.data.MY_APPOINTMENTS}
              labelStyle={styles.label}
              onPress={() => {
                navigation.navigate('AppointmentsNavigator');
              }}
              style={styles.drawerItem}
            />
            <DrawerItem
              pressColor="transparent" //{COLORS.SECONDARY}
              activeTintColor={COLORS.SECONDARY}
              inactiveTintColor={COLORS.UNDERLAY}
              icon={({color, size, focused}) => (
                <Feather
                  name="users"
                  // MaterialIcons
                  // name="family-restroom"
                  color={color}
                  size={size}
                />
              )}
              label={application.language.data.MY_RELATIVES}
              labelStyle={styles.label}
              onPress={() => {
                navigation.navigate('RelativesNavigator');
              }}
              style={styles.drawerItem}
            />
            <DrawerItem
              pressColor="transparent" //{COLORS.SECONDARY}
              activeTintColor={COLORS.SECONDARY}
              inactiveTintColor={COLORS.UNDERLAY}
              icon={({color, size, focused}) => (
                <Ionicons name="documents-outline" color={color} size={size} />
              )}
              label={application.language.data.MY_FILES}
              labelStyle={styles.label}
              onPress={() => {
                navigation.navigate('DocumentsNavigator');
              }}
              style={styles.drawerItem}
            />
            <DrawerItem
              pressColor="transparent" //{COLORS.SECONDARY}
              activeTintColor={COLORS.SECONDARY}
              inactiveTintColor={COLORS.UNDERLAY}
              icon={({color, size, focused}) => (
                <AntDesign name="solution1" color={color} size={size} />
              )}
              label={application.language.data.MY_INFORMATIONS}
              labelStyle={styles.label}
              onPress={() => {
                navigation.navigate('InformationsNavigator');
              }}
              style={styles.drawerItem}
            />
          </>
        )}
        {user && role !== USER_ROLES.PATIENT && (
          <DrawerItem
            pressColor="transparent" //{COLORS.SECONDARY}
            activeTintColor={COLORS.SECONDARY}
            inactiveTintColor={COLORS.UNDERLAY}
            icon={({color, size, focused}) => (
              <AntDesign name="solution1" color={color} size={size} />
            )}
            label={application.language.data.PROFILE}
            labelStyle={styles.label}
            onPress={() => navigation.navigate('ProfileNavigator')}
            style={styles.drawerItem}
          />
        )}
        <DrawerItem
          pressColor="transparent" //{COLORS.SECONDARY}
          activeTintColor={COLORS.SECONDARY}
          inactiveTintColor={COLORS.UNDERLAY}
          icon={({color, size, focused}) => (
            <MaterialIcons name="language" color={color} size={size} />
          )}
          label={application.language.data.LANGUAGE}
          labelStyle={styles.label}
          onPress={() => {
            navigation.navigate('ChangeLanguage');
          }}
          style={styles.drawerItem}
        />
        <DrawerItem
          pressColor="transparent" //{COLORS.SECONDARY}
          activeTintColor={COLORS.SECONDARY}
          inactiveTintColor={COLORS.UNDERLAY}
          icon={({color, size, focused}) => (
            <MaterialIcons name="info-outline" color={color} size={size} />
          )}
          label={application.language.data.ABOUT}
          labelStyle={styles.label}
          onPress={() => {
            navigation.navigate('AboutUs');
          }}
          style={styles.drawerItem}
        />
        <DrawerItem
          pressColor="transparent" //{COLORS.SECONDARY}
          activeTintColor={COLORS.SECONDARY}
          inactiveTintColor={COLORS.UNDERLAY}
          icon={({color, size, focused}) => (
            <Feather name="mail" color={color} size={size} />
          )}
          label={application.language.data.CONTACT}
          labelStyle={styles.label}
          onPress={() => {
            navigation.navigate('ContactUs');
          }}
          style={styles.drawerItem}
        />
        {user && (
          <DrawerItem
            pressColor="transparent" //{COLORS.SECONDARY}
            activeTintColor={COLORS.SECONDARY}
            inactiveTintColor={COLORS.UNDERLAY}
            icon={({color, size, focused}) => (
              <Feather name="log-out" color={color} size={size} />
            )}
            label={application.language.data.SIGN_OUT}
            labelStyle={styles.label}
            onPress={async () => {
              await logOut();
              navigation.navigate('HomeNavigator');
            }}
            style={styles.drawerItem}
          />
        )}
      </View>
      <View style={styles.socialContainer}>
        <Text style={[styles.label, {marginBottom: 10}]}>
          {application.language.data.FOLLOW}
        </Text>
        <View style={styles.socialSubContainer}>
          <TouchableOpacity
            style={styles.social}
            onPress={() => Linking.openURL('fb://page/103644174736009')}>
            <Feather
              name="facebook"
              color={COLORS.SECONDARY}
              size={socialIconSize}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.social}
            onPress={() =>
              Linking.openURL('instagram://user?username=sadeeminfo')
            }>
            <Feather
              name="instagram"
              color={COLORS.SECONDARY}
              size={socialIconSize}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.social}
            onPress={() =>
              Linking.openURL(
                'https://www.youtube.com/channel/UCZuG8U9ow5ONHTpPvFrlYKQ',
              )
            }>
            <Feather
              name="youtube"
              color={COLORS.SECONDARY}
              size={socialIconSize}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
  user: store.userState.currentUser,
  role: store.userState.role,
});

const mapDispatchProps = dispatch => ({
  logOut: () => dispatch(signOut()),
});

export default connect(mapStateProps, mapDispatchProps)(DrawerContent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY12,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  logoContainer: {
    height: logoContainerSize,
    width: logoContainerSize,
    borderRadius: logoContainerSize,
    backgroundColor: COLORS.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: HEIGHT / 100,
  },
  logo: {
    height: logoSize,
    width: logoSize,
    borderRadius: logoSize,
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-evenly',
  },
  drawerItem: {width: '95%'},
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.SECONDARY,
    textAlign: 'right',
  },
  socialContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: HEIGHT / 100,
  },
  socialSubContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
