export const generateBasicAuthHeader = (userName: string, passWord: string) => {
  const credentials = `${userName}:${passWord}`;
  const encodedCredentials = btoa(credentials);
  const authHeader = `Basic ${encodedCredentials}`;

  return authHeader;
};
