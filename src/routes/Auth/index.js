import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../../store/actions/user";

import NotFound from "../Errors/NotFound";

import Login from "../../pages/Auth/Login";
import Register from "../../pages/Auth/Register";
// import EmailVerify from "../../pages/Auth/EmailVerify";
// import PasswordRecovery from "../../pages/Auth/PasswordRecovery";

export default function Auth(props) {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setIsLoading(true));
		setTimeout(() => props.setIsLoading(false), 1)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.location]);

	return (
		<>
			<Switch>
				<Route exact path="/auth" component={Login}/>
				<Route exact path="/auth/cadastrar" component={Register} />

				<Route component={NotFound} />
			</Switch>
		</>
	);
}