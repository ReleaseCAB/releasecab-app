import jwt_decode from "jwt-decode";
import { RefreshToken } from "@services/UserApi";

export const CheckUserLoggedIn = async () => {
  // If they don't have an access/refresh token, assume they are not logged in
  if (!localStorage.access_token || !localStorage.refresh_token) {
    return false;
  }
  try {
    const decodedToken = jwt_decode(localStorage.access_token);
    const expirationTime = decodedToken.exp;
    const currentTime = Date.now() / 1000;
    if (currentTime < expirationTime) {
      // Token is not expired, don't refresh it
      return true;
    }
  } catch (error) {
    return false;
  }
  try {
    // Token is expired or invalid, try to refresh it
    const refreshResponse = await RefreshToken();
    if (refreshResponse.ok) {
      // Token refreshed
      const responseData = await refreshResponse.json();
      localStorage.setItem("access_token", responseData.access);
      return true;
    } else {
      // Token refresh failed
      return false;
    }
  } catch (error) {
    return false;
  }
};
