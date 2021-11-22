const INITIAL_STATE = {
  name: "",
  email: "",
  pabxId: "",
  pabxName: ""
};

export default function user(state = INITIAL_STATE, action) {
  if (action.type === 'UPDATE_USER') {
    return { ...state, name: action.name, email: action.email }
  }

  if (action.type === 'UPDATE_PABX') {
    return { ...state, pabxId: action.pabxId, pabxName: action.pabxName }
  }

  return state;
}
