import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import {COLORS} from '../../constants/colors';
import {LANAGUAGES_LIST} from '../../constants/languages';

const AnimatedTextInput = ({
  inputHeight,
  inputWidth,
  inputRadius,
  value,
  onChange,
  placeholder,
  multiline,
  secureTextIntry,
  errorText,
  errorTextVisible,
  application,
}) => {
  const animation = useRef(new Animated.Value(1)).current;

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange:
      application.language.key == LANAGUAGES_LIST.ARABIC ? [0, 10] : [0, -10],
  });
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -inputHeight / 2],
  });
  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  const animate = value => {
    Animated.spring(animation, {
      toValue: value,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  };

  const onFocus = () => animate(1);

  const onBlur = () => {
    if (value.length == 0) {
      animate(0);
    }
  };

  //   useEffect(() => {
  //     const keyboardDidHideListener = Keyboard.addListener(
  //       'keyboardDidHide',
  //       onBlur,
  //     );
  //     return () => {
  //       keyboardDidHideListener.remove();
  //     };
  //   }, []);

  return (
    <View>
      <View
        style={[
          styles.container,
          {height: inputHeight, width: inputWidth, borderRadius: inputRadius},
        ]}
        //   onLayout={e =>
        //     !inputHeight && setInputHeight(e.nativeEvent.layout.height)
        //   }
      >
        <View
          style={[styles.placeholderContainer, {height: inputHeight * 0.9}]}>
          <Animated.Text
            //   onTextLayout={e =>
            //     !placeholderWidth &&
            //     setPlaceholderWidth(e.nativeEvent.lines[0]?.width || 0)
            //   }
            style={[
              styles.placeholder,
              {transform: [{translateX}, {translateY}, {scale}]},
              application.language.key == LANAGUAGES_LIST.ARABIC
                ? {right: 0}
                : {left: 0},
            ]}>
            {placeholder}
          </Animated.Text>
          <TextInput
            value={value}
            style={[styles.input, multiline && {textAlignVertical: 'top'}]}
            onFocus={onFocus}
            onBlur={onBlur}
            onChangeText={onChange}
            multiline={multiline}
            secureTextEntry={secureTextIntry}
          />
        </View>
      </View>
      {errorTextVisible && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
});

export default connect(mapStateProps, null)(AnimatedTextInput);

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY12,
  },
  placeholderContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholder: {
    position: 'absolute',
    marginHorizontal: 5,
    paddingHorizontal: 5,
    backgroundColor: COLORS.SECONDARY,
  },
  input: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 10,
  },
  errorText: {
    color: COLORS.PRIMARY12,
  },
});
