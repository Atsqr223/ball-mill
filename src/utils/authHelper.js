import { encrypt, decrypt } from "./encryption";

export const authCheck = (userRole) => {
  if (getAuthToken(userRole)) {
    return true;
  }
  return false;
};

export const createAuthSession = (jsonParam) => {
  const encryptData = encrypt(JSON.stringify(jsonParam));
  localStorage.setItem(process.env.REACT_APP_USER_AUTH_KEY, encryptData);
};

export const getAuthToken = () => {
  const encryptData = localStorage.getItem(process.env.REACT_APP_USER_AUTH_KEY);
  if (encryptData) {
    const decryptData = JSON.parse(decrypt(encryptData));
    return decryptData.token;
  } else {
    return;
  }
};

export const getAuthUser = () => {
  const encryptData = localStorage.getItem(process.env.REACT_APP_USER_AUTH_KEY);
  if (encryptData) {
    const decryptData = JSON.parse(decrypt(encryptData));
    return decryptData.userdata;
  } else {
    return;
  }
};
