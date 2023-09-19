import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {COLORS} from '../../constants/colors';
import {HEIGHT, WIDTH} from '../../constants/dimensions';
import {useTheme} from '../../context/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import AnimatedTextInput from '../../components/input/AnimatedTextInput';
import {Picker} from '@react-native-picker/picker';
import {LANAGUAGES_LIST} from '../../constants/languages';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import Feather from 'react-native-vector-icons/Feather';
import {USER_ROLES} from '../../constants/user';
import {fetchWilayas} from '../../api/wilayas';
import {fetchCommunes} from '../../api/communes';
import {isValidPhoneNumber} from 'libphonenumber-js';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import DrawerHiddenView from '../../components/drawerHiddenView/DrawerHiddenView';
import {patientCheckUnique, patientRegister} from '../../api/patients';
import {StackActions} from '@react-navigation/native';
import {doctorCheckUnique, doctorRegister} from '../../api/doctors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {fetchSpecialites} from '../../api/specialties';
import {
  paramedicalCheckUnique,
  paramedicalRegister,
} from '../../api/paramedicals';
import {
  clinicHospitalCheckUnique,
  clinicHospitalRegister,
} from '../../api/clinics';
import {pharmacyCheckUnique, pharmacyRegister} from '../../api/pharmacies';
import {ambulanceCheckUnique, ambulanceRegister} from '../../api/ambulances';
import {bloodDonorCheckUnique, bloodDonorRegister} from '../../api/bloodDonors';
import {
  laboratoryCheckUnique,
  laboratoryRegister,
} from '../../api/laboratories';

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

const bloodTypes = [
  {
    id: 1,
    type: 'A+',
  },
  {
    id: 2,
    type: 'A-',
  },
  {
    id: 3,
    type: 'B+',
  },
  {
    id: 4,
    type: 'B-',
  },
  {
    id: 5,
    type: 'AB+',
  },
  {
    id: 6,
    type: 'AB-',
  },
  {
    id: 7,
    type: 'O+',
  },
  {
    id: 8,
    type: 'O-',
  },
];

const inputHeight = HEIGHT / 12.5;
const inputWidth = WIDTH * 0.9;
const buttonHeight = HEIGHT / 10;
const logoSize = WIDTH / 3;

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

