export const regexLogin = (userName: string) => {
  const regex = /[!@#$%^&*(),.?":{}|<>/]/;

  if (regex.test(userName)) {
    return false;
  } else {
    return true;
  }
};
