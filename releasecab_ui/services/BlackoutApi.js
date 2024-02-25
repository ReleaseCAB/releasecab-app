import { urlConstants } from "@constants/UrlConstants";
import { ApiAuth } from "./ApiAuth";

export const FetchBlackout = async (id) => {
  await ApiAuth();
  const response = await fetch(urlConstants.fetchBlackout + "/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const AddBlackout = async (blackout) => {
  await ApiAuth();
  const response = await fetch(urlConstants.createBlackout, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify(blackout),
  });
  return response;
};

export const UpdateBlackout = async (blackout, id) => {
  await ApiAuth();
  const response = await fetch(urlConstants.updateBlackout + "/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify(blackout),
  });
  return response;
};

export const FetchBlackoutForTenant = async (page, sortBy, orderBy) => {
  await ApiAuth();
  const url = urlConstants.fetchBlackout;
  const response = await fetch(
    url + "/?page=" + page + "&sort_by=" + sortBy + "&order_by=" + orderBy,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.access_token}`,
      },
    },
  );
  return response;
};

export const FetchBlackoutForTenantCalendar = async () => {
  await ApiAuth();
  const url = urlConstants.fetchBlackoutCalendar;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const DeleteBlackout = async (blackoutId) => {
  await ApiAuth();
  const response = await fetch(urlConstants.deleteBlackout + "/" + blackoutId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};
