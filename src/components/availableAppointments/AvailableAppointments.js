import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {
  fetchDoctorAppointments,
  fetchDoctorWorkingHours,
} from '../../api/doctors';
import {patientFetchAppointments} from '../../api/patients';
import {COLORS} from '../../constants/colors';
import {HEIGHT, WIDTH} from '../../constants/dimensions';

const hourHeight = 80;
const columnsNumber = 3;
const hourWidth = (WIDTH - 20 - (columnsNumber - 1) * 10) / columnsNumber;

const AvailableAppointments = ({
  application,
  user,
  token,
  //doctor,
  doctorInfos,
  date,
  hour,
  setHour,
  setHourValue,
}) => {
  const [doctorAppointments, setDoctorAppointments] = useState(null);
  const [doctorWorkingHours, setDoctorWorkingHours] = useState(null);
  const [availableAppointments, setAvailableAppointments] = useState(null);

  // const getWorkingHours = async () => {
  //   try {
  //     const response = await fetchDoctorWorkingHours(doctor, date);
  //     if (response) {
  //       if (response['horaires']) {
  //         setDoctorAppointments(response['rdvs']);
  //         setDoctorWorkingHours(response['horaires']);
  //       }
  //     } else {
  //       Alert.alert(
  //         application.language.data.ALERT,
  //         application.language.data.ERROR_OCCURED,
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getAppointments = async () => {
    try {
      const response = await patientFetchAppointments(token);
      //alert(JSON.stringify(response['venir']));
      if (response) {
        setDoctorAppointments(response['venir']);
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

  const availableRDV = () => {
    let appointments = [];
    // doctorWorkingHours &&
    //   doctorWorkingHours
    //alert(new Date().getDay() +"\n"+JSON.stringify( doctorInfos.horaires))
    doctorInfos.horaires
      .filter(horaire => horaire.jour == new Date(date).getDay())
      .map(workingHour => {
        let opening = workingHour
          ? parseInt(workingHour.ouverture.split(':')[0])
          : 0;
        let closing = workingHour
          ? parseInt(workingHour.fermeture.split(':')[0])
          : 0;
        let minute = 0;
        const timeStampNow = Date.now();
        let selectedDateStamp = new Date(date);
        selectedDateStamp.setHours(0);
        selectedDateStamp.setMinutes(0);
        selectedDateStamp = selectedDateStamp.getTime();
        while (opening < closing) {
          minute = 0;
          while (minute < 60) {
            let rdv = {
              heure: '',
              available: true,
            };
            rdv.heure = `${opening}:${minute}`;
            if (minute === 0) {
              rdv.heure = `${opening}:00`;
            }
            if (
              timeStampNow >
              selectedDateStamp + opening * 60 * 60 * 1000 + minute * 60 * 1000
            ) {
              rdv.available = false;
            }
            doctorAppointments &&
              doctorAppointments.map(appointment => {
                const h = parseInt(appointment.heure_rdv.split(':')[0]);
                const m = parseInt(appointment.heure_rdv.split(':')[1]);
                if (h === opening && minute === m) {
                  rdv.available = false;
                }
              });
            appointments.push(rdv);
            minute = minute + parseInt(doctorInfos.infos.duree_seance);
          }
          opening = opening + 1;
        }
      });
    //alert(JSON.stringify(appointments))
    setAvailableAppointments(appointments);
  };

  useEffect(() => {
    getAppointments();
    //getWorkingHours();
  }, [date]);

  useEffect(() => {
    availableRDV();
  }, [doctorAppointments]);

  return (
    <>
      {
        //doctorWorkingHours ?
        availableAppointments && availableAppointments.length > 0 ? (
          <FlatList
            numColumns={columnsNumber}
            showsVerticalScrollIndicator={false}
            data={availableAppointments}
            renderItem={({item, index}) => (
              <TouchableOpacity
                disabled={item.available == false}
                style={[
                  styles.hourContainer,
                  {
                    borderColor: item.available
                      ? COLORS.PRIMARY12
                      : COLORS.GRAY,
                    backgroundColor:
                      index == hour ? COLORS.PRIMARY12 : 'transparent',
                  },
                  index == hour && {
                    shadowColor: COLORS.PRIMARY12,
                    shadowOffset: {
                      width: 0,
                      height: 5,
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,
                    elevation: 10,
                  },
                ]}
                onPress={() => {
                  if (index !== hour && item.available) {
                    //alert(JSON.stringify(availableAppointments.filter((_,appointmentIndex)=>appointmentIndex==index).pop().heure))
                    setHour(index);
                    setHourValue(
                      availableAppointments
                        .filter(
                          (_, appointmentIndex) => appointmentIndex == index,
                        )
                        .pop().heure,
                    );
                  }
                }}>
                <Text
                  style={[
                    styles.hourText,
                    index == hour && {color: COLORS.SECONDARY},
                  ]}>
                  {item.heure}
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={{alignSelf: 'center'}}>
            {application.language.data.NO_AVAILABLE_APPOINMENTS}
          </Text>
        )
        // : (
        //   <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        //     <ActivityIndicator size="small" color={COLORS.PRIMARY12} />
        //   </View>
        // )
      }
    </>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
  user: store.userState.currentUser,
  token: store.userState.token,
});

export default connect(mapStateProps, null)(AvailableAppointments);

const styles = StyleSheet.create({
  hourContainer: {
    height: hourHeight,
    width: hourWidth,
    borderRadius: 15,
    borderWidth: 2.5,
    marginRight: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourText: {
    fontSize: 18,
    fontWeight: '900',
  },
});
