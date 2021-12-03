const INITIAL_STATE = {
  name: "",
  email: "",
};

export default function user(state = INITIAL_STATE, action) {
  if (action.type === 'UPDATE_USER') {
    return { name: action.name, email: action.email }
  }

  return state;
}
