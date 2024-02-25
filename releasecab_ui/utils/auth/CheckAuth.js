import { useEffect, useState } from "react";
import { CheckUserLoggedIn } from "./AuthUtils";

export const CheckAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const isAuthenticated = await CheckUserLoggedIn();
      setIsLoggedIn(isAuthenticated);
    };

    checkAuthStatus();
  }, []);

  return isLoggedIn;
};
