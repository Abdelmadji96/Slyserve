import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {COLORS} from '../../../constants/colors';
import {HEIGHT, WIDTH} from '../../../constants/dimensions';
import {useTheme} from '../../../context/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Animated from 'react-native-reanimated';
import DrawerHiddenView from '../../../components/drawerHiddenView/DrawerHiddenView';
import AnimatedTextInput from '../../../components/input/AnimatedTextInput';
import FilledAnimatedTextInput from '../../../components/input/FilledAnimatedTextInput';
import {fetchWilayas} from '../../../api/wilayas';
import {fetchCommunes} from '../../../api/communes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import {LANAGUAGES_LIST} from '../../../constants/languages';
import NumericFilledAnimatedTextInput from '../../../components/input/NumericFilledAnimatedInput';
import WorkingDay from '../../../components/workingDay/WorkingDay';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {
  doctorUpdateAddress,
  doctorUpdateEmail,
  doctorUpdatePassword,
} from '../../../api/doctors';
import {USER_ROLES} from '../../../constants/user';
import {updateUser} from '../../../redux/actions/user';
import {
  paramedicalUpdateAddress,
  paramedicalUpdateEmail,
  paramedicalUpdatePassword,
} from '../../../api/paramedicals';

const inputHeight = HEIGHT / 12.5;
const inputWidth = WIDTH * 0.9;
const buttonHeight = HEIGHT / 10;

const ParamedicalEditProfile = ({
  navigation,
  route,
  application,
  user,
  role,
  token,
  updateProfile,
}) => {
  const {drawer} = useTheme();
  const [address, setAddress] = useState(user?.nom_de_rue);
  const [addressValidate, setAddressValidate] = useState(1);
  const [addressErrorVisible, setAddressErrorVisible] = useState(false);
  const [wilaya, setWilaya] = useState(user?.wilaya_id);
  const [commune, setCommune] = useState(user?.commune_id);
  const [email, setEmail] = useState(user?.email);
  const [emailValidate, setEmailValidate] = useState(1);
  const [emailErrorVisible, setEmailErrorVisible] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(user?.email);
  const [confirmEmailValidate, setConfirmEmailValidate] = useState(1);
  const [confirmEmailErrorVisible, setConfirmEmailErrorVisible] =
    useState(false);
  const [password, setPassword] = useState('');
  const [passwordValidate, setPasswordValidate] = useState(0);
  const [passwordErrorVisible, setPasswordErrorVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordValidate, setConfirmPasswordValidate] = useState(0);
  const [confirmPasswordErrorVisible, setConfirmPasswordErrorVisible] =
    useState(false);

  const [wilayas, setWilayas] = useState(null);
  const [communes, setCommunes] = useState(null);
  const [location, setLocation] = useState({
    latitude: user.latitude,
    longitude: user.longitude,
  });
  const [modalVisible, setModalVisible] = useState(false);

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
    getCommunes(user.wilaya_id);
  }, []);

  const handleUpdateProfile = async () => {
    setModalVisible(true);
    try {
      if (address !== user.nom_de_rue) {
        const addressResponse = await paramedicalUpdateAddress(
          token,
          address,
          wilaya,
          commune,
        );
        //alert(JSON.stringify(addressResponse));
        if (addressResponse) {
          if (addressResponse['message'] == 'success') {
            await updateProfile({...user, nom_de_rue: address});
          }
        }
      }
      if (email !== user.email) {
        const emailResponse = await paramedicalUpdateEmail(token, email);
        //alert(JSON.stringify(emailResponse));
        if (emailResponse) {
          if (emailResponse['message'] == 'success') {
            await updateProfile({...user, email});
          }
        }
      }
      if (password !== '') {
        const passwordResponse = await paramedicalUpdatePassword(
          token,
          password,
        );
        //alert(JSON.stringify(passwordResponse));
        if (passwordResponse) {
          if (passwordResponse['message'] == 'success') {
            //await updateProfile({...user,  password});
            setPassword('');
            setConfirmPassword('');
            setPasswordValidate(0);
            setConfirmPasswordValidate(0);
          }
        }
      }
      setModalVisible(false);
      Alert.alert('', application.language.data.UPDATED_SUCCESSFULY);
      navigation.goBack();
    } catch (error) {
      setModalVisible(false);
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.ERROR_OCCURED,
      );
      console.log(error);
    }
  };

  const allValidate = () => {
    if (
      addressValidate !== 1 ||
      emailValidate !== 1 ||
      confirmEmailValidate !== 1 ||
      ![0, 1].includes(passwordValidate) ||
      ![0, 1].includes(confirmPasswordValidate)
    ) {
      alert('Enter and correctly your details');
    } else {
      if (
        address !== user.nom_de_rue ||
        email !== user.email ||
        password !== '' ||
        wilaya !== user.wilaya_id ||
        commune !== user.commune_id ||
        location.latitude !== user.latitude ||
        location.longitude !== user.longitude
      ) {
        handleUpdateProfile();
      } else {
        Alert.alert(application.language.data.ALERT, 'No changes applied');
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
            {application.language.data.EDIT_PROFILE}
          </Text>
          <Feather
            name="save"
            size={30}
            color={COLORS.PRIMARY12}
            onPress={allValidate}
          />
        </View>
        <ScrollView
          style={styles.bottomView}
          contentContainerStyle={{alignItems: 'center'}}>
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
          </View>
          <Text />
          <Text
            style={[
              styles.headerTitle,
              {
                marginHorizontal: (WIDTH - inputWidth) / 2,
                alignSelf:
                  application.language.key == LANAGUAGES_LIST.ARABIC
                    ? 'flex-end'
                    : 'flex-start',
              },
            ]}>
            {application.language.data.EXERCICE_ADDRESS}
          </Text>
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0221,
              }}
              onPress={async x => {
                let coordinates = x.nativeEvent.coordinate;
                //Location.setGoogleApiKey("");
                setLocation({
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                });
                s;
              }}>
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}>
                <Ionicons
                  name="location-sharp"
                  size={35}
                  color={COLORS.PRIMARY12}
                />
              </Marker>
            </MapView>
          </View>
          <Text />
          <TouchableOpacity style={styles.button} onPress={allValidate}>
            <Text style={styles.buttonText}>
              {application.language.data.EDIT}
            </Text>
          </TouchableOpacity>
          <Text />
        </ScrollView>
        <Modal transparent={true} visible={modalVisible}>
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
  role: store.userState.role,
});

const mapDispatchProps = dispatch => ({
  updateProfile: user => dispatch(updateUser(user)),
});

export default connect(mapStateProps, mapDispatchProps)(ParamedicalEditProfile);

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
  bottomView: {flex: 1},
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
  mapContainer: {
    height: HEIGHT / 3,
    width: WIDTH * 0.9,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 10,
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  button: {
    height: buttonHeight,
    width: WIDTH * 0.9,
    borderRadius: 15,
    backgroundColor: COLORS.PRIMARY12,
    marginVertical: 25,
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
  },
});
