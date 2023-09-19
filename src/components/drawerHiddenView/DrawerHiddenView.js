import React from 'react';
import {StyleSheet /*, View*/} from 'react-native';
import Animated from 'react-native-reanimated';
import {COLORS} from '../../constants/colors';
import {HEIGHT, WIDTH} from '../../constants/dimensions';
//import {useTheme} from '../../context/theme';

const DrawerHiddenView = () => {
  //const {drawer} = useTheme();
  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: HEIGHT * 0.7 /*drawer.height*/,
          top: HEIGHT * 0.15 /*, top: drawer.top, left: drawer.left*/,
        },
      ]}
    />
  );
};

export default DrawerHiddenView;

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    position: 'absolute',
    left: WIDTH / 30,
    alignSelf: 'flex-start',
    alignContent: 'center',
    backgroundColor: 'cyan',
    borderRadius: 20,
    backgroundColor: COLORS.SECONDARY,
    opacity: 0.45,
  },
});
