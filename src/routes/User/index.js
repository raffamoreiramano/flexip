import React, { useEffect } from "react";

import { Switch, Route } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setIsLoading, setLocation } from "../../store/actions";
import LOCATIONS from "../../store/locations";

import NotFound from "../Errors/NotFound";

import Dashboard from "../../pages/User/Dashboard";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";


export default function User({ location, history }) {
	const dispatch = useDispatch();

	const routes = [
		{
			path: "/admin/dashboard",
			component: Dashboard,
			exact: true
		},
		{
			component: NotFound
		}
	]

	useEffect(() => {
		const path = location?.pathname;

		const updateLocation = () => {
			let location = {
				path: "",
				title: "",
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

			dispatch(setLocation(location));
		}

		dispatch(setIsLoading(true));

		if (path?.length > 1) {
			updateLocation();
		}

		setTimeout(() => dispatch(setIsLoading(false)), 1);
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