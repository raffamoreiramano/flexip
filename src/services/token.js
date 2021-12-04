import api from "../services/api";
import { API_GUARD } from "../services/env";

const validateToken = async () => {
	const access_token = localStorage.getItem("access_token");

	if (access_token) {
		try {
			const response = await api.post(`/v1/${API_GUARD}/auth/me`, null, {
				headers: { Authorization: "Bearer " + access_token }
			});

			if (response.status === 200) {
				const { user } = response.data;
				const { company } = user;
				const { pabx } = company;

				return { user, pabx };
			}
		} catch (error) {
			localStorage.removeItem("access_token");

			throw new Error(error);
		}
	}
	
	throw new Error();
}

export default validateToken;