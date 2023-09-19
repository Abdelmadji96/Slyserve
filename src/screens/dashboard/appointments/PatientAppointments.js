import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
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
import {
  patientCancelAppointment,
  patientFetchAppointments,
} from '../../../api/patients';
import {useFocusEffect} from '@react-navigation/core';
import {LANAGUAGES_LIST} from '../../../constants/languages';

const tabsContainerHeight = HEIGHT / 12.5;
const tabsContainerWidth = WIDTH * 0.85;
const tabWidth = (tabsContainerWidth - 20) / 3;

const appointmentHeight = HEIGHT / 3.5;
const appointmentWidth = WIDTH * 0.9;

const appointmentDateIconSize = 17.5;
const professionalIconContainerSize = 40;

const PatientAppointments = ({navigation, route, application, user, token}) => {
  const {drawer} = useTheme();
  const [appointments, setAppointments] = useState(null);
  const [tempAppointments, setTempAppointments] = useState(null);
  const [pastAppointments, setPastAppointments] = useState(null);
  const [comingAppointments, setComingAppointments] = useState(null);
  const [ancelledAppointments, setCancelledAppointments] = useState(null);
  const [selectedTab, setSelectedTab] = useState(1);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const tabsArray = [
    {
      id: 0,
      title: application.language.data.PAST,
    },
    {
      id: 1,
      title: application.language.data.COMING,
    },
    {
      id: 2,
      title: application.language.data.CANCELLED,
    },
  ];

  const getAppointments = async () => {
    try {
      const response = await patientFetchAppointments(token);
      if (response) {
        setAppointments(response);
        setTempAppointments(response['venir']);
        setPastAppointments(response['passe']);
        setComingAppointments(response['venir']);
        setCancelledAppointments(response['annule']);
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

  const handleCancelAppointment = async id => {
    setLoadingModalVisible(true);
    try {
      const response = await patientCancelAppointment(token, id);
      if (response) {
        if (response['message'] == 'success') {
          setLoadingModalVisible(false);
          setTempAppointments(
            tempAppointments.filter(appointment => appointment.id !== id),
          );
          setComingAppointments(
            comingAppointments.filter(appointment => appointment.id !== id),
          );
          Alert.alert('', application.language.data.CANCELLED_SUCCESSFULY);
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

  useFocusEffect(
    useCallback(() => {
      getAppointments();
      //if (selectedTab !== 1) {
      setSelectedTab(1);
      //}
    }, []),
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

  // useEffect(() => {
  //   getAppointments();
  // }, []);

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
          <View />
        </View>
        <View style={styles.tabsContainer}>
          {tabsArray.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    tab.id == selectedTab ? COLORS.SECONDARY : COLORS.PRIMARY12,
                },
              ]}
              onPress={() => {
                if (selectedTab !== tab.id) {
                  setSelectedTab(tab.id);
                  switch (tab.id) {
                    case 0:
                      setTempAppointments(appointments['passe']);
                      break;

                    case 1:
                      setTempAppointments(appointments['venir']);
                      break;

                    case 2:
                      setTempAppointments(appointments['annule']);
                      break;

                    default:
                      break;
                  }
                }
              }}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[
                  styles.headerTitle,
                  {
                    color:
                      tab.id == selectedTab
                        ? COLORS.PRIMARY12
                        : COLORS.SECONDARY,
                  },
                ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.subContainer}>
          {tempAppointments ? (
            tempAppointments.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={tempAppointments}
                renderItem={({item, index}) => (
                  <View
                    style={[
                      styles.appointmentContainer,
                      {
                        marginBottom:
                          index == tempAppointments.length - 1 ? 20 : 0,
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
                            {item.nom}{' '}
                          </Text>
                          <Text style={styles.professionalName}>
                            {item.prenom}
                          </Text>
                        </View>
                        <Text>{item.nom_fr}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'flex-end',
                      }}>
                      {item.type_rdv == 'V' ? (
                        <MaterialCommunityIcons
                          name="video-box"
                          size={professionalIconContainerSize / 1.5}
                          color={COLORS.PRIMARY12}
                          style={styles.appointmentDateIcon}
                        />
                      ) : (
                        <FontAwesome5
                          name="clinic-medical"
                          size={professionalIconContainerSize / 2}
                          color={COLORS.PRIMARY12}
                          style={styles.appointmentDateIcon}
                        />
                      )}
                      <Text style={styles.professionalName}>
                        {item.type_rdv == 'V'
                          ? application.language.data.TELECONSULTATION
                          : application.language.data.CABINET}
                      </Text>
                    </View>
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          {width: selectedTab == 1 ? '45%' : '80%'},
                        ]}
                        onPress={() => {
                          // if (
                          //   item.abonner_formule1 == 1 ||
                          //   item.abonner_formule2 == 1
                          // ) {
                          navigation.navigate('BookAppointment', {
                            doctor: item,
                          });
                          //}
                        }}>
                        <FontAwesome5
                          name="calendar-plus"
                          size={professionalIconContainerSize / 2}
                          color={COLORS.PRIMARY12}
                          style={styles.appointmentDateIcon}
                        />
                        <Text style={styles.buttonText}>
                          {application.language.data.REBOOK_APPOINTMENT}
                        </Text>
                      </TouchableOpacity>
                      {selectedTab == 1 && (
                        <TouchableOpacity
                          style={[styles.button, {width: '45%'}]}
                          onPress={() => {
                            Alert.alert(
                              application.language.data.ALERT,
                              application.language.data
                                .CONFIRM_CANCEL_APPOINTMENT,
                              [
                                {
                                  text: application.language.data.YES,
                                  onPress: () => {
                                    handleCancelAppointment(item.id);
                                  },
                                  style: 'default',
                                },
                                {
                                  text: application.language.data.NO,
                                  //onPress: () => {},
                                  style: 'cancel',
                                },
                              ],
                              {
                                cancelable: true,
                                onDismiss: () => console.log('Alert dismissed'),
                              },
                            );
                          }}>
                          <FontAwesome5
                            name="calendar-times"
                            size={professionalIconContainerSize / 2}
                            color={COLORS.PRIMARY12}
                            style={styles.appointmentDateIcon}
                          />
                          <Text //style={styles.cancelText}
                          >
                            {application.language.data.CANCEL}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text>
                  {/* {(() => {
                    switch (selectedTab) {
                      case 0:
                        return 'No past appointments';
                        break;

                      case 1:
                        return 'No coming appointments';
                        break;

                      case 2:
                        return 'No cancelled appointments';
                        break;

                      default:
                        break;
                    }
                  })()} */}
                  {application.language.data.NO_APPOINTMENTS}
                </Text>
              </View>
            )
          ) : (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size="small" color={COLORS.PRIMARY12} />
            </View>
          )}
        </View>
        <Modal transparent={true} visible={loadingModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.loadingModal}>
              {application.language.key == LANAGUAGES_LIST.ARABIC && (
                <ActivityIndicator size={WIDTH / 10} color={COLORS.PRIMARY12} />
              )}
              <Text style={styles.loadingText}>
                {application.language.data.CANCELLING}
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

const mapDispatchProps = dispatch => ({});

export default connect(mapStateProps, mapDispatchProps)(PatientAppointments);

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
  tabsContainer: {
    height: tabsContainerHeight,
    width: tabsContainerWidth,
    borderRadius: 10,
    backgroundColor: COLORS.PRIMARY12,
    paddingHorizontal: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY12,
    marginVertical: 15,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  tab: {
    height: '80%',
    width: tabWidth,
    borderRadius: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subContainer: {
    flex: 1,
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
  professionalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
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
  buttonsContainer: {
    height: '25%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button: {
    height: '100%',
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  buttonText: {
    textAlign: 'center',
  },
  cancelText: {
    fontWeight: 'bold',
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
