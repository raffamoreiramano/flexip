import React from "react";
import { Route } from "react-router-dom";

import Login from "../../pages/Auth/Login";

export default function Signin() {
	return (
		<>
			<Route exact path="*" component={Login} />
		</>
	);
}
