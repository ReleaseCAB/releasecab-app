import { urlConstants } from "@constants/UrlConstants";
import { ApiAuth } from "./ApiAuth";

export const FetchCommunications = async (page) => {
  await ApiAuth();
  const response = await fetch(
    urlConstants.fetchCommunications + "/?page=" + page,
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

export const FetchCommunication = async (id) => {
  await ApiAuth();
  const response = await fetch(urlConstants.fetchCommunication + "/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};
