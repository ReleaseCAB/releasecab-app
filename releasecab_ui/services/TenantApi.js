import { urlConstants } from "@constants/UrlConstants";
import { ApiAuth } from "./ApiAuth";

export const FindTenantByInviteCode = async (tenantCode) => {
  const response = await fetch(urlConstants.findTenantByInviteCode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tenant_code: tenantCode,
    }),
  });
  return response;
};

export const CreateTenant = async (tenantName, numberOfEmployees) => {
  const response = await fetch(urlConstants.tenantCreate, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify({
      name: tenantName,
      number_of_employees: numberOfEmployees,
    }),
  });
  return response;
};

export const GetMyTenant = async () => {
  await ApiAuth();
  const response = await fetch(urlConstants.getMyTenant, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const GetInvitedUser = async (
  disablePagination,
  page,
  sortBy,
  orderBy,
) => {
  await ApiAuth();
  let url = urlConstants.findInvitedUserByTenant;
  if (disablePagination) {
    url = url + "/?disable_pagination=true";
  } else {
    url = url + "?page=" + page + "&sort_by=" + sortBy + "&order_by=" + orderBy;
  }
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const CreateInvitedUser = async (invitedUser) => {
  await ApiAuth();
  const response = await fetch(urlConstants.createInvitedUser, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify({
      email: invitedUser,
    }),
  });
  return response;
};

export const GetTenantConfig = async () => {
  const response = await fetch(urlConstants.getTenantConfig, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const DeleteInvitedUser = async (userId) => {
  await ApiAuth();
  const response = await fetch(urlConstants.deleteInvitedUser + "/" + userId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};
