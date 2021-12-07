import { combineReducers } from 'redux';

import user from './user';
import pabx from './pabx';
import isLoading from './loading';
import navigation from './navigation';
import theme from './theme';

export default combineReducers({
	user,
	pabx,
	isLoading,
	navigation,
	theme,
});