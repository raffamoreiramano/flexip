const INITIAL_STATE = {
  path: "/admin/dashboard",
  title: "Dashboard",
  subtitle: "",

};

export default function navigation(state = INITIAL_STATE, action) {
  if (action.type === 'UPDATE_LOCATION') {
    return { path: action.path, title: action.title, subtitle: action.subtitle }
  }

  return state;
}
