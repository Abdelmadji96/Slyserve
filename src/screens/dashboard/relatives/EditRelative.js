import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import {COLORS} from '../../../constants/colors';
import {HEIGHT, WIDTH} from '../../../constants/dimensions';
import {useTheme} from '../../../context/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import DrawerHiddenView from '../../../components/drawerHiddenView/DrawerHiddenView';
import FilledAnimatedTextInput from '../../../components/input/FilledAnimatedTextInput';
import {Picker} from '@react-native-picker/picker';
import {isValidPhoneNumber} from 'libphonenumber-js';
import {LANAGUAGES_LIST} from '../../../constants/languages';
import DatePicker from 'react-native-date-picker';
import {fetchCommunes} from '../../../api/communes';
import {fetchWilayas} from '../../../api/wilayas';
import {patientUpdateRelative} from '../../../api/patients';

const gendersData = [
  {
    id: 1,
    gender: 'Male',
    nameAR: 'ذكر',
    nameFR: 'Home',
    nameEN: 'Male',
  },
  {
    id: 2,
    gender: 'Female',
    nameAR: 'أنثى',
    nameFR: 'Femme',
    nameEN: 'Female',
  },
];

const inputHeight = HEIGHT / 12.5;
const inputWidth = WIDTH * 0.9;
const buttonHeight = HEIGHT / 10;

const maximumDate = () => {
  let today = new Date();
  let maximumYear = today.getFullYear() - 18;
  let month = today.getMonth();
  let day = today.getDate();
  return new Date(maximumYear, month, day);
};

const minimumDate = () => {
  let today = new Date();
  let minimumYear = today.getFullYear() - 150;
  let month = today.getMonth();
  let day = today.getDate();
  return new Date(minimumYear, month, day);
};

const displayDate = date => {
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let month =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let year = date.getFullYear();
  return year + '-' + month + '-' + day;
};

const EditRelative = ({navigation, route, application, user, role, token}) => {
  const {drawer} = useTheme();
  const [firstName, setFirstName] = useState(route.params.relative.prenom);
  const [firstNameValidate, setFirstNameValidate] = useState(1);
  const [firstNameErrorVisible, setFirstNameErrorVisible] = useState(false);
  const [lastName, setLastName] = useState(route.params.relative.nom);
  const [lastNameValidate, setLastNameValidate] = useState(1);
  const [lastNameErrorVisible, setLastNameErrorVisible] = useState(false);
  const [gender, setGender] = useState(
    route.params.relative.genre == 'H' ? 1 : 2,
  );
  const [genderErrorVisible, setGenderErrorVisible] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(
    new Date(route.params.relative.date_de_naissance),
  );
  const [address, setAddress] = useState(route.params.relative.nom_de_rue);
  const [addressValidate, setAddressValidate] = useState(1);
  const [addressErrorVisible, setAddressErrorVisible] = useState(false);
  // const [phone, setPhone] = useState(route.params.relative.telephone);
  // const [phoneValidate, setPhoneValidate] = useState(1);
  // const [phoneErrorVisible, setPhoneErrorVisible] = useState(false);
  const [wilaya, setWilaya] = useState(route.params.relative.wilaya_id);
  const [wilayaErrorVisible, setWilayaErrorVisible] = useState(false);
  const [commune, setCommune] = useState(route.params.relative.commune_id);
  const [communeErrorVisible, setCommuneErrorVisible] = useState(false);
  const [datePickerOpened, setDatePickerOpened] = useState(false);
  const [wilayas, setWilayas] = useState(null);
  const [communes, setCommunes] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const scrollViewRef = useRef();

  const validate = (text, type) => {
    let alph = /^(?=.{5,10})/;
    switch (type) {
      case 'firstName':
        if (!firstNameErrorVisible) {
          setFirstNameErrorVisible(true);
        }
        text.length == 0
          ? setFirstNameValidate(0)
          : alph.test(text)
          ? setFirstNameValidate(1)
          : setFirstNameValidate(2);
        setFirstName(text);
        break;

      case 'lastName':
        if (!lastNameErrorVisible) {
          setLastNameErrorVisible(true);
        }
        text.length == 0
          ? setLastNameValidate(0)
          : alph.test(text)
          ? setLastNameValidate(1)
          : setLastNameValidate(2);
        setLastName(text);
        break;

      case 'address':
        if (!addressErrorVisible) {
          setAddressErrorVisible(true);
        }
        text.length == 0
          ? setAddressValidate(0)
          : alph.test(text)
          ? setAddressValidate(1)
          : setAddressValidate(2);
        setAddress(text);
        break;

      // case 'phone':
      //   if (!phoneErrorVisible) {
      //     setPhoneErrorVisible(true);
      //   }
      //   text.length == 0
      //     ? setPhoneValidate(0)
      //     : isValidPhoneNumber('+213 ' + text, 'DZ')
      //     ? setPhoneValidate(1)
      //     : setPhoneValidate(2);
      //   setPhone(text);
      //   break;

      default:
        break;
    }
  };

  const handleUpdateRelative = async () => {
    setModalVisible(true);
    try {
      const response = await patientUpdateRelative(
        route.params.relative.id,
        firstName,
        lastName,
        displayDate(dateOfBirth),
        gender == 1 ? 'H' : 'F',
        address,
        //phone,
        wilaya,
        commune,
        token,
      );
      if (response) {
        if (response['message'] == 'success') {
          setModalVisible(false);
          Alert.alert('', application.language.data.UPDATED_SUCCESSFULY);
          navigation.goBack();
        } else {
          setModalVisible(false);
          Alert.alert(
            application.language.data.ALERT,
            application.language.data.ERROR_OCCURED,
          );
        }
      } else {
        setModalVisible(false);
        Alert.alert(
          application.language.data.ALERT,
          application.language.data.ERROR_OCCURED,
        );
      }
    } catch (error) {
      setModalVisible(false);
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.ERROR_OCCURED,
      );
      console.log(error);
    }
  };

  const isGenderChanged = () => {
    let changed = false;
    if (route.params.relative.genre == 'H') {
      if (gender == 2) {
        changed = true;
      }
    } else {
      if (gender == 1) {
        changed = true;
      }
    }
    return changed;
  };

  const allValidate = () => {
    if (
      firstNameValidate == 1 &&
      lastNameValidate == 1 &&
      addressValidate == 1
      // &&
      // phoneValidate == 1
    ) {
      if (
        firstName == route.params.relative.prenom &&
        lastName == route.params.relative.nom &&
        !isGenderChanged() &&
        address == route.params.relative.nom_de_rue &&
        //phone == route.params.relative.telephone &&
        wilaya == route.params.relative.wilaya_id &&
        commune == route.params.relative.commune_id &&
        displayDate(dateOfBirth) ==
          displayDate(new Date(route.params.relative.date_de_naissance))
      ) {
        Alert.alert('', 'No changes applied');
      } else {
        handleUpdateRelative();
      }
    } else {
      Alert.alert(
        application.language.data.WARNING,
        application.language.data.FILL_THE_FORM,
      );
      if (lastNameValidate !== 1) {
        setLastNameErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (firstNameValidate !== 1) {
        setFirstNameErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (gender == 0) {
        setGenderErrorVisible(true);
      }
      if (addressValidate !== 1) {
        setAddressErrorVisible(true);
      }
      // if (phoneValidate !== 1) {
      //   setPhoneErrorVisible(true);
      //   scrollViewRef.current.scrollTo({y: 0});
      // }
      if (wilaya == 0) {
        setWilayaErrorVisible(true);
      }
      if (commune == 0) {
        setCommuneErrorVisible(true);
      }
    }
  };

  const displayValue = item => {
    switch (application.language.key) {
      case LANAGUAGES_LIST.ARABIC:
        return item.nameAR;
        break;

      case LANAGUAGES_LIST.FRENCH:
        return item.nameFR;
        break;

      case LANAGUAGES_LIST.ENGLISH:
        return item.nameEN;
        break;

      default:
        break;
    }
  };

  const getWilayas = async () => {
    const response = await fetchWilayas();
    if (response) {
      setWilayas(response);
    }
  };

  const getCommunes = async wilaya_id => {
    const response = await fetchCommunes(wilaya_id);
    if (response) {
      setCommunes(response);
    }
  };

  useEffect(() => {
    getWilayas();
    getCommunes(route.params.relative.wilaya_id);
  }, []);

  return (
    <>
      <DrawerHiddenView />
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{scale: drawer.scale}],
            borderBottomLeftRadius: drawer.radius,
            borderTopLeftRadius: drawer.radius,
          },
        ]}>
        <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={35}
            color={COLORS.PRIMARY12}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>
            {application.language.data.MY_RELATIVES}
          </Text>
          <Feather
            name="save"
            size={30}
            color={COLORS.PRIMARY12}
            //onPress={allValidate}
          />
        </View>
        <View style={styles.bottomView}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{
              alignItems: 'center',
              paddingBottom: buttonHeight * 2,
              paddingHorizontal: (WIDTH - inputWidth) / 2,
            }}>
            <Text />
            <FilledAnimatedTextInput
              inputHeight={inputHeight}
              inputWidth={inputWidth}
              inputRadius={10}
              value={firstName}
              onChange={value => validate(value, 'firstName')}
              placeholder={application.language.data.FIRST_NAME}
              multiline={false}
              secureTextIntry={false}
              errorText={
                firstNameValidate == 0
                  ? application.language.data.ENTER_FIRST_NAME
                  : firstNameValidate == 2 &&
                    application.language.data.INVALID_FIRST_NAME
              }
              errorTextVisible={firstNameErrorVisible}
            />
            <Text />
            <FilledAnimatedTextInput
              inputHeight={inputHeight}
              inputWidth={inputWidth}
              inputRadius={10}
              value={lastName}
              onChange={value => validate(value, 'lastName')}
              placeholder={application.language.data.LAST_NAME}
              multiline={false}
              secureTextIntry={false}
              errorText={
                lastNameValidate == 0
                  ? application.language.data.ENTER_LAST_NAME
                  : lastNameValidate == 2 &&
                    application.language.data.INVALID_LAST_NAME
              }
              errorTextVisible={lastNameErrorVisible}
            />
            <Text />
            <FilledAnimatedTextInput
              inputHeight={inputHeight}
              inputWidth={inputWidth}
              inputRadius={10}
              value={address}
              onChange={value => validate(value, 'address')}
              placeholder={application.language.data.ADDRESS}
              multiline={false}
              errorText={
                addressValidate == 0
                  ? application.language.data.ENTER_ADDRESS
                  : addressValidate == 2 &&
                    application.language.data.INVALID_ADDRESS
              }
              errorTextVisible={addressErrorVisible}
            />
            {/* <Text />
            <FilledAnimatedTextInput
              inputHeight={HEIGHT / 12.5}
              inputWidth={WIDTH * 0.9}
              inputRadius={10}
              value={phone}
              onChange={value => validate(value, 'phone')}
              placeholder={application.language.data.PHONE}
              multiline={false}
              errorText={
                phoneValidate == 0
                  ? application.language.data.ENTER_PHONE
                  : phoneValidate == 2 &&
                    application.language.data.INVALID_PHONE
              }
              errorTextVisible={phoneErrorVisible}
            /> */}
            <Text />
            <View style={styles.pickerContainer}>
              <View style={styles.picker}>
                <MaterialCommunityIcons
                  name="gender-male-female"
                  color={COLORS.PRIMARY12}
                  size={25}
                  style={styles.pickerIcon}
                />
                <Picker
                  selectedValue={gender}
                  style={{
                    flex: 1,
                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    if (gender !== itemValue) {
                      setGender(itemValue);
                      if (genderErrorVisible) {
                        setGenderErrorVisible(false);
                      }
                    }
                  }}>
                  <Picker.Item
                    label={(() => {
                      switch (application.language.key) {
                        case LANAGUAGES_LIST.ARABIC:
                          return 'حدد جنسك';
                          break;
                        case LANAGUAGES_LIST.FRENCH:
                          return 'Sélectionnez votre sexe';
                          break;
                        case LANAGUAGES_LIST.ENGLISH:
                          return 'Select your gender';
                          break;

                        default:
                          break;
                      }
                    })()}
                    value={0}
                    style={{textAlign: 'left'}}
                    enabled={false}
                  />
                  {gendersData.map(gender => (
                    <Picker.Item
                      key={gender.id.toString()}
                      label={displayValue(gender)}
                      value={gender.id}
                    />
                  ))}
                </Picker>
              </View>
              {genderErrorVisible && (
                <Text style={styles.errorText}>
                  {application.language.data.SELECT_GENDER}
                </Text>
              )}
            </View>
            <Text />
            <TouchableOpacity
              style={styles.datePicker}
              activeOpacity={1}
              onPress={() => setDatePickerOpened(true)}>
              <Feather
                name="calendar"
                size={25}
                color={COLORS.PRIMARY12}
                style={styles.pickerIcon}
              />
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{displayDate(dateOfBirth)}</Text>
                <Ionicons
                  name="caret-down-sharp"
                  color={COLORS.PRIMARY25}
                  size={12.5}
                  style={[styles.pickerIcon, {opacity: 0.55}]}
                />
              </View>
            </TouchableOpacity>
            <Text />
            <DatePicker
              modal
              open={datePickerOpened}
              date={dateOfBirth}
              mode="date"
              maximumDate={maximumDate()}
              minimumDate={minimumDate()}
              onConfirm={date => {
                setDatePickerOpened(false);
                setDateOfBirth(date);
              }}
              onCancel={() => {
                setDatePickerOpened(false);
              }}
            />
            <Text />
            <View style={styles.pickerContainer}>
              <View style={styles.picker}>
                <Ionicons
                  name="trail-sign-outline"
                  color={COLORS.PRIMARY12}
                  size={25}
                  style={styles.pickerIcon}
                />
                <Picker
                  enabled={wilayas !== null}
                  selectedValue={wilaya}
                  style={{
                    flex: 1,
                    textAlign: 'left',
                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    if (wilaya !== itemValue) {
                      setWilaya(itemValue);
                      getCommunes(itemValue);
                      if (wilayaErrorVisible) {
                        setWilayaErrorVisible(false);
                      }
                    }
                  }}>
                  <Picker.Item
                    label={(() => {
                      switch (application.language.key) {
                        case LANAGUAGES_LIST.ARABIC:
                          return 'حدد ولايتك';
                          break;
                        case LANAGUAGES_LIST.FRENCH:
                          return 'Sélectionnez votre wilaya';
                          break;
                        case LANAGUAGES_LIST.ENGLISH:
                          return 'Select your city';
                          break;

                        default:
                          break;
                      }
                    })()}
                    enabled={false}
                  />
                  {wilayas &&
                    wilayas.map(wilaya => (
                      <Picker.Item
                        key={wilaya.id.toString()}
                        value={wilaya.id}
                        label={
                          wilaya.id +
                          ' - ' +
                          `${
                            application.language.key == LANAGUAGES_LIST.ARABIC
                              ? wilaya.nom_ar
                              : wilaya.nom_fr
                          }`
                        }
                      />
                    ))}
                </Picker>
              </View>
              {wilayaErrorVisible && (
                <Text style={styles.errorText}>
                  {application.language.data.SELECT_CITY}
                </Text>
              )}
            </View>
            <Text />
            <View style={styles.pickerContainer}>
              <View style={styles.picker}>
                <MaterialCommunityIcons
                  name="city-variant-outline"
                  color={COLORS.PRIMARY12}
                  size={25}
                  style={styles.pickerIcon}
                />
                <Picker
                  enabled={communes !== null}
                  selectedValue={commune}
                  style={{
                    flex: 1,
                    textAlign: 'left',
                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    if (commune !== itemValue) {
                      setCommune(itemValue);
                      if (communeErrorVisible) {
                        setCommuneErrorVisible(false);
                      }
                    }
                  }}>
                  <Picker.Item
                    label={(() => {
                      switch (application.language.key) {
                        case LANAGUAGES_LIST.ARABIC:
                          return 'حدد بلديتك';
                          break;
                        case LANAGUAGES_LIST.FRENCH:
                          return 'Sélectionnez votre commune';
                          break;
                        case LANAGUAGES_LIST.ENGLISH:
                          return 'Select your commune';
                          break;
                        default:
                          break;
                      }
                    })()}
                    enabled={false}
                  />
                  {communes &&
                    communes.map(commune => (
                      <Picker.Item
                        key={commune.id.toString()}
                        value={commune.id}
                        label={
                          wilaya +
                          ' - ' +
                          `${
                            application.language.key == LANAGUAGES_LIST.ARABIC
                              ? commune.nom_ar
                              : commune.nom_fr
                          }`
                        }
                      />
                    ))}
                </Picker>
              </View>
              {communeErrorVisible && (
                <Text style={styles.errorText}>
                  {application.language.data.SELECT_COMMUNE}
                </Text>
              )}
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={allValidate}>
            <Text style={styles.buttonText}>
              {application.language.data.EDIT}
            </Text>
          </TouchableOpacity>
          <Modal transparent={true} visible={modalVisible}>
            <View style={styles.modalContainer}>
              <View style={styles.loadingModal}>
                {application.language.key == LANAGUAGES_LIST.ARABIC && (
                  <ActivityIndicator
                    size={WIDTH / 10}
                    color={COLORS.PRIMARY12}
                  />
                )}
                <Text style={styles.loadingText}>
                  {application.language.data.UPDATING}
                </Text>
                {application.language.key !== LANAGUAGES_LIST.ARABIC && (
                  <ActivityIndicator
                    size={WIDTH / 10}
                    color={COLORS.PRIMARY12}
                  />
                )}
              </View>
            </View>
          </Modal>
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

export default connect(mapStateProps, null)(EditRelative);

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
    justifyContent: 'center',
  },
  pickerContainer: {
    width: inputWidth,
    alignSelf: 'center',
  },
  picker: {
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY12,
  },
  pickerIcon: {marginHorizontal: 10},
  datePicker: {
    height: 52.5,
    width: inputWidth,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY12,
    //backgroundColor: COLORS.UNDERLAY,
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 7.5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY25,
    opacity: 0.8,
  },
  button: {
    height: buttonHeight,
    width: WIDTH * 0.9,
    borderRadius: 15,
    backgroundColor: COLORS.PRIMARY12,
    position: 'absolute',
    bottom: buttonHeight / 2,
    alignSelf: 'center',
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
  errorText: {
    color: COLORS.PRIMARY12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingModal: {
    height: HEIGHT / 10,
    width: WIDTH * 0.95,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
