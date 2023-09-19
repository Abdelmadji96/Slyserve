import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  FlatList,
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
import {fetchRelatives} from '../../../api/patients';
import Relative from '../../../components/relative/Relative';
import {useFocusEffect} from '@react-navigation/core';

const Relatives = ({navigation, route, application, user, token}) => {
  const {drawer} = useTheme();
  const [relatives, setRelatives] = useState(null);

  const getRelatives = async () => {
    try {
      const response = await fetchRelatives(token);
      if (response) {
        setRelatives(response['results']);
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
      getRelatives();
    }, []),
  );

  // useEffect(() => {
  //   getRelatives();
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
            {application.language.data.MY_RELATIVES}
          </Text>
          <Feather
            name="user-plus"
            size={30}
            color={COLORS.PRIMARY12}
            onPress={() => navigation.navigate('AddRelative')}
          />
        </View>
        {relatives ? (
          relatives.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={relatives}
              renderItem={({item, index}) => (
                <Relative
                  navigation={navigation}
                  relative={item}
                  relatives={relatives}
                  setRelatives={setRelatives}
                  index={index}
                  relativesLength={relatives.length}
                />
              )}
            />
          ) : (
            <Text>No relatives</Text>
          )
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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

export default connect(mapStateProps, mapDispatchProps)(Relatives);

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
});
