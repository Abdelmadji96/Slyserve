import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  Animated as RNAnimated,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, { Extrapolate } from 'react-native-reanimated';
import DrawerHiddenView from '../../../components/drawerHiddenView/DrawerHiddenView';
import { COLORS } from '../../../constants/colors';
import { HEIGHT, WIDTH } from '../../../constants/dimensions';
import { useTheme } from '../../../context/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { USER_ROLES } from '../../../constants/user';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { Picker } from '@react-native-picker/picker';
import { LANAGUAGES_LIST } from '../../../constants/languages';
import { fetchWilayas } from '../../../api/wilayas';
import { fetchCommunes } from '../../../api/communes';
import { fetchSpecialites } from '../../../api/specialties';
import { fetchDoctors } from '../../../api/doctors';
import { fetchParamedicals } from '../../../api/paramedicals';
import { fetchClinics } from '../../../api/clinics';
import { fetchLaboratories } from '../../../api/laboratories';
import { fetchPharmacies } from '../../../api/pharmacies';
import { fetchAmbulances } from '../../../api/ambulances';
import { fetchBloodDonors } from '../../../api/bloodDonors';

const drawerIconContainerSize = 50;
const bottomTabsIconSize = 30;
const professionalIconSize = 20;
const professionalHeight = HEIGHT / 15;
const professionalWidth = WIDTH / 2;
const inputHeight = HEIGHT / 12.5;
const inputWidth = WIDTH * 0.75;
const buttonHeight = HEIGHT / 12.5;
const resultIconSize = 20;
const resultHeight = HEIGHT / 4;
const resultWidth = WIDTH * 0.75;
const professionalIconContainerSize = 45;

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

