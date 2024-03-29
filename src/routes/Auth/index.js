import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../../store/actions";

import Login from "../../pages/Auth/Login";
import Register from "../../pages/Auth/Register";
import Recovery from "../../pages/Auth/Recovery";

export default function Auth(props) {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setIsLoading(true));
		setTimeout(() => dispatch(setIsLoading(false)), 1)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.location]);

	return (
		<>
			<Switch>
				<Route exact path="/auth/cadastrar" component={Register}/>
				<Route exact path="/auth/email/:token" component={Login}/>
				<Route exact path="/auth/senha/nova-senha/:token" component={Recovery}/>
				<Route exact path="/auth" component={Login}/>
				<Route path="/" component={Login}/>
			</Switch>
		</>
	);
}