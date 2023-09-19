import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  patientFetchPrescriptions,
  patientFetchRadiology,
  patientFetchRecords,
  patientFetchReports,
  patientFetchTestResults,
  patientFetchVaccinations,
} from '../../../api/patients';
import {openInBrowser} from '../../../functions/storage';

const tabsHeight = HEIGHT / 15;

const documentHeight = HEIGHT / 5;
const documentWidth = WIDTH * 0.95;
const iconContainerSize = 45;

const Documents = ({navigation, route, application, user, token}) => {
  const {drawer} = useTheme();
  const tabsArray = [
    {
      id: 0,
      title: application.language.data.PRESCRIPTIONS,
    },
    {
      id: 1,
      title: application.language.data.RECORDS,
    },
    {
      id: 2,
      title: application.language.data.TEST_RESULTS,
    },
    {
      id: 3,
      title: application.language.data.TREATMENTS,
    },
    {
      id: 4,
      title: application.language.data.BIOLOGY,
    },
    {
      id: 5,
      title: application.language.data.REPORTS,
    },
    {
      id: 6,
      title: application.language.data.RADIOLOGY,
    },
    {
      id: 7,
      title: application.language.data.VACCINATIONS,
    },
  ];
  const [selectedTab, setSelectedTab] = useState(0);
  const [documents, setDocuments] = useState(null);
  const tabsRef = useRef();

  const handleFetchPrescriptions = async () => {
    try {
      const response = await patientFetchPrescriptions(token);
      //alert(JSON.stringify(response));
      if (response) {
        setDocuments(response['results']);
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

  const handleFetchRecords = async () => {
    try {
      const response = await patientFetchRecords(token);
      //alert(JSON.stringify(response));
      if (response) {
        setDocuments(response['results']);
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

  const handleFetchTestResults = async () => {
    try {
      const response = await patientFetchTestResults(token);
      alert(JSON.stringify(response));
      if (response) {
        setDocuments(response['results']);
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

  const handleFetchReports = async () => {
    try {
      const response = await patientFetchReports(token);
      alert(JSON.stringify(response));
      if (response) {
        setDocuments(response['results']);
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

  const handleFetchRadiology = async () => {
    try {
      const response = await patientFetchRadiology(token);
      alert(JSON.stringify(response));
      if (response) {
        setDocuments(response['results']);
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

  const handleFetchVaccinations = async () => {
    try {
      const response = await patientFetchVaccinations(token);
      alert(JSON.stringify(response));
      if (response) {
        setDocuments(response['results']);
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

  const getDocuments = async selectedTab => {
    switch (selectedTab) {
      case 0:
        handleFetchPrescriptions();
        break;

      case 1:
        handleFetchRecords();
        break;

      case 2:
        handleFetchTestResults();
        break;

      case 5:
        handleFetchReports();
        break;

      case 6:
        handleFetchRadiology();
        break;

      case 7:
        handleFetchVaccinations();
        break;

      default:
        break;
    }
  };

  const getDocumentDate = document => {
    switch (selectedTab) {
      case 0:
        return document.date_ordonnance;
        break;
      case 1:
        return document.date_compte_rendu;
        break;
      case 2:
        return document.date_resultat;
        break;
      case 3:
        return '';
        break;
      case 4:
        return '';
        break;
      case 5:
        return document.date_rapport;
        break;
      case 6:
        return document.date_imagerie;
        break;
      case 7:
        return document.date_vaccin;
        break;

      default:
        return '';
        break;
    }
  };

  useEffect(() => {
    getDocuments(selectedTab);
  }, [selectedTab]);

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
          <AntDesign
            name="addfile"
            size={30}
            color={COLORS.PRIMARY12}
            onPress={() => navigation.navigate('AddDocument')}
          />
        </View>
        <FlatList
          ref={tabsRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabsArray}
          contentContainerStyle={styles.tabsContainer}
          //style={styles.tabsContainer}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={[
                styles.tab,
                {
                  marginRight: index == tabsArray.length - 1 ? 10 : 0,
                  borderBottomWidth: item.id == selectedTab ? 2 : 0,
                  borderBottomColor: COLORS.PRIMARY12,
                },
              ]}
              onPress={() => {
                if (item.id !== selectedTab) {
                  setDocuments(null);
                  setSelectedTab(item.id);
                  tabsRef.current.scrollToIndex({index});
                }
              }}>
              <Text
                style={[
                  styles.tabName,
                  item.id == selectedTab && {color: COLORS.PRIMARY12},
                ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.bottomView}>
          {documents ? (
            documents.length > 0 ? (
              <FlatList
                data={documents}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={[
                      styles.documentContainer,
                      {marginBottom: index == documents.length - 1 ? 25 : 0},
                    ]}>
                    <View style={styles.row}>
                      <View style={styles.iconContainer}>
                        <MaterialCommunityIcons
                          name={(() => {
                            switch (selectedTab) {
                              case 0:
                                return 'file-document-outline';
                                break;
                              case 1:
                                return 'file-document-outline';
                                break;
                              case 2:
                                return 'test-tube-empty';
                                break;
                              case 3:
                                return 'medical-bag';
                                break;
                              case 4:
                                return 'bio';
                                break;
                              case 5:
                                return 'file-document-outline';
                                break;
                              case 6:
                                return 'radiology-box-outline';
                                break;
                              case 7:
                                return 'needle';
                                break;

                              default:
                                break;
                            }
                          })()}
                          color={COLORS.SECONDARY}
                          size={iconContainerSize / 2}
                        />
                      </View>
                      <Text>{getDocumentDate(item).substr(0, 10)}</Text>
                    </View>
                    <Text>{item.description}</Text>
                    {item.fichier !== '' && (
                      <TouchableOpacity
                        onPress={() => openInBrowser(item.fichier)}>
                        {/* <Text>
                          {item.fichier.substr(0, 25)}...
                          {item.fichier.substr(
                            item.fichier.length - 26,
                            item.fichier.length - 1,
                          )}
                        </Text> */}
                        <View
                          style={[
                            styles.row,
                            {marginTop: 5, justifyContent: 'space-evenly'},
                          ]}>
                          <MaterialCommunityIcons
                            name="file-document-outline"
                            size={20}
                            color={COLORS.PRIMARY12}
                          />
                          <Text>
                            {item.fichier.substr(0, 15)}...
                            {item.fichier.substr(
                              item.fichier.length - 16,
                              item.fichier.length - 1,
                            )}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text>{application.language.data.NO_FILES}</Text>
              </View>
            )
          ) : (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size="small" color={COLORS.PRIMARY12} />
            </View>
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

const mapDispatchProps = dispatch => ({});

export default connect(mapStateProps, mapDispatchProps)(Documents);

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
    height: tabsHeight,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  tabName: {
    fontSize: 16,
    fontWeight: '700',
  },
  bottomView: {height: HEIGHT - tabsHeight - HEIGHT / 10},
  documentContainer: {
    height: documentHeight,
    width: documentWidth,
    borderRadius: 15,
    backgroundColor: COLORS.SECONDARY,
    marginTop: 10,
    padding: 10,
    alignSelf: 'center',
    shadowColor: COLORS.PRIMARY12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconContainer: {
    height: iconContainerSize,
    width: iconContainerSize,
    borderRadius: iconContainerSize,
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
});
