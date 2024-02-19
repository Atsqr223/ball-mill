export const authCheck = (userRole) => {
  if (fetchAuthToken(userRole)) {
    return true;
  }
  return false;
};

export const fetchAuthToken = (userRole) => {
  switch (userRole) {
    case 'admin':
      return localStorage.getItem(process.env.REACT_APP_ADMIN_AUTH_KEY);
      break;
    case 'user':
      return localStorage.getItem(process.env.REACT_APP_USER_AUTH_KEY);
      break;
  }
};

