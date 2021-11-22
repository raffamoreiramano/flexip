export function updateUser(name, email) {
  return {
    type: 'UPDATE_USER', // Sempre precisa dessa chave para o redux
    name,
    email
  };
}

export function updatePABX(id, name) {
  return {
    type: 'UPDATE_PABX', // Sempre precisa dessa chave para o redux
    pabxId: id,
    pabxName: name
  };
}

export function setIsLoading(loading) {
  if (loading) {
    return {
      type: 'LOADING',
    };
  } else {
    return {
      type: 'LOADED',
    };
  }
}