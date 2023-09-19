import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../constants/colors';
import {HEIGHT, WIDTH} from '../../constants/dimensions';
import { useTheme } from '../../context/theme';

const ForgotPassword = ({navigation, application}) => {
  const {drawer} = useTheme();

  return (
    <Animated.View
      style={[styles.container, {transform: [{scale: drawer.scale}]}]}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={35}
          color={COLORS.PRIMARY12}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>
          {application.language.data.SIGN_IN}
        </Text>
        <View />
      </View>
      <Text>fp</Text>
    </Animated.View>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
});

const mapDispatchProps = dispatch => ({
  login: () => {},
});

export default connect(mapStateProps, mapDispatchProps)(ForgotPassword);

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
});
