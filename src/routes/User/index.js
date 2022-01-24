import React, { useEffect } from "react";

import { Switch, Route } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setLocation, updateUser, updatePABX } from "../../store/actions";
import LOCATIONS from "../../store/locations";

import NotFound from "../Errors/NotFound";

import validateToken from "../../services/token";

import Navbar from "../../components/Navbar";
import Header from "../../components/Header";

import Dashboard from "../../pages/User/Dashboard";
import PABXList from "../../pages/User/PABX";
import PABX from "../../pages/User/PABX/PABX";
import Finance from "../../pages/User/Finance";


export default function User({ location, history }) {
	const dispatch = useDispatch();

	const routes = [
		{
			path: "/admin/dashboard",
			component: Dashboard,
			exact: true
		},
		{
			path: "/admin/PABX",
			component: PABXList,
			exact: true
		},
		{
			path: "/admin/PABX/:PABX",
			component: PABX,
			exact: true
		},
		{
			path: "/admin/financeiro",
			component: Finance,
			exact: true
		},
		{
			component: NotFound
		}
	]

	useEffect(() => {
		const path = location?.pathname;

		const updateLocation = (path = "/admin/dashboard") => {
			let location = {
				path,
			};

			LOCATIONS.forEach(item => {
				if (item.nested) {
					item.nested.forEach(nested => {
						if (path.match(nested.key)) {
							location.path = nested.key;
							location.title = item.name;
							location.subtitle = nested.name;
						}
					});
				} else if (path.match(item.key)) {
					location.path = item.key;
					location.title = item.name;
				}
			});

			if (path === "/admin/dashboard") {
				location.subtitle = "Bem-vindo!"
			}

			dispatch(setLocation(location));
		}

			
		validateToken().catch(() => {				
			dispatch(updateUser());
			dispatch(updatePABX());
		});

		if (path?.length > 1) {
			updateLocation(path);
		} else {
			updateLocation();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	return (
		<>
			<Navbar history={history} />
			<Header />
			<Switch>
				<Route exact path="/" component={Dashboard} />
				{routes.map((route, i) => (
					<Route key={i} {...route} />
				))}
			</Switch>
		</>
	);
}