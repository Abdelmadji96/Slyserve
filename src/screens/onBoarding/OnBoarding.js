import React, {useRef} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Animated} from 'react-native';
import {Extrapolate} from 'react-native-reanimated';
import {connect} from 'react-redux';
import SlideImage1 from '../../assests/images/onBoarding/1.svg';
import SlideImage2 from '../../assests/images/onBoarding/2.svg';
import SlideImage3 from '../../assests/images/onBoarding/3.svg';
import {COLORS} from '../../constants/colors';
import {HEIGHT, WIDTH} from '../../constants/dimensions';
import {setApplication} from '../../redux/actions/application';

const slideImageHeight = HEIGHT / 3;
const slideImageWidth = WIDTH * 0.8;
const buttonHeight = HEIGHT / 10;
const dotSize = 12.5;

const OnBoarding = ({navigation, application, setOnBoarding}) => {
  const slides = [
    {
      title: application.language.data.SLIDE1_TITLE,
      description: application.language.data.SLIDE1_DESCRIPTION,
      image: SlideImage1,
    },
    {
      title: application.language.data.SLIDE2_TITLE,
      description: application.language.data.SLIDE2_DESCRIPTION,
      image: SlideImage2,
    },
    {
      title: application.language.data.SLIDE3_TITLE,
      description: application.language.data.SLIDE3_DESCRIPTION,
      image: SlideImage3,
    },
  ];

  const displaySlideImage = index => {
    switch (index) {
      case 0:
        return (
          <SlideImage1 height={slideImageHeight} width={slideImageWidth} />
        );
        break;
      case 1:
        return (
          <SlideImage2 height={slideImageHeight} width={slideImageWidth} />
        );
        break;
      case 2:
        return (
          <SlideImage3 height={slideImageHeight} width={slideImageWidth} />
        );
        break;

      default:
        break;
    }
  };

  const scrollX = new Animated.Value(0);
  const scrollRef = useRef();

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={WIDTH}
        style={styles.container}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}>
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.topContainer}>
              {(() => displaySlideImage(index))()}
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                if (index === slides.length - 1) {
                  await setOnBoarding({...application, onBoarding: false});
                  navigation.replace('Dashboard');
                } else {
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                      x: WIDTH * (index + 1),
                      animated: true,
                    });
                  }
                }
              }}>
              <Text style={styles.buttonText}>
                {index !== slides.length - 1
                  ? application.language.data.NEXT
                  : application.language.data.GET_STARTED}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </Animated.ScrollView>
      <View style={styles.pagination}>
        {slides.map((_, index) => {
          const inputRange = [index - 1, index, index + 1];
          const opacity = Animated.divide(scrollX, WIDTH).interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: Extrapolate.CLAMP,
          });
          const scale = Animated.divide(scrollX, WIDTH).interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: Extrapolate.CLAMP,
          });
          return (
            <Animated.View
              style={[
                styles.dot,
                {
                  opacity,
                  transform: [{scale}],
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
});

const mapDispatchProps = dispatch => ({
  setOnBoarding: application => dispatch(setApplication(application)),
});

export default connect(mapStateProps, mapDispatchProps)(OnBoarding);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    height: HEIGHT,
    width: WIDTH,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topContainer: {
    height: HEIGHT * 0.7,
    width: WIDTH,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.PRIMARY25,
    marginHorizontal: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.PRIMARY25,
    opacity: 0.4,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  button: {
    height: buttonHeight,
    width: WIDTH * 0.9,
    borderRadius: 15,
    backgroundColor: COLORS.PRIMARY12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: buttonHeight / 2,
    shadowColor: COLORS.PRIMARY12,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.SECONDARY,
  },
  pagination: {
    height: dotSize,
    width: 5 * dotSize,
    alignSelf: 'center',
    position: 'absolute',
    bottom: buttonHeight * 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dot: {
    height: dotSize,
    width: dotSize,
    borderRadius: dotSize,
    backgroundColor: COLORS.PRIMARY12,
  },
});
