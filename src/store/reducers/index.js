import { combineReducers } from 'redux';

import user from './user';
import isLoading from './loading';

export default combineReducers({
  user,
  isLoading,
});