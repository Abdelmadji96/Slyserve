import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {COLORS} from '../../constants/colors';
import {HEIGHT, WIDTH} from '../../constants/dimensions';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RTCView} from 'react-native-webrtc';
import {connect} from 'react-redux';
import CallTimer from '../../components/callTimer/CallTimer';
//import CountDown from 'react-native-countdown-component';

const actionButtonSize = HEIGHT / 12.5;

const VideoCall = ({hangup, localStream, remoteStream, updateStream, call}) => {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [frontCamera, setFrontCamera] = useState(true);
  const [timerStarted, setTimerStarted] = useState(false);

  const toggleMic = () => {
    localStream.getTracks().map(t => {
      if (t.kind === 'audio') {
        setMicEnabled(!micEnabled);
        t.enabled = !t.enabled;
      }
    });
  };

  const toggleVideo = () => {
    localStream.getTracks().map(t => {
      if (t.kind === 'video') {
        setVideoEnabled(!videoEnabled);
        t.enabled = !t.enabled;
      }
    });
  };

  const toggleCamera = value => {
    setFrontCamera(value);
    updateStream(value);
  };

  const isRemoteCameraEnabled = remoteStream => {
    let enabled = false;
    remoteStream.getTracks().map(t => {
      if (t.kind === 'video' && t.enabled) {
        enabled = true;
      }
    });
    return enabled;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (remoteStream && !timerStarted) {
      setTimerStarted(true);
    }
  }, [remoteStream]);

  return (
    <View style={styles.container}>
      <View style={styles.underlay}>
        {remoteStream ? (
          isRemoteCameraEnabled(remoteStream) ? (
            <>
              <RTCView
                streamURL={remoteStream.toURL()}
                style={{...StyleSheet.absoluteFillObject}}
                objectFit="cover"
              />
              {videoEnabled && (
                <View style={styles.localStreamWrapper}>
                  <RTCView
                    streamURL={localStream.toURL()}
                    style={styles.localStreamContainer}
                    objectFit="cover"
                  />
                  {/* <TouchableOpacity
                    style={styles.switchCamera}
                    onPress={() => toggleCamera(!frontCamera)}>
                    <Ionicons
                      name="camera-reverse-outline"
                      size={20}
                      color={COLORS.SECONDARY}
                    />
                  </TouchableOpacity> */}
                </View>
              )}
            </>
          ) : (
            <>
              <View style={styles.localStreamWrapper}>
                <RTCView
                  streamURL={localStream.toURL()}
                  style={styles.localStreamContainer}
                  objectFit="cover"
                />
                {/* <TouchableOpacity
                    style={styles.switchCamera}
                    onPress={() => toggleCamera(!frontCamera)}>
                    <Ionicons
                      name="camera-reverse-outline"
                      size={20}
                      color={COLORS.SECONDARY}
                    />
                  </TouchableOpacity> */}
              </View>
            </>
          )
        ) : (
          <RTCView
            streamURL={localStream.toURL()}
            style={{...StyleSheet.absoluteFill}}
            objectFit="cover"
          />
        )}
        <View style={styles.buttonsContainer}>
          {/* <TouchableOpacity
            style={[
              styles.callActionButton,
              {
                backgroundColor: COLORS.LIGHT_GRAY,
                shadowColor: COLORS.LIGHT_GRAY,
              },
            ]}
            onPress={toggleCamera}>
            <Ionicons
              name="camera-reverse-outline"
              size={actionButtonSize / 1.5}
              color={COLORS.PRIMARY12}
            />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[
              styles.callActionButton,
              {
                backgroundColor: COLORS.LIGHT_GRAY,
                shadowColor: COLORS.LIGHT_GRAY,
              },
            ]}
            onPress={toggleVideo}>
            <Feather
              name={videoEnabled ? 'video' : 'video-off'}
              size={actionButtonSize / 2}
              color={COLORS.PRIMARY12}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.callActionButton,
              {
                backgroundColor: COLORS.LIGHT_GRAY,
                shadowColor: COLORS.LIGHT_GRAY,
              },
            ]}
            onPress={toggleMic}>
            <Feather
              name={micEnabled ? 'mic' : 'mic-off'}
              size={actionButtonSize / 2}
              color={COLORS.PRIMARY12}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.callActionButton,
              {backgroundColor: 'red', shadowColor: 'red'},
            ]}
            onPress={hangup}>
            <Feather
              name="phone-off"
              size={actionButtonSize / 2}
              color={COLORS.SECONDARY}
            />
          </TouchableOpacity>
        </View>
        {timerStarted && (
          <CallTimer timerStarted={timerStarted} />
          // <CountDown
          //   //until={60}
          //   size={20}
          //   digitStyle={{backgroundColor: COLORS.PRIMARY12, marginTop: 10}}
          //   digitTxtStyle={{color: COLORS.SECONDARY}}
          //   timeToShow={['H', 'M', 'S']}
          //   timeLabels={{h: '', m: '', s: ''}}
          // />
        )}
      </View>
    </View>
  );
};

const mapStateProps = store => ({
  user: store.userState.currentUser,
  role: store.userState.role,
  call: store.callState.call,
});

export default connect(mapStateProps, null)(VideoCall);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
  },
  underlay: {flex: 1},
  localStreamWrapper: {
    height: HEIGHT / 4.5,
    width: WIDTH / 4,
    position: 'absolute',
    top: 60,
    right: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  localStreamContainer: {
    height: HEIGHT / 5,
    width: WIDTH / 4,
    borderRadius: 25,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  switchCamera: {
    height: 30,
    width: 30,
    borderRadius: 30,
    backgroundColor: COLORS.PRIMARY12,
    bottom: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    height: HEIGHT / 8.5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: COLORS.SECONDARY,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'absolute',
    bottom: 0,
  },
  callActionButton: {
    height: actionButtonSize,
    width: actionButtonSize,
    borderRadius: actionButtonSize,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2.5,
  },
});
