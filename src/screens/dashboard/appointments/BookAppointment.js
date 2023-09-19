import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import DrawerHiddenView from '../../../components/drawerHiddenView/DrawerHiddenView';
import {COLORS} from '../../../constants/colors';
import {HEIGHT, WIDTH} from '../../../constants/dimensions';
import {useTheme} from '../../../context/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {fetchDoctorInfos} from '../../../api/doctors';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {LANAGUAGES_LIST} from '../../../constants/languages';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import AvailableAppointments from '../../../components/availableAppointments/AvailableAppointments';
import {
  patientBookAppointment,
  patientFetchAppointments,
  patientProcessBalancePayment,
} from '../../../api/patients';
import moment from 'moment';
import {WebView} from 'react-native-webview';
import {updateUser} from '../../../redux/actions/user';
import {sendFCMNotification} from '../../../functions/notifications';

const professionalIconContainerSize = 40;
const radioButtonIconSize = 17.5;

const inputHeight = HEIGHT / 12.5;
const inputWidth = WIDTH * 0.9;
const buttonHeight = HEIGHT / 10;

const logoSize = 40;

const displayDate = date => {
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let month =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let year = date.getFullYear();
  return year + '-' + month + '-' + day;
};

const BookAppointment = ({
  navigation,
  route,
  application,
  user,
  setUser,
  role,
  token,
}) => {
  const {drawer} = useTheme();
  const [doctorInfos, setDoctorInfos] = useState(null);
  const [alreadyBeenConsulted, setAlreadyBeenConsulted] = useState(false);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState(0);
  const [appointmentTypeErrorVisible, setAppointmentTypeErrorVisible] =
    useState(false);
  const [date, setDate] = useState(new Date());
  const [datePickerOpened, setDatePickerOpened] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedHourValue, setSelectedHourValue] = useState(null);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(0);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const appointmentTypes = [
    {
      id: 1,
      title: application.language.data.CABINET,
    },
    {
      id: 2,
      title: application.language.data.TELECONSULTATION,
    },
  ];

  const getDoctorInfos = async () => {
    try {
      const response = await fetchDoctorInfos(route.params.doctor.medecin_id);
      if (response) {
        setDoctorInfos(response);
        // const response2 = await patientFetchAppointments(token);
        // alert(JSON.stringify(response2));
        getAvailableAppointments(response);
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

  const getAvailableAppointments = doctorInfos => {
    let rdvs = [];
    doctorInfos.horaires.map(horaire => {
      let ouverture = horaire ? parseInt(horaire.ouverture.split(':')[0]) : 0;
      let fermeture = horaire ? parseInt(horaire.fermeture.split(':')[0]) : 0;
      let minute = 0;
      const timeStampNow = Date.now();
      let selectedDateStamp = new Date(date);
      selectedDateStamp.setHours(0);
      selectedDateStamp.setMinutes(0);
      selectedDateStamp = selectedDateStamp.getTime();
      while (ouverture < fermeture) {
        minute = 0;
        while (minute < 60) {
          let rdv = {
            heure: '',
            available: true,
          };
          rdv.heure = `${ouverture}:${minute}`;
          if (minute === 0) {
            rdv.heure = `${ouverture}:00`;
          }
          if (
            timeStampNow >
            selectedDateStamp + ouverture * 60 * 60 * 1000 + minute * 60 * 1000
          ) {
            rdv.available = false;
          }
          doctorAppointments.map(r => {
            const h = parseInt(r.heure_rdv.split(':')[0]);
            const m = parseInt(r.heure_rdv.split(':')[1]);
            if (h === ouverture && minute === m) {
              rdv.available = false;
            }
          });
          rdvs.push(rdv);
          minute = minute + parseInt(doctorInfos.infos.duree_seance);
        }
        ouverture = ouverture + 1;
      }
    });
    //alert(JSON.stringify(rdvs));
    setAvailableAppointments(rdvs);
  };

  const displayDay = day => {
    switch (day) {
      case 0:
        return application.language.data.SUNDAY;
        break;
      case 1:
        return application.language.data.MONDAY;
        break;
      case 2:
        return application.language.data.TUESDAY;
        break;
      case 3:
        return application.language.data.WEDNESDAY;
        break;
      case 5:
        return application.language.data.FRIDAY;
        break;
      case 4:
        return application.language.data.THURSDAY;
        break;
      case 6:
        return application.language.data.SATURDAY;
        break;

      default:
        break;
    }
  };

  const handleBookAppointment = async () => {
    try {
      const response = await patientBookAppointment(
        moment(new Date(date)).format('YYYY-MM-DD'),
        selectedHourValue,
        `${doctorInfos.infos.id}${
          selectedAppointmentType == 1 ? 'C' : 'V'
        }${date}${selectedHour}`,
        doctorInfos.infos.id,
        user.id,
        selectedAppointmentType == 1 ? 'C' : 'V',
        token,
      );
      if (response) {
        if (response['message'] == 'success') {
          setLoadingModalVisible(false);
          Alert.alert(
            application.language.data.ALERT,
            application.language.data.APPOITMENT_BOOKED,
          );
          navigation.goBack();
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

  const handlePayment = async () => {
    if (selectedPaymentMethod !== 0) {
      if (selectedPaymentMethod == 2) {
        setLoadingModalVisible(true);
        try {
          const response = await patientProcessBalancePayment(
            token,
            selectedAppointmentType == 1
              ? route.params.doctor.tarif_cabinet
              : route.params.doctor.tarif_video,
          );
          if (response) {
            if (response['error']) {
              // if (
              //   response['error'].substr(0, 42) ==
              //   'insufficient funds your balance has just : '
              // ) {
              setLoadingModalVisible(false);
              Alert.alert(application.language.data.ALERT, response['error']);
              // } else {
              //   setLoadingModalVisible(false);
              //   Alert.alert(
              //     application.language.data.ALERT,
              //     application.language.data.ERROR_OCCURED,
              //   );
              // }
            } else {
              await setUser({...user, solde: response['newBalance']});
              sendFCMNotification(
                route.params.doctor.notificationsToken,
                'Slyserve',
                user.nom +
                  ' ' +
                  user.prenom +
                  'a reserve un rendez vous avec vous pour la date ' +
                  moment(new Date(date)).format('YYYY-MM-DD'),
              );
              handleBookAppointment();
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
      } else {
        //setWebViewVisible(true);
        //handleBookAppointment();
      }
    } else {
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.SELECT_PAYMENT_METHOD,
      );
    }
  };

  const allValidate = async () => {
    if (selectedAppointmentType && selectedHourValue) {
      setPaymentModalVisible(true);
    } else {
      Alert.alert(
        application.language.data.ALERT,
        application.langauge.data.ENTER_APPOINTMENT_DETAILS,
      );
    }
  };

  const getAppointmentPrice = () => {
    switch (selectedAppointmentType) {
      case 1:
        return route.params.doctor.tarif_cabinet;
        break;

      case 2:
        return route.params.doctor.tarif_video;
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    getDoctorInfos();
  }, [date]);

  return (
    <>
      <DrawerHiddenView />
      {webViewVisible ? (
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{scale: drawer.scale}],
              borderBottomLeftRadius: drawer.radius,
              borderTopLeftRadius: drawer.radius,
            },
          ]}>
          <WebView source={{uri: 'https://slyserve.dz/'}} />
        </Animated.View>
      ) : (
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
              {application.language.data.BOOK_APPOINTMENT}
            </Text>
            <Feather
              name="save"
              size={30}
              color={COLORS.PRIMARY12}
              onPress={allValidate}
            />
          </View>
          {doctorInfos ? (
            <ScrollView
              style={styles.bottomView}
              contentContainerStyle={{paddingBottom: buttonHeight * 1.5}}>
              <View style={styles.professionalContainer}>
                <View style={styles.professionalIconContainer}>
                  <FontAwesome5
                    name="stethoscope"
                    size={professionalIconContainerSize / 2}
                    color={COLORS.SECONDARY}
                  />
                </View>
                <View style={styles.professionalNameContainer}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.professionalName}>
                      {doctorInfos.infos.prenom}{' '}
                    </Text>
                    <Text style={styles.professionalName}>
                      {doctorInfos.infos.nom}
                    </Text>
                  </View>
                  <Text>{doctorInfos.infos.specialite}</Text>
                </View>
              </View>
              <Text style={styles.headerTitle}>
                {application.language.data.PRESENTATION}
              </Text>
              <Text>{doctorInfos.infos.presentation}</Text>
              <Text />
              <Text style={styles.headerTitle}>
                {application.language.data.PRICING}
              </Text>
              <View
                style={[
                  styles.row,
                  application.language.key == LANAGUAGES_LIST.ARABIC && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <Text>{application.language.data.TELECONSULTATION}</Text>
                <Text>
                  {doctorInfos.infos.tarif_video}{' '}
                  {application.language.key == LANAGUAGES_LIST.ARABIC
                    ? 'دج'
                    : 'DA'}
                </Text>
              </View>
              <View
                style={[
                  styles.row,
                  application.language.key == LANAGUAGES_LIST.ARABIC && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <Text>{application.language.data.CABINET}</Text>
                <Text>
                  {doctorInfos.infos.tarif_cabinet}{' '}
                  {application.language.key == LANAGUAGES_LIST.ARABIC
                    ? 'دج'
                    : 'DA'}
                </Text>
              </View>
              <Text />
              <Text style={styles.headerTitle}>
                {application.language.data.EXERCICE_ADDRESS}
              </Text>
              <View style={styles.mapContainer}>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  region={{
                    latitude: doctorInfos.infos.latitude,
                    longitude: doctorInfos.infos.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0221,
                  }}>
                  <Marker
                    coordinate={{
                      latitude: doctorInfos.infos.latitude,
                      longitude: doctorInfos.infos.longitude,
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
              <Text style={styles.headerTitle}>
                {application.language.data.WORKING_DAYS}
              </Text>
              <View
                style={[
                  styles.row,
                  {marginVertical: 5},
                  application.language.key == LANAGUAGES_LIST.ARABIC && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <Text style={styles.subTitle}>
                  {application.language.data.DAY}
                </Text>
                <Text style={styles.subTitle}>
                  {application.language.data.OPENING}
                </Text>
                <Text style={styles.subTitle}>
                  {application.language.data.CLOSING}
                </Text>
              </View>
              {doctorInfos.horaires.map(horaire => (
                <View
                  style={[
                    styles.row,
                    application.language.key == LANAGUAGES_LIST.ARABIC && {
                      flexDirection: 'row-reverse',
                    },
                  ]}>
                  <Text style={styles.subTitle}>
                    {displayDay(horaire.jour)}
                  </Text>
                  <Text>{horaire.ouverture.substr(0, 5)}</Text>
                  <Text>{horaire.fermeture.substr(0, 5)}</Text>
                </View>
              ))}
              <Text />
              <Text style={styles.headerTitle}>
                {application.language.data.CONTACT_INFORMATIONS}
              </Text>
              <View
                style={[
                  styles.row,
                  application.language.key == LANAGUAGES_LIST.ARABIC && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <Text style={styles.subTitle}>
                  {application.language.data.PHONE}
                </Text>
                <Text>{doctorInfos.infos.telephone}</Text>
              </View>
              <View
                style={[
                  styles.row,
                  application.language.key == LANAGUAGES_LIST.ARABIC && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <Text style={styles.subTitle}>
                  {application.language.data.EMAIL}
                </Text>
                <Text>{doctorInfos.infos.email}</Text>
              </View>
              <Text />
              <Text style={styles.headerTitle}>
                {application.language.data.SPOKEN_LANGUAGES}
              </Text>
              <Text>{doctorInfos.infos.langues_parlees}</Text>
              <Text />
              <Text style={styles.headerTitle}>
                {application.language.data.COURSES}
              </Text>
              <Text>{doctorInfos.infos.formations}</Text>
              <Text />
              <Text style={[styles.headerTitle, {alignSelf: 'center'}]}>
                {application.language.data.BOOK_APPOINTMENT}
              </Text>
              <Text />
              <Text>Fill your informations</Text>
              <Text />
              <Text style={styles.headerTitle}>
                {application.language.data.CONSULTED_BEFORE}
              </Text>
              <Text />
              <View
                style={[
                  styles.row,
                  application.language.key == LANAGUAGES_LIST.ARABIC && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    application.language.key == LANAGUAGES_LIST.ARABIC && {
                      flexDirection: 'row-reverse',
                    },
                  ]}
                  onPress={() => {
                    if (!alreadyBeenConsulted) {
                      setAlreadyBeenConsulted(true);
                    }
                  }}>
                  <Feather
                    name={alreadyBeenConsulted ? 'check-circle' : 'circle'}
                    size={radioButtonIconSize}
                    color={COLORS.PRIMARY12}
                    style={styles.radioButtonIcon}
                  />
                  <Text style={styles.subTitle}>
                    {application.language.data.YES}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    application.language.key == LANAGUAGES_LIST.ARABIC && {
                      flexDirection: 'row-reverse',
                    },
                  ]}
                  onPress={() => {
                    if (alreadyBeenConsulted) {
                      setAlreadyBeenConsulted(false);
                    }
                  }}>
                  <Feather
                    name={alreadyBeenConsulted ? 'circle' : 'check-circle'}
                    size={radioButtonIconSize}
                    color={COLORS.PRIMARY12}
                    style={styles.radioButtonIcon}
                  />
                  <Text style={styles.subTitle}>
                    {application.language.data.NO}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text />
              <Text style={styles.headerTitle}>
                {application.language.data.APPOINMENT_TYPE}
              </Text>
              <Text />
              <View style={styles.pickerContainer}>
                <View style={styles.picker}>
                  <MaterialCommunityIcons
                    name="format-list-bulleted-type"
                    color={COLORS.PRIMARY12}
                    size={25}
                    style={styles.pickerIcon}
                  />
                  <Picker
                    selectedValue={selectedAppointmentType}
                    style={{
                      flex: 1,
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      if (selectedAppointmentType !== itemValue) {
                        setSelectedAppointmentType(itemValue);
                        if (appointmentTypeErrorVisible) {
                          setAppointmentTypeErrorVisible(false);
                        }
                      }
                    }}>
                    <Picker.Item
                      value={0}
                      label={(() => {
                        switch (application.language.key) {
                          case LANAGUAGES_LIST.ARABIC:
                            return 'حدد نوع الموعد';
                            break;
                          case LANAGUAGES_LIST.FRENCH:
                            return 'Sélectionnez le type de rendez vous';
                            break;
                          case LANAGUAGES_LIST.ENGLISH:
                            return 'Select appointment type';
                            break;

                          default:
                            break;
                        }
                      })()}
                      value={0}
                      style={{textAlign: 'left'}}
                    />
                    {appointmentTypes.map(type => (
                      <Picker.Item
                        key={type.id.toString()}
                        label={type.title}
                        value={type.id}
                        enabled={
                          type.id == 1
                            ? route.params.doctor.abonner_formule_1 == 1
                              ? true
                              : false
                            : route.params.doctor.abonner_formule_2 == 1
                            ? true
                            : false
                        }
                      />
                    ))}
                  </Picker>
                </View>
                {appointmentTypeErrorVisible && (
                  <Text style={styles.errorText}>
                    {application.language.data.SELECT_APPOINTMENT_TYPE}
                  </Text>
                )}
              </View>
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
              <Text />
              <Text style={styles.headerTitle}>
                {application.language.data.APPOINMENT_HOUR}
              </Text>
              <Text />
              <AvailableAppointments
                date={displayDate(date)}
                //doctor={route.params.doctor.medecin_id}
                doctorInfos={doctorInfos}
                hour={selectedHour}
                setHour={setSelectedHour}
                setHourValue={setSelectedHourValue}
              />
              <Text />
            </ScrollView>
          ) : (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size="small" color={COLORS.PRIMARY12} />
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={allValidate}>
            <Text style={styles.buttonText}>
              {application.language.data.BOOK_APPOINTMENT}
            </Text>
          </TouchableOpacity>
          <Modal
            transparent={true}
            visible={paymentModalVisible}
            onRequestClose={() => setPaymentModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.paymentModal}>
                <Ionicons
                  name="close"
                  size={35}
                  color={COLORS.PRIMARY12}
                  style={{alignSelf: 'flex-end', marginRight: WIDTH * 0.05}}
                  onPress={() => setPaymentModalVisible(false)}
                />
                <Text style={styles.headerTitle}>
                  {application.language.data.SELECT_PAYMENT_METHOD}
                </Text>
                <TouchableOpacity
                  style={styles.paymentMethod}
                  onPress={() => {
                    if (selectedPaymentMethod !== 1) {
                      setSelectedPaymentMethod(1);
                    }
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Feather
                      name={
                        selectedPaymentMethod == 1 ? 'check-circle' : 'circle'
                      }
                      size={15}
                      color={COLORS.PRIMARY12}
                      style={{marginRight: 10}}
                    />
                    <Image
                      source={require('../../../assests/logos/cib.png')}
                      style={styles.logo}
                    />
                  </View>
                  <Text style={styles.headerTitle}>Credit card</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.paymentMethod}
                  onPress={() => {
                    if (selectedPaymentMethod !== 2) {
                      setSelectedPaymentMethod(2);
                    }
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Feather
                      name={
                        selectedPaymentMethod == 2 ? 'check-circle' : 'circle'
                      }
                      size={15}
                      color={COLORS.PRIMARY12}
                      style={{marginRight: 10}}
                    />
                    <Ionicons
                      name={'wallet-outline'}
                      size={logoSize}
                      color={COLORS.PRIMARY12}
                    />
                  </View>
                  <Text style={styles.headerTitle}>
                    {application.language.data.BALANCE} : {user?.solde}{' '}
                    {application.language.key == LANAGUAGES_LIST.ARABIC
                      ? 'دج'
                      : 'DA'}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    alignSelf: 'flex-end',
                    marginRight: WIDTH * 0.05,
                    color: COLORS.PRIMARY25,
                  }}>
                  {application.language.data.AMOUNT} : {getAppointmentPrice()}{' '}
                  {application.language.key == LANAGUAGES_LIST.ARABIC
                    ? 'دج'
                    : 'DA'}
                </Text>
                <TouchableOpacity
                  style={[styles.button, {position: 'relative', bottom: 0}]}
                  onPress={handlePayment}>
                  <Text style={styles.buttonText}>
                    {application.language.data.BOOK_APPOINTMENT}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal transparent={true} visible={loadingModalVisible}>
            <View style={styles.modalContainer}>
              <View style={styles.loadingModal}>
                {application.language.key == LANAGUAGES_LIST.ARABIC && (
                  <ActivityIndicator
                    size={WIDTH / 10}
                    color={COLORS.PRIMARY12}
                  />
                )}
                <Text style={styles.loadingText}>
                  {application.language.data.ADDING}
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
        </Animated.View>
      )}
    </>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
  user: store.userState.currentUser,
  token: store.userState.token,
});

const mapDispatchProps = dispatch => ({
  setUser: user => dispatch(updateUser(user)),
});

export default connect(mapStateProps, mapDispatchProps)(BookAppointment);

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
  professionalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: 30,
    alignSelf: 'center',
  },
  professionalIconContainer: {
    height: professionalIconContainerSize,
    width: professionalIconContainerSize,
    borderRadius: professionalIconContainerSize,
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
  professionalName: {
    fontSize: 16,
    fontWeight: '700',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
  subTitle: {fontSize: 16, fontWeight: '900'},
  radioButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonIcon: {marginHorizontal: 5},
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
  errorText: {
    color: COLORS.PRIMARY12,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  paymentModal: {
    height: HEIGHT * 0.8,
    width: WIDTH,
    backgroundColor: COLORS.SECONDARY,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  paymentMethod: {
    height: HEIGHT / 10,
    width: WIDTH * 0.9,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  logo: {
    height: logoSize,
    width: logoSize,
    borderRadius: logoSize,
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
