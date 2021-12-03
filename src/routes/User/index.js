import React, { useEffect } from "react";

import { Switch, Route } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setIsLoading, setActiveLink } from "../../store/actions/user";

import NotFound from "../Errors/NotFound";

import Dashboard from "../../pages/User/Dashboard";
import Navbar from "../../components/Navbar";


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
		dispatch(setIsLoading(true));
		dispatch(setActiveLink(location.pathname));
		setTimeout(() => dispatch(setIsLoading(false)), 1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	return (
		<>
			<Navbar history={history} />
			<Switch>
				<Route exact path="/" component={Dashboard} />
				{routes.map((route, i) => (
					<Route key={i} {...route} />
				))}
			</Switch>
		</>
	);
}