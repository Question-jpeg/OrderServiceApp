import { useContext } from "react";
import jwtDecode from "jwt-decode";

import AuthContext from "../auth/context";
import authStorage from "../auth/storage";

export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  logIn = async (authToken, refreshToken) => {
    await authStorage.setToken(authToken);
    await authStorage.setRefreshToken(refreshToken);
    const decodedUser = jwtDecode(authToken);
    setUser(decodedUser);
  };

  logOut = () => {
    setUser(null);
    authStorage.removeToken();
    authStorage.removeRefreshToken();
  };

  return { user, setUser, logIn, logOut };
};
