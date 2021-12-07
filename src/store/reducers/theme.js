const INITIAL_STATE = {
    dark: false,
};

export default function theme(state = INITIAL_STATE, action) {
    if (action.type === 'UPDATE_THEME') {
        return { dark: action.dark }
    }

    return state;
}