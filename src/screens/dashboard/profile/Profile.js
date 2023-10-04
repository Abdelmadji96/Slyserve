import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
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
import { useFocusEffect } from '@react-navigation/core';
import { fetchDoctorProfile } from '../../../api/doctors';
import { LANAGUAGES_LIST } from '../../../constants/languages';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import WorkingDay from '../../../components/workingDay/WorkingDay';
import DisplayWorkingDay from '../../../components/workingDay/DisplayWorkingDay';

const Profile = ({ navigation, application, user, role, token }) => {
  const { drawer } = useTheme();
  const [profile, setProfile] = useState(null);
  const [weekDays, setWeekDays] = useState([
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
  ]);

  const getProfile = async () => {
    try {
      const response = await fetchDoctorProfile(user.id);
      //alert(JSON.stringify(response))
      console.log('responseresponse', response);
      if (response) {
        setProfile(response);
        setWeekDays(
          weekDays.map(item => ({
            ...item,
            checked: response['horaires']
              .map(item => item.jour)
              .includes(item.day)
              ? !item.checked
              : item.checked,
          })),
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

  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, []),
  );

  //   useEffect(() => {
  //     getPatients();
  //   }, []);
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
            name="menu"
            size={35}
            color={COLORS.PRIMARY12}
            onPress={() => navigation.openDrawer()}
          />
          <Text style={styles.headerTitle}>
            {application.language.data.PROFILE}
          </Text>
          <Feather
            name="edit"
            size={30}
            color={COLORS.PRIMARY12}
            onPress={() => navigation.navigate('EditProfile', { profile })}
          />
        </View>
        {profile ? (
          <ScrollView
            style={styles.bottomView}
            contentContainerStyle={{ padding: 10 }}>
            <Text />
            <View
              style={[
                styles.row,
                application.language.key == LANAGUAGES_LIST.ARABIC && {
                  flexDirection: 'row-reverse',
                },
              ]}>
              <Text style={styles.headerTitle}>
                {application.language.data.LAST_NAME}
              </Text>
              <Text>{profile?.infos?.nom}</Text>
            </View>
            <Text />
            <View
              style={[
                styles.row,
                application.language.key == LANAGUAGES_LIST.ARABIC && {
                  flexDirection: 'row-reverse',
                },
              ]}>
              <Text style={styles.headerTitle}>
                {application.language.data.FIRST_NAME}
              </Text>
              <Text>{profile?.infos?.prenom}</Text>
            </View>
            <Text />
            <View
              style={[
                styles.row,
                application.language.key == LANAGUAGES_LIST.ARABIC && {
                  flexDirection: 'row-reverse',
                },
              ]}>
              <Text style={styles.headerTitle}>
                {application.language.data.DATE_OF_BIRTH}
              </Text>
              <Text>{profile?.infos?.date_de_naissance.substr(0, 10)}</Text>
            </View>
            <Text />
            <View
              style={[
                styles.row,
                application.language.key == LANAGUAGES_LIST.ARABIC && {
                  flexDirection: 'row-reverse',
                },
              ]}>
              <Text style={styles.headerTitle}>
                {application.language.data.SPECIALTY}
              </Text>
              <Text>{profile?.infos?.specialite}</Text>
            </View>
            <Text />
            <View
              style={[
                styles.row,
                application.language.key == LANAGUAGES_LIST.ARABIC && {
                  flexDirection: 'row-reverse',
                },
              ]}>
              <Text style={styles.headerTitle}>
                {application.language.data.PHONE}
              </Text>
              <Text>{profile?.infos?.telephone}</Text>
            </View>
            <Text />
            <View
              style={[
                styles.row,
                application.language.key == LANAGUAGES_LIST.ARABIC && {
                  flexDirection: 'row-reverse',
                },
              ]}>
              <Text style={styles.headerTitle}>
                {application.language.data.EMAIL}
              </Text>
              <Text>{profile?.infos?.email}</Text>
            </View>
            <>
              <Text />
              <Text style={styles.headerTitle}>
                {application.language.data.ADDRESS}
              </Text>
              <Text>{profile?.infos?.nom_de_rue}</Text>
            </>
            <Text />
            <Text style={styles.headerTitle}>
              {application.language.data.EXERCICE_ADDRESS}
            </Text>
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                  latitude: profile?.infos ? profile?.infos?.latitude : 10,
                  longitude: profile?.infos ? profile?.infos?.longitude : 10,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0221,
                }}>
                <Marker
                  coordinate={{
                    latitude: profile?.infos ? profile?.infos?.latitude : 10,
                    longitude: profile?.infos ? profile?.infos?.longitude : 10,
                  }}>
                  <Ionicons
                    name="location-sharp"
                    size={35}
                    color={COLORS.PRIMARY12}
                  />
                </Marker>
              </MapView>
            </View>
            {profile?.infos?.presentation && (
              <>
                <Text />
                <Text style={styles.headerTitle}>
                  {application.language.data.ADDRESS}
                </Text>
                <Text>{profile?.infos?.presentation}</Text>
              </>
            )}
            {profile?.infos?.formations && (
              <>
                <Text />
                <Text style={styles.headerTitle}>
                  {application.language.data.COURSES}
                </Text>
                <Text>{profile?.infos?.formations}</Text>
              </>
            )}
            {profile?.infos?.langues_parlees && (
              <>
                <Text />
                <Text style={styles.headerTitle}>
                  {application.language.data.SPOKEN_LANGUAGES}
                </Text>
                <Text>{profile?.infos?.langues_parlees}</Text>
              </>
            )}
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
                {profile?.infos?.tarif_video}{' '}
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
                {profile?.infos?.tarif_cabinet}{' '}
                {application.language.key == LANAGUAGES_LIST.ARABIC
                  ? 'دج'
                  : 'DA'}
              </Text>
            </View>
            <Text />
            <View
              style={[
                styles.row,
                application.language.key == LANAGUAGES_LIST.ARABIC && {
                  flexDirection: 'row-reverse',
                },
              ]}>
              <Text style={styles.headerTitle}>
                {application.language.data.SESSION_DURATION}
              </Text>
              <Text>
                {profile?.infos?.duree_seance}{' '}
                {application.language.key == LANAGUAGES_LIST.ARABIC
                  ? 'د'
                  : 'm'}
              </Text>
            </View>

            {profile.horaires ? (
              profile.horaires.length > 0 ? (
                <>
                  <Text />
                  <Text style={styles.headerTitle}>
                    {application.language.data.WORKING_DAYS}
                  </Text>
                  <View
                    style={[
                      styles.row,
                      application.language.key == LANAGUAGES_LIST.ARABIC && {
                        flexDirection: 'row-reverse',
                      },
                    ]}>
                    <Text style={{ fontWeight: '700' }}>
                      {application.language.data.DAY}
                    </Text>
                    <Text style={{ fontWeight: '700' }}>
                      {application.language.data.OPENING}
                    </Text>
                    <Text style={{ fontWeight: '700' }}>
                      {application.language.data.CLOSING}
                    </Text>
                    <Text style={{ fontWeight: '700' }}>
                      {application.language.data.AVAILABLE}
                    </Text>
                  </View>
                  {weekDays.map((weekDay, index) => (
                    <DisplayWorkingDay
                      weekDay={weekDay}
                      index={index}
                      weekDaysLength={weekDays.length}
                      workingDays={profile.horaires}
                      weekDays={weekDays}
                      setWeekDays={setWeekDays}
                    />
                  ))}
                </>
              ) : (
                <Text>No working days</Text>
              )
            ) : null}
            <Text />
          </ScrollView>
        ) : (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="small" color={COLORS.PRIMARY12} />
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

export default connect(mapStateProps, null)(Profile);

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
});
