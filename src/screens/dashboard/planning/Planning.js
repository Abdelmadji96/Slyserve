import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ReactNativeCalendarStrip from 'react-native-calendar-strip';
import {fetchDoctorAppointments} from '../../../api/doctors';
import {setCall} from '../../../redux/actions/call';
import {firebase} from '../../../../firebase';
import {useFocusEffect} from '@react-navigation/native';

const appointmentHeight = HEIGHT / 3.5;
const appointmentWidth = WIDTH * 0.9;

const appointmentDateIconSize = 17.5;
const patientIconContainerSize = 40;

const Planning = ({navigation, application, user, role, token, makeCall}) => {
  const {drawer} = useTheme();
  const [appointments, setAppointments] = useState(null);
  const [date, setDate] = useState(new Date());

  const getAppointments = async date => {
    try {
      const response = await fetchDoctorAppointments(token);
      if (response) {
        setAppointments(
          response['results']
          .filter(
            appointment =>
              new Date(appointment.date_rdv).getFullYear() ==
                date.getFullYear() &&
              new Date(appointment.date_rdv).getMonth() == date.getMonth() &&
              new Date(appointment.date_rdv).getDate() == date.getDate(),
          ),
        );
      } else {
        Alert.alert(
          application.language.data.ALERT,
          application.language.data.ERROR_OCCURED,
        );
      }
    } catch (error) {
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.ERROR_OCCURED,
      );
      console.log(error);
    }
  };

  // useEffect(() => {
  //   getAppointments(date);
  // }, [date]);

  useFocusEffect(
    useCallback(() => {
      getAppointments(date);
    }, [date]),
  );

  const displayDate = date => {
    let newDate = new Date(date);
    let day =
      newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate();
    let month =
      newDate.getMonth() < 10
        ? '0' + (newDate.getMonth() + 1)
        : newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return year + '-' + month + '-' + day;
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
            name="menu"
            size={35}
            color={COLORS.PRIMARY12}
            onPress={() => navigation.openDrawer()}
          />
          <Text style={styles.headerTitle}>
            {application.language.data.MY_APPOINTMENTS}
          </Text>
          <FontAwesome5
            name="calendar-plus"
            size={30}
            color={COLORS.PRIMARY12}
            onPress={() => navigation.navigate('AddAppointment')}
          />
        </View>
        <ReactNativeCalendarStrip
          numDaysInWeek={7}
          scrollable
          scrollerPaging
          style={styles.calendarContainer}
          dateNameStyle={{
            fontSize: 10.5,
            fontWeight: 'bold',
            color: COLORS.PRIMARY12,
          }}
          dateNumberStyle={{
            fontSize: 14,
            color: COLORS.PRIMARY12,
          }}
          calendarHeaderStyle={{
            fontSize: 18,
            color: COLORS.PRIMARY12,
          }}
          selectedDate={date}
          onDateSelected={date => {
            // let day =
            //   date.toDate().getDate() < 10
            //     ? '0' + date.toDate().getDate()
            //     : date.toDate().getDate();
            // let month = 1 + date.toDate().getUTCMonth();
            // if (month < 10) {
            //   month = '0' + month;
            // }
            // let year = date.toDate().getFullYear();
            // let dateText = day + '-' + month + '-' + year;
            // getAppointments(dateText);
            setDate(new Date(date));
          }}
          highlightDateContainerStyle={{
            backgroundColor: COLORS.PRIMARY12,
          }}
          highlightDateNameStyle={{
            fontSize: 11,
            fontWeight: 'bold',
            color: COLORS.SECONDARY,
          }}
          highlightDateNumberStyle={{
            fontSize: 12,
            color: COLORS.SECONDARY,
          }}
        />
        {appointments ? (
          appointments.length > 0 ? (
            <FlatList
              data={appointments}
              renderItem={({item, index}) => (
                <View
                  style={[
                    styles.appointmentContainer,
                    {
                      marginBottom: index == appointments.length - 1 ? 20 : 0,
                    },
                  ]}>
                  <View style={styles.appointmentDateContainer}>
                    <View style={styles.appointmentDateItemContainer}>
                      <Feather
                        name="calendar"
                        size={appointmentDateIconSize}
                        color={COLORS.PRIMARY12}
                        style={styles.appointmentDateIcon}
                      />
                      <Text>{displayDate(item.date_rdv)}</Text>
                    </View>
                    <View style={styles.appointmentDateItemContainer}>
                      <Feather
                        name="clock"
                        size={appointmentDateIconSize}
                        color={COLORS.PRIMARY12}
                        style={styles.appointmentDateIcon}
                      />
                      <Text>{item.heure_rdv.substring(0, 5)}</Text>
                    </View>
                  </View>
                  <View style={styles.patientContainer}>
                    <View style={styles.patientIconContainer}>
                      <Feather
                        name="user"
                        size={patientIconContainerSize / 2}
                        color={COLORS.SECONDARY}
                      />
                    </View>
                    <View style={styles.patientNameContainer}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.patientName}>{item.nom} </Text>
                        <Text style={styles.patientName}>{item.prenom}</Text>
                      </View>
                      <Text>{item.telephone}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'flex-end',
                    }}>
                    <FontAwesome5
                      name="clinic-medical"
                      size={patientIconContainerSize / 2}
                      color={COLORS.PRIMARY12}
                      style={styles.appointmentDateIcon}
                    />
                    <Text style={styles.professionalName}>
                      {item.type_rdv == 'V' ? application.language.data.TELECONSULTATION : application.language.data.CABINET}
                    </Text>
                  </View>
                  {item.type_rdv !== 'C' && (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={async () => {
                        // // alert(
                        // //   JSON.stringify(
                        // //     firebase.firestore.Timestamp.fromDate(
                        // //       new Date(item.date_rdv),
                        // //     ) > firebase.firestore.Timestamp.now(),
                        // //   ),
                        // // );
                        // if (
                        //   firebase.firestore.Timestamp.fromDate(
                        //     new Date(item.date_rdv),
                        //   ) > firebase.firestore.Timestamp.now()
                        // ) {
                          await makeCall({
                            calling: true,
                            callee: {
                              id: 181,
                              notificationsToken:
                                'eZzpzlTdTLmjB0ooyB58zr:APA91bG9h7EMtbc3QZ7TFaOfKq51VsbzxJJMBeOYCBJhtn6dARfkjDBwiw1N9sbUB1i9TI04T5F5Xoz6qqKPkC8iahwkdI9aMD-P7UaB4SZGKOquxwjvuX35YLInh0iGBe13se9SIucW',
                            },
                          });
                        // } else {
                        //   alert('Appointment date passed');
                        // }
                      }}>
                      <Feather
                        name="video"
                        size={patientIconContainerSize / 2}
                        color={COLORS.PRIMARY12}
                        style={styles.appointmentDateIcon}
                      />
                      <Text>{application.language.data.BEGIN_APPOINTMENT}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
          ) : (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text>No available appointments</Text>
            </View>
          )
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <>
              <ActivityIndicator size="small" color={COLORS.PRIMARY12} />
              {/* <TouchableOpacity
                onPress={async () =>
                  await makeCall({
                    calling: true,
                    callee: {
                      id: 181,
                      notificationsToken:
                        'eZzpzlTdTLmjB0ooyB58zr:APA91bG9h7EMtbc3QZ7TFaOfKq51VsbzxJJMBeOYCBJhtn6dARfkjDBwiw1N9sbUB1i9TI04T5F5Xoz6qqKPkC8iahwkdI9aMD-P7UaB4SZGKOquxwjvuX35YLInh0iGBe13se9SIucW',
                    },
                  })
                }>
                <Text>Video call</Text>
              </TouchableOpacity> */}
            </>
          </View>
        )}
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
  makeCall: call => dispatch(setCall(call)),
});

export default connect(mapStateProps, mapDispatchProps)(Planning);

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
  calendarContainer: {
    height: 80,
    width: WIDTH,
  },
  appointmentContainer: {
    height: appointmentHeight,
    width: appointmentWidth,
    borderRadius: 15,
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: 10,
    marginTop: 10,
    shadowColor: COLORS.PRIMARY12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  appointmentDateContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appointmentDateItemContainer: {flexDirection: 'row', alignItems: 'center'},
  appointmentDateIcon: {marginRight: 5},
  patientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  patientIconContainer: {
    height: patientIconContainerSize,
    width: patientIconContainerSize,
    borderRadius: patientIconContainerSize,
    backgroundColor: COLORS.PRIMARY12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.PRIMARY12,
    marginHorizontal: 10,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    height: '25%',
    width: '80%',
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