const Register = ({navigation, route, application}) => {
  const {drawer} = useTheme();
  const [firstName, setFirstName] = useState('');
  const [firstNameValidate, setFirstNameValidate] = useState(0);
  const [firstNameErrorVisible, setFirstNameErrorVisible] = useState(false);
  const [lastName, setLastName] = useState('');
  const [lastNameValidate, setLastNameValidate] = useState(0);
  const [lastNameErrorVisible, setLastNameErrorVisible] = useState(false);
  const [gender, setGender] = useState(0);
  const [genderErrorVisible, setGenderErrorVisible] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(maximumDate());
  const [phone, setPhone] = useState('');
  const [phoneValidate, setPhoneValidate] = useState(0);
  const [phoneErrorVisible, setPhoneErrorVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [emailValidate, setEmailValidate] = useState(0);
  const [emailErrorVisible, setEmailErrorVisible] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmEmailValidate, setConfirmEmailValidate] = useState(0);
  const [confirmEmailErrorVisible, setConfirmEmailErrorVisible] =
    useState(false);
  const [password, setPassword] = useState('');
  const [passwordValidate, setPasswordValidate] = useState(0);
  const [passwordErrorVisible, setPasswordErrorVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordValidate, setConfirmPasswordValidate] = useState(0);
  const [confirmPasswordErrorVisible, setConfirmPasswordErrorVisible] =
    useState(false);
  const [address, setAddress] = useState('');
  const [addressValidate, setAddressValidate] = useState(0);
  const [addressErrorVisible, setAddressErrorVisible] = useState(false);
  // const [specialty, setSpecialty] = useState('');
  // const [specialtyValidate, setSpecialtyValidate] = useState(0);
  const [specialtyErrorVisible, setSpecialtyErrorVisible] = useState(false);
  const [wilaya, setWilaya] = useState(0);
  const [wilayaErrorVisible, setWilayaErrorVisible] = useState(false);
  const [commune, setCommune] = useState(0);
  const [communeErrorVisible, setCommuneErrorVisible] = useState(false);
  const [name, setName] = useState('');
  const [nameValidate, setNameValidate] = useState(0);
  const [nameErrorVisible, setNameErrorVisible] = useState(false);
  const [buisnessIdentifier, setBuisnessIdentifier] = useState('');
  const [buisnessIdentifierValidate, setBuisnessIdentifierValidate] =
    useState(0);
  const [buisnessIdentifierErrorVisible, setBuisnessIdentifierErrorVisible] =
    useState(false);
  const [bloodType, setBloodType] = useState(0);
  const [bloodTypeErrorVisible, setBloodTypeErrorVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationErrorVisible, setLocationErrorVisible] = useState(false);

  const [datePickerOpened, setDatePickerOpened] = useState(false);

  const [wilayas, setWilayas] = useState(null);
  const [communes, setCommunes] = useState(null);
  const [specialties, setSpecialties] = useState(null);
  const [specialty, setSpecialty] = useState(0);

  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const scrollViewRef = useRef();

  const validate = (text, type) => {
    let alph = /^(?=.{5,10})/;
    switch (type) {
      case 'name':
        if (!nameErrorVisible) {
          setNameErrorVisible(true);
        }
        text.length == 0
          ? setNameValidate(0)
          : alph.test(text)
          ? setNameValidate(1)
          : setNameValidate(2);
        setName(text);
        break;

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

      case 'phone':
        if (!phoneErrorVisible) {
          setPhoneErrorVisible(true);
        }
        text.length == 0
          ? setPhoneValidate(0)
          : isValidPhoneNumber('+213 ' + text, 'DZ')
          ? setPhoneValidate(1)
          : setPhoneValidate(2);
        setPhone(text);
        break;

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

      // case 'specialty':
      //   if (!specialtyErrorVisible) {
      //     setSpecialtyErrorVisible(true);
      //   }
      //   text.length == 0
      //     ? setSpecialtyValidate(0)
      //     : alph.test(text)
      //     ? setSpecialtyValidate(1)
      //     : setSpecialtyValidate(2);
      //   setSpecialty(text);
      //   break;

      case 'buisnessIdentifier':
        if (!buisnessIdentifierErrorVisible) {
          setBuisnessIdentifierErrorVisible(true);
        }
        text.length == 0
          ? setBuisnessIdentifierValidate(0)
          : alph.test(text)
          ? setBuisnessIdentifierValidate(1)
          : setBuisnessIdentifierValidate(2);
        setBuisnessIdentifier(text);
        break;

      default:
        break;
    }
  };

  const patientRegisterHandler = async () => {
    setLoadingModalVisible(true);
    try {
      const checkResponse = await patientCheckUnique(email, phone);
      if (checkResponse) {
        if (checkResponse['message'] == 'success') {
          const registerResponse = await patientRegister(
            firstName,
            lastName,
            displayDate(dateOfBirth),
            gender == 1 ? 'H' : 'F',
            address,
            phone,
            email,
            password,
            wilaya,
            commune,
          );
          if (registerResponse) {
            if (registerResponse['message'] == 'success') {
              setLoadingModalVisible(false);
              Alert.alert('', application.language.data.SIGN_UP_SUCCESSFUL);
              const popAction = StackActions.pop(1);
              navigation.dispatch(popAction);
              navigation.navigate('LoginNavigator');
            } else {
              setLoadingModalVisible(false);
              Alert.alert(
                application.language.data.ALERT,
                application.language.data.ERROR_OCCURED,
              );
            }
          } else {
            setLoadingModalVisible(false);
            Alert.alert(
              application.language.data.ALERT,
              application.language.data.ERROR_OCCURED,
            );
          }
        } else {
          setLoadingModalVisible(false);
          Alert.alert(
            application.language.data.ALERT,
            application.language.data.EMAIL_PHONE_IN_USE,
          );
        }
      } else {
        setLoadingModalVisible(false);
        Alert.alert(
          application.language.data.ALERT,
          application.language.data.ERROR_OCCURED,
        );
      }
    } catch (error) {
      setLoadingModalVisible(false);
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.ERROR_OCCURED,
      );
      console.log(error);
    }
  };

  const doctorParamedicalRegisterHandler = async () => {
    setLoadingModalVisible(true);
    try {
      let checkResponse;
      if (route.params.choice == USER_ROLES.DOCTOR) {
        checkResponse = await doctorCheckUnique(email, phone);
      } else {
        checkResponse = await paramedicalCheckUnique(email, phone);
      }
      if (checkResponse) {
        if (checkResponse['message'] == 'success') {
          let registerResponse;
          if (route.params.choice == USER_ROLES.DOCTOR) {
            registerResponse = await doctorRegister(
              firstName,
              lastName,
              displayDate(dateOfBirth),
              gender == 1 ? 'H' : 'F',
              address,
              phone,
              email,
              password,
              wilaya,
              commune,
              specialty,
              location.latitude,
              location.longitude,
            );
          } else {
            registerResponse = await paramedicalRegister(
              firstName,
              lastName,
              displayDate(dateOfBirth),
              gender == 1 ? 'H' : 'F',
              address,
              phone,
              email,
              password,
              wilaya,
              commune,
              specialty,
              location.latitude,
              location.longitude,
            );
          }
          if (registerResponse) {
            if (registerResponse['message'] == 'success') {
              setLoadingModalVisible(false);
              Alert.alert('', application.language.data.SIGN_UP_SUCCESSFUL);
              const popAction = StackActions.pop(1);
              navigation.dispatch(popAction);
              navigation.navigate('LoginNavigator');
            } else {
              console.log(registerResponse['error']);
              setLoadingModalVisible(false);
              Alert.alert(
                application.language.data.ALERT,
                application.language.data.ERROR_OCCURED,
              );
            }
          } else {
            setLoadingModalVisible(false);
            Alert.alert(
              application.language.data.ALERT,
              application.language.data.ERROR_OCCURED,
            );
          }
        } else {
          setLoadingModalVisible(false);
          Alert.alert(
            application.language.data.ALERT,
            application.language.data.EMAIL_PHONE_IN_USE,
          );
        }
      } else {
        setLoadingModalVisible(false);
        Alert.alert(
          application.language.data.ALERT,
          application.language.data.ERROR_OCCURED,
        );
      }
    } catch (error) {
      setLoadingModalVisible(false);
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.ERROR_OCCURED,
      );
      console.log(error);
    }
  };

  const clinicHospitalPharmacyRegisterHandler = async () => {
    setLoadingModalVisible(true);
    try {
      let checkResponse;
      if (route.params.choice == USER_ROLES.CLINIC_HOSPITAL) {
        checkResponse = await clinicHospitalCheckUnique(email, phone);
      } else {
        checkResponse = await pharmacyCheckUnique(email, phone);
      }
      if (checkResponse) {
        if (checkResponse['message'] == 'success') {
          let registerResponse;
          if (route.params.choice == USER_ROLES.CLINIC_HOSPITAL) {
            registerResponse = await clinicHospitalRegister(
              address,
              phone,
              email,
              password,
              wilaya,
              commune,
              location.latitude,
              location.longitude,
              buisnessIdentifier,
            );
          } else {
            registerResponse = await pharmacyRegister(
              address,
              phone,
              email,
              password,
              wilaya,
              commune,
              location.latitude,
              location.longitude,
              buisnessIdentifier,
            );
          }
          if (registerResponse) {
            if (registerResponse['message'] == 'success') {
              setLoadingModalVisible(false);
              Alert.alert('', application.language.data.SIGN_UP_SUCCESSFUL);
              const popAction = StackActions.pop(1);
              navigation.dispatch(popAction);
              navigation.navigate('LoginNavigator');
            } else {
              setLoadingModalVisible(false);
              Alert.alert(
                application.language.data.ALERT,
                application.language.data.ERROR_OCCURED,
              );
            }
          } else {
            setLoadingModalVisible(false);
            Alert.alert(
              application.language.data.ALERT,
              application.language.data.ERROR_OCCURED,
            );
          }
        } else {
          setLoadingModalVisible(false);
          Alert.alert(
            application.language.data.ALERT,
            application.language.data.EMAIL_PHONE_IN_USE,
          );
        }
      } else {
        setLoadingModalVisible(false);
        Alert.alert(
          application.language.data.ALERT,
          application.language.data.ERROR_OCCURED,
        );
      }
    } catch (error) {
      setLoadingModalVisible(false);
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.ERROR_OCCURED,
      );
      console.log(error);
    }
  };

  const ambulanceRegisterHandler = async () => {
    setLoadingModalVisible(true);
    try {
      const checkResponse = await ambulanceCheckUnique(email, phone);
      if (checkResponse) {
        if (checkResponse['message'] == 'success') {
          const registerResponse = await ambulanceRegister(
            address,
            phone,
            email,
            password,
            wilaya,
            commune,
            location.latitude,
            location.longitude,
          );
          if (registerResponse) {
            if (registerResponse['message'] == 'success') {
              setLoadingModalVisible(false);
              Alert.alert('', application.language.data.SIGN_UP_SUCCESSFUL);
              const popAction = StackActions.pop(1);
              navigation.dispatch(popAction);
              navigation.navigate('LoginNavigator');
            } else {
              setLoadingModalVisible(false);
              Alert.alert(
                application.language.data.ALERT,
                application.language.data.ERROR_OCCURED,
              );
            }
          } else {
            setLoadingModalVisible(false);
            Alert.alert(
              application.language.data.ALERT,
              application.language.data.ERROR_OCCURED,
            );
          }
        } else {
          setLoadingModalVisible(false);
          Alert.alert(
            application.language.data.ALERT,
            application.language.data.EMAIL_PHONE_IN_USE,
          );
        }
      } else {
        setLoadingModalVisible(false);
        Alert.alert(
          application.language.data.ALERT,
          application.language.data.ERROR_OCCURED,
        );
      }
    } catch (error) {
      setLoadingModalVisible(false);
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.ERROR_OCCURED,
      );
      console.log(error);
    }
  };

  const laboratoryRegisterHandler = async () => {
    setLoadingModalVisible(true);
    try {
      const checkResponse = await laboratoryCheckUnique(email, phone);
      if (checkResponse) {
        if (checkResponse['message'] == 'success') {
          const registerResponse = await laboratoryRegister(
            name,
            phone,
            email,
            password,
            address,
            wilaya,
            commune,
            location.latitude,
            location.longitude,
            buisnessIdentifier,
          );
          console.log(JSON.stringify(registerResponse));
          if (registerResponse) {
            if (registerResponse['message'] == 'success') {
              setLoadingModalVisible(false);
              Alert.alert('', application.language.data.SIGN_UP_SUCCESSFUL);
              const popAction = StackActions.pop(1);
              navigation.dispatch(popAction);
              navigation.navigate('LoginNavigator');
            } else {
              setLoadingModalVisible(false);
              Alert.alert(
                application.language.data.ALERT,
                application.language.data.ERROR_OCCURED,
              );
            }
          } else {
            setLoadingModalVisible(false);
            Alert.alert(
              application.language.data.ALERT,
              application.language.data.ERROR_OCCURED,
            );
          }
        } else {
          setLoadingModalVisible(false);
          Alert.alert(
            application.language.data.ALERT,
            application.language.data.EMAIL_PHONE_IN_USE,
          );
        }
      } else {
        setLoadingModalVisible(false);
        Alert.alert(
          application.language.data.ALERT,
          application.language.data.ERROR_OCCURED,
        );
      }
    } catch (error) {
      setLoadingModalVisible(false);
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.ERROR_OCCURED,
      );
      console.log(error);
    }
  };

  const bloodDonorRegisterHandler = async () => {
    setLoadingModalVisible(true);
    try {
      const checkResponse = await bloodDonorCheckUnique(email, phone);
      if (checkResponse) {
        if (checkResponse['message'] == 'success') {
          const registerResponse = await bloodDonorRegister(
            firstName,
            lastName,
            displayDate(dateOfBirth),
            gender == 1 ? 'H' : 'F',
            address,
            phone,
            email,
            password,
            wilaya,
            commune,
            location.latitude,
            location.longitude,
            bloodTypes.filter(type => type.id == bloodType).pop().type,
          );
          if (registerResponse) {
            if (registerResponse['message'] == 'success') {
              setLoadingModalVisible(false);
              Alert.alert('', application.language.data.SIGN_UP_SUCCESSFUL);
              const popAction = StackActions.pop(1);
              navigation.dispatch(popAction);
              navigation.navigate('LoginNavigator');
            } else {
              setLoadingModalVisible(false);
              Alert.alert(
                application.language.data.ALERT,
                application.language.data.ERROR_OCCURED,
              );
            }
          } else {
            setLoadingModalVisible(false);
            Alert.alert(
              application.language.data.ALERT,
              application.language.data.ERROR_OCCURED,
            );
          }
        } else {
          setLoadingModalVisible(false);
          Alert.alert(
            application.language.data.ALERT,
            application.language.data.EMAIL_PHONE_IN_USE,
          );
        }
      } else {
        setLoadingModalVisible(false);
        Alert.alert(
          application.language.data.ALERT,
          application.language.data.ERROR_OCCURED,
        );
      }
    } catch (error) {
      setLoadingModalVisible(false);
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.ERROR_OCCURED,
      );
      console.log(error);
    }
  };

  const patientAllValidate = () => {
    if (
      firstNameValidate == 1 &&
      lastNameValidate == 1 &&
      gender !== 0 &&
      phoneValidate == 1 &&
      emailValidate == 1 &&
      confirmEmailValidate == 1 &&
      passwordValidate == 1 &&
      passwordValidate == 1 &&
      addressValidate == 1 &&
      wilaya !== 0 &&
      commune !== 0
    ) {
      patientRegisterHandler();
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
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (phoneValidate !== 1) {
        setPhoneErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (emailValidate !== 1) {
        setEmailErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
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
      if (wilaya == 0) {
        setWilayaErrorVisible(true);
      }
      if (commune == 0) {
        setCommuneErrorVisible(true);
      }
    }
  };

  const doctorParamedicalAllValidate = () => {
    if (
      firstNameValidate == 1 &&
      lastNameValidate == 1 &&
      gender !== 0 &&
      phoneValidate == 1 &&
      emailValidate == 1 &&
      confirmEmailValidate == 1 &&
      passwordValidate == 1 &&
      passwordValidate == 1 &&
      addressValidate == 1 &&
      wilaya !== 0 &&
      commune !== 0 &&
      //specialtyValidate == 1 &&
      specialty !== 0 &&
      buisnessIdentifierValidate == 1 &&
      location !== null
    ) {
      doctorParamedicalRegisterHandler();
    } else {
      Alert.alert(
        application.language.data.ALERT,
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
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (phoneValidate !== 1) {
        setPhoneErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (emailValidate !== 1) {
        setEmailErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (confirmEmailValidate !== 1) {
        setConfirmEmailErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (passwordValidate !== 1) {
        setPasswordErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (confirmPasswordValidate !== 1) {
        setConfirmPasswordErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (addressValidate !== 1) {
        setAddressErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (wilaya == 0) {
        setWilayaErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (commune == 0) {
        setCommuneErrorVisible(true);
      }
      // if (specialtyValidate !== 1) {
      //   setSpecialtyErrorVisible(true);
      // }
      if (specialty == 0) {
        setSpecialtyErrorVisible(true);
      }
      if (buisnessIdentifierValidate !== 1) {
        setBuisnessIdentifierErrorVisible(true);
      }
      if (location == null) {
        setLocationErrorVisible(true);
      }
    }
  };

  const clinicHospitalPharmacyAllValidate = () => {
    if (
      nameValidate == 1 &&
      phoneValidate == 1 &&
      emailValidate == 1 &&
      confirmEmailValidate == 1 &&
      passwordValidate == 1 &&
      passwordValidate == 1 &&
      addressValidate == 1 &&
      wilaya !== 0 &&
      commune !== 0 &&
      buisnessIdentifierValidate == 1 &&
      location !== null
    ) {
      clinicHospitalPharmacyRegisterHandler();
    } else {
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.FILL_THE_FORM,
      );
      if (nameValidate !== 1) {
        setNameErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (phoneValidate !== 1) {
        setPhoneErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (emailValidate !== 1) {
        setEmailErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (confirmEmailValidate !== 1) {
        setConfirmEmailErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (passwordValidate !== 1) {
        setPasswordErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (confirmPasswordValidate !== 1) {
        setConfirmPasswordErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (addressValidate !== 1) {
        setAddressErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (wilaya == 0) {
        setWilayaErrorVisible(true);
      }
      if (commune == 0) {
        setCommuneErrorVisible(true);
      }
      if (buisnessIdentifierValidate !== 1) {
        setBuisnessIdentifierErrorVisible(true);
      }
      if (location == null) {
        setLocationErrorVisible(true);
      }
    }
  };

  const ambulanceAllValidate = () => {
    if (
      phoneValidate == 1 &&
      emailValidate == 1 &&
      confirmEmailValidate == 1 &&
      passwordValidate == 1 &&
      passwordValidate == 1 &&
      addressValidate == 1 &&
      wilaya !== 0 &&
      commune !== 0 &&
      buisnessIdentifierValidate == 1 &&
      location !== null
    ) {
      ambulanceRegisterHandler();
    } else {
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.FILL_THE_FORM,
      );
      if (phoneValidate !== 1) {
        setPhoneErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (emailValidate !== 1) {
        setEmailErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (confirmEmailValidate !== 1) {
        setConfirmEmailErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (passwordValidate !== 1) {
        setPasswordErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (confirmPasswordValidate !== 1) {
        setConfirmPasswordErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (addressValidate !== 1) {
        setAddressErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (wilaya == 0) {
        setWilayaErrorVisible(true);
      }
      if (commune == 0) {
        setCommuneErrorVisible(true);
      }
      if (buisnessIdentifierValidate !== 1) {
        setBuisnessIdentifierErrorVisible(true);
      }
      if (location == null) {
        setLocationErrorVisible(true);
      }
    }
  };

  const laboratoryAllValidate = () => {
    if (
      phoneValidate == 1 &&
      emailValidate == 1 &&
      confirmEmailValidate == 1 &&
      passwordValidate == 1 &&
      passwordValidate == 1 &&
      addressValidate == 1 &&
      wilaya !== 0 &&
      commune !== 0 &&
      buisnessIdentifierValidate == 1 &&
      location !== null
    ) {
      laboratoryRegisterHandler();
    } else {
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.FILL_THE_FORM,
      );
      if (phoneValidate !== 1) {
        setPhoneErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (emailValidate !== 1) {
        setEmailErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (confirmEmailValidate !== 1) {
        setConfirmEmailErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (passwordValidate !== 1) {
        setPasswordErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (confirmPasswordValidate !== 1) {
        setConfirmPasswordErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (addressValidate !== 1) {
        setAddressErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (wilaya == 0) {
        setWilayaErrorVisible(true);
      }
      if (commune == 0) {
        setCommuneErrorVisible(true);
      }
      if (buisnessIdentifierValidate !== 1) {
        setBuisnessIdentifierErrorVisible(true);
      }
      if (location == null) {
        setLocationErrorVisible(true);
      }
    }
  };

  const bloodDonorAllValidate = () => {
    if (
      firstNameValidate == 1 &&
      lastNameValidate == 1 &&
      gender !== 0 &&
      phoneValidate == 1 &&
      emailValidate == 1 &&
      confirmEmailValidate == 1 &&
      passwordValidate == 1 &&
      passwordValidate == 1 &&
      addressValidate == 1 &&
      wilaya !== 0 &&
      commune !== 0 &&
      location !== null &&
      bloodType !== 0
    ) {
      bloodDonorRegisterHandler();
    } else {
      Alert.alert(
        application.language.data.ALERT,
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
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (phoneValidate !== 1) {
        setPhoneErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
      }
      if (emailValidate !== 1) {
        setEmailErrorVisible(true);
        scrollViewRef.current.scrollTo({y: 0});
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
      if (wilaya == 0) {
        setWilayaErrorVisible(true);
      }
      if (commune == 0) {
        setCommuneErrorVisible(true);
      }
      if (bloodType == 0) {
        setBloodTypeErrorVisible(true);
      }
      if (location == null) {
        setLocationErrorVisible(true);
      }
    }
  };

  const allValidate = () => {
    switch (route.params.choice) {
      case USER_ROLES.PATIENT:
        patientAllValidate();
        break;

      case USER_ROLES.BLOOD_DONOR:
        bloodDonorAllValidate();
        break;

      case USER_ROLES.DOCTOR:
        doctorParamedicalAllValidate();
        break;

      case USER_ROLES.PARAMEDICAL:
        doctorParamedicalAllValidate();
        break;

      case USER_ROLES.CLINIC_HOSPITAL:
        clinicHospitalPharmacyAllValidate();
        break;

      case USER_ROLES.PHARMACY:
        clinicHospitalPharmacyAllValidate();
        break;

      case USER_ROLES.AMBULANCE:
        ambulanceAllValidate();
        break;

      case USER_ROLES.LABORATORY:
        laboratoryAllValidate();
        break;

      case USER_ROLES.BLOOD_DONOR:
        bloodDonorAllValidate();
        break;

      default:
        break;
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

  const displaySpecialty = item => {
    switch (application.language.key) {
      case LANAGUAGES_LIST.ARABIC:
        return item.nom_ar;
        break;

      case LANAGUAGES_LIST.FRENCH:
        return item.nom_fr;
        break;

      case LANAGUAGES_LIST.ENGLISH:
        return item.nom_en;
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

  const getSpecialties = async () => {
    const response = await fetchSpecialites();
    if (response) {
      setSpecialties(response);
    }
  };

  useEffect(() => {
    getWilayas();
    getSpecialties();
  }, []);

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
            {application.language.data.REGISTER}
          </Text>
          <View />
        </View>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            alignItems: 'center',
            paddingBottom: buttonHeight * 2,
            paddingHorizontal: (WIDTH - inputWidth) / 2,
          }}>
          <Text />
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assests/logos/logo.png')}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
          {route.params.choice == USER_ROLES.PHARMACY ||
          route.params.choice == USER_ROLES.CLINIC_HOSPITAL ||
          route.params.choice == USER_ROLES.PHARMACY ? (
            <>
              <Text />
              <AnimatedTextInput
                inputHeight={inputHeight}
                inputWidth={inputWidth}
                inputRadius={10}
                value={name}
                onChange={value => validate(value, 'name')}
                placeholder={application.language.data.NAME}
                multiline={false}
                secureTextIntry={false}
                errorText={
                  nameValidate == 0
                    ? application.language.data.ENTER_NAME
                    : nameValidate == 2 &&
                      application.language.data.INVALID_NAME
                }
                errorTextVisible={nameErrorVisible}
              />
            </>
          ) : (
            route.params.choice !== USER_ROLES.AMBULANCE && (
              <>
                <Text />
                <AnimatedTextInput
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
                <AnimatedTextInput
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
              </>
            )
          )}
          {route.params.choice == USER_ROLES.PATIENT ||
          route.params.choice == USER_ROLES.DOCTOR ||
          route.params.choice == USER_ROLES.PARAMEDICAL ||
          route.params.choice == USER_ROLES.BLOOD_DONOR ? (
            <>
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
            </>
          ) : null}
          {route.params.choice !== USER_ROLES.CLINIC_HOSPITAL &&
            route.params.choice !== USER_ROLES.PHARMACY &&
            route.params.choice !== USER_ROLES.AMBULANCE && (
              <>
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
                    <Text style={styles.dateText}>
                      {displayDate(dateOfBirth)}
                    </Text>
                    <Ionicons
                      name="caret-down-sharp"
                      color={COLORS.PRIMARY25}
                      size={12.5}
                      style={[styles.pickerIcon, {opacity: 0.55}]}
                    />
                  </View>
                </TouchableOpacity>
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
              </>
            )}
          <Text />
          <AnimatedTextInput
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
                : phoneValidate == 2 && application.language.data.INVALID_PHONE
            }
            errorTextVisible={phoneErrorVisible}
          />
          <Text />
          <AnimatedTextInput
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
          <AnimatedTextInput
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
          <AnimatedTextInput
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
          {route.params.choice == USER_ROLES.DOCTOR ||
          route.params.choice == USER_ROLES.PARAMEDICAL ? (
            <>
              {/* 
             <AnimatedTextInput
                inputHeight={HEIGHT / 12.5}
                inputWidth={WIDTH * 0.9}
                inputRadius={10}
                value={specialite}
                onChange={value => validate(value, 'specialite')}
                placeholder={application.language.data.SPECIALTY}
                multiline={false}
                errorText={
                  specialiteValidate == 0
                    ? application.language.data.SELECT_SPECIALTY
                    : specialiteValidate == 2 &&
                      application.language.data.INVALID_SPECIALTY
                }
                errorTextVisible={specialiteErrorVisible}
              /> */}
              <Text />
              <View style={styles.pickerContainer}>
                <View style={styles.picker}>
                  <FontAwesome5
                    name="stethoscope"
                    color={COLORS.PRIMARY12}
                    size={25}
                    style={styles.pickerIcon}
                  />
                  <Picker
                    enabled={specialties !== null}
                    selectedValue={specialty}
                    style={{
                      flex: 1,
                      textAlign: 'left',
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      if (specialty !== itemValue) {
                        setSpecialty(itemValue);
                        if (specialtyErrorVisible) {
                          setSpecialtyErrorVisible(false);
                        }
                      }
                    }}>
                    <Picker.Item
                      value={0}
                      label={(() => {
                        switch (application.language.key) {
                          case LANAGUAGES_LIST.ARABIC:
                            return 'حدد تخصصك';
                            break;
                          case LANAGUAGES_LIST.FRENCH:
                            return 'Selectionnez votre spécialité';
                            break;
                          case LANAGUAGES_LIST.ENGLISH:
                            return 'Select your specialty';
                            break;
                          default:
                            break;
                        }
                      })()}
                    />
                    {specialties &&
                      specialties.map(specialty => (
                        <Picker.Item
                          key={specialty.id.toString()}
                          value={specialty.id}
                          label={displaySpecialty(specialty)}
                        />
                      ))}
                  </Picker>
                </View>
                {specialtyErrorVisible && (
                  <Text style={styles.errorText}>
                    {application.language.data.SELECT_SPECIALTY}
                  </Text>
                )}
              </View>
            </>
          ) : null}
          {route.params.choice !== USER_ROLES.PATIENT &&
          route.params.choice !== USER_ROLES.BLOOD_DONOR ? (
            <>
              <Text />
              <AnimatedTextInput
                inputHeight={HEIGHT / 12.5}
                inputWidth={WIDTH * 0.9}
                inputRadius={10}
                value={buisnessIdentifier}
                onChange={value => validate(value, 'buisnessIdentifier')}
                placeholder={application.language.data.BUISNESS_IDENTIFIER}
                multiline={false}
                errorText={
                  buisnessIdentifierValidate == 0
                    ? application.language.data.ENTER_BUISNESS_IDENTIFIER
                    : buisnessIdentifierValidate == 2 &&
                      application.language.data.INVALID_BUISNESS_IDENTIFIER
                }
                errorTextVisible={buisnessIdentifierErrorVisible}
              />
            </>
          ) : null}
          {route.params.choice == USER_ROLES.BLOOD_DONOR && (
            <>
              <Text />
              <View style={styles.pickerContainer}>
                <View style={styles.picker}>
                  <Fontisto
                    name="blood-drop"
                    color={COLORS.PRIMARY12}
                    size={25}
                    style={styles.pickerIcon}
                  />
                  <Picker
                    enabled={bloodTypes !== null}
                    selectedValue={bloodType}
                    style={{
                      flex: 1,
                      textAlign: 'left',
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      if (bloodType !== itemValue) {
                        setBloodType(itemValue);
                        if (bloodTypeErrorVisible) {
                          setBloodTypeErrorVisible(false);
                        }
                      }
                    }}>
                    <Picker.Item
                      label={(() => {
                        switch (application.language.key) {
                          case LANAGUAGES_LIST.ARABIC:
                            return 'حدد فصيلة دمك';
                            break;
                          case LANAGUAGES_LIST.FRENCH:
                            return 'Sélectionnez votre groupe sanguin';
                            break;
                          case LANAGUAGES_LIST.ENGLISH:
                            return 'Select your blood type';
                            break;
                          default:
                            break;
                        }
                      })()}
                    />
                    {bloodTypes &&
                      bloodTypes.map(bloodType => (
                        <Picker.Item
                          key={bloodType.id.toString()}
                          value={bloodType.id}
                          label={bloodType.type}
                        />
                      ))}
                  </Picker>
                </View>
                {bloodTypeErrorVisible && (
                  <Text style={styles.errorText}>
                    {application.language.data.SELECT_BLOOD_TYPE}
                  </Text>
                )}
              </View>
            </>
          )}
          {route.params.choice !== USER_ROLES.PATIENT && (
            <>
              <Text />
              <View style={styles.mapContainer}>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  region={
                    location && {
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: 0.0222,
                      longitudeDelta: 0.0121,
                    }
                  }
                  onPress={async x => {
                    let coordinates = x.nativeEvent.coordinate;
                    //Location.setGoogleApiKey("");
                    setLocation({
                      latitude: coordinates.latitude,
                      longitude: coordinates.longitude,
                    });
                    if (locationErrorVisible) {
                      setLocationErrorVisible(false);
                    }
                  }}>
                  {location && (
                    <Marker coordinate={location}>
                      <Ionicons
                        name="location-sharp"
                        size={35}
                        color={COLORS.PRIMARY12}
                      />
                    </Marker>
                  )}
                </MapView>
              </View>
              {locationErrorVisible && (
                <Text
                  style={[
                    styles.errorText,
                    {
                      alignSelf:
                        application.language.key == LANAGUAGES_LIST.ARABIC
                          ? 'flex-end'
                          : 'flex-start',
                    },
                  ]}>
                  {application.language.data.ENTER_LOCATION}
                </Text>
              )}
            </>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={allValidate}>
          <Text style={styles.buttonText}>
            {application.language.data.REGISTER}
          </Text>
        </TouchableOpacity>
        <Modal transparent={true} visible={loadingModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.loadingModal}>
              {application.language.key == LANAGUAGES_LIST.ARABIC && (
                <ActivityIndicator size={WIDTH / 10} color={COLORS.PRIMARY12} />
              )}
              <Text style={styles.loadingText}>
                {application.language.data.SIGNING_UP}
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
  login: () => {},
});

export default connect(mapStateProps, mapDispatchProps)(Register);

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
  mapContainer: {
    height: HEIGHT / 3,
    width: inputWidth,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  map: {
    ...StyleSheet.absoluteFill,
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
    fontFamily: 'Poppins-Regular',
  },
});
