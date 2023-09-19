import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
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
import {fetchDoctorPatients} from '../../../api/doctors';
import Patient from '../../../components/patient/Patient';
import {useFocusEffect} from '@react-navigation/core';

const Patients = ({navigation, application, user, role, token}) => {
  const {drawer} = useTheme();
  const [patients, setPatients] = useState(null);

  const getPatients = async () => {
    try {
      const response = await fetchDoctorPatients(token);
      if (response) {
        setPatients(response['results']);
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
      getPatients();
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
            {application.language.data.MY_PATIENTS}
          </Text>
          <Feather
            name="user-plus"
            size={30}
            color={COLORS.PRIMARY12}
            onPress={() => navigation.navigate('AddPatient')}
          />
        </View>
        {patients ? (
          patients.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={patients}
              renderItem={({item, index}) => (
                <Patient
                  key={index}
                  navigation={navigation}
                  patient={item}
                  index={index}
                  patients={patients}
                  setPatients={setPatients}
                />
              )}
            />
          ) : (
            <View style={styles.bottomView}>
              <Text>No patients found</Text>
            </View>
          )
        ) : (
          <View style={styles.bottomView}>
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

const mapDispatchProps = dispatch => ({});

export default connect(mapStateProps, mapDispatchProps)(Patients);

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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
