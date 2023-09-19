import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {useTheme} from '../../../context/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../../constants/colors';
import {HEIGHT, WIDTH} from '../../../constants/dimensions';
import {connect} from 'react-redux';
import DrawerHiddenView from '../../../components/drawerHiddenView/DrawerHiddenView';
import {LANAGUAGES_LIST} from '../../../constants/languages';
import {Picker} from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AnimatedTextInput from '../../../components/input/AnimatedTextInput';
import {uploadFile, uploadImage} from '../../../functions/storage';
import {STORAGE, STORAGE_DIRECTORIES} from '../../../../firebase';
import {
  patientAddPrescription,
  patientAddRecord,
  patientAddTestResult,
  patientAddRadiology,
  patientAddReport,
  patientAddVaccination,
} from '../../../api/patients';

const inputHeight = HEIGHT / 12.5;
const inputWidth = WIDTH * 0.9;
const buttonHeight = HEIGHT / 10;

const AddDocument = ({navigation, route, application, user, token}) => {
  const {drawer} = useTheme();
  const documentsArray = [
    {
      id: 1,
      title: application.language.data.PRESCRIPTIONS,
    },
    {
      id: 2,
      title: application.language.data.RECORDS,
    },
    {
      id: 3,
      title: application.language.data.TEST_RESULTS,
    },
    {
      id: 4,
      title: application.language.data.TREATMENTS,
    },
    {
      id: 5,
      title: application.language.data.BIOLOGY,
    },
    {
      id: 6,
      title: application.language.data.REPORTS,
    },
    {
      id: 7,
      title: application.language.data.RADIOLOGY,
    },
    {
      id: 8,
      title: application.language.data.VACCINATIONS,
    },
  ];
  const [selectedDocumentType, setSelectedDocumentType] = useState(0);
  const [documentTypeErrorVisible, setDocumentTypeErrorVisible] =
    useState(false);
  const [description, setDescription] = useState(null);
  const [descriptionValidate, setDescriptionValidate] = useState(0);
  const [descriptionErrorVisible, setDescriptionErrorVisible] = useState(false);
  const [document, setDocument] = useState('');
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const validate = (text, type) => {
    let alph = /^(?=.{5,10})/;
    switch (type) {
      case 'description':
        if (!descriptionErrorVisible) {
          setDescriptionErrorVisible(true);
        }
        text.length == 0
          ? setDescriptionValidate(0)
          : alph.test(text)
          ? setDescriptionValidate(1)
          : setDescriptionValidate(2);
        setDescription(text);
        break;
    }
  };

  const getStorageDirectory = () => {
    switch (selectedDocumentType) {
      case 1:
        return STORAGE_DIRECTORIES.PRESCRIPTIONS;
        break;
      case 2:
        return STORAGE_DIRECTORIES.RECORDS;
        break;
      case 3:
        return STORAGE_DIRECTORIES.TEST_RESULTS;
        break;
      case 4:
        return STORAGE_DIRECTORIES.TREATMENTS;
        break;
      case 5:
        return STORAGE_DIRECTORIES.BIOLOGY;
        break;
      case 6:
        return STORAGE_DIRECTORIES.REPORTS;
        break;
      case 7:
        return STORAGE_DIRECTORIES.RADIOLOGY;
        break;
      case 8:
        return STORAGE_DIRECTORIES.VACCINATIONS;
        break;
      default:
        break;
    }
  };

  const handleSqlAddDocument = async downloadURL => {
    let response;
    try {
      switch (selectedDocumentType) {
        case 1:
          response = await patientAddPrescription(
            description,
            user.id,
            '',
            downloadURL,
            token,
          );
          break;
        case 2:
          response = await patientAddRecord(
            description,
            user.id,
            '',
            downloadURL,
            token,
          );
          break;
        case 3:
          response = await patientAddTestResult(
            description,
            user.id,
            '',
            downloadURL,
            token,
          );
          break;

        case 6:
          response = await patientAddReport(
            description,
            user.id,
            '',
            downloadURL,
            token,
          );
          break;
        case 7:
          response = await patientAddRadiology(
            description,
            user.id,
            '',
            downloadURL,
            token,
          );
          break;
        case 8:
          response = await patientAddVaccination(
            description,
            user.id,
            '',
            downloadURL,
            token,
          );
          break;
        default:
          break;
      }
      //alert(JSON.stringify(response));
      if (response) {
        if (response['message'] == 'success') {
          setLoadingModalVisible(false);
          Alert.alert(
            application.language.data.ALERT,
            application.language.data.ADDED_SUCCESSFULY,
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

  /*
  if (image.uri !== "") {
      let imageURL = "";
      let imageResponse = await fetch(image.uri);
      let imageBlob = await imageResponse.blob();

      let imageRef = STORAGE.ref().child(`products/${storageId}`);
      let imageUpload = imageRef.put(imageBlob);
      imageUpload.on("state_changed", (taskSnapshot) => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferés de ${taskSnapshot.totalBytes}`
        );
      });
      imageUpload.then(async () => {
        imageURL = await imageRef.getDownloadURL();
        console.log("Image uploaded to the bucket!\nDownload URL :" + imageURL);
        FIRESTORE.collection(DATABASE_TABLES.PRODUCTS)
          .add({
            name,
            description,
            image: imageURL,
            price: 0,
            storageId,
          })
          .then((docRef) => {
            initializeState();
            setLoadingModalVisible(false);
            Alert.alert("Succes", "Produit ajoute avec succes");
          })
          .catch((error) => {
            setLoadingModalVisible(false);
            Alert.alert("Erreur", "Une erreur est survenue!");
            console.log(error);
          });
      });
    }
  */

  const handleAddDocument = async () => {
    setLoadingModalVisible(true);
    if (document) {
      const documentResponse = await fetch(document.uri);
      let documentName = document.uri.split('/').pop();
      let documentBlob = await documentResponse.blob();
      let documentRef = STORAGE.ref().child(
        `${getStorageDirectory()}/patient${user.id}/${documentName}`,
      );
      //let documentUpload = documentRef.putFile(document.uri); //rnfirebase
      let documentUpload = documentRef.put(documentBlob); //firebasejs
      documentUpload.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferés de ${taskSnapshot.totalBytes}`,
        );
      });
      documentUpload
        .then(async res => {
          let documentURL = await documentRef.getDownloadURL(); //rnfirebase
          handleSqlAddDocument(documentURL); //rnfirebase
          //handleSqlAddDocument(res.downloadURL); //firebasejs
        })
        .catch(error => {
          setLoadingModalVisible(false);
          Alert.alert(
            application.language.data.ALERT,
            application.language.data.ERROR_OCCURED,
          );
          console.log(error);
        });
    } else {
      handleSqlAddDocument('');
    }
  };

  const allValidate = () => {
    if (selectedDocumentType !== 0 && descriptionValidate == 1) {
      handleAddDocument();
    } else {
      alert('Enter all document informations');
      if (selectedDocumentType == 0) {
        setDocumentTypeErrorVisible(true);
      }
      if (!descriptionErrorVisible) {
        setDescriptionErrorVisible(true);
      }
    }
  };

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
            name="arrow-back"
            size={35}
            color={COLORS.PRIMARY12}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>
            {application.language.data.MY_FILES}
          </Text>
          <Ionicons
            name="save-outline"
            size={30}
            color={COLORS.PRIMARY12}
            onPress={() => navigation.navigate('AddDocument')}
          />
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.pickerContainer}>
            <View style={styles.picker}>
              <MaterialCommunityIcons
                name="format-list-bulleted-type"
                color={COLORS.PRIMARY12}
                size={25}
                style={styles.pickerIcon}
              />
              <Picker
                selectedValue={selectedDocumentType}
                style={{
                  flex: 1,
                }}
                onValueChange={(itemValue, itemIndex) => {
                  if (selectedDocumentType !== itemValue) {
                    setSelectedDocumentType(itemValue);
                    if (documentTypeErrorVisible) {
                      setDocumentTypeErrorVisible(false);
                    }
                  }
                }}>
                <Picker.Item
                  value={0}
                  label={(() => {
                    switch (application.language.key) {
                      case LANAGUAGES_LIST.ARABIC:
                        return 'حدد نوع الملف';
                        break;
                      case LANAGUAGES_LIST.FRENCH:
                        return 'Sélectionnez le type de document';
                        break;
                      case LANAGUAGES_LIST.ENGLISH:
                        return 'Select the document type';
                        break;

                      default:
                        break;
                    }
                  })()}
                  value={0}
                  style={{textAlign: 'left'}}
                />
                {documentsArray.map(type => (
                  <Picker.Item
                    key={type.id.toString()}
                    label={type.title}
                    value={type.id}
                  />
                ))}
              </Picker>
            </View>
            {documentTypeErrorVisible && (
              <Text style={styles.errorText}>
                {application.language.data.SELECT_APPOINTMENT_TYPE}
              </Text>
            )}
          </View>
          <AnimatedTextInput
            inputHeight={HEIGHT / 5}
            inputWidth={WIDTH * 0.9}
            inputRadius={10}
            value={description}
            onChange={value => validate(value, 'description')}
            placeholder={application.language.data.DESCRIPTION}
            multiline={true}
            secureTextIntry={false}
            errorText={
              descriptionValidate == 0
                ? application.language.data.ENTER_DESCRIPTION
                : descriptionValidate == 2 &&
                  application.language.data.INVALID_DESCRIPTION
            }
            errorTextVisible={descriptionErrorVisible}
          />
          <View
            style={{
              width: WIDTH,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <Text
              numberOfLines={1}
              style={{width: inputWidth - 30, textAlign: 'center'}}>
              {document
                ? document?.uri.substr(0, 20) +
                  '...' +
                  document?.uri.substr(
                    document?.uri.length - 21,
                    document?.uri.length - 1,
                  )
                : 'No document attached'}
            </Text>
            <Ionicons
              name="close-circle-outline"
              size={30}
              color={COLORS.PRIMARY12}
              onPress={() => setDocument(null)}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: WIDTH,
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <Feather
              name="upload"
              size={50}
              color={COLORS.PRIMARY12}
              onPress={async () => {
                let file = await uploadFile();
                if (file) {
                  setDocument(file);
                }
              }}
            />
            <Feather
              name="camera"
              size={50}
              color={COLORS.PRIMARY12}
              onPress={async () => {
                let image = await uploadImage();
                if (image) {
                  setDocument(image);
                }
              }}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={allValidate}>
            <Text style={styles.buttonText}>
              {application.language.data.ADD}
            </Text>
          </TouchableOpacity>
        </View>
        <Modal transparent={true} visible={loadingModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.loadingModal}>
              {application.language.key == LANAGUAGES_LIST.ARABIC && (
                <ActivityIndicator size={WIDTH / 10} color={COLORS.PRIMARY12} />
              )}
              <Text style={styles.loadingText}>
                {application.language.data.ADDING}
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

export default connect(mapStateProps, mapDispatchProps)(AddDocument);

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
  button: {
    height: buttonHeight,
    width: WIDTH * 0.9,
    borderRadius: 15,
    backgroundColor: COLORS.PRIMARY12,
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
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  errorText: {
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
