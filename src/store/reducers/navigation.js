const INITIAL_STATE = {
  path: "/admin/dashboard"
};

export default function navigation(state = INITIAL_STATE, action) {
  if (action.type === 'UPDATE_ACTIVE') {
    return { ...state, path: action.path }
  }

  return state;
}
