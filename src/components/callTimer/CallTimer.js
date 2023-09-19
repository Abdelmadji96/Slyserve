import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../../constants/colors';

const CallTimer = ({timerStarted}) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    let interval;
    if (timerStarted) {
      interval = setInterval(() => {
          console.log('!')
        if (minutes == 59) {
          setSeconds(0);
          setMinutes(0);
          setHours(previousHours => previousHours + 1);
        } else {
          if (seconds == 59) {
            setSeconds(0);
            setMinutes(previousMinutes => previousMinutes + 1);
          } else {
            setSeconds(previousSeconds => previousSeconds + 1);
          }
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, []);

  const displayTimer = () => {
    let s = seconds < 10 ? '0' + seconds : seconds;
    let m = minutes < 10 ? '0' + minutes : minutes;
    let h = hours < 10 ? '0' + hours : hours;
    return h + ' : ' + m + ' : ' + s;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{displayTimer()}</Text>
    </View>
  );
};

export default CallTimer;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 100,
    borderRadius: 10,
    backgroundColor: COLORS.PRIMARY12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.SECONDARY,
  },
});
