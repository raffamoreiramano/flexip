import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { setIsLoading, updatePABX, updateUser } from "../store/actions";

import api from "../services/api";
import { API_GUARD } from "../services/env";

import NotFound from './Errors/NotFound';
import Rendering from "./Errors/Rendering";

import User from './User';
import Auth from './Auth';

export default function Routes() {
	const [authenticated, setAuthenticated] = useState(false);
	const [initialRender, setInitialRender] = useState(true);

	const user = useSelector(state => state.user);

	const dispatch = useDispatch();

	useEffect(() => {
		const validateToken = async () => {
			const access_token = localStorage.getItem("access_token");

			dispatch(setIsLoading(true));

			if (access_token) {
				try {
					const response = await api.post(`/v1/${API_GUARD}/auth/me`, null, {
						headers: { Authorization: "Bearer " + access_token }
					});

					if (response.status === 200) {
						const { user } = response.data;
						const { company } = user;
						const { pabx } = company;

						setAuthenticated(true);

						dispatch(updateUser(user.name, user.email));
						dispatch(updatePABX(pabx[0].id, pabx[0].name));
					}
				} catch (error) {
					localStorage.removeItem("access_token");

					dispatch(updateUser());
					dispatch(updatePABX());
				}
			}

			dispatch(setIsLoading(false));

			return;
		}

		if (initialRender) {
			validateToken().then(() => setInitialRender(false));
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!initialRender && user.name && user.email) {
			setAuthenticated(true);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const RouterSwitch = () => {
		if (authenticated) {
			return <Route exact path="*" component={User} />;
		}

		if (!initialRender) {
			return (
				<Switch>
					<Route path="/" component={Auth} />
		
					<Route component={NotFound} />
				</Switch>
			);
		}

		return <Route exact path="*" component={Rendering} />;
	}

	return (
		<>
			<Router>
				<RouterSwitch />
			</Router>
		</>
	);
}