import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { COLORS } from '../../../constants/colors';
import { HEIGHT, WIDTH } from '../../../constants/dimensions';
import { useTheme } from '../../../context/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Animated from 'react-native-reanimated';
import DrawerHiddenView from '../../../components/drawerHiddenView/DrawerHiddenView';
import AnimatedTextInput from '../../../components/input/AnimatedTextInput';
import FilledAnimatedTextInput from '../../../components/input/FilledAnimatedTextInput';
import { fetchWilayas } from '../../../api/wilayas';
import { fetchCommunes } from '../../../api/communes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { LANAGUAGES_LIST } from '../../../constants/languages';
import NumericFilledAnimatedTextInput from '../../../components/input/NumericFilledAnimatedInput';
import WorkingDay from '../../../components/workingDay/WorkingDay';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  doctorUpdateAddress,
  doctorUpdateEmail,
  doctorUpdatePassword,
  doctorUpdatePresentation,
  doctorUpdatePricing,
  doctorUpdateSpokenLanguages,
  doctorUpdateWorkingHours,
} from '../../../api/doctors';
import { USER_ROLES } from '../../../constants/user';
import { updateUser } from '../../../redux/actions/user';

const inputHeight = HEIGHT / 12.5;
const inputWidth = WIDTH * 0.9;
const buttonHeight = HEIGHT / 10;

const weekDaysArray = [
  {
    day: 0,
    opening: '08:00',
    closing: '17:00',
    checked: false,
  },
  {
    day: 1,
    opening: '08:00',
    closing: '17:00',
    checked: false,
  },
  {
    day: 2,
    opening: '08:00',
    closing: '17:00',
    checked: false,
  },
  {
    day: 3,
    opening: '08:00',
    closing: '17:00',
    checked: false,
  },
  {
    day: 4,
    opening: '08:00',
    closing: '17:00',
    checked: false,
  },
  {
    day: 5,
    opening: '08:00',
    closing: '17:00',
    checked: false,
  },
  {
    day: 6,
    opening: '08:00',
    closing: '17:00',
    checked: false,
  },
];

const sessionDurations = [
  {
    id: 0,
    duration: 10,
  },
  {
    id: 1,
    duration: 15,
  },
  {
    id: 2,
    duration: 20,
  },
  {
    id: 3,
    duration: 30,
  },
];

