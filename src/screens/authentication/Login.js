import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {COLORS} from '../../constants/colors';
import {useTheme} from '../../context/theme';
import {connect} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {HEIGHT, WIDTH} from '../../constants/dimensions';
import AnimatedTextInput from '../../components/input/AnimatedTextInput';
import {isValidPhoneNumber} from 'libphonenumber-js';
import DrawerHiddenView from '../../components/drawerHiddenView/DrawerHiddenView';
import {USER_ROLES} from '../../constants/user';
import {patientLogin} from '../../api/patients';
import {LANAGUAGES_LIST} from '../../constants/languages';
import {signIn} from '../../redux/actions/user';
import {doctorLogin} from '../../api/doctors';
import {paramedicalLogin} from '../../api/paramedicals';
import {clinicHospitalLogin} from '../../api/clinics';
import {pharmacyLogin} from '../../api/pharmacies';
import {StackActions} from '@react-navigation/native';
import {bloodDonorLogin} from '../../api/bloodDonors';
import {ambulanceLogin} from '../../api/ambulances';
import {laboratoryLogin} from '../../api/laboratories';

const buttonHeight = HEIGHT / 10;
const logoSize = WIDTH / 3;

const Login = ({navigation, route, application, login}) => {
  const {drawer} = useTheme();
  const [phoneEmail, setPhoneEmail] = useState('');
  const [phoneEmailValidate, setPhoneEmailValidate] = useState(0);
  const [phoneEmailErrorVisible, setPhoneEmailErrorVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordValidate, setPasswordValidate] = useState(0);
  const [passwordErrorVisible, setPasswordErrorVisible] = useState(false);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const validate = (text, type) => {
    let alph = /^(?=.{5,10})/;
    switch (type) {
      case 'phoneEmail':
        if (!phoneEmailErrorVisible) {
          setPhoneEmailErrorVisible(true);
        }
        alph =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        text.length == 0
          ? setPhoneEmailValidate(0)
          : alph.test(text) || isValidPhoneNumber('+213 ' + text, 'DZ')
          ? setPhoneEmailValidate(1)
          : setPhoneEmailValidate(2);
        setPhoneEmail(text);
        break;

      case 'password':
        if (!passwordErrorVisible) {
          setPasswordErrorVisible(true);
        }
        text.length == 0
          ? setPasswordValidate(0)
          : alph.test(text)
          ? setPasswordValidate(1)
          : setPasswordValidate(2);
        setPassword(text);
        break;

      default:
        break;
    }
  };

  const allValidate = async () => {
    if (phoneEmailValidate == 1 && passwordValidate == 1) {
      setLoadingModalVisible(true);
      var response;
      try {
        switch (route.params.choice) {
          case USER_ROLES.PATIENT:
            response = await patientLogin(phoneEmail, password);
            if (response) {
              if (response['particulier']) {
                await login(
                  response['particulier'],
                  response['token'],
                  USER_ROLES.PATIENT,
                );
                setLoadingModalVisible(false);
                const popAction = StackActions.pop(1);
                navigation.dispatch(popAction);
                navigation.goBack();
              } else {
                setLoadingModalVisible(false);
                switch (response['message']) {
                  case 'Email incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.USER_DOESNT_EXIST,
                    );
                    break;
                  case 'Email ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;

                  case 'Telephone ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;
                  default:
                    break;
                }
              }
            } else {
              setLoadingModalVisible(false);
              Alert.alert(
                application.language.data.ALERT,
                application.language.data.ERROR_OCCURED,
              );
            }
            break;
          case USER_ROLES.DOCTOR:
            response = await doctorLogin(phoneEmail, password);
            if (response) {
              if (response['medecin']) {
                await login(
                  response['medecin'],
                  response['token'],
                  USER_ROLES.DOCTOR,
                );
                setLoadingModalVisible(false);
                const popAction = StackActions.pop(2);
                navigation.dispatch(popAction);
                navigation.goBack();
              } else {
                setLoadingModalVisible(false);
                switch (response['message']) {
                  case 'Email incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.USER_DOESNT_EXIST,
                    );
                    break;
                  case 'Email ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;

                  case 'Telephone ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;
                  default:
                    break;
                }
              }
            } else {
              setLoadingModalVisible(false);
              Alert.alert(
                application.language.data.ALERT,
                application.language.data.ERROR_OCCURED,
              );
            }
            break;
          case USER_ROLES.PARAMEDICAL:
            response = await paramedicalLogin(phoneEmail, password);
            if (response) {
              if (response['paramedical']) {
                await login(
                  response['paramedical'],
                  response['token'],
                  USER_ROLES.PARAMEDICAL,
                );
                setLoadingModalVisible(false);
                const popAction = StackActions.pop(2);
                navigation.dispatch(popAction);
                navigation.goBack();
              } else {
                setLoadingModalVisible(false);
                switch (response['message']) {
                  case 'Email incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.USER_DOESNT_EXIST,
                    );
                    break;
                  case 'Email ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;

                  case 'Telephone ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;
                  default:
                    break;
                }
              }
            } else {
              setLoadingModalVisible(false);
              Alert.alert(
                application.language.data.ALERT,
                application.language.data.ERROR_OCCURED,
              );
            }
            break;
          case USER_ROLES.CLINIC_HOSPITAL:
            response = await clinicHospitalLogin(phoneEmail, password);
            if (response) {
              if (response['clinique']) {
                await login(
                  response['clinique'],
                  response['token'],
                  USER_ROLES.CLINIC_HOSPITAL,
                );
                setLoadingModalVisible(false);
                const popAction = StackActions.pop(2);
                navigation.dispatch(popAction);
                navigation.goBack();
              } else {
                setLoadingModalVisible(false);
                switch (response['message']) {
                  case 'Email incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.USER_DOESNT_EXIST,
                    );
                    break;
                  case 'Email ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;

                  case 'Telephone ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;
                  default:
                    break;
                }
              }
            } else {
              setLoadingModalVisible(false);
              Alert.alert(
                application.language.data.ALERT,
                application.language.data.ERROR_OCCURED,
              );
            }
            break;
          case USER_ROLES.LABORATORY:
            response = await laboratoryLogin(phoneEmail, password);
            if (response) {
              if (response['laboratoire']) {
                await login(
                  response['laboratoire'],
                  response['token'],
                  USER_ROLES.LABORATORY,
                );
                setLoadingModalVisible(false);
                const popAction = StackActions.pop(2);
                navigation.dispatch(popAction);
                navigation.goBack();
              } else {
                setLoadingModalVisible(false);
                switch (response['message']) {
                  case 'Email incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.USER_DOESNT_EXIST,
                    );
                    break;
                  case 'Email ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;

                  case 'Telephone ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;
                  default:
                    break;
                }
              }
            } else {
              setLoadingModalVisible(false);
              Alert.alert(
                application.language.data.ALERT,
                application.language.data.ERROR_OCCURED,
              );
            }
            break;
          case USER_ROLES.PHARMACY:
            response = await pharmacyLogin(phoneEmail, password);
            if (response) {
              if (response['pharmacie']) {
                await login(
                  response['pharmacie'],
                  response['token'],
                  USER_ROLES.PHARMACY,
                );
                setLoadingModalVisible(false);
                const popAction = StackActions.pop(2);
                navigation.dispatch(popAction);
                navigation.goBack();
              } else {
                setLoadingModalVisible(false);
                switch (response['message']) {
                  case 'Email incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.USER_DOESNT_EXIST,
                    );
                    break;
                  case 'Email ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;

                  case 'Telephone ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;
                  default:
                    break;
                }
              }
            } else {
              setLoadingModalVisible(false);
              Alert.alert(
                application.language.data.ALERT,
                application.language.data.ERROR_OCCURED,
              );
            }
            break;
          case USER_ROLES.AMBULANCE:
            response = await ambulanceLogin(phoneEmail, password);
            if (response) {
              if (response['ambulance']) {
                await login(
                  response['ambulance'],
                  response['token'],
                  USER_ROLES.AMBULANCE,
                );
                setLoadingModalVisible(false);
                const popAction = StackActions.pop(2);
                navigation.dispatch(popAction);
                navigation.goBack();
              } else {
                setLoadingModalVisible(false);
                switch (response['message']) {
                  case 'Email incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.USER_DOESNT_EXIST,
                    );
                    break;
                  case 'Email ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;

                  case 'Telephone ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;
                  default:
                    break;
                }
              }
            } else {
              setLoadingModalVisible(false);
              Alert.alert(
                application.language.data.ALERT,
                application.language.data.ERROR_OCCURED,
              );
            }
            break;
          case USER_ROLES.BLOOD_DONOR:
            response = await bloodDonorLogin(phoneEmail, password);
            if (response) {
              if (response['donneur_sang']) {
                await login(
                  response['donneur_sang'],
                  response['token'],
                  USER_ROLES.BLOOD_DONOR,
                );
                setLoadingModalVisible(false);
                const popAction = StackActions.pop(2);
                navigation.dispatch(popAction);
                navigation.goBack();
              } else {
                setLoadingModalVisible(false);
                switch (response['message']) {
                  case 'Email incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.USER_DOESNT_EXIST,
                    );
                    break;
                  case 'Email ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;

                  case 'Telephone ou mot de passe incorrect !':
                    Alert.alert(
                      application.language.data.ALERT,
                      application.language.data.WRONG_PASSWORD,
                    );
                    break;
                  default:
                    break;
                }
              }
            } else {
              setLoadingModalVisible(false);
              Alert.alert(
                application.language.data.ALERT,
                application.language.data.ERROR_OCCURED,
              );
            }
            break;
          default:
            break;
        }
      } catch (error) {
        setLoadingModalVisible(false);
        Alert.alert(
          application.language.data.ALERT,
          application.language.data.ERROR_OCCURED,
        );
        console.log(error);
      }
    } else {
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.FILL_THE_FORM,
      );
      if (!phoneEmailErrorVisible) {
        setPhoneEmailErrorVisible(true);
      }
      if (!passwordErrorVisible) {
        setPasswordErrorVisible(true);
      }
    }
  };

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
        <View style={styles.subContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assests/logos/logo.png')}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.title}>
            {application.language.data.WELCOME_BACK}
          </Text>
          <Text>{application.language.data.SIGN_IN_TO_CONTINUE}</Text>
          <AnimatedTextInput
            inputHeight={HEIGHT / 12.5}
            inputWidth={WIDTH * 0.9}
            inputRadius={10}
            value={phoneEmail}
            onChange={value => validate(value, 'phoneEmail')}
            placeholder={application.language.data.EMAIL_PHONE}
            multiline={false}
            secureTextIntry={false}
            errorText={
              phoneEmailValidate == 0
                ? application.language.data.ENTER_EMAIL_PHONE
                : phoneEmailValidate == 2 &&
                  application.language.data.INVALID_EMAIL_PHONE
            }
            errorTextVisible={phoneEmailErrorVisible}
          />
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
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.headerTitle}>
              {application.language.data.FORGOT_PASSWORD}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={allValidate}>
            <Text style={styles.buttonText}>
              {application.language.data.SIGN_IN}
            </Text>
          </TouchableOpacity>
        </View>
        <Modal transparent={true} visible={loadingModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.loadingModal}>
              {application.language.key == LANAGUAGES_LIST.ARABIC && (
                <ActivityIndicator size={WIDTH / 10} color={COLORS.PRIMARY12} />
              )}
              <Text style={styles.loadingText}>
                {application.language.data.SIGNING_IN}
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
});

const mapDispatchProps = dispatch => ({
  login: (user, token, role) => {
    dispatch(signIn(user, token, role));
  },
});

export default connect(mapStateProps, mapDispatchProps)(Login);

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
  logoContainer: {
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
  logo: {
    height: logoSize,
    width: logoSize,
    borderRadius: logoSize,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.PRIMARY12,
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
