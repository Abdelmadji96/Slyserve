import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {HEIGHT, WIDTH} from '../../constants/dimensions';
import {COLORS} from '../../constants/colors';
import Feather from 'react-native-vector-icons/Feather';

const logoSize = WIDTH / 2;
const buttonSize = HEIGHT / 12.5;

const GettingCall = ({doctor, join, hangup}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{doctor?.name}</Text>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assests/logos/logo.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: 'green'}]}
          onPress={join}>
          <Feather
            name="video"
            size={buttonSize / 2}
            color={COLORS.SECONDARY}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: COLORS.PRIMARY12}]}
          onPress={hangup}>
          <Feather
            name="video-off"
            size={buttonSize / 2}
            color={COLORS.SECONDARY}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GettingCall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
    backgroundColor: COLORS.SECONDARY,
  },
  logoContainer: {
    height: logoSize,
    width: logoSize,
    borderRadius: logoSize,
  },
  logo: {
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

  name: {
    fontSize: 24,
    fontWeight: '900',
    fontFamily: 'Poppins-Regular',
    color: COLORS.PRIMARY25,
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button: {
    height: buttonSize,
    width: buttonSize,
    borderRadius: buttonSize,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2.5,
  },
});
