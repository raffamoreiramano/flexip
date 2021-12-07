import React, { useState, useEffect, useRef } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { setIsLoading, updatePABX, updateUser } from "../store/actions";

import validateToken from "../services/token";

import Rendering from "./Errors/Rendering";
import Auth from './Auth';
import User from './User';

export default function Routes() {
	const [authenticated, setAuthenticated] = useState(false);
	const [validated, setValidated] = useState(false);
	
	const dispatch = useDispatch();
	const user = useSelector(state => state.user);
	
	const initialRender = useRef(true);

	useEffect(() => {
		setValidated(false);
		dispatch(setIsLoading(true));

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

			if (initialRender.current) {
				initialRender.current = false;
			}
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

		return (
			<Switch>
				<Route exact path="*" component={Auth} />
			</Switch>
		);
		
	}

	return (
		<>
			<Router>
				<RouterSwitch />
			</Router>
		</>
	);
}