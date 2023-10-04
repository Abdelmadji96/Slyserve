import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { connect } from 'react-redux';
import DrawerHiddenView from '../../../components/drawerHiddenView/DrawerHiddenView';
import { COLORS } from '../../../constants/colors';
import { HEIGHT, WIDTH } from '../../../constants/dimensions';
import { useTheme } from '../../../context/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { LANAGUAGES_LIST } from '../../../constants/languages';
import { fetchWilayas } from '../../../api/wilayas';
import { fetchCommunes } from '../../../api/communes';

const Informations = ({ navigation, application, user, token }) => {
  const { drawer } = useTheme();
  const [wilayas, setWilayas] = useState(null);
  const [communes, setCommunes] = useState(null);
  console.log('useruser', user);
  const getWilayas = async () => {
    const response = await fetchWilayas();
    if (response) {
      setWilayas(response);
    }
  };

  const getCommunes = async wilaya => {
    const response = await fetchCommunes(wilaya);
    if (response) {
      setCommunes(response);
    }
  };

  const displayWilaya = id => {
    if (user && wilayas) {
      if (application.language.key == LANAGUAGES_LIST.ARABIC) {
        return wilayas.filter(wilaya => wilaya.id == id).pop().nom_ar;
      } else {
        return wilayas.filter(wilaya => wilaya.id == id).pop().nom_fr;
      }
    }
  };

  const displayCommune = id => {
    if (user && communes) {
      if (application.language.key == LANAGUAGES_LIST.ARABIC) {
        return communes.filter(commune => commune.id == id).pop().nom_ar;
      } else {
        return communes.filter(commune => commune.id == id).pop().nom_fr;
      }
    }
  };

  useEffect(() => {
    getWilayas();
    getCommunes(user.wilaya);
  }, [user.wilaya]);

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
            name="arrow-back"
            size={35}
            color={COLORS.PRIMARY12}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>
            {application.language.data.MY_INFORMATIONS}
          </Text>
          <Feather
            name="edit"
            size={30}
            color={COLORS.PRIMARY12}
            onPress={() => navigation.navigate('EditInformations')}
          />
        </View>
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
              {application.language.data.EMAIL}
            </Text>
            <Text>{user?.email}</Text>
          </View>
          <Text />
          <>
            <Text style={styles.headerTitle}>
              {application.language.data.ADDRESS}
            </Text>
            <Text>{user?.nomRue}</Text>
          </>
          <Text />
          <View
            style={[
              styles.row,
              application.language.key == LANAGUAGES_LIST.ARABIC && {
                flexDirection: 'row-reverse',
              },
            ]}>
            <Text style={styles.headerTitle}>
              {application.language.data.WILAYA}
            </Text>
            <Text>
              {user?.wilaya + ' - ' + displayWilaya(user?.wilaya)}
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
              {application.language.data.COMMUNE}
            </Text>
            <Text>
              {user?.wilaya + ' - ' + displayCommune(user?.commune)}
            </Text>
          </View>
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

const mapDispatchProps = dispatch => ({});

export default connect(mapStateProps, mapDispatchProps)(Informations);

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
  bottomView: { flex: 1 },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
