import React, {useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS} from '../../constants/colors';
import {HEIGHT, WIDTH} from '../../constants/dimensions';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {patientDeleteRelative} from '../../api/patients';

const containerHeight = HEIGHT / 5;
const containerWidth = WIDTH * 0.95;

const itemAvatarIconSize = 35;
const itemIconSize = 22.5;

const modalButtonHeight = HEIGHT / 12.5;
const modalIconSize = 30;

const Relative = ({
  navigation,
  relative,
  index,
  relatives,
  setRelatives,
  application,
  token,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleDeleteRelative = async () => {
    try {
      const response = await patientDeleteRelative(relative.id, token);
      alert(JSON.stringify(response));
      if (response) {
        if (response['message'] == 'success') {
          setRelatives(relatives.filter(item => item.id !== relative.id));
          Alert.alert('', 'Deleted successfuly');
        } else {
        }
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

  return (
    <TouchableOpacity
      //activeOpacity={1}
      style={[
        styles.container,
        {marginBottom: index == relatives.length - 1 ? 20 : 0},
      ]}
      onLongPress={() => setModalVisible(true)}
      onPress={() => navigation.navigate('EditRelative', {relative})}>
      <View style={styles.row}>
        <Feather
          name="user"
          size={itemAvatarIconSize}
          color={COLORS.PRIMARY12}
          style={styles.icon}
        />
        <Text style={styles.name}>
          {relative.nom} {relative.prenom}
        </Text>
      </View>
      <View style={styles.row}>
        <Feather
          name="calendar"
          size={itemIconSize}
          color={COLORS.PRIMARY12}
          style={styles.icon}
        />
        <Text>{relative.date_de_naissance.substr(0, 10)}</Text>
      </View>
      <View style={styles.row}>
        <MaterialCommunityIcons
          name="map-marker-radius-outline"
          size={itemIconSize}
          color={COLORS.PRIMARY12}
          style={styles.icon}
        />
        <Text>{relative.nom_de_rue}</Text>
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.modalButton,
                {
                  borderBottomWidth: 0.5,
                  borderBottomColor: COLORS.PRIMARY12,
                },
              ]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('EditRelative');
              }}>
              <Feather
                name="edit"
                color={COLORS.PRIMARY12}
                size={modalIconSize}
                style={styles.modalButtonIcon}
              />
              <Text style={[styles.modalButtonText, {color: COLORS.PRIMARY12}]}>
                {application.language.data.EDIT}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.modalButton,
                {
                  borderBottomWidth: 0.5,
                  borderBottomColor: COLORS.PRIMARY12,
                },
              ]}
              onPress={handleDeleteRelative}>
              <Feather
                name="user-x"
                color={COLORS.PRIMARY12}
                size={modalIconSize}
                style={styles.modalButtonIcon}
              />
              <Text style={[styles.modalButtonText, {color: COLORS.PRIMARY12}]}>
                {application.language.data.DELETE}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
              }}>
              <Text style={[styles.modalButtonText, {color: COLORS.PRIMARY12}]}>
                {application.language.data.CANCEL}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};
const mapStateProps = store => ({
  application: store.applicationState.application,
  token: store.userState.token,
});

const mapDispatchProps = dispatch => ({});

export default connect(mapStateProps, mapDispatchProps)(Relative);

const styles = StyleSheet.create({
  container: {
    height: containerHeight,
    width: containerWidth,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 20,
    marginTop: 10,
    padding: 10,
    alignSelf: 'center',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '900',
  },
  icon: {
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    height: 3 * modalButtonHeight,
    width: WIDTH * 0.9,
    borderRadius: 5,
    backgroundColor: COLORS.SECONDARY,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  modalButton: {
    height: modalButtonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonIcon: {
    marginRight: 5,
  },
  modalButtonText: {
    fontWeight: '900',
    color: COLORS.PRIMARY12,
  },
});
