import React, { useState, useEffect, useRef } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { setIsLoading, updatePABX, updateUser } from "../store/actions";

import validateToken from "../services/token";

import NotFound from './Errors/NotFound';
import Rendering from "./Errors/Rendering";

import User from './User';
import Auth from './Auth';

export default function Routes() {
	const [authenticated, setAuthenticated] = useState(false);
	const [validated, setValidated] = useState(false);
	
	const dispatch = useDispatch();
	const user = useSelector(state => state.user);
	
	const initialRender = useRef(true);

	useEffect(() => {
		setValidated(false);
		dispatch(setIsLoading(true));

		if (initialRender.current) {
			initialRender.current = false;
		}

		validateToken().then(({user, pabx}) => {
			setAuthenticated(true);

			if (initialRender.current) {
				dispatch(updateUser(user.name, user.email));
				dispatch(updatePABX(pabx[0].id, pabx[0].name));
			}
		}).catch(error => {
			setAuthenticated(false);
		}).finally(() => {			
			setValidated(true);
			dispatch(setIsLoading(false));
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const RouterSwitch = () => {
		if (!validated) {
			return <Route exact path="*" component={Rendering} />;
		}

		if (authenticated) {
			return <Route exact path="*" component={User} />;
		}

		if (!authenticated) {
			return (
				<Switch>
					<Route exact path="*" component={Auth} />
				</Switch>
			);
		}
	}

	return (
		<>
			<Router>
				<RouterSwitch />
			</Router>
		</>
	);
}