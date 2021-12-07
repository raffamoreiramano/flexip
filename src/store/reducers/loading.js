const INITIAL_STATE = false;

export default function isLoading(state = INITIAL_STATE, action) {
	switch (action.type) {
		case 'LOADING':
			return true;
		case 'LOADED':
			return false;
		default:
			return state;
	}
}