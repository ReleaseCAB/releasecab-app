import { urlConstants } from "@constants/UrlConstants";
import { ApiAuth } from "./ApiAuth";

// No Auth Required
export const LoginUser = async (email, password) => {
  const response = await fetch(urlConstants.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return response;
};

// No Auth Needed
export const VerifyToken = async () => {
  const response = await fetch(urlConstants.tokenVerify, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: localStorage.access_token }),
  });
  return response;
};

// No Auth Needed
export const PasswordResetRequest = async (email) => {
  const response = await fetch(urlConstants.forgotPassword, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  });
  return response;
};

// No Auth Needed
export const PasswordResetRequestConfirm = async (token, password) => {
  const response = await fetch(urlConstants.forgotPassword + "/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token, password: password }),
  });
  return response;
};

// No Auth Needed
export const ValidateUser = async (email, password) => {
  const response = await fetch(urlConstants.userValidate, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  });
  return response;
};

// No Auth Needed
export const RefreshToken = async () => {
  const response = await fetch(urlConstants.tokenRefresh, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: localStorage.refresh_token }),
  });
  return response;
};

// No Auth Needed, no real reason to auth here
export const BlacklistToken = async () => {
  const response = await fetch(urlConstants.tokenBlacklist, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: localStorage.refresh_token }),
  });
  return response;
};

// Auth Required
export const GetUserProfile = async () => {
  await ApiAuth();
  const response = await fetch(urlConstants.userProfile, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

// Auth Required
export const UpdateUserProfileTenant = async (tenantId) => {
  await ApiAuth();
  const response = await fetch(urlConstants.userUpdate, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify({ tenant: tenantId }),
  });
  return response;
};

// Auth Required
export const UpdateUserProfileOnboardingStep = async (step) => {
  await ApiAuth();
  const response = await fetch(urlConstants.userUpdate, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify({ last_onboarding_step: step }),
  });
  return response;
};

// Auth Required
export const UpdateUserProfileOnboardingComplete = async (isComplete) => {
  await ApiAuth();
  const response = await fetch(urlConstants.userUpdate, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify({ is_onboarding_complete: isComplete }),
  });
  return response;
};

// Auth Required
export const UpdateUserProfile = async (firstName, lastName) => {
  await ApiAuth();
  const response = await fetch(urlConstants.userUpdate, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
    }),
  });
  return response;
};

// No Auth Needed, new user creation
export const CreateUser = async (
  email,
  password,
  firstName,
  lastName,
  isOwner,
  onboardingNotNeeded,
  tenantId
) => {
  const bodyWithTenant = {
    email: email,
    password: password,
    first_name: firstName,
    last_name: lastName,
    is_tenant_owner: isOwner,
    is_onboarding_complete: onboardingNotNeeded,
    tenant: tenantId,
  };
  const bodyWithoutTenant = {
    email: email,
    password: password,
    first_name: firstName,
    last_name: lastName,
    is_tenant_owner: isOwner,
    is_onboarding_complete: onboardingNotNeeded,
  };
  let response;
  if (tenantId === null) {
    response = await fetch(urlConstants.userCreate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyWithoutTenant),
    });
  } else {
    response = await fetch(urlConstants.userCreate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyWithTenant),
    });
  }
  return response;
};

export const GetUsers = async (page, sortBy, orderBy) => {
  await ApiAuth();
  const response = await fetch(
    urlConstants.fetchUsers +
      "/?page=" +
      page +
      "&sort_by=" +
      sortBy +
      "&order_by=" +
      orderBy,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.access_token}`,
      },
    }
  );
  return response;
};

export const GetUser = async (id) => {
  await ApiAuth();
  const response = await fetch(urlConstants.fetchUser + "/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const UpdateOtherUser = async (user, id) => {
  await ApiAuth();
  const response = await fetch(urlConstants.otherUserUpdate + "/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify(user),
  });
  return response;
};

export const GetUserSearch = async (text) => {
  await ApiAuth();
  const response = await fetch(urlConstants.userSearch + "/?search=" + text, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};
