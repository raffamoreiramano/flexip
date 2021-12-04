export function updateUser(name, email) {
  return {
    type: 'UPDATE_USER',
    name,
    email
  };
}

export function updatePABX(id, name) {
  return {
    type: 'UPDATE_PABX',
    id,
    name
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

export function setLocation({ path, title, subtitle = "" }) {
  return {
    type: 'UPDATE_LOCATION',
    path,
    title,
    subtitle,
  };
}