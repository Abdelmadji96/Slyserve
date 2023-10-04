import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { connect } from 'react-redux';
import DrawerHiddenView from '../../../components/drawerHiddenView/DrawerHiddenView';
import { COLORS } from '../../../constants/colors';
import { HEIGHT, WIDTH } from '../../../constants/dimensions';
import { useTheme } from '../../../context/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { LANAGUAGES_LIST } from '../../../constants/languages';
import { fetchWilayas } from '../../../api/wilayas';
import { fetchCommunes } from '../../../api/communes';
import FilledAnimatedTextInput from '../../../components/input/FilledAnimatedTextInput';
import AnimatedTextInput from '../../../components/input/AnimatedTextInput';
import { Picker } from '@react-native-picker/picker';
import { patientEditProfile } from '../../../api/patients';
import { setUser } from '../../../redux/actions/user';

const inputHeight = HEIGHT / 12.5;
const inputWidth = WIDTH * 0.9;
const buttonHeight = HEIGHT / 10;

const EditInformations = ({
  navigation,
  application,
  user,
  token,
  updateUser,
}) => {
  const { drawer } = useTheme();
  const [wilayas, setWilayas] = useState(null);
  const [communes, setCommunes] = useState(null);
  const [address, setAddress] = useState(user?.nomRue);
  const [addressValidate, setAddressValidate] = useState(1);
  const [addressErrorVisible, setAddressErrorVisible] = useState(false);
  const [wilaya, setWilaya] = useState(user?.wilaya);
  const [commune, setCommune] = useState(user?.commune);
  const [email, setEmail] = useState(user?.email);
  const [emailValidate, setEmailValidate] = useState(1);
  const [emailErrorVisible, setEmailErrorVisible] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(user?.email);
  const [confirmEmailValidate, setConfirmEmailValidate] = useState(1);
  const [confirmEmailErrorVisible, setConfirmEmailErrorVisible] =
    useState(false);
  const [password, setPassword] = useState(null);
  const [passwordValidate, setPasswordValidate] = useState(0);
  const [passwordErrorVisible, setPasswordErrorVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [confirmPasswordValidate, setConfirmPasswordValidate] = useState(0);
  const [confirmPasswordErrorVisible, setConfirmPasswordErrorVisible] =
    useState(false);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const getWilayas = async () => {
    const response = await fetchWilayas();
    if (response) {
      setWilayas(response);
    }
  };

  // eslint-disable-next-line no-shadow
  const getCommunes = async (wilaya) => {
    const response = await fetchCommunes(wilaya);
    if (response) {
      setCommunes(response);
    }
  };

  const validate = (text, type) => {
    let alph = /^(?=.{5,10})/;
    switch (type) {
      case 'email':
        if (!emailErrorVisible) {
          setEmailErrorVisible(true);
        }
        if (confirmEmailValidate !== 3) {
          setConfirmEmailErrorVisible(true);
          setConfirmEmailValidate(3);
        }
        alph =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        text.length == 0
          ? setEmailValidate(0)
          : alph.test(text)
            ? setEmailValidate(1)
            : setEmailValidate(2);
        setEmail(text);
        if (text == confirmEmail) {
          setConfirmEmailErrorVisible(false);
          setConfirmEmailValidate(1);
        }
        break;

      case 'confirmEmail':
        if (!confirmEmailErrorVisible) {
          setConfirmEmailErrorVisible(true);
        }
        alph =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        text.length == 0
          ? setConfirmEmailValidate(0)
          : alph.test(text) && text == email
            ? setConfirmEmailValidate(1)
            : text == email
              ? setConfirmEmailValidate(2)
              : setConfirmEmailValidate(3);
        setConfirmEmail(text);
        break;

      case 'password':
        if (!passwordErrorVisible) {
          setPasswordErrorVisible(true);
        }
        if (confirmPasswordValidate !== 3) {
          setConfirmPasswordErrorVisible(true);
          setConfirmPasswordValidate(3);
        }
        text.length == 0
          ? setPasswordValidate(0)
          : alph.test(text)
            ? setPasswordValidate(1)
            : setPasswordValidate(2);
        setPassword(text);
        if (text == confirmPassword) {
          setConfirmPasswordErrorVisible(false);
          setConfirmPasswordValidate(1);
        }
        break;

      case 'confirmPassword':
        if (!confirmPasswordErrorVisible) {
          setConfirmPasswordErrorVisible(true);
        }
        text.length == 0
          ? setConfirmPasswordValidate(0)
          : alph.test(text) && text == password
            ? setConfirmPasswordValidate(1)
            : text == password
              ? setConfirmPasswordValidate(2)
              : setConfirmPasswordValidate(3);
        setConfirmPassword(text);
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

      default:
        break;
    }
  };

  const handleEditInformations = async () => {
    setLoadingModalVisible(true);
    try {
      const response = await patientEditProfile(
        address,
        wilaya,
        commune,
        confirmEmail,
        confirmPassword ? confirmPassword : '',
        token,
      );
      if (response['error']) {
        setLoadingModalVisible(false);
        Alert.alert(
          application.language.data.ALERT,
          application.language.ERROR_OCCURED,
        );
      } else {
        if (response['message'] == 'success') {
          await updateUser({
            ...user,
            wilaya: wilaya,
            commune: commune,
            email: confirmEmail,
            mot_de_passe: confirmPassword ? confirmPassword : user.mot_de_passe,
            nomRue: address,
          });
          setLoadingModalVisible(false);
          Alert.alert('', application.language.data.UPDATED_SUCCESSFULLY);
          navigation.goBack();
        }
      }
    } catch (error) {
      setLoadingModalVisible(false);
      Alert.alert(
        application.language.data.ALERT,
        application.language.ERROR_OCCURED,
      );
      console.log(error);
    }
  };

  const allValidate = () => {
    if (
      confirmEmailValidate == 1 ||
      confirmEmail !== user.email ||
      addressValidate == 1 ||
      address !== user.nomRue ||
      wilaya !== user.wilaya ||
      commune !== user.commune
    ) {
      handleEditInformations();
    } else {
      Alert.alert(
        application.language.data.ALERT,
        'No changes applied',
        //application.language.data.FILL_THE_FORM,
      );
      if (emailValidate !== 1) {
        setEmailErrorVisible(true);
        //scrollViewRef.current.scrollTo({y: 0});
      }
      if (confirmEmailValidate !== 1) {
        setConfirmEmailErrorVisible(true);
      }
      if (passwordValidate !== 1) {
        setPasswordErrorVisible(true);
      }
      if (confirmPasswordValidate !== 1) {
        setConfirmPasswordErrorVisible(true);
      }
      if (addressValidate !== 1) {
        setAddressErrorVisible(true);
      }
    }
  };

  useEffect(() => {
    getWilayas();
    getCommunes(user?.wilaya);
  }, [user?.wilaya]);

  return (
    <>
      <DrawerHiddenView />
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale: drawer.scale }],
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
            {application.language.data.MY_INFORMATIONS}
          </Text>
          <Feather
            name="edit"
            size={30}
            color={COLORS.PRIMARY12}
            onPress={() => navigation.navigate('EditInformations')}
          />
        </View>
        <ScrollView
          style={styles.bottomView}
          contentContainerStyle={{ padding: 10 }}>
          <Text />
          <FilledAnimatedTextInput
            inputHeight={HEIGHT / 12.5}
            inputWidth={WIDTH * 0.9}
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
          <Text />
          <FilledAnimatedTextInput
            inputHeight={HEIGHT / 12.5}
            inputWidth={WIDTH * 0.9}
            inputRadius={10}
            value={email}
            onChange={value => validate(value, 'email')}
            placeholder={application.language.data.EMAIL}
            multiline={false}
            errorText={
              emailValidate == 0
                ? application.language.data.ENTER_EMAIL
                : emailValidate == 2 && application.language.data.INVALID_EMAIL
            }
            errorTextVisible={emailErrorVisible}
          />
          <Text />
          <FilledAnimatedTextInput
            inputHeight={HEIGHT / 12.5}
            inputWidth={WIDTH * 0.9}
            inputRadius={10}
            value={confirmEmail}
            onChange={value => validate(value, 'confirmEmail')}
            placeholder={application.language.data.CONFIRM_EMAIL}
            multiline={false}
            errorText={
              confirmEmailValidate == 0
                ? application.language.data.ENTER_EMAIL
                : confirmEmailValidate == 2
                  ? application.language.data.INVALID_EMAIL
                  : confirmEmailValidate == 3 &&
                  application.language.data.EMAIL_DONT_MATCH
            }
            errorTextVisible={confirmEmailErrorVisible}
          />
          <Text />
          <AnimatedTextInput
            inputHeight={HEIGHT / 12.5}
            inputWidth={WIDTH * 0.9}
            inputRadius={10}
            value={password}
            onChange={value => validate(value, 'password')}
            placeholder={application.language.data.PASSWORD}
            multiline={false}
            secureTextIntry={true}
            errorText={
              passwordValidate == 0
                ? application.language.data.ENTER_PASSWORD
                : passwordValidate == 2 &&
                application.language.data.INVALID_PASSWORD
            }
            errorTextVisible={passwordErrorVisible}
          />
          <Text />
          <AnimatedTextInput
            inputHeight={HEIGHT / 12.5}
            inputWidth={WIDTH * 0.9}
            inputRadius={10}
            value={confirmPassword}
            onChange={value => validate(value, 'confirmPassword')}
            placeholder={application.language.data.CONFIRM_PASSWORD}
            multiline={false}
            secureTextIntry={true}
            errorText={
              confirmPasswordValidate == 0
                ? application.language.data.ENTER_PASSWORD
                : confirmPasswordValidate == 2
                  ? application.language.data.INVALID_PASSWORD
                  : confirmPasswordValidate == 3 &&
                  application.language.data.PASSWORD_DONT_MATCH
            }
            errorTextVisible={confirmPasswordErrorVisible}
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
                  }
                }}>
                {wilayas &&
                  wilayas.map(wilaya => (
                    <Picker.Item
                      key={wilaya.id.toString()}
                      value={wilaya.id}
                      label={
                        wilaya.id +
                        ' - ' +
                        `${application.language.key == LANAGUAGES_LIST.ARABIC
                          ? wilaya.nom_ar
                          : wilaya.nom_fr
                        }`
                      }
                    />
                  ))}
              </Picker>
            </View>
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
                  }
                }}>
                {communes &&
                  communes.map(commune => (
                    <Picker.Item
                      key={commune.id.toString()}
                      value={commune.id}
                      label={
                        wilaya +
                        ' - ' +
                        `${application.language.key == LANAGUAGES_LIST.ARABIC
                          ? commune.nom_ar
                          : commune.nom_fr
                        }`
                      }
                    />
                  ))}
              </Picker>
            </View>
          </View>
          <Text />
          <TouchableOpacity style={styles.button} onPress={allValidate}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <Text />
        </ScrollView>
        <Modal transparent={true} visible={loadingModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.loadingModal}>
              {application.language.key == LANAGUAGES_LIST.ARABIC && (
                <ActivityIndicator size={WIDTH / 10} color={COLORS.PRIMARY12} />
              )}
              <Text style={styles.loadingText}>
                {application.language.data.UPDATING}
              </Text>
              {application.language.key !== LANAGUAGES_LIST.ARABIC && (
                <ActivityIndicator size={WIDTH / 10} color={COLORS.PRIMARY12} />
              )}
            </View>
          </View>
        </Modal>
      </Animated.View>
    </>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
  user: store.userState.currentUser,
  token: store.userState.token,
});

const mapDispatchProps = dispatch => ({
  updateUser: user => dispatch(setUser(user)),
});

export default connect(mapStateProps, mapDispatchProps)(EditInformations);

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
  bottomView: { flex: 1 },
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
  pickerIcon: { marginHorizontal: 10 },
  button: {
    height: buttonHeight,
    width: WIDTH * 0.9,
    borderRadius: 15,
    backgroundColor: COLORS.PRIMARY12,
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
    fontFamily: 'Poppins-Regular',
  },
});
