const INITIAL_STATE = {
  id: "",
  name: ""
};

export default function pabx(state = INITIAL_STATE, action) {
  if (action.type === 'UPDATE_PABX') {
    return { id: action.id, name: action.name }
  }

  return state;
}
