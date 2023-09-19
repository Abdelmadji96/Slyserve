import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {COLORS} from '../../../constants/colors';
import {HEIGHT, WIDTH} from '../../../constants/dimensions';
import {useTheme} from '../../../context/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Animated from 'react-native-reanimated';
import DrawerHiddenView from '../../../components/drawerHiddenView/DrawerHiddenView';
import {LANAGUAGES_LIST} from '../../../constants/languages';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

const ParamedicalProfile = ({navigation, application, user, role, token}) => {
  const {drawer} = useTheme();
  const [profile, setProfile] = useState(null);

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
            {application.language.data.PROFILE}
          </Text>
          <Feather
            name="edit"
            size={30}
            color={COLORS.PRIMARY12}
            onPress={() =>
              navigation.navigate('ParamedicalEditProfile', {profile})
            }
          />
        </View>
        <ScrollView
          style={styles.bottomView}
          contentContainerStyle={{padding: 10}}>
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
            <Text>{user?.nom}</Text>
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
            <Text>{user?.prenom}</Text>
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
            <Text>{user?.date_de_naissance.substr(0, 10)}</Text>
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
            <Text>{user?.specialite}</Text>
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
            <Text>{user?.telephone}</Text>
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
            <Text>{user?.email}</Text>
          </View>
          <>
            <Text />
            <Text style={styles.headerTitle}>
              {application.language.data.ADDRESS}
            </Text>
            <Text>{user?.nom_de_rue}</Text>
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
                latitude: user?.latitude,
                longitude: user?.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0221,
              }}>
              <Marker
                coordinate={{
                  latitude: user?.latitude,
                  longitude: user?.longitude,
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
        </ScrollView>
      </Animated.View>
    </>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
  user: store.userState.currentUser,
  token: store.userState.token,
});

export default connect(mapStateProps, null)(ParamedicalProfile);

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