const Home = ({ navigation, application, user, role }) => {
  const { drawer } = useTheme();
  const [selectedProfessional, setSelectedProfessional] = useState(
    USER_ROLES.DOCTOR,
  );
  const [filterModalVisible, setFilterModalVisible] = useState(true);
  const professionals = [
    {
      role: USER_ROLES.DOCTOR,
      name: application.language.data.DOCTOR,
      icon: (
        <FontAwesome5
          name="stethoscope"
          size={professionalIconSize}
          color={
            selectedProfessional == USER_ROLES.DOCTOR
              ? COLORS.SECONDARY
              : COLORS.PRIMARY12
          }
          style={styles.professionalIcon}
        />
      ),
    },
    {
      role: USER_ROLES.PARAMEDICAL,
      name: application.language.data.PARAMEDICAL,
      icon: (
        <FontAwesome5
          name="briefcase-medical"
          size={professionalIconSize}
          color={
            selectedProfessional == USER_ROLES.PARAMEDICAL
              ? COLORS.SECONDARY
              : COLORS.PRIMARY12
          }
          style={styles.professionalIcon}
        />
      ),
    },
    {
      role: USER_ROLES.CLINIC_HOSPITAL,
      name: application.language.data.CLINIC_HOSPITAL,
      icon: (
        <FontAwesome5
          name="hospital"
          size={professionalIconSize}
          color={
            selectedProfessional == USER_ROLES.CLINIC_HOSPITAL
              ? COLORS.SECONDARY
              : COLORS.PRIMARY12
          }
          style={styles.professionalIcon}
        />
      ),
    },
    {
      role: USER_ROLES.LABORATORY,
      name: application.language.data.LABORATORY,
      icon: (
        <Fontisto
          name="test-tube"
          size={professionalIconSize}
          color={
            selectedProfessional == USER_ROLES.LABORATORY
              ? COLORS.SECONDARY
              : COLORS.PRIMARY12
          }
          style={styles.professionalIcon}
        />
      ),
    },
    {
      role: USER_ROLES.PHARMACY,
      name: application.language.data.PHARMACY,
      icon: (
        <Fontisto
          name="drug-pack"
          size={professionalIconSize}
          color={
            selectedProfessional == USER_ROLES.PHARMACY
              ? COLORS.SECONDARY
              : COLORS.PRIMARY12
          }
          style={styles.professionalIcon}
        />
      ),
    },
    {
      role: USER_ROLES.AMBULANCE,
      name: application.language.data.AMBULANCE,
      icon: (
        <FontAwesome5
          name="ambulance"
          size={professionalIconSize}
          color={
            selectedProfessional == USER_ROLES.AMBULANCE
              ? COLORS.SECONDARY
              : COLORS.PRIMARY12
          }
          style={styles.professionalIcon}
        />
      ),
    },
    {
      role: USER_ROLES.BLOOD_DONOR,
      name: application.language.data.BLOOD_DONOR,
      icon: (
        <Fontisto
          name="blood-drop"
          size={professionalIconSize}
          color={
            selectedProfessional == USER_ROLES.BLOOD_DONOR
              ? COLORS.SECONDARY
              : COLORS.PRIMARY12
          }
          style={styles.professionalIcon}
        />
      ),
    },
  ];
  const [wilayas, setWilayas] = useState(null);
  const [communes, setCommunes] = useState(null);
  const [specialties, setSpecialties] = useState(null);
  const [wilaya, setWilaya] = useState(0);
  const [commune, setCommune] = useState(0);
  const [specialty, setSpecialty] = useState(0);
  const [wilayaErrorVisible, setWilayaErrorVisible] = useState(false);
  const [results, setResults] = useState([]);
  const [onScrollEndCallable, setOnScrollEndCallable] = useState(false);
  const mapRef = useRef();
  const professionalsRef = useRef();
  const scrollX = useRef(new RNAnimated.Value(0));
  const [selectedResult, setSelectedResult] = useState(0);
  const resultsRef = useRef();
  const [bloodType, setBloodType] = useState(0);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const fitMapToContent = results => {
    mapRef.current.fitToCoordinates(
      results.map(result => ({
        latitude: result.latitude,
        longitude: result.longitude,
      })),
      {
        edgePadding: {
          top: HEIGHT / 4,
          right: 50,
          bottom: HEIGHT / 4,
          left: 50,
        },
        animated: true,
      },
    );
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

  const displayValue = item => {
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

  const getDoctors = async () => {
    try {
      const response = await fetchDoctors(wilaya, commune, specialty);
      if (response) {
        setLoadingModalVisible(false);
        setResults(response);
        if (response.length > 0) {
          setSelectedResult(response[0].id);
        } else {
          setLoadingModalVisible(false);
          Alert.alert('', application.language.data.NO_RESULTS);
        }
        setFilterModalVisible(false);
        fitMapToContent(response);
      }
    } catch (error) {
      setLoadingModalVisible(false);
      alert(JSON.stringify(error));
      console.log(error);
    }
  };

  const getParamedicals = async () => {
    try {
      const response = await fetchParamedicals(wilaya, commune, specialty);
      if (response) {
        setLoadingModalVisible(false);
        setResults(response);
        if (response.length > 0) {
          setSelectedResult(response[0].id);
        } else {
          setLoadingModalVisible(false);
          Alert.alert('', application.language.data.NO_RESULTS);
        }
        setFilterModalVisible(false);
        fitMapToContent(response);
      }
    } catch (error) {
      setLoadingModalVisible(false);
      alert(JSON.stringify(error));
      console.log(error);
    }
  };

  const getClinics = async () => {
    try {
      const response = await fetchClinics(wilaya, commune);
      if (response) {
        setLoadingModalVisible(false);
        setResults(response['results']);
        if (response['results'].length > 0) {
          setSelectedResult(response['results'][0].id);
        } else {
          setLoadingModalVisible(false);
          Alert.alert('', application.language.data.NO_RESULTS);
        }
        setFilterModalVisible(false);
        fitMapToContent(response['results']);
      }
    } catch (error) {
      setLoadingModalVisible(false);
      alert(JSON.stringify(error));
      console.log(error);
    }
  };

  const getLaboratories = async () => {
    try {
      const response = await fetchLaboratories(wilaya, commune);
      if (response) {
        setLoadingModalVisible(false);
        setResults(
          response['results'].map((result, index) => ({ ...result, id: index })),
        );
        if (response['results'].length > 0) {
          setSelectedResult(0);
        } else {
          setLoadingModalVisible(false);
          Alert.alert('', application.language.data.NO_RESULTS);
        }
        setFilterModalVisible(false);
        fitMapToContent(response['results']);
      }
    } catch (error) {
      setLoadingModalVisible(false);
      alert(JSON.stringify(error));
      console.log(error);
    }
  };

  const getPharmacies = async () => {
    try {
      const response = await fetchPharmacies(wilaya, commune);
      if (response) {
        setLoadingModalVisible(false);
        setResults(
          response['results'].map((result, index) => ({ ...result, id: index })),
        );
        if (response['results'].length > 0) {
          setSelectedResult(0);
        } else {
          setLoadingModalVisible(false);
          Alert.alert('', application.language.data.NO_RESULTS);
        }
        setFilterModalVisible(false);
        fitMapToContent(response['results']);
      }
    } catch (error) {
      setLoadingModalVisible(false);
      alert(JSON.stringify(error));
      console.log(error);
    }
  };

  const getAmbulances = async () => {
    try {
      const response = await fetchAmbulances(wilaya, commune);
      if (response) {
        setLoadingModalVisible(false);
        setResults(
          response['results'].map((result, index) => ({ ...result, id: index })),
        );
        if (response['results'].length > 0) {
          setSelectedResult(0);
        } else {
          setLoadingModalVisible(false);
          Alert.alert('', application.language.data.NO_RESULTS);
        }
        setFilterModalVisible(false);
        fitMapToContent(response['results']);
      }
    } catch (error) {
      setLoadingModalVisible(false);
      alert(JSON.stringify(error));
      console.log(error);
    }
  };

  const getBloodDonors = async () => {
    try {
      const response = await fetchBloodDonors(
        wilaya,
        commune,
        bloodType == 0
          ? bloodType
          : bloodTypes.filter(type => type.id == bloodType).pop().type,
      );
      console.log(JSON.stringify(response));
      if (response) {
        setLoadingModalVisible(false);
        setResults(
          response['results'].map((result, index) => ({ ...result, id: index })),
        );
        if (response['results'].length > 0) {
          setSelectedResult(0);
        } else {
          setLoadingModalVisible(false);
          Alert.alert('', application.language.data.NO_RESULTS);
        }
        setFilterModalVisible(false);
        fitMapToContent(response['results']);
      }
    } catch (error) {
      setLoadingModalVisible(false);
      alert(JSON.stringify(error));
      console.log(error);
    }
  };

  const allVaildate = () => {
    if (wilaya !== 0) {
      setLoadingModalVisible(true);
      switch (selectedProfessional) {
        case USER_ROLES.DOCTOR:
          getDoctors();
          break;

        case USER_ROLES.PARAMEDICAL:
          getParamedicals();
          break;

        case USER_ROLES.CLINIC_HOSPITAL:
          getClinics();
          break;

        case USER_ROLES.LABORATORY:
          getLaboratories();
          break;

        case USER_ROLES.PHARMACY:
          getPharmacies();
          break;

        case USER_ROLES.AMBULANCE:
          getAmbulances();
          break;

        case USER_ROLES.BLOOD_DONOR:
          getBloodDonors();

        default:
          break;
      }
    } else {
      setWilayaErrorVisible(true);
      Alert.alert(
        application.language.data.ALERT,
        application.language.data.SELECT_CITY,
      );
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
            transform: [{ scale: drawer.scale }],
            borderBottomLeftRadius: drawer.radius,
            borderTopLeftRadius: drawer.radius,
          },
        ]}>
        <View style={styles.subContainer}>
          <MapView provider={PROVIDER_GOOGLE} style={{ flex: 1 }} ref={mapRef}>
            {results &&
              results.map((result, index) => (
                <Marker
                  coordinate={{
                    latitude: result.latitude,
                    longitude: result.longitude,
                  }}
                  onPress={() => {
                    if (result.id !== selectedResult) {
                      setSelectedResult(result.id);
                      //resultsRef.current.scrollToIndex({index, animated: true});
                      resultsRef.current.scrollToOffset({
                        offset: index * resultWidth,
                        animated: true,
                      });
                    }
                  }}>
                  <Ionicons
                    name="location-sharp"
                    size={35}
                    color={COLORS.PRIMARY12}
                    style={{
                      opacity: result.id == selectedResult ? 1 : 0.4,
                    }}
                  />
                </Marker>
              ))}
          </MapView>
          <View style={styles.bottomTabs}>
            <TouchableOpacity style={styles.tab}>
              <Feather
                name="home"
                size={bottomTabsIconSize}
                color={COLORS.PRIMARY12}
              />
            </TouchableOpacity>
            {
              user ? (
                <TouchableOpacity style={styles.tab}>
                  <Feather
                    name="user"
                    size={bottomTabsIconSize}
                    color={COLORS.PRIMARY12}
                  />
                </TouchableOpacity>
              ) : null
              // <>
              //   <TouchableOpacity
              //     style={styles.tab}
              //     onPress={() => navigation.navigate('Register')}>
              //     <Feather
              //       name="user-plus"
              //       size={bottomTabsIconSize}
              //       color={COLORS.PRIMARY12}
              //     />
              //   </TouchableOpacity>
              //   <TouchableOpacity
              //     style={styles.tab}
              //     onPress={() => navigation.navigate('Login')}>
              //     <Feather
              //       name="log-in"
              //       size={bottomTabsIconSize}
              //       color={COLORS.PRIMARY12}
              //     />
              //   </TouchableOpacity>
              // </>
            }
            <TouchableOpacity
              style={styles.tab}
              onPress={() => navigation.navigate('AboutUs')}>
              <MaterialIcons
                name="info-outline"
                size={bottomTabsIconSize}
                color={COLORS.PRIMARY12}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.drawerIconContainer,
            {
              left: drawerIconContainerSize / 4,
              backgroundColor: COLORS.PRIMARY12,
            },
          ]}
          onPress={() => navigation.openDrawer()}>
          <Ionicons
            name="menu"
            size={drawerIconContainerSize / 1.5}
            color={COLORS.SECONDARY}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.drawerIconContainer,
            {
              right: drawerIconContainerSize / 4,
              backgroundColor: COLORS.SECONDARY,
            },
          ]}
          onPress={() => setFilterModalVisible(true)}>
          <Feather
            name="filter"
            size={drawerIconContainerSize / 1.5}
            color={COLORS.PRIMARY12}
          />
        </TouchableOpacity>
        <Text style={styles.title}>
          {application.language.data.IN_SEARCH_FOR}
        </Text>
        <ScrollView
          ref={professionalsRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.professionalsContainer}>
          {professionals.map((professional, index) => (
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.professional,
                {
                  marginRight:
                    index == professionals.length - 1
                      ? drawerIconContainerSize / 4
                      : 0,
                  backgroundColor:
                    professional.role == selectedProfessional
                      ? COLORS.PRIMARY12
                      : COLORS.SECONDARY,
                },
              ]}
              onPress={() => {
                if (professional.role !== selectedProfessional) {
                  setSelectedProfessional(professional.role);
                  setFilterModalVisible(true);
                } else {
                  setFilterModalVisible(true);
                }
                professionalsRef.current.scrollTo({
                  x: professionalWidth * index,
                  animated: true,
                });
              }}>
              {professional.icon}
              <Text
                style={[
                  styles.professionalName,
                  {
                    color:
                      professional.role == selectedProfessional
                        ? COLORS.SECONDARY
                        : COLORS.PRIMARY12,
                  },
                ]}>
                {professional.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {results.length > 0 && (
          <RNAnimated.FlatList
            ref={resultsRef}
            style={styles.resultsContainer}
            bounces={false}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={results}
            snapToInterval={resultWidth}
            scrollEventThrottle={16}
            decelerationRate="normal"
            onMomentumScrollBegin={() => setOnScrollEndCallable(true)}
            onMomentumScrollEnd={e => {
              const index = Math.floor(
                e.nativeEvent.contentOffset.x / resultWidth,
              ).toFixed(0);
              if (onScrollEndCallable && results[index]) {
                setSelectedResult(results[index].id);
                fitMapToContent([results[index]]);
                setOnScrollEndCallable(false);
              }
            }}
            onScroll={RNAnimated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX.current } } }],
              { useNativeDriver: true },
            )}
            renderItem={({ item, index }) => {
              const inputRange = [
                (index - 1) * resultWidth,
                index * resultWidth,
                (index + 1) * resultWidth,
              ];
              const scale = scrollX.current.interpolate({
                inputRange,
                outputRange: [0.9, 1, 0.9],
                extrapolate: Extrapolate.CLAMP,
              });
              switch (selectedProfessional) {
                case USER_ROLES.DOCTOR:
                  return (
                    <RNAnimated.View
                      style={[
                        styles.doctorResultContainer,
                        {
                          marginLeft:
                            index == 0 ? (WIDTH - resultWidth) / 2 : 0,
                          marginRight:
                            index == results.length - 1
                              ? (WIDTH - resultWidth) / 2
                              : 0,
                          transform: [{ scale }],
                        },
                      ]}>
                      <TouchableOpacity style={styles.doctorContainer}>
                        <View style={styles.professionalIconContainer}>
                          <FontAwesome5
                            name="stethoscope"
                            size={professionalIconContainerSize / 2}
                            color={COLORS.SECONDARY}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.professionalName}>
                            {item.nom} {item.prenom}
                          </Text>
                          <Text numberOfLines={1} style={{ maxWidth: '90%' }}>
                            {item.specialite}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <Text numberOfLines={1} style={{ maxWidth: '95%' }}>
                        {item.nom_de_rue}
                        {' - '}
                        {item.commune}
                        {' - '}
                        {item.wilaya}
                      </Text>
                      {item.abonner_formule_2 == 1 && (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Feather
                            name="video"
                            size={professionalIconSize}
                            color={COLORS.PRIMARY12}
                            style={styles.professionalIcon}
                          />
                          <Text>
                            {application.language.data.VIDEO_AVAILABLE}
                          </Text>
                        </View>
                      )}
                      {user ? (
                        item.abonner_formule_1 == 1 &&
                        role == USER_ROLES.PATIENT && (
                          <TouchableOpacity
                            style={styles.appointmentButton}
                            onPress={() => {
                              if (user) {
                                if (role == USER_ROLES.PATIENT) {
                                  navigation.navigate('BookAppointment', {
                                    doctor: { ...item, medecin_id: item.id },
                                  });
                                } else {
                                  alert(
                                    'You have to be logged in as a patient to book an appointment',
                                  );
                                }
                              } else {
                                alert(
                                  'You have to be logged in to book an appointment',
                                );
                              }
                            }}>
                            <Feather
                              name="calendar"
                              size={professionalIconSize}
                              color={COLORS.PRIMARY12}
                              style={styles.professionalIcon}
                            />
                            <Text style={styles.appointmentText}>
                              {application.language.data.BOOK_APPOINTMENT}
                            </Text>
                          </TouchableOpacity>
                        )
                      ) : (
                        <TouchableOpacity style={styles.appointmentButton}>
                          <Feather
                            name="calendar"
                            size={professionalIconSize}
                            color={COLORS.PRIMARY12}
                            style={styles.professionalIcon}
                          />
                          <Text style={styles.appointmentText}>
                            {application.language.data.BOOK_APPOINTMENT}
                          </Text>
                        </TouchableOpacity>
                      )}
                      {item.abonner_formule_1 == 0 &&
                        item.abonner_formule_2 == 0 && (
                          <Text
                            style={[
                              styles.professionalName,
                              { color: COLORS.PRIMARY12 },
                            ]}>
                            {
                              application.language.data
                                .CONSULTATION_NOT_AVAILABLE
                            }
                          </Text>
                        )}
                    </RNAnimated.View>
                  );
                  break;

                case USER_ROLES.PARAMEDICAL:
                  return (
                    <RNAnimated.View
                      style={[
                        styles.doctorResultContainer,
                        {
                          marginLeft:
                            index == 0 ? (WIDTH - resultWidth) / 2 : 0,
                          marginRight:
                            index == results.length - 1
                              ? (WIDTH - resultWidth) / 2
                              : 0,
                          transform: [{ scale }],
                        },
                      ]}>
                      <View style={styles.doctorContainer}>
                        <View style={styles.professionalIconContainer}>
                          <FontAwesome5
                            name="briefcase-medical"
                            size={professionalIconContainerSize / 2}
                            color={COLORS.SECONDARY}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.professionalName}>
                            {item.nom} {item.prenom}
                          </Text>
                          <Text numberOfLines={1} style={{ maxWidth: '90%' }}>
                            {item.specialite}
                          </Text>
                        </View>
                      </View>
                      <Text numberOfLines={1} style={{ maxWidth: '95%' }}>
                        {item.nom_de_rue}
                        {' - '}
                        {item.commune}
                        {' - '}
                        {item.wilaya}
                      </Text>
                      {/* <TouchableOpacity style={styles.appointmentButton}>
                        <Feather
                          name="calendar"
                          size={professionalIconSize}
                          color={COLORS.PRIMARY12}
                          style={styles.professionalIcon}
                        />
                        <Text style={styles.appointmentText}>
                          {application.language.data.BOOK_APPOINTMENT}
                        </Text>
                      </TouchableOpacity> */}
                    </RNAnimated.View>
                  );
                  break;

                case USER_ROLES.CLINIC_HOSPITAL:
                  return (
                    <RNAnimated.View
                      style={[
                        styles.doctorResultContainer,
                        {
                          marginLeft:
                            index == 0 ? (WIDTH - resultWidth) / 2 : 0,
                          marginRight:
                            index == results.length - 1
                              ? (WIDTH - resultWidth) / 2
                              : 0,
                          transform: [{ scale }],
                        },
                      ]}>
                      <View style={styles.doctorContainer}>
                        <View style={styles.professionalIconContainer}>
                          <FontAwesome5
                            name="hospital"
                            size={professionalIconContainerSize / 2}
                            color={COLORS.SECONDARY}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.professionalName}>
                            {item.email}
                          </Text>
                          <Text numberOfLines={1} style={{ maxWidth: '90%' }}>
                            {item.telephone}
                          </Text>
                        </View>
                      </View>
                      <Text numberOfLines={1} style={{ maxWidth: '95%' }}>
                        {item.nom_de_rue}
                        {' - '}
                        {item.commune}
                        {' - '}
                        {item.wilaya}
                      </Text>
                    </RNAnimated.View>
                  );
                  break;

                case USER_ROLES.PHARMACY:
                  return (
                    <RNAnimated.View
                      style={[
                        styles.doctorResultContainer,
                        {
                          marginLeft:
                            index == 0 ? (WIDTH - resultWidth) / 2 : 0,
                          marginRight:
                            index == results.length - 1
                              ? (WIDTH - resultWidth) / 2
                              : 0,
                          transform: [{ scale }],
                        },
                      ]}>
                      <View style={styles.doctorContainer}>
                        <View style={styles.professionalIconContainer}>
                          <Fontisto
                            name="drug-pack"
                            size={professionalIconContainerSize / 2}
                            color={COLORS.SECONDARY}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.professionalName}>
                            {item.email}
                          </Text>
                          <Text numberOfLines={1} style={{ maxWidth: '90%' }}>
                            {item.telephone}
                          </Text>
                        </View>
                      </View>
                      <Text numberOfLines={1} style={{ maxWidth: '95%' }}>
                        {item.nom_de_rue}
                        {' - '}
                        {item.commune}
                        {' - '}
                        {item.wilaya}
                      </Text>
                    </RNAnimated.View>
                  );
                  break;

                case USER_ROLES.AMBULANCE:
                  return (
                    <RNAnimated.View
                      style={[
                        styles.doctorResultContainer,
                        {
                          marginLeft:
                            index == 0 ? (WIDTH - resultWidth) / 2 : 0,
                          marginRight:
                            index == results.length - 1
                              ? (WIDTH - resultWidth) / 2
                              : 0,
                          transform: [{ scale }],
                        },
                      ]}>
                      <View style={styles.doctorContainer}>
                        <View style={styles.professionalIconContainer}>
                          <FontAwesome5
                            name="ambulance"
                            size={professionalIconContainerSize / 2}
                            color={COLORS.SECONDARY}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.professionalName}>
                            {item.email}
                          </Text>
                          <Text numberOfLines={1} style={{ maxWidth: '90%' }}>
                            {item.telephone}
                          </Text>
                        </View>
                      </View>
                      <Text numberOfLines={1} style={{ maxWidth: '95%' }}>
                        {item.nom_de_rue}
                        {' - '}
                        {item.commune}
                        {' - '}
                        {item.wilaya}
                      </Text>
                    </RNAnimated.View>
                  );
                  break;

                case USER_ROLES.BLOOD_DONOR:
                  return (
                    <RNAnimated.View
                      style={[
                        styles.doctorResultContainer,
                        {
                          marginLeft:
                            index == 0 ? (WIDTH - resultWidth) / 2 : 0,
                          marginRight:
                            index == results.length - 1
                              ? (WIDTH - resultWidth) / 2
                              : 0,
                          transform: [{ scale }],
                        },
                      ]}>
                      <View style={styles.doctorContainer}>
                        <View style={styles.professionalIconContainer}>
                          <Fontisto
                            name="blood-drop"
                            size={professionalIconContainerSize / 2}
                            color={COLORS.SECONDARY}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.professionalName}>
                            {item.nom} {item.prenom}
                          </Text>
                          <Text numberOfLines={1} style={{ maxWidth: '90%' }}>
                            {item.groupe_sanguin}
                          </Text>
                        </View>
                      </View>
                      <Text numberOfLines={1} style={{ maxWidth: '95%' }}>
                        {item.nom_de_rue}
                        {' - '}
                        {item.commune}
                        {' - '}
                        {item.wilaya}
                      </Text>
                      <Text style={styles.professionalName}>{item.email}</Text>
                      <Text numberOfLines={1} style={{ maxWidth: '90%' }}>
                        {item.telephone}
                      </Text>
                    </RNAnimated.View>
                  );
                  break;

                case USER_ROLES.LABORATORY:
                  return (
                    <RNAnimated.View
                      style={[
                        styles.doctorResultContainer,
                        {
                          marginLeft:
                            index == 0 ? (WIDTH - resultWidth) / 2 : 0,
                          marginRight:
                            index == results.length - 1
                              ? (WIDTH - resultWidth) / 2
                              : 0,
                          transform: [{ scale }],
                        },
                      ]}>
                      <View style={styles.doctorContainer}>
                        <View style={styles.professionalIconContainer}>
                          <Fontisto
                            name="test-tube"
                            size={professionalIconContainerSize / 2}
                            color={COLORS.SECONDARY}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.professionalName}>
                            {item.email}
                          </Text>
                          <Text numberOfLines={1} style={{ maxWidth: '90%' }}>
                            {item.telephone}
                          </Text>
                        </View>
                      </View>
                      <Text numberOfLines={1} style={{ maxWidth: '95%' }}>
                        {item.nom_de_rue}
                        {' - '}
                        {item.commune}
                        {' - '}
                        {item.wilaya}
                      </Text>
                    </RNAnimated.View>
                  );
                  break;

                default:
                  break;
              }
            }}
          />
        )}
        <Modal
          transparent={true}
          visible={filterModalVisible}
          onRequestClose={() => setFilterModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.filterModal}>
              <Text
                style={[
                  styles.professionalName,
                  { fontSize: 20, color: COLORS.PRIMARY12 },
                ]}>
                {application.language.data.IN_SEARCH_FOR}
              </Text>
              <View style={styles.pickerContainer}>
                <View style={styles.picker}>
                  <FontAwesome5
                    name="hand-holding-medical"
                    color={COLORS.PRIMARY12}
                    size={25}
                    style={styles.pickerIcon}
                  />
                  <Picker
                    selectedValue={selectedProfessional}
                    style={{
                      flex: 1,
                      textAlign: 'left',
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      if (selectedProfessional !== itemValue) {
                        setSelectedProfessional(itemValue);
                        professionalsRef.current.scrollTo({
                          x: professionalWidth * itemIndex,
                          animated: true,
                        });
                      }
                    }}>
                    {professionals.map((professional, index) => (
                      <Picker.Item
                        key={index}
                        value={professional.role}
                        label={(() => {
                          switch (professional.role) {
                            case USER_ROLES.DOCTOR:
                              return application.language.data.DOCTOR;
                              break;

                            case USER_ROLES.PARAMEDICAL:
                              return application.language.data.PARAMEDICAL;
                              break;

                            case USER_ROLES.CLINIC_HOSPITAL:
                              return application.language.data.CLINIC_HOSPITAL;
                              break;

                            case USER_ROLES.LABORATORY:
                              return application.language.data.LABORATORY;
                              break;

                            case USER_ROLES.PHARMACY:
                              return application.language.data.PHARMACY;
                              break;

                            case USER_ROLES.AMBULANCE:
                              return application.language.data.AMBULANCE;
                              break;

                            case USER_ROLES.BLOOD_DONOR:
                              return application.language.data.BLOOD_DONOR;
                              break;

                            default:
                              break;
                          }
                        })()}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
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
                      value={0}
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
                            `${application.language.key == LANAGUAGES_LIST.ARABIC
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
                    <Picker.Item
                      value={0}
                      label={(() => {
                        switch (application.language.key) {
                          case LANAGUAGES_LIST.ARABIC:
                            return 'كل البلديات';
                            break;
                          case LANAGUAGES_LIST.FRENCH:
                            return 'Toutes les communes';
                            break;
                          case LANAGUAGES_LIST.ENGLISH:
                            return 'All communes';
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
              {(selectedProfessional == USER_ROLES.DOCTOR ||
                selectedProfessional == USER_ROLES.PARAMEDICAL) && (
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
                          }
                        }}>
                        <Picker.Item
                          value={0}
                          label={(() => {
                            switch (application.language.key) {
                              case LANAGUAGES_LIST.ARABIC:
                                return 'كل التخصصات';
                                break;
                              case LANAGUAGES_LIST.FRENCH:
                                return 'toutes les spécialités';
                                break;
                              case LANAGUAGES_LIST.ENGLISH:
                                return 'All specialties';
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
                              label={displayValue(specialty)}
                            />
                          ))}
                      </Picker>
                    </View>
                  </View>
                )}
              {selectedProfessional == USER_ROLES.BLOOD_DONOR && (
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
                        }
                      }}>
                      <Picker.Item
                        value={0}
                        label={(() => {
                          switch (application.language.key) {
                            case LANAGUAGES_LIST.ARABIC:
                              return 'كل فصائل الدم';
                              break;
                            case LANAGUAGES_LIST.FRENCH:
                              return 'Tous les groupes sanguins';
                              break;
                            case LANAGUAGES_LIST.ENGLISH:
                              return 'All blood types';
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
                </View>
              )}
              <TouchableOpacity style={styles.button} onPress={allVaildate}>
                <Text style={styles.buttonText}>
                  {application.language.data.SEARCH}
                </Text>
              </TouchableOpacity>
              <Ionicons
                name="close"
                size={35}
                color={COLORS.PRIMARY12}
                style={styles.filterModalCloseIcon}
                onPress={() => setFilterModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
        <Modal transparent={true} visible={loadingModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.loadingModal}>
              {application.language.key == LANAGUAGES_LIST.ARABIC && (
                <ActivityIndicator size={WIDTH / 10} color={COLORS.PRIMARY12} />
              )}
              <Text style={styles.loadingText}>
                {application.language.data.SEARCHING}
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
  role: store.userState.role,
});

export default connect(mapStateProps, null)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
    overflow: 'hidden',
  },
  drawerIconContainer: {
    height: drawerIconContainerSize,
    width: drawerIconContainerSize,
    borderRadius: drawerIconContainerSize,
    position: 'absolute',
    top: drawerIconContainerSize / 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.PRIMARY12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  subContainer: {
    flex: 1,
  },
  bottomTabs: {
    height: HEIGHT / 10,
    width: WIDTH,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    position: 'absolute',
    top: drawerIconContainerSize / 2,
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.PRIMARY25,
  },
  professionalIcon: {
    marginRight: 10,
  },
  professionalsContainer: {
    position: 'absolute',
    top: drawerIconContainerSize * 1.5,
  },
  professional: {
    height: professionalHeight,
    width: professionalWidth,
    borderRadius: 10, //professionalHeight,
    marginLeft: drawerIconContainerSize / 4,
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.PRIMARY12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  filterModal: {
    height: HEIGHT * 0.8,
    width: WIDTH * 0.9,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  filterModalCloseIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
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
  pickerIcon: { marginHorizontal: 10 },
  errorText: {
    color: COLORS.PRIMARY12,
  },
  button: {
    height: buttonHeight,
    width: WIDTH * 0.7,
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
  resultsContainer: { position: 'absolute', bottom: HEIGHT / 10 },
  doctorResultContainer: {
    height: resultHeight,
    width: resultWidth,
    borderRadius: 15,
    backgroundColor: COLORS.SECONDARY,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: COLORS.PRIMARY12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  doctorContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  professionalIconContainer: {
    height: professionalIconContainerSize,
    width: professionalIconContainerSize,
    borderRadius: professionalIconContainerSize,
    backgroundColor: COLORS.PRIMARY12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    shadowColor: COLORS.PRIMARY12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  appointmentButton: {
    height: '22.5%',
    width: '80%',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.PRIMARY12,
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