const EditProfile = ({
  navigation,
  route,
  application,
  user,
  role,
  token,
  updateProfile,
}) => {
  const { drawer } = useTheme();
  const [address, setAddress] = useState(user?.nom_de_rue);
  const [addressValidate, setAddressValidate] = useState(1);
  const [addressErrorVisible, setAddressErrorVisible] = useState(false);
  const [wilaya, setWilaya] = useState(user?.wilaya);
  const [commune, setCommune] = useState(user?.communeId);
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
  const [presentation, setPresentation] = useState(
    user?.presentation ? user?.presentation : '',
  );
  const [presentationValidate, setPresentationValidate] = useState(1);
  const [presentationErrorVisible, setPresentationErrorVisible] =
    useState(false);
  const [spokenLanguages, setSpokenLanguages] = useState(
    user?.langues_parlees ? user?.langues_parlees : '',
  );
  const [spokenLanguagesValidate, setSpokenLanguagesValidate] = useState(1);
  const [spokenLanguagesErrorVisible, setSpokenLanguagesErrorVisible] =
    useState(false);
  const [formations, setFormations] = useState(
    user?.formations ? user?.formations : '',
  );
  const [formationsValidate, setFormationsValidate] = useState(1);
  const [formationsErrorVisible, setFormationsErrorVisible] = useState(false);
  const [teleconsultationPricing, setTeleconsultationPricing] = useState(
    user?.tarif_video,
  );
  const [teleconsultationPricingValidate, setTeleconsultationPricingValidate] =
    useState(1);
  const [
    teleconsultationPricingErrorVisible,
    setTeleconsultationPricingErrorVisible,
  ] = useState(false);
  const [cabinetPricing, setCabinetPricing] = useState(user?.tarif_cabinet);
  const [cabinetPricingValidate, setCabinetPricingValidate] = useState(1);
  const [cabinetPricingErrorVisible, setCabinetPricingErrorVisible] =
    useState(false);

  const [wilayas, setWilayas] = useState(null);
  const [communes, setCommunes] = useState(null);

  const [weekDays, setWeekDays] = useState(weekDaysArray);

  const [location, setLocation] = useState({
    latitude: route.params.profile?.infos ? route.params.profile?.infos?.latitude : 10,
    longitude: route.params.profile?.infos ? route.params.profile?.infos?.longitude : 10,
  });
  const [sessionDuration, setSessionDuration] = useState(user?.duree_seance);

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
        if (text.length == 0 && passwordErrorVisible) {
          setPasswordErrorVisible(false);
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
        if (
          text.length == 0 &&
          password.length == 0 &&
          confirmPasswordErrorVisible
        ) {
          setConfirmPasswordErrorVisible(false);
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

      case 'presentation':
        alph = /^(?=.{10,250})/;
        if (!presentationErrorVisible) {
          setPresentationErrorVisible(true);
        }
        text.length == 0
          ? setPresentationValidate(0)
          : alph.test(text)
            ? setPresentationValidate(1)
            : setPresentationValidate(2);
        setPresentation(text);
        break;

      case 'spokenLanguages':
        alph = /^(?=.{10,250})/;
        if (!spokenLanguagesErrorVisible) {
          setSpokenLanguagesErrorVisible(true);
        }
        text.length == 0
          ? setSpokenLanguagesValidate(0)
          : alph.test(text)
            ? setSpokenLanguagesValidate(1)
            : setSpokenLanguagesValidate(2);
        setSpokenLanguages(text);
        break;

      case 'formations':
        alph = /^(?=.{10,250})/;
        if (!formationsErrorVisible) {
          setFormationsErrorVisible(true);
        }
        text.length == 0
          ? setFormationsValidate(0)
          : alph.test(text)
            ? setFormationsValidate(1)
            : setFormationsValidate(2);
        setFormations(text);
        break;

      case 'teleconsultationPricing':
        alph = /^(?=.{3,5})/;
        if (!teleconsultationPricingErrorVisible) {
          setTeleconsultationPricingErrorVisible(true);
        }
        text.length == 0
          ? setTeleconsultationPricingValidate(0)
          : alph.test(text)
            ? setTeleconsultationPricingValidate(1)
            : setTeleconsultationPricingValidate(2);
        setTeleconsultationPricing(text);
        break;

      case 'cabinetPricing':
        alph = /^(?=.{3,5})/;
        if (!cabinetPricingErrorVisible) {
          setCabinetPricingErrorVisible(true);
        }
        text.length == 0
          ? setCabinetPricingValidate(0)
          : alph.test(text)
            ? setCabinetPricingValidate(1)
            : setCabinetPricingValidate(2);
        setCabinetPricing(text);
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

  const getCommunes = async wilaya => {
    const response = await fetchCommunes(wilaya);
    if (response) {
      setCommunes(response);
    }
  };

  useEffect(() => {
    getWilayas();
    getCommunes(user.wilaya);
    setWeekDays(
      weekDays.map(item => ({
        ...item,
        checked: route.params.profile.horaires
          .map(item => item.jour)
          .includes(item.day)
          ? !item.checked
          : item.checked,
      })),
    );
  }, []);

  const handleUpdateProfile = async () => {
    try {
      if (address !== user.nom_de_rue) {
        const addressResponse = await doctorUpdateAddress(
          token,
          address,
          wilaya,
          commune,
        );
        //alert(JSON.stringify(addressResponse));
        if (addressResponse) {
          if (addressResponse['message'] == 'success') {
            await updateProfile({ ...user, nom_de_rue: address });
          }
        }
      }
      if (email !== user.email) {
        const emailResponse = await doctorUpdateEmail(token, email);
        //alert(JSON.stringify(emailResponse));
        if (emailResponse) {
          if (emailResponse['message'] == 'success') {
            await updateProfile({ ...user, email });
          }
        }
      }
      if (password !== '') {
        const passwordResponse = await doctorUpdatePassword(token, password);
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
      if (presentation !== user.presentation) {
        const presentationResponse = await doctorUpdatePresentation(
          token,
          presentation,
        );
        //alert(JSON.stringify(presentationResponse));
        if (presentationResponse) {
          if (presentationResponse['message'] == 'success') {
            await updateProfile({ ...user, presentation });
          }
        }
      }
      if (spokenLanguages !== user.langues_parlees) {
        const spokenLanguagesResponse = await doctorUpdateSpokenLanguages(
          token,
          spokenLanguages,
        );
        //alert(JSON.stringify(spokenLanguagesResponse));
        if (spokenLanguagesResponse) {
          if (spokenLanguagesResponse['message'] == 'success') {
            await updateProfile({ ...user, langues_parlees: spokenLanguages });
          }
        }
      }
      if (
        cabinetPricing !== user.tarif_cabinet ||
        teleconsultationPricing !== user.tarif_video
      ) {
        const pricingResponse = await doctorUpdatePricing(
          token,
          cabinetPricing,
          teleconsultationPricing,
        );
        //alert(JSON.stringify(pricingResponse));
        if (pricingResponse) {
          if (pricingResponse['message'] == 'success') {
            await updateProfile({
              ...user,
              tarif_cabinet: cabinetPricing,
              tarif_video: teleconsultationPricing,
            });
          }
        }
      }
      if (
        !arraysEqual(
          weekDaysArray.map(item => ({
            ...item,
            checked: route.params.profile.horaires
              .map(item => item.jour)
              .includes(item.day)
              ? !item.checked
              : item.checked,
          })),
          weekDays,
        ) ||
        sessionDuration !== user.duree_seance
      ) {
        //alert(JSON.stringify(weekDays));
        const workingDaysResponse = await doctorUpdateWorkingHours(
          token,
          weekDays
            .map(day => ({
              jour: { id: day.day },
              ouverture: day.opening + ':00',
              fermeture: day.closing + ':00',
              ferme: !route.params.profile.horaires
                .map(item => item.jour)
                .includes(day.day),
            }))
            .filter(day =>
              route.params.profile.horaires
                .map(item => item.jour)
                .includes(day.jour.id),
            ),
          sessionDuration,
        );
        alert(JSON.stringify(workingDaysResponse));
        if (workingDaysResponse) {
          if (workingDaysResponse['message'] == 'success') {
            // await updateProfile({
            //   ...user,
            //   tarif_cabinet: cabinetPricing,
            //   tarif_video: teleconsultationPricing,
            // });
          }
        }
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.ERROR_OCCURED,
      );
      console.log(error);
    }
  };

  const objectsEqual = (o1, o2) =>
    typeof o1 === 'object' && Object.keys(o1).length > 0
      ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
      : o1 === o2;

  const arraysEqual = (a1, a2) =>
    a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

  const allValidate = () => {
    if (
      addressValidate !== 1 ||
      emailValidate !== 1 ||
      confirmEmailValidate !== 1 ||
      (passwordValidate !== 0 && passwordValidate !== 1) ||
      (confirmPasswordValidate !== 0 && confirmPasswordValidate !== 1) ||
      presentationValidate !== 1 ||
      spokenLanguagesValidate !== 1 ||
      formationsValidate !== 1 ||
      cabinetPricingValidate !== 1 ||
      teleconsultationPricingValidate !== 1
    ) {
      alert('Enter and correctly your details');
    } else {
      if (
        address !== user.nom_de_rue ||
        email !== user.email ||
        password !== '' ||
        wilaya !== user.wilaya ||
        commune !== user.commune ||
        location.latitude !== user.latitude ||
        location.longitude !== user.longitude ||
        presentation !== user.presentation ||
        spokenLanguages !== user.langues_parlees ||
        cabinetPricing !== user.tarif_cabinet ||
        teleconsultationPricing !== user.tarif_video ||
        sessionDuration !== user.duree_seance ||
        !arraysEqual(
          weekDaysArray.map(item => ({
            ...item,
            checked: route.params.profile.horaires
              .map(item => item.jour)
              .includes(item.day)
              ? !item.checked
              : item.checked,
          })),
          weekDays,
        )
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
          contentContainerStyle={{ alignItems: 'center' }}>
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
          <FilledAnimatedTextInput
            inputHeight={HEIGHT / 7.5}
            inputWidth={WIDTH * 0.9}
            inputRadius={10}
            value={presentation}
            onChange={value => validate(value, 'presentation')}
            placeholder={application.language.data.PRESENTATION}
            multiline={true}
            secureTextIntry={true}
            errorText={
              presentationValidate == 0
                ? application.language.data.ENTER_PRESENTATION
                : presentationValidate == 2 &&
                application.language.data.INVALID_PRESENTATION
            }
            errorTextVisible={presentationErrorVisible}
          />
          <Text />
          <FilledAnimatedTextInput
            inputHeight={HEIGHT / 7.5}
            inputWidth={WIDTH * 0.9}
            inputRadius={10}
            value={spokenLanguages}
            onChange={value => validate(value, 'spokenLanguages')}
            placeholder={application.language.data.SPOKEN_LANGUAGES}
            multiline={true}
            secureTextIntry={true}
            errorText={
              spokenLanguagesValidate == 0
                ? application.language.data.ENTER_SPOKEN_LANGUAGES
                : spokenLanguagesValidate == 2 &&
                application.language.data.INVALID_SPOKEN_LANGUAGES
            }
            errorTextVisible={spokenLanguagesErrorVisible}
          />
          <Text />
          <FilledAnimatedTextInput
            inputHeight={HEIGHT / 7.5}
            inputWidth={WIDTH * 0.9}
            inputRadius={10}
            value={formations}
            onChange={value => validate(value, 'formations')}
            placeholder={application.language.data.COURSES}
            multiline={true}
            secureTextIntry={true}
            errorText={
              formationsValidate == 0
                ? application.language.data.ENTER_COURSES
                : formationsValidate == 2 &&
                application.language.data.INVALID_COURSES
            }
            errorTextVisible={formationsErrorVisible}
          />
          <>
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
              {application.language.data.SESSION_DURATION}
            </Text>
            <Text />
            <View style={styles.pickerContainer}>
              <View style={styles.picker}>
                <MaterialIcons
                  name="timer"
                  color={COLORS.PRIMARY12}
                  size={25}
                  style={styles.pickerIcon}
                />
                <Picker
                  enabled={sessionDurations !== null}
                  selectedValue={sessionDuration}
                  style={{
                    flex: 1,
                    textAlign: 'left',
                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    if (sessionDuration !== itemValue) {
                      setSessionDuration(itemValue);
                    }
                  }}>
                  {sessionDurations &&
                    sessionDurations.map(duration => (
                      <Picker.Item
                        key={duration.id.toString()}
                        value={duration.duration}
                        label={`${duration.duration.toString()} ${application.language.key == LANAGUAGES_LIST.ARABIC
                          ? 'د'
                          : 'm'
                          }`}
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
              {application.language.data.PRICING}
            </Text>
            <Text />
            <NumericFilledAnimatedTextInput
              inputHeight={HEIGHT / 12.5}
              inputWidth={WIDTH * 0.9}
              inputRadius={10}
              value={teleconsultationPricing.toString()}
              onChange={value => validate(value, 'teleconsultationPricing')}
              placeholder={application.language.data.TELECONSULTATION}
              multiline={true}
              secureTextIntry={true}
              errorText={
                teleconsultationPricingValidate == 0
                  ? application.language.data.ENTER_COURSES
                  : teleconsultationPricingValidate == 2 &&
                  application.language.data.INVALID_COURSES
              }
              errorTextVisible={teleconsultationPricingErrorVisible}
            />
            <Text />
            <NumericFilledAnimatedTextInput
              inputHeight={HEIGHT / 12.5}
              inputWidth={WIDTH * 0.9}
              inputRadius={10}
              value={cabinetPricing.toString()}
              onChange={value => validate(value, 'cabinetPricing')}
              placeholder={application.language.data.CABINET}
              multiline={true}
              secureTextIntry={true}
              errorText={
                cabinetPricingValidate == 0
                  ? application.language.data.ENTER_COURSES
                  : cabinetPricingValidate == 2 &&
                  application.language.data.INVALID_COURSES
              }
              errorTextVisible={cabinetPricingErrorVisible}
            />
          </>
          <Text />
          {weekDays.map((weekDay, index) => (
            <WorkingDay
              weekDay={weekDay}
              index={index}
              weekDaysLength={weekDays.length}
              workingDays={route.params.profile.horaires}
              weekDays={weekDays}
              setWeekDays={setWeekDays}
            />
          ))}
          <Text />
          <TouchableOpacity style={styles.button} onPress={allValidate}>
            <Text style={styles.buttonText}>
              {application.language.data.EDIT}
            </Text>
          </TouchableOpacity>
        </ScrollView>
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

export default connect(mapStateProps, mapDispatchProps)(EditProfile);

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
});
