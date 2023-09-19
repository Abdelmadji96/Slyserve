import {Dimensions} from 'react-native';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const ASPECT_RATIO = HEIGHT / WIDTH;

//const BOTTOM_TABS_NAVIGATOR_HEIGHT = HEIGHT / 10;

export {
  HEIGHT,
  WIDTH,
  ASPECT_RATIO,
  //BOTTOM_TABS_NAVIGATOR_HEIGHT,
};