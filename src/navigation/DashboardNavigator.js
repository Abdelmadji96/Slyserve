import React, {useRef, useState, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeNavigator from './HomeNavigator';
import {WIDTH} from '../constants/dimensions';
import {COLORS} from '../constants/colors';
import DrawerContent from '../components/drawer/DrawerContent';
import ChangeLanguage from '../screens/dashboard/ChangeLanguage';
import {LoginNavigator} from './LoginNavigator';
import {RegisterNavigator} from './RegisterNavigator';
import AboutUs from '../screens/dashboard/AboutUs';
import ContactUs from '../screens/dashboard/ContactUs';
import AppointmentsNavigator from './AppointmentsNavigator';
import RelativesNavigator from './RelativesNavigator';
import DocumentsNavigator from './DocumentsNavigator';
import PlanningNavigator from './PlanningNavigator';
import PatientsNavigator from './PatientsNavigator';
import SubscriptionNavigator from './SubscriptionNavigator';
import ProfileNavigator from './ProfileNavigator';
import InformationsNavigator from './InformationsNavigator';
import {FIRESTORE, FIRESTORE_COLLECTIONS} from '../../firebase';
import {USER_ROLES} from '../constants/user';
import GettingCall from '../screens/videoCall/GettingCall';
import {connect} from 'react-redux';
import {setCall} from '../redux/actions/call';
import InCallManager from 'react-native-incall-manager';
import VideoCall from '../screens/videoCall/VideoCall';
import {ActivityIndicator, View} from 'react-native';
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import VideoCallClass from '../functions/VideoCallClass';
import {sendFCMNotification} from '../functions/notifications';
import Sound from 'react-native-sound';
import {doctorUpdateRemainingMinutes} from '../api/doctors';
InCallManager.setForceSpeakerphoneOn(true);

const Drawer = createDrawerNavigator();

const config = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302',
      ],
    },
    {
      urls: ['turn:numb.viagenie.ca'],
      credential: 'muazkh',
      username: 'webrtc@live.com',
    },
  ],
};

