import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import {COLORS} from '../../../constants/colors';
import {HEIGHT, WIDTH} from '../../../constants/dimensions';
import {useTheme} from '../../../context/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import DrawerHiddenView from '../../../components/drawerHiddenView/DrawerHiddenView';
import DatePicker from 'react-native-date-picker';
import AnimatedTextInput from '../../../components/input/AnimatedTextInput';
import AvailableAppointments from '../../../components/availableAppointments/AvailableAppointments';
import {fetchDoctorInfos} from '../../../api/doctors';
import {useFocusEffect} from '@react-navigation/native';

const inputHeight = HEIGHT / 12.5;
const inputWidth = WIDTH * 0.9;
const buttonHeight = HEIGHT / 10;

const displayDate = date => {
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let month =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let year = date.getFullYear();
  return year + '-' + month + '-' + day;
};

const AddAppointment = ({navigation, application, user, role, token}) => {
  const {drawer} = useTheme();
  const [date, setDate] = useState(new Date());
  const [datePickerOpened, setDatePickerOpened] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [firstNameValidate, setFirstNameValidate] = useState(0);
  const [firstNameErrorVisible, setFirstNameErrorVisible] = useState(false);
  const [lastName, setLastName] = useState('');
  const [lastNameValidate, setLastNameValidate] = useState(0);
  const [lastNameErrorVisible, setLastNameErrorVisible] = useState(false);
  const [doctorInfos, setDoctorInfos] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedHourValue, setSelectedHourValue] = useState(null);

  const validate = (text, type) => {
    let alph = /^(?=.{3,15})/;
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
    }
  };

  const getDoctorInfos = async () => {
    try {
      const response = await fetchDoctorInfos(user.id);
      if (response) {
        setDoctorInfos(response);
      } else {
        Alert.alert(
          application.language.data.ALERT,
          application.language.data.ERROR_OCCURED,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   getDoctorInfos();
  // }, [date]);

  useFocusEffect(
    useCallback(() => {
      getDoctorInfos();
    }, [date]),
  );

  const handleAddAppointment = async () => {
    // try {
    //   const response = await patientBookAppointment(
    //     moment(new Date(date)).format('YYYY-MM-DD'),
    //     selectedHourValue,
    //     `${doctorInfos.infos.id}${
    //       selectedAppointmentType == 1 ? 'C' : 'V'
    //     }${date}${selectedHour}`,
    //     doctorInfos.infos.id,
    //     user.id,
    //     selectedAppointmentType == 1 ? 'C' : 'V',
    //     token,
    //   );
    //   if (response) {
    //     if (response['message'] == 'success') {
    //       alert('Appointment booked successfuly');
    //       navigation.goBack();
    //     }
    //   } else {
    //     Alert.alert(
    //       application.language.data.ALERT,
    //       application.language.data.ERROR_OCCURED,
    //     );
    //   }
    // } catch (error) {
    //   Alert.alert(
    //     application.language.data.ALERT,
    //     application.language.data.ERROR_OCCURED,
    //   );
    //   console.log(error);
    // }
  };

  const allValidate = () => {
    if (selectedHourValue && firstNameValidate == 1 && lastNameValidate == 1) {
      //handleAddAppointment()
      alert(1);
    } else {
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.ENTER_APPOINTMENT_DETAILS,
      );
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
            {application.language.data.ADD_APPOINTMENT}
          </Text>
          <Feather
            name="save"
            size={30}
            color={COLORS.PRIMARY12}
            //onPress={allValidate}
          />
        </View>
        <ScrollView
          style={styles.bottomView}
          contentContainerStyle={{
            paddingBottom: buttonHeight * 1.5,
            alignItems: 'center',
          }}>
          <Text />
          <AnimatedTextInput
            inputHeight={HEIGHT / 12.5}
            inputWidth={WIDTH * 0.9}
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
            inputHeight={HEIGHT / 12.5}
            inputWidth={WIDTH * 0.9}
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
          <>
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
                <Text style={styles.dateText}>{displayDate(date)}</Text>
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
              date={date}
              mode="date"
              minimumDate={new Date()}
              onConfirm={date => {
                setDatePickerOpened(false);
                setDate(date);
                setSelectedHour(null);
              }}
              onCancel={() => {
                setDatePickerOpened(false);
              }}
            />
          </>
          {/* <Text />
          <Text>{JSON.stringify(doctorInfos)}</Text> */}
          <Text />
          {doctorInfos && (
            <AvailableAppointments
              date={displayDate(date)}
              doctorInfos={doctorInfos}
              hour={selectedHour}
              setHour={setSelectedHour}
              setHourValue={setSelectedHourValue}
            />
          )}
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={allValidate}>
          <Text style={styles.buttonText}>{application.language.data.ADD}</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
  user: store.userState.currentUser,
  token: store.userState.token,
});

export default connect(mapStateProps, null)(AddAppointment);

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
    paddingHorizontal: 10,
  },
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
  pickerIcon: {marginHorizontal: 10},
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
});
