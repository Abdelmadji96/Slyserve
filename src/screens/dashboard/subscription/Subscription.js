import React, {useCallback, useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import Animated, {cos} from 'react-native-reanimated';
import {connect} from 'react-redux';
import {COLORS} from '../../../constants/colors';
import {HEIGHT, WIDTH} from '../../../constants/dimensions';
import {useTheme} from '../../../context/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DrawerHiddenView from '../../../components/drawerHiddenView/DrawerHiddenView';
import {doctorGetSubscription1, fetchDoctorSubscription} from '../../../api/doctors';
import {LANAGUAGES_LIST} from '../../../constants/languages';
import {useFocusEffect} from '@react-navigation/native';

const Subscription = ({navigation, application, user, role, token}) => {
  const {drawer} = useTheme();
  const [subscription, setSubscription] = useState(null);

  const getSubscription = async () => {
    try {
      const response = await fetchDoctorSubscription(token);
      if (response) {
        setSubscription(response);
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

  const getPricePrefix = () => {
    switch (application.language.key) {
      case LANAGUAGES_LIST.ARABIC:
        return 'ب';
        break;

      case LANAGUAGES_LIST.FRENCH:
        return 'pour';
        break;

      case LANAGUAGES_LIST.ENGLISH:
        return 'for';
        break;

      default:
        break;
    }
  };

  const getPriceSuffix = () => {
    switch (application.language.key) {
      case LANAGUAGES_LIST.ARABIC:
        return 'دج قيمة إجمالية / شهر';
        break;

      case LANAGUAGES_LIST.FRENCH:
        return 'DA TTC / mois';
        break;

      case LANAGUAGES_LIST.ENGLISH:
        return 'DZD VAD / month';
        break;

      default:
        break;
    }
  };

  // useEffect(() => {
  //   getSubscription();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      getSubscription();
    }, []),
  );

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
            {application.language.data.SUBSCRIPTION}
          </Text>
          <MaterialCommunityIcons
            name="file-document-edit-outline"
            size={30}
            color={COLORS.PRIMARY12}
            onPress={() =>
              navigation.navigate('ChangeSubscription', {subscription})
            }
          />
        </View>
        <View style={styles.bottomView}>
          <View
            style={[
              styles.row,
              application.language.key == LANAGUAGES_LIST.ARABIC && {
                flexDirection: 'row-reverse',
              },
            ]}>
            <Ionicons
              name={
                application.language.key == LANAGUAGES_LIST.ARABIC
                  ? 'caret-back'
                  : 'caret-forward'
              }
              size={25}
              color={COLORS.PRIMARY12}
            />
            <Text>{application.language.data.SUBSCRIPTION_INFORMATIONS}</Text>
          </View>
          <View
            style={[
              styles.row,
              {paddingHorizontal: 20, alignItems: 'flex-start'},
              application.language.key == LANAGUAGES_LIST.ARABIC && {
                flexDirection: 'row-reverse',
              },
            ]}>
            <Ionicons
              name={user?.abonner_formule_1 == 1 ? 'checkmark' : 'close'}
              size={25}
              color={COLORS.PRIMARY12}
              style={
                application.language.key == LANAGUAGES_LIST.ARABIC
                  ? {marginLeft: 5}
                  : {marginRight: 5}
              }
            />
            <Text>
              {application.language.data.SUBSCRIPTION_1} {getPricePrefix()}{' '}
              {user?.tarif_cabinet} {getPriceSuffix()}
            </Text>
          </View>
          <View
            style={[
              styles.row,
              {paddingHorizontal: 20, alignItems: 'flex-start'},
              application.language.key == LANAGUAGES_LIST.ARABIC && {
                flexDirection: 'row-reverse',
              },
            ]}>
            <Ionicons
              name={user?.abonner_formule_2 == 1 ? 'checkmark' : 'close'}
              size={25}
              color={COLORS.PRIMARY12}
              style={
                application.language.key == LANAGUAGES_LIST.ARABIC
                  ? {marginLeft: 5}
                  : {marginRight: 5}
              }
            />
            <Text>
              {application.language.data.SUBSCRIPTION_2} {getPricePrefix()}{' '}
              {user?.tarif_video} {getPriceSuffix()}
            </Text>
          </View>
          <View
            style={[
              styles.row,
              application.language.key == LANAGUAGES_LIST.ARABIC && {
                flexDirection: 'row-reverse',
              },
            ]}>
            <Ionicons
              name={
                application.language.key == LANAGUAGES_LIST.ARABIC
                  ? 'caret-back'
                  : 'caret-forward'
              }
              size={25}
              color={COLORS.PRIMARY12}
            />
            <Text>{application.language.data.VALIDITY}</Text>
          </View>
          <View
            style={[
              styles.row,
              {paddingHorizontal: 20},
              application.language.key == LANAGUAGES_LIST.ARABIC && {
                flexDirection: 'row-reverse',
              },
            ]}>
            <Ionicons
              name={
                application.language.key == LANAGUAGES_LIST.ARABIC
                  ? 'caret-back'
                  : 'caret-forward'
              }
              size={17.5}
              color={COLORS.PRIMARY12}
            />
            <Text>{application.language.data.SUBSCRIPTION_1}</Text>
          </View>
          {user?.abonner_formule_1 == 1 ? (
            <>
              <View
                style={[
                  styles.row,
                  application.language.key == LANAGUAGES_LIST.ARABIC && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={25}
                  color={COLORS.PRIMARY12}
                  style={{marginHorizontal: 15}}
                />
                <Text>{application.language.data.BEGIN_DATE} : </Text>
                <Text>
                  {subscription?.abonnement1?.date_debut.substr(0, 10)}
                </Text>
              </View>
              <View
                style={[
                  styles.row,
                  application.language.key == LANAGUAGES_LIST.ARABIC && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={25}
                  color={COLORS.PRIMARY12}
                  style={{marginHorizontal: 15}}
                />
                <Text>{application.language.data.END_DATE} : </Text>
                <Text>{subscription?.abonnement1?.date_fin.substr(0, 10)}</Text>
              </View>
              <View
                style={[
                  styles.row,
                  application.language.key == LANAGUAGES_LIST.ARABIC && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <MaterialCommunityIcons
                  name={
                    new Date() > new Date(subscription?.abonnement1?.date_fin)
                      ? 'timer-sand-empty'
                      : 'timer-sand'
                  }
                  size={25}
                  color={COLORS.PRIMARY12}
                  style={{marginHorizontal: 15}}
                />
                <Text>{application.language.data.REMAINING_DAYS} : </Text>
                <Text>
                  {new Date() > new Date(subscription?.abonnement1?.date_fin)
                    ? 0
                    : (new Date().getMilliseconds() -
                        new Date(
                          subscription?.abonnement1?.date_debut,
                        ).getMilliseconds()) /
                      (1000 * 60 * 60 * 24)}
                </Text>
              </View>
            </>
          ) : (
            <Text style={{marginHorizontal: 30}}>
              {application.language.data.NOT_SUBSCRIBED}
            </Text>
          )}
          <View
            style={[
              styles.row,
              application.language.key == LANAGUAGES_LIST.ARABIC && {
                flexDirection: 'row-reverse',
              },
            ]}>
            <Ionicons
              name={
                application.language.key == LANAGUAGES_LIST.ARABIC
                  ? 'caret-back'
                  : 'caret-forward'
              }
              size={25}
              color={COLORS.PRIMARY12}
            />
            <Text>{application.language.data.SUBSCRIPTION_2}</Text>
          </View>
          {user?.abonner_formule_2 == 1 ? (
            <>
              <View
                style={[
                  styles.row,
                  {paddingHorizontal: 20, alignItems: 'flex-start'},
                  application.language.key == LANAGUAGES_LIST.ARABIC && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={25}
                  color={COLORS.PRIMARY12}
                  style={{marginHorizontal: 5}}
                />
                <View
                  style={[
                    styles.row,
                    application.language.key == LANAGUAGES_LIST.ARABIC && {
                      flexDirection: 'row-reverse',
                    },
                  ]}>
                  <Text>{application.language.data.BEGIN_DATE} : </Text>
                  <Text>
                    {subscription?.abonnement2?.date_debut.substr(0, 10)}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.row,
                  {paddingHorizontal: 20, alignItems: 'flex-start'},
                  application.language.key == LANAGUAGES_LIST.ARABIC && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <MaterialCommunityIcons
                  name={
                    subscription?.abonnement2?.restant == 0
                      ? 'timer-sand-empty'
                      : 'timer-sand'
                  }
                  size={25}
                  color={COLORS.PRIMARY12}
                  style={{marginHorizontal: 5}}
                />
                <View
                  style={[
                    styles.row,
                    application.language.key == LANAGUAGES_LIST.ARABIC && {
                      flexDirection: 'row-reverse',
                    },
                  ]}>
                  <Text>{application.language.data.REMAINING_MINUTES} : </Text>
                  <Text>{subscription?.abonnement2?.restant}</Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={{marginHorizontal: 30}}>
              {application.language.data.NOT_SUBSCRIBED}
            </Text>
          )}
        </View>
      </Animated.View>
    </>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
  user: store.userState.currentUser,
  token: store.userState.token,
});

export default connect(mapStateProps, null)(Subscription);

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
    justifyContent: 'space-evenly',
  },
  row: {
    width: WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});
