import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Animated from 'react-native-reanimated';
import DrawerHiddenView from '../../components/drawerHiddenView/DrawerHiddenView';
import {COLORS} from '../../constants/colors';
import {useTheme} from '../../context/theme';
import WebrtcSimple from 'react-native-webrtc-simple';
import {connect} from 'react-redux';
import {USER_ROLES} from '../../constants/user';
import {useFocusEffect} from '@react-navigation/native';

const AboutUs = ({navigation, route, user, role, token}) => {
  const {drawer} = useTheme();

  // useFocusEffect(
  //   useCallback(() => {
  //     const configuration = {
  //       optional: null,
  //       key:
  //         //role == USER_ROLES.PATIENT ? 'PATIENT' + user.id : 'DOCTOR' + user.id,
  //         Math.random().toString(36).substr(2, 4), //optional
  //     };

  //     WebrtcSimple.start(configuration)
  //       .then(status => {
  //         alert(status);
  //         if (status) {
  //           const stream = WebrtcSimple.getLocalStream();
  //           console.log('My stream: ', stream);

  //           WebrtcSimple.getSessionId(id => {
  //             console.log('UserId: ', id);
  //           });
  //         }
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });

  //     WebrtcSimple.listenings.callEvents((type, userData) => {
  //       console.log('Type: ', type);
  //       console.log(type)
  //       switch (type) {
  //         case 'RECEIVED_CALL':
  //           alert('call received')
  //           break;
        
  //         default:
  //           break;
  //       }
  //       // START_CALL
  //       // RECEIVED_CALL
  //       // ACCEPT_CALL
  //       // END_CALL
  //       // MESSAGE
  //       // START_GROUP_CALL
  //       // RECEIVED_GROUP_CALL
  //       // JOIN_GROUP_CALL
  //       // LEAVE_GROUP_CALL
  //     });

  //     WebrtcSimple.listenings.getRemoteStream(remoteStream => {
  //       console.log('Remote stream', remoteStream);
  //     });
  //   }, []),
  // );

  // const callToUser = (userId, data) => {
  //   //const data = {};
  //   WebrtcSimple.events.call(userId, data);
  // };

  // const acceptCall = () => {
  //   WebrtcSimple.events.acceptCall();
  // };

  // const endCall = () => {
  //   WebrtcSimple.events.endCall();
  // };

  // const switchCamera = () => {
  //   WebrtcSimple.events.switchCamera();
  // };

  // const video = enable => {
  //   WebrtcSimple.events.videoEnable(enable);
  // };

  // const audio = enable => {
  //   WebrtcSimple.events.audioEnable(enable);
  // };

  // const sendMessage = message => {
  //   WebrtcSimple.events.message(message);
  // };

  // const groupCall = sessionId => {
  //   const data = {};
  //   WebrtcSimple.events.groupCall(sessionId, data);
  // };

  // const joinGroup = groupSessionId => {
  //   WebrtcSimple.events.joinGroup(groupSessionId);
  // };

  // const leaveGroup = () => {
  //   WebrtcSimple.events.leaveGroup();
  // };

  return (
    <>
      <DrawerHiddenView />
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{scale: drawer.scale}],
            borderTopLeftRadius: drawer.radius,
            borderBottomLeftRadius: drawer.radius,
          },
        ]}>
        {/* <TouchableOpacity
          onPress={() => {
            if (role == USER_ROLES.DOCTOR) {
              callToUser('pcmv', {caller: 'DOCTOR' + user.id});
            } else {
              alert("you can't make a call");
            }
          }}>
          <Text>call</Text>
        </TouchableOpacity> */}
      </Animated.View>
    </>
  );
};

const mapStateProps = store => ({
  user: store.userState.currentUser,
  role: store.userState.role,
  token: store.userState.token,
});

export default connect(mapStateProps, null)(AboutUs);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
  },
});

