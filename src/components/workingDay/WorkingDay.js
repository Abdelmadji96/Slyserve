import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {LANAGUAGES_LIST} from '../../constants/languages';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS} from '../../constants/colors';
import DatePicker from 'react-native-date-picker';
import {WIDTH} from '../../constants/dimensions';

const getMinimumOpeningTime = () => {
  let today = new Date();
  today.setHours(
    parseInt('08:00'.substr(0, 2)),
    parseInt('08:00'.substr(3, 2)),
  );
  return today;
};

const getMaximumClosingTime = () => {
  let today = new Date();
  today.setHours(
    parseInt('17:00'.substr(0, 2)),
    parseInt('17:00'.substr(3, 2)),
  );
  return today;
};

const displayTime = time => {
  let displayedTime = '';
  let hours = time.getHours() >= 10 ? time.getHours() : '0' + time.getHours();
  let minutes =
    time.getMinutes() >= 10 ? time.getMinutes() : '0' + time.getMinutes();
  displayedTime = hours + ':' + minutes;
  return displayedTime;
};

const WorkingDay = ({
  application,
  weekDay,
  index,
  weekDaysLength,
  workingDays,
  weekDays,
  setWeekDays,
}) => {
  const [openingTimePickerOpened, setOpeningTimePickerOpened] = useState(false);
  const [closingTimePickerOpened, setClosingTimePickerOpened] = useState(false);
  const [openingTime, setOpeningTime] = useState(getMinimumOpeningTime());
  const [closingTime, setClosingTime] = useState(getMaximumClosingTime());

  const displayDay = day => {
    switch (day) {
      case 0:
        return application.language.data.SUNDAY;
        break;
      case 1:
        return application.language.data.MONDAY;
        break;
      case 2:
        return application.language.data.TUESDAY;
        break;
      case 3:
        return application.language.data.WEDNESDAY;
        break;
      case 4:
        return application.language.data.THURSDAY;
        break;
      case 5:
        return application.language.data.FRIDAY;
        break;
      case 6:
        return application.language.data.SATURDAY;
        break;

      default:
        break;
    }
  };

  return (
    <View
      style={[
        styles.container,
        application.language.key == LANAGUAGES_LIST.ARABIC && {
          flexDirection: 'row-reverse',
        },
      ]}>
      <Text>{displayDay(weekDay.day)}</Text>
      <TouchableOpacity onPress={() => setOpeningTimePickerOpened(true)}>
        <Text>{weekDay.opening}</Text>
        <DatePicker
          modal
          open={openingTimePickerOpened}
          date={openingTime}
          minimumDate={getMinimumOpeningTime()}
          mode="time"
          onConfirm={date => {
            setOpeningTimePickerOpened(false);
            setOpeningTime(date);
            setWeekDays(
              weekDays.map(item => ({
                ...item,
                opening:
                  item.day == weekDay.day ? displayTime(date) : item.opening,
              })),
            );
          }}
          onCancel={() => {
            setOpeningTimePickerOpened(false);
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setClosingTimePickerOpened(true)}>
        <Text>{weekDay.closing}</Text>
        <DatePicker
          modal
          open={closingTimePickerOpened}
          date={closingTime}
          maximumDate={getMaximumClosingTime()}
          mode="time"
          onConfirm={date => {
            setClosingTimePickerOpened(false);
            setClosingTime(date);
            setWeekDays(
              weekDays.map(item => ({
                ...item,
                closing:
                  item.day == weekDay.day ? displayTime(date) : item.closing,
              })),
            );
          }}
          onCancel={() => {
            setClosingTimePickerOpened(false);
          }}
        />
      </TouchableOpacity>
      <Feather
        name={weekDay.checked ? 'check-circle' : 'circle'}
        size={20}
        color={COLORS.PRIMARY12}
        onPress={() =>
          setWeekDays(
            weekDays.map(item => ({
              ...item,
              checked: item.day == weekDay.day ? !item.checked : item.checked,
            })),
          )
        }
      />
    </View>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
});

export default connect(mapStateProps, null)(WorkingDay);

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingHorizontal: 10,
  },
});
