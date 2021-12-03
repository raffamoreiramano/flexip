import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";

import { useDispatch } from "react-redux";
import { setIsLoading, updatePABX, updateUser } from "../store/actions/user";

import api from "../services/api";
import { API_GUARD } from "../services/env";

import NotFound from './Errors/NotFound';

import Signin from './Signin';
import Auth from './Auth';
import User from './User';

export default function Routes({ history }) {
	const [authenticated, setAuthenticated] = useState(false);
	const [initialRender, setInitialRender] = useState(true);

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
					setAuthenticated(false);
	
					history.push("/");
				}
			} else {
				setAuthenticated(false);
	
				history.push("/");
			}

			dispatch(setIsLoading(false));
		}

		if (initialRender) {
			validateToken().then(() => setInitialRender(false));
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Router>
				<Switch>
					{
						authenticated && !initialRender &&
						<Route exact path="/*" component={User} /> 
					}
					{
						!initialRender &&
						<>
							<Route path="/auth" component={Auth} />
							<Route exact path="/" component={Signin} />
							<Route component={NotFound} />
						</>
					}
				</Switch>
			</Router>
		</>
	);
}