import { GetUserProfile } from "@services/UserApi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { store } from "../../redux/store";
import { CheckUserLoggedIn } from "./AuthUtils";

export const WithAuthGuard = (WrappedComponent) => {
  const AuthGuard = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const user = store.getState().user;
    const dispatch = useDispatch();

    const setUser = (profile) => {
      dispatch({ type: "SET_USER", payload: profile });
    };

    useEffect(() => {
      const checkAuthStatus = async () => {
        const isAuthenticated = await CheckUserLoggedIn();

        if (!isAuthenticated) {
          setIsLoggedIn(false);
          const loginUrl = `/login?next=${encodeURIComponent(router.pathname)}`;
          router.replace(loginUrl);
        } else {
          setIsLoggedIn(true);
          // If logged in, see if redux has the user info, and if not fetch it and store it
          if (!user) {
            const userProfileResponse = await GetUserProfile();
            if (userProfileResponse.ok) {
              const userProfile = await userProfileResponse.json();
              setUser(userProfile);
            }
          }
        }
      };
      checkAuthStatus();
    }, []);

    return isLoggedIn ? <WrappedComponent {...props} /> : null;
  };
  return AuthGuard;
};

export const WithoutAuthGuard = (WrappedComponent) => {
  const AuthGuard = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkAuthStatus = async () => {
        const isAuthenticated = await CheckUserLoggedIn();

        if (!isAuthenticated) {
          setIsLoggedIn(false);
          return true;
        } else {
          setIsLoggedIn(true);
          const redirectUrl = "/";
          router.replace(redirectUrl);
        }
      };
      checkAuthStatus();
    }, []);

    return isLoggedIn ? null : <WrappedComponent {...props} />;
  };
  return AuthGuard;
};