const DashboardNavigator = ({user, role, token, call, updateCall}) => {
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [gettingCall, setGettingCall] = useState(false);
  const [callAnswered, setCallAnswered] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  const peerConnection = useRef(null);
  const connecting = useRef(false);
  //const [counter, setCounter] = useState(null);
  const [callEnded, setCallEnded] = useState(false);
  // const peerConnectionPatient = useRef(null);
  // const peerConnectionDoctor = useRef(null);
  // const [callingSound, setCallingSound] = useState(
  //   new Sound('calling.mp3', Sound.MAIN_BUNDLE, (error, sound) => {
  //     if (error) {
  //       console.log('error' + error.message);
  //       return;
  //     }
  //   }),
  // );
  // const [ringingSound, setRingingSound] = useState(
  //   new Sound('ringing.mp3', Sound.MAIN_BUNDLE, (error, sound) => {
  //     if (error) {
  //       console.log('error' + error.message);
  //       return;
  //     }
  //   }),
  // );

  // const playSound = sound => {
  //   Sound.setCategory('Playback');
  //   sound.setVolume(1);
  //   sound.setNumberOfLoops(100);
  //   sound.play(() => {
  //     sound.release();
  //   });
  // };

  // const stopSound = sound => {
  //   sound.stop(() => {});
  // };

  const setupWebrtc = async () => {
    InCallManager.start({media: 'audio'});
    //InCallManager.setForceSpeakerphoneOn(true);
    peerConnection.current = new RTCPeerConnection(config);

    // peerConnectionPatient.current = new RTCPeerConnection(config);
    // peerConnectionDoctor.current = new RTCPeerConnection(config);

    const stream = await VideoCallClass.getStream(true);
    if (stream) {
      console.log('local stream:\n' + JSON.stringify(stream));
      setLocalStream(stream);
      peerConnection.current.addStream(stream);
    }
    peerConnection.current.onaddstream = e => {
      console.log('remote stream:\n' + JSON.stringify(e.stream));
      setRemoteStream(e.stream);
    };
  };

  const updateStream = async cameraType => {
    const stream = await VideoCallClass.getStream(cameraType);
    if (stream) {
      console.log(JSON.stringify(stream));
      if (localStream) {
        // localStream.getTracks().forEach(track => track.stop());
        // localStream.release();
        peerConnection.current.removeStream(localStream);
        peerConnection.current.addStream(stream);
        setLocalStream(stream);
      }
      // const offer = await peerConnection.current.createOffer();
      // peerConnection.current.setLocalDescription(offer);
      // const callRef = FIRESTORE.collection(FIRESTORE_COLLECTIONS.CALLS).doc(
      //   'callId',
      // );
      // callRef.update({offer: {type: offer.type, sdp: offer.sdp}});
    }
    // peerConnection.current.onaddstream = e => {
    //   console.log(JSON.stringify(e.stream));
    //   setRemoteStream(e.stream);
    // };
  };

  // const updateStream2 = async cameraType => {
  //   const stream = await VideoCallClass.getStream(cameraType);
  //   const videoTracks = stream.getVideoTracks();
  //   localStream.addTrack(videoTracks[0]);
  //   if (role == USER_ROLES.PATIENT) {
  //     peerConnectionPatient.current.addTrack(videoTracks[0], localStream);
  //     const offer = await peerConnectionPatient.current.createOffer();
  //     peerConnectionPatient.current.setLocalDescription(offer);
  //     peerConnectionDoctor.current.setRemoteDescription(
  //       peerConnectionPatient.current.localDescription,
  //     );
  //     const answer = await peerConnectionDoctor.current.createAnswer();
  //     peerConnectionDoctor.current.setLocalDescription(answer);
  //     peerConnectionPatient.current.setRemoteDescription(answer);
  //   } else {
  //     peerConnectionDoctor.current.addTrack(videoTracks[0], localStream);
  //     const offer = await peerConnectionDoctor.current.createOffer();
  //     peerConnectionDoctor.current.setLocalDescription(offer);
  //     peerConnectionPatient.current.setRemoteDescription(
  //       peerConnectionDoctor.current.localDescription,
  //     );
  //     const answer = await peerConnectionPatient.current.createAnswer();
  //     peerConnectionPatient.current.setLocalDescription(answer);
  //     peerConnectionDoctor.current.setRemoteDescription(answer);
  //   }
  // };

  const create = async () => {
    console.log('Calling');
    connecting.current = true;
    await setupWebrtc();
    const callRef = FIRESTORE.collection(FIRESTORE_COLLECTIONS.CALLS).doc(
      `PATIENT${call.callee.id}`,
    );
    collectIceCandidates(
      callRef,
      `DOCTOR${user.id}`,
      `PATIENT${call.callee.id}`,
    );
    callRef.get().then(async doc => {
      if (doc && doc.exists) {
        alert('Patient already in call');
      } else {
        if (peerConnection.current) {
          const offer = await peerConnection.current.createOffer();
          peerConnection.current.setLocalDescription(offer);
          const callWithOffer = {
            offer: {
              type: offer.type,
              sdp: offer.sdp,
            },
            doctor: {
              id: user.id,
              name: user.nom + ' ' + user.prenom,
            },
          };
          callRef.set(callWithOffer);
          sendFCMNotification(
            call.callee.notificationsToken,
            'Slyserve',
            user.nom +
              ' ' +
              user.prenom +
              ' est entrain de vous appeler, rejoignez le dans la session',
            {key1: 'value1'},
          );
          //playSound(callingSound);
          //InCallManager.startRingtone('DEFAULT', [0, 250, 250, 250], '', 60);
        }
      }
    });
  };

  const join = async () => {
    console.log('Joining');
    connecting.current = true;
    setGettingCall(false);
    const callRef = FIRESTORE.collection(FIRESTORE_COLLECTIONS.CALLS).doc(
      `PATIENT${user.id}`,
    );
    const data = (await callRef.get()).data();
    const offer = data?.offer;
    const doctor = data?.doctor;
    if (offer) {
      await setupWebrtc();
      collectIceCandidates(callRef, `PATIENT${user.id}`, `DOCTOR${doctor.id}`);
      if (peerConnection.current) {
        peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(offer),
        );
        const answer = await peerConnection.current.createAnswer();
        peerConnection.current.setLocalDescription(answer);
        const callWithAnswer = {
          answer: {type: answer.type, sdp: answer.sdp},
        };
        callRef.update(callWithAnswer);
      }
    }
    if (doctor) {
      setDoctorData(doctor);
    }
    setCallAnswered(true);
    //stopSound(ringingSound);
    //InCallManager.startRingtone();
  };

  const hangup = async () => {
    if (role == USER_ROLES.PATIENT) {
      setGettingCall(false);
    }
    if (callAnswered) {
      setCallEnded(true);
    }
    setCallAnswered(false);
    connecting.current = false;
    streamCleanUp();
    firestoreCleanUp();
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    //InCallManager.stop();
    await updateCall({
      ...call,
      calling: false,
      callee: null,
    });
    // stopSound(callingSound);
    // stopSound(ringingSound);
    //InCallManager.stopRingtone();
  };

  const streamCleanUp = async () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      localStream.release();
    }
    setLocalStream(null);
    setRemoteStream(null);
  };

  const firestoreCleanUp = async () => {
    const callRef = FIRESTORE.collection(FIRESTORE_COLLECTIONS.CALLS).doc(
      `PATIENT${role == USER_ROLES.PATIENT ? user.id : call.callee.id}`,
    );
    if (callRef) {
      const calleeCandidate = await callRef.collection('callee').get();
      calleeCandidate.forEach(async candidate => {
        await candidate.ref.delete();
      });
      const callerCandidate = await callRef.collection('caller').get();
      callerCandidate.forEach(async candidate => {
        await candidate.ref.delete();
      });
      callRef.delete();
    }
  };

  const collectIceCandidates = async (callRef, caller, callee) => {
    const candidateCollection = callRef.collection(caller);
    if (peerConnection.current) {
      peerConnection.current.onicecandidate = e => {
        if (e.candidate) {
          candidateCollection.add(e.candidate);
        }
      };
    }
    callRef.collection(callee).onSnapshot(snapshot => {
      snapshot.docChanges.forEach(change => {
        if (change.type == 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          peerConnection.current?.addIceCandidate(candidate);
        }
      });
    });
  };

  useEffect(() => {
    if (call.calling) {
      create();
    }
  }, [call.calling]);

  useEffect(() => {
    const callRef = FIRESTORE.collection(FIRESTORE_COLLECTIONS.CALLS).doc(
      `PATIENT${role == USER_ROLES.PATIENT ? user.id : call?.callee?.id}`,
    );
    const subscribe = callRef.onSnapshot(snapshot => {
      if (snapshot && snapshot.exists) {
        const data = snapshot.data();
        if (data && data.offer && !connecting.current) {
          if (USER_ROLES.PATIENT) {
            setGettingCall(true);
            setDoctorData(data.doctor);
          }
          //playSound(ringingSound);
          //InCallManager.startRingtone('DEFAULT', [], '', 60);
        }
        if (
          peerConnection.current &&
          !peerConnection.current.remoteDescription &&
          data &&
          data.answer
        ) {
          peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.answer),
          );
        }
      }
    });
    const subscribeDelete = callRef.onSnapshot(doc => {
      if (!doc.exists) {
        hangup();
      }
    });
    return () => {
      subscribe();
      subscribeDelete();
    };
  }, []);

  useEffect(() => {
    if (role == USER_ROLES.DOCTOR) {
      const callRef = FIRESTORE.collection(FIRESTORE_COLLECTIONS.CALLS).doc(
        `PATIENT${call?.callee?.id}`,
      );
      const subscribe = callRef.onSnapshot(snapshot => {
        if (!snapshot && !snapshot.exists) {
          hangup();
        } else {
          const data = snapshot.data();
          if (data && data.offer && !connecting.current) {
            if (role == USER_ROLES.PATIENT) {
              setGettingCall(true);
              setDoctorData(data.doctor);
            }
          }
          if (
            peerConnection.current &&
            !peerConnection.current.remoteDescription &&
            data &&
            data.answer
          ) {
            //stopSound(callingSound);
            //InCallManager.stopRingtone();
            peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(data.answer),
            );
          }
        }
      });
      return () => {
        subscribe();
      };
    }
  }, [call.calling]);

  useEffect(() => {
    var interval;
    if (callAnswered) {
      let c = 0;
      interval = setInterval(() => {
        c++;
        handleUpdateMinutes();
      }, 10000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [callAnswered]);

  const handleUpdateMinutes = async () => {
    try {
      console.log(token)
      const response = await doctorUpdateRemainingMinutes(token);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  if (call.calling) {
    if (localStream) {
      return (
        <VideoCall
          hangup={hangup}
          localStream={localStream}
          remoteStream={remoteStream}
          updateStream={updateStream}
        />
      );
    } else {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="small" color={COLORS.PRIMARY12} />
        </View>
      );
    }
  } else {
    if (gettingCall) {
      return <GettingCall doctor={doctorData} join={join} hangup={hangup} />;
    } else {
      if (callAnswered) {
        if (localStream && remoteStream) {
          return (
            <VideoCall
              hangup={hangup}
              localStream={localStream}
              remoteStream={remoteStream}
              updateStream={updateStream}
            />
          );
        }
      } else {
        return (
          <Drawer.Navigator
            drawerContent={props => {
              return <DrawerContent {...props} />;
            }}
            initialRouteName="Home"
            backBehavior="initialRoute"
            detachInactiveScreens
            screenOptions={{
              headerShown: false,
              drawerType: 'slide',
              overlayColor: 'transparent',
              drawerStyle: {
                width: WIDTH * 0.6,
              },
              sceneContainerStyle: {
                backgroundColor: COLORS.PRIMARY12,
                opacity: 1,
              },
            }}>
            <Drawer.Screen name="HomeNavigator" component={HomeNavigator} />
            <Drawer.Screen name="ChangeLanguage" component={ChangeLanguage} />
            <Drawer.Screen name="LoginNavigator" component={LoginNavigator} />
            <Drawer.Screen
              name="RegisterNavigator"
              component={RegisterNavigator}
            />
            <Drawer.Screen
              name="AppointmentsNavigator"
              component={AppointmentsNavigator}
            />
            <Drawer.Screen
              name="RelativesNavigator"
              component={RelativesNavigator}
            />
            <Drawer.Screen
              name="DocumentsNavigator"
              component={DocumentsNavigator}
            />
            <Drawer.Screen
              name="PlanningNavigator"
              component={PlanningNavigator}
            />
            <Drawer.Screen
              name="PatientsNavigator"
              component={PatientsNavigator}
            />
            <Drawer.Screen
              name="SubscriptionNavigator"
              component={SubscriptionNavigator}
            />
            <Drawer.Screen
              name="InformationsNavigator"
              component={InformationsNavigator}
            />
            <Drawer.Screen
              name="ProfileNavigator"
              component={ProfileNavigator}
            />
            <Drawer.Screen name="AboutUs" component={AboutUs} />
            <Drawer.Screen name="ContactUs" component={ContactUs} />
          </Drawer.Navigator>
        );
      }
    }
  }
};

const mapStateProps = store => ({
  user: store.userState.currentUser,
  role: store.userState.role,
  call: store.callState.call,
  token: store.userState.token,
});

const mapDispatchProps = dispatch => ({
  updateCall: call => dispatch(setCall(call)),
});

export default connect(mapStateProps, mapDispatchProps)(DashboardNavigator);
