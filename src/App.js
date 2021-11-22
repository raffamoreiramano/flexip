import React from 'react';
import { Provider } from 'react-redux';
import store from './store';

import Progress from './components/Progress';

import './App.css';

import Routes from './routes';

function App() {
	return (
		<Provider store={store}>
			<Progress />
			<Routes />
		</Provider>
	);
}

export default App;
