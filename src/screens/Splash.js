import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {WIDTH} from '../constants/dimensions';
import logo from '../assests/logos/logo.png';
import {COLORS} from '../constants/colors';

const logoSize = WIDTH / 2;

const Splash = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} resizeMode="cover" />
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.SECONDARY
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
});
