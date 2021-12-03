import { combineReducers } from 'redux';

import user from './user';
import isLoading from './loading';
import navigation from './navigation';

export default combineReducers({
  user,
  isLoading,
  navigation,
});