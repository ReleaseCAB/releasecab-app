import { urlConstants } from "@constants/UrlConstants";
import { ApiAuth } from "./ApiAuth";

export const GetTeams = async (disablePagination, page, sortBy, orderBy) => {
  await ApiAuth();
  let url = urlConstants.getTeam;
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

export const AddUsersToTeam = async (teamsObj) => {
  await ApiAuth();
  const response = await fetch(urlConstants.addUsersToTeam, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify(teamsObj),
  });
  return response;
};

export const CreateTeam = async (team) => {
  await ApiAuth();
  const response = await fetch(urlConstants.createTeam, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify({
      name: team,
    }),
  });
  return response;
};

export const DeleteTeam = async (teamId) => {
  await ApiAuth();
  const response = await fetch(urlConstants.deleteTeam + "/" + teamId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const FetchTeam = async (teamId) => {
  await ApiAuth();
  const url = urlConstants.fetchTeam + "/" + teamId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const UpdateTeam = async (team, id) => {
  await ApiAuth();
  const response = await fetch(urlConstants.updateTeam + "/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify(team),
  });
  return response;
};

export const FetchUserManagedTeams = async () => {
  await ApiAuth();
  const url = urlConstants.getUserManagedTeams;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};
