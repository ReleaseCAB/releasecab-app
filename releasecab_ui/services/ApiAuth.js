import { CheckUserLoggedIn } from "@utils/auth/AuthUtils";

export const ApiAuth = async () => {
  const isAuthenticated = await CheckUserLoggedIn();
  if (!isAuthenticated) {
    // We use window.location instead of router because this gets called in a hook
    const loginUrl = `/login?next=${encodeURIComponent(
      window.location.pathname,
    )}`;
    window.location.replace(loginUrl);
  } else {
    return true;
  }
};
