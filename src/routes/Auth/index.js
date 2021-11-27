import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserActions from "../../store/actions/user";

import NotFound from "../Errors/NotFound";

import Login from "../../pages/Auth/Login";
import Register from "../../pages/Auth/Register";
// import EmailVerify from "../../pages/Auth/EmailVerify";
// import PasswordRecovery from "../../pages/Auth/PasswordRecovery";

function Auth(props) {
	useEffect(() => {
		props.setIsLoading(true);
		setTimeout(() => props.setIsLoading(false), 1)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.location]);

	return (
		<>
			<Switch>
				<Route exact path="/auth" component={Login}/>
				<Route exact path="/auth/cadastrar" component={Register} />
{/*         
				<Route
					exact
					path="/auth/email/:verification_code"
					component={EmailVerify}
				/>
				<Route
					exact
					path="/auth/senha/nova-senha/:token"
					component={PasswordRecovery}
				/>
*/}
				<Route component={NotFound} />
			</Switch>
		</>
	);
}

const mapDispatchToProps = dispatch => bindActionCreators(UserActions, dispatch);

export default connect(null, mapDispatchToProps)(Auth);