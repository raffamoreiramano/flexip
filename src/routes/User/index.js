import React, { useState, useEffect } from "react";

import { Switch, Route } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserActions from "../../store/actions/user";

import api from "../../services/api";
import { API_GUARD } from "../../services/env";

import NotFound from "../Errors/NotFound";

import Dashboard from "../../pages/User/Dashboard";
import Navbar from "../../components/Navbar";


function User({location, history, setIsLoading, updateUser, updatePABX }) {
	// const [authenticated, setAuthenticated] = useState(true);
	const [routes, setRoutes] = useState([]);

	useEffect(() => {
		setIsLoading(true);
		setTimeout(() => setIsLoading(false), 1)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	useEffect(() => {
		checkIfTokenExists();
		setRoutes([
			{
				path: "/admin/dashboard",
				component: Dashboard,
				exact: false
			},
			{
				component: NotFound
			}
		]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function checkIfTokenExists() {
		const access_token = await localStorage.getItem("access_token");

		if (access_token) {
			// setAuthenticated(true);
			try {
				const response = await api.post(`/v1/${API_GUARD}/auth/me`, null, {
					headers: { Authorization: "Bearer " + access_token }
				});

				if (response.status === 200) {
					const { user } = response.data;
					const { company } = user;
					const { pabx } = company;
					// setAuthenticated(true);
					updateUser(user.name, user.email);
					updatePABX(pabx[0].id, pabx[0].name);
					return;
				} else {
					// setAuthenticated(false);
					history.push("/");
					return;
				}
			} catch (error) {
				localStorage.removeItem("access_token");
				// setAuthenticated(false);
				history.push("/");
			}
		} else {
			// setAuthenticated(false);
			history.push("/");
		}
	}

	return (
		<>
			<Navbar history={history} />
			<Switch>
				{routes.map((route, i) => (
					<Route key={i} {...route} />
				))}
			</Switch>
		</>
	);
}

const mapStateToProps = state => ({
	user: state.user
});

const mapDispatchToProps = dispatch =>
	bindActionCreators(UserActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(User);
