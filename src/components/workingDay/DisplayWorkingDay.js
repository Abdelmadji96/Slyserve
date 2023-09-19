import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {LANAGUAGES_LIST} from '../../constants/languages';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS} from '../../constants/colors';

const DisplayWorkingDay = ({
  application,
  weekDay,
  index,
  weekDaysLength,
  workingDays,
  weekDays,
  setWeekDays,
}) => {
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
      <View>
        <Text>{weekDay.opening}</Text>
      </View>
      <View>
        <Text>{weekDay.closing}</Text>
      </View>
      <Feather
        name={weekDay.checked ? 'check-circle' : 'circle'}
        size={20}
        color={COLORS.PRIMARY12}
      />
    </View>
  );
};

const mapStateProps = store => ({
  application: store.applicationState.application,
});

export default connect(mapStateProps, null)(DisplayWorkingDay);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});
