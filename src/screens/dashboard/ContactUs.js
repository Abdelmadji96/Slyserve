import React from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import DrawerHiddenView from '../../components/drawerHiddenView/DrawerHiddenView';
import {COLORS} from '../../constants/colors';
import {HEIGHT, WIDTH} from '../../constants/dimensions';
import {useTheme} from '../../context/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';

const logoSize = WIDTH / 3;

const ContactUs = ({navigation, application}) => {
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
            {application.language.data.CONTACT}
          </Text>
          <View />
        </View>
        <View style={styles.bottomView}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assests/logos/logo.png')}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
          <Text style={[styles.headerTitle, {color: COLORS.PRIMARY25}]}>
            {application.language.data.CONTACT}
          </Text>
          <Text>{application.language.data.CONTACT_TEXT}</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:contact@slyserve.com')}>
            <Text style={styles.link}>contact@slyserve.com</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
  user: store.userState.currentUser,
  token: store.userState.token,
});

export default connect(mapStateProps, null)(ContactUs);

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
  bottomView: {
    flex: 1,
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
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
