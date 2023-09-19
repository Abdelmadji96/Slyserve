import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import logo from '../../assests/logos/logo.png';
import {HEIGHT, WIDTH} from '../../constants/dimensions';
import {COLORS} from '../../constants/colors';
import {
  LANAGUAGES_LIST,
  LANGUAGES_ARRAY,
  LANGUAGES,
} from '../../constants/languages';
import {setApplication} from '../../redux/actions/application';
import {connect} from 'react-redux';

const logoSize = WIDTH / 3;
const languageItemHeight = 50;
const languageImageSize = 35;
const buttonHeight = HEIGHT / 10;

const LanguageChoice = ({navigation, application, setLanguage}) => {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="cover" />
      <Text style={styles.title}>
        {application.language.data.CHOOSE_LANGUAGE}
      </Text>
      <View style={styles.languageItemsContainer}>
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
                    language: {key: LANAGUAGES_LIST.ARABIC, data: LANGUAGES.AR},
                  });
                  break;

                case LANAGUAGES_LIST.FRENCH:
                  setLanguage({
                    ...application,
                    language: {key: LANAGUAGES_LIST.FRENCH, data: LANGUAGES.FR},
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
                  ? [styles.languageItemText, styles.selectedLanguageItemText]
                  : styles.languageItemText
              }>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('OnBoarding')}>
        <Text style={styles.buttonText}>{application.language.data.NEXT}</Text>
      </TouchableOpacity>
    </View>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
});

const mapDispatchProps = dispatch => ({
  setLanguage: application => dispatch(setApplication(application)),
});

export default connect(mapStateProps, mapDispatchProps)(LanguageChoice);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  logo: {
    height: logoSize,
    width: logoSize,
    borderRadius: logoSize,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY25,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: HEIGHT / 15,
  },
  languageItemsContainer: {
    height: HEIGHT / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    color: COLORS.BLUE_TEXT,
    opacity: 0.8,
  },
  selectedLanguageItemText: {
    color: COLORS.SECONDARY,
  },
  button: {
    height: buttonHeight,
    width: WIDTH * 0.9,
    borderRadius: 15,
    backgroundColor: COLORS.PRIMARY12,
    alignItems: 'center',
    justifyContent: 'center',
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
});
