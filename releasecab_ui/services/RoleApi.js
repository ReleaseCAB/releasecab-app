import { urlConstants } from "@constants/UrlConstants";
import { ApiAuth } from "./ApiAuth";

export const GetRoles = async (disablePagination, page, sortBy, orderBy) => {
  await ApiAuth();
  let url = urlConstants.getRole;
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

export const DeleteRole = async (roleId) => {
  await ApiAuth();
  const response = await fetch(urlConstants.deleteRoles + "/" + roleId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const CreateRole = async (role) => {
  await ApiAuth();
  const response = await fetch(urlConstants.createRole, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify({
      name: role,
    }),
  });
  return response;
};

export const GetRole = async (id) => {
  await ApiAuth();
  const response = await fetch(urlConstants.fetchRole + "/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const UpdateRole = async (role, id) => {
  await ApiAuth();
  const response = await fetch(urlConstants.updateRole + "/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify(role),
  });
  return response;
};
