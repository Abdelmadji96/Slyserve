import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import {useTheme} from '../../context/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../constants/colors';
import {HEIGHT, WIDTH} from '../../constants/dimensions';
import {
  LANAGUAGES_LIST,
  LANGUAGES,
  LANGUAGES_ARRAY,
} from '../../constants/languages';
import {setApplication} from '../../redux/actions/application';
import DrawerHiddenView from '../../components/drawerHiddenView/DrawerHiddenView';

const languageItemHeight = 50;
const languageImageSize = 35;

const ClangeLanguage = ({navigation, application, setLanguage}) => {
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
          <Text style={styles.headerTitle}>Language</Text>
          <View />
        </View>
        <View style={styles.subcontainer}>
          <Text style={styles.title}>
            {application.language.data.CHOOSE_LANGUAGE}
          </Text>
          <View style={styles.languagesContainer}>
            {LANGUAGES_ARRAY.map((item, index) => (
              <TouchableOpacity
                style={
                  application.language.key == item.name
                    ? [
                        styles.languageItemContainer,
                        styles.selectedLanguageItemContainer,
                      ]
                    : styles.languageItemContainer
                }
                onPress={() => {
                  switch (item.name) {
                    case LANAGUAGES_LIST.ARABIC:
                      setLanguage({
                        ...application,
                        language: {
                          key: LANAGUAGES_LIST.ARABIC,
                          data: LANGUAGES.AR,
                        },
                      });
                      break;

                    case LANAGUAGES_LIST.FRENCH:
                      setLanguage({
                        ...application,
                        language: {
                          key: LANAGUAGES_LIST.FRENCH,
                          data: LANGUAGES.FR,
                        },
                      });
                      break;

                    case LANAGUAGES_LIST.ENGLISH:
                      setLanguage({
                        ...application,
                        language: {
                          key: LANAGUAGES_LIST.ENGLISH,
                          data: LANGUAGES.EN,
                        },
                      });
                      break;

                    default:
                      break;
                  }
                }}>
                <Image source={item.image} style={styles.languageItemImage} />
                <Text
                  style={
                    application.language.key == item.name
                      ? [
                          styles.languageItemText,
                          styles.selectedLanguageItemText,
                        ]
                      : styles.languageItemText
                  }>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
});

const mapDispatchProps = dispatch => ({
  setLanguage: application => dispatch(setApplication(application)),
});

export default connect(mapStateProps, mapDispatchProps)(ClangeLanguage);

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
    fontFamily: 'Poppins-Regular',
    color: COLORS.PRIMARY12,
  },
  subcontainer: {
    height: HEIGHT - HEIGHT / 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    color: COLORS.PRIMARY25,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: HEIGHT / 15,
  },
  languagesContainer: {height: HEIGHT / 3, justifyContent: 'space-between'},
  languageItemContainer: {
    height: languageItemHeight,
    width: WIDTH * 0.9,
    borderRadius: 10,
    backgroundColor: COLORS.SECONDARY,
    marginTop: HEIGHT / 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  selectedLanguageItemContainer: {
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
  languageItemImage: {
    height: languageImageSize,
    width: languageImageSize,
    borderRadius: languageImageSize,
  },
  languageItemText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Mulish-Regular',
    color: COLORS.PRIMARY25,
    opacity: 0.8,
  },
  selectedLanguageItemText: {
    color: COLORS.SECONDARY,
  },
});
