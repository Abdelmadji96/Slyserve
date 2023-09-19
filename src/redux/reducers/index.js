import {combineReducers} from 'redux';
import {application} from './application';
import {user} from './user';
import {call} from './call';

const Reducers = combineReducers({
  applicationState: application,
  userState: user,
  callState: call,
});

export default Reducers;
