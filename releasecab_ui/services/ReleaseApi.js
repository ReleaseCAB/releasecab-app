import { urlConstants } from "@constants/UrlConstants";
import { ApiAuth } from "./ApiAuth";

export const GetReleaseTypes = async (
  disablePagination,
  page,
  sortBy,
  orderBy,
) => {
  await ApiAuth();
  let url = urlConstants.getReleaseTypes;
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

export const GetReleaseStages = async (
  disablePagination,
  page,
  sortBy,
  orderBy,
) => {
  await ApiAuth();
  let url = urlConstants.getReleaseStages;
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

export const CreateReleaseStage = async (releaseStage) => {
  await ApiAuth();
  const response = await fetch(urlConstants.createReleaseStages, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify({ name: releaseStage }),
  });
  return response;
};

export const CreateReleaseStageConnection = async (releaseStageConnection) => {
  await ApiAuth();
  const response = await fetch(urlConstants.createReleaseStageConnection, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify(releaseStageConnection),
  });
  return response;
};

export const GetReleaseEnvs = async (
  disablePagination,
  page,
  sortBy,
  orderBy,
) => {
  await ApiAuth();
  let url = urlConstants.getReleaseEnvs;
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

export const CreateRelease = async (release) => {
  await ApiAuth();
  const response = await fetch(urlConstants.createRelease, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify(release),
  });
  return response;
};

export const UpdateRelease = async (release, id) => {
  await ApiAuth();
  const response = await fetch(urlConstants.updateRelease + "/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify(release),
  });
  return response;
};

export const FetchRelease = async (releaseIdentifier) => {
  await ApiAuth();
  const url = urlConstants.fetchRelease + "/" + releaseIdentifier;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const FetchReleaseForTenant = async (
  page,
  sortBy,
  orderBy,
  filterMyReleases,
  releaseType,
  environments,
) => {
  await ApiAuth();
  const url = urlConstants.fetchRelease;
  const response = await fetch(
    url +
      "/?page=" +
      page +
      "&sort_by=" +
      sortBy +
      "&order_by=" +
      orderBy +
      "&filter_by_me=" +
      filterMyReleases +
      "&filter_by_type=" +
      releaseType +
      "&filter_by_env=" +
      environments,
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

export const FetchReleaseForTenantCalendar = async () => {
  await ApiAuth();
  const url = urlConstants.fetchCalendarRelease;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const AddNewReleaseType = async (releaseType) => {
  await ApiAuth();
  const response = await fetch(urlConstants.addNewReleaseType, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify({
      name: releaseType,
    }),
  });
  return response;
};

export const AddNewReleaseEnv = async (releaseEnv) => {
  await ApiAuth();
  const response = await fetch(urlConstants.addNewReleaseEnv, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify({
      name: releaseEnv,
    }),
  });
  return response;
};

export const GetReleaseType = async (id) => {
  await ApiAuth();
  const response = await fetch(urlConstants.getReleaseType + "/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const UpdateReleaseType = async (releaseType, id) => {
  await ApiAuth();
  const response = await fetch(urlConstants.updateReleaseType + "/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify(releaseType),
  });
  return response;
};

export const GetReleaseEnv = async (id) => {
  await ApiAuth();
  const response = await fetch(urlConstants.getReleaseEnv + "/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const UpdateReleaseEnv = async (releaseEnv, id) => {
  await ApiAuth();
  const response = await fetch(urlConstants.updateReleaseEnv + "/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify(releaseEnv),
  });
  return response;
};

export const GetReleaseStage = async (id) => {
  await ApiAuth();
  const response = await fetch(urlConstants.getReleaseStage + "/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const UpdateReleaseStage = async (releaseStage, id) => {
  await ApiAuth();
  const response = await fetch(urlConstants.updateReleaseStage + "/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify(releaseStage),
  });
  return response;
};

export const FetchReleaseStageConnectionsForTenant = async () => {
  await ApiAuth();
  const url = urlConstants.getReleaseStageConnections;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const FetchReleaseConfigForTenant = async () => {
  await ApiAuth();
  const url = urlConstants.getReleaseConfig;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const UpdateReleaseStageConnection = async (
  releaseStageConnection,
  id,
) => {
  await ApiAuth();
  const response = await fetch(
    urlConstants.updateReleaseStageConnection + "/" + id,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.access_token}`,
      },
      body: JSON.stringify(releaseStageConnection),
    },
  );
  return response;
};

export const FetchNextStageConnections = async (fromStageId, releaseId) => {
  await ApiAuth();
  const response = await fetch(
    urlConstants.getNextStageConnections +
      "/" +
      fromStageId +
      "?release=" +
      releaseId,
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

export const FetchReleaseStatsForMe = async () => {
  await ApiAuth();
  const response = await fetch(urlConstants.fetchReleaseStatsForMe, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const GetReleaseComments = async (id, page) => {
  await ApiAuth();
  const response = await fetch(
    urlConstants.fetchReleaseComments + "/" + id + "/?page=" + page,
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

export const AddNewReleaseComment = async (releaseComment) => {
  await ApiAuth();
  const response = await fetch(urlConstants.createReleaseComments, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
    body: JSON.stringify(releaseComment),
  });
  return response;
};

export const DeleteRelease = async (releaseId) => {
  await ApiAuth();
  const response = await fetch(urlConstants.deleteRelease + "/" + releaseId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access_token}`,
    },
  });
  return response;
};

export const DeleteReleaseComment = async (releaseCommentId) => {
  await ApiAuth();
  const response = await fetch(
    urlConstants.deleteReleaseComment + "/" + releaseCommentId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.access_token}`,
      },
    },
  );
  return response;
};

export const DeleteReleaseStage = async (releaseStageId) => {
  await ApiAuth();
  const response = await fetch(
    urlConstants.deleteReleaseStage + "/" + releaseStageId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.access_token}`,
      },
    },
  );
  return response;
};

export const DeleteReleaseStageConnection = async (
  releaseStageConnectionId,
) => {
  await ApiAuth();
  const response = await fetch(
    urlConstants.deleteReleaseStageConnection + "/" + releaseStageConnectionId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.access_token}`,
      },
    },
  );
  return response;
};

export const DeleteReleaseType = async (releaseTypeId) => {
  await ApiAuth();
  const response = await fetch(
    urlConstants.deleteReleaseType + "/" + releaseTypeId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.access_token}`,
      },
    },
  );
  return response;
};

export const deleteReleaseEnv = async (releaseEnvId) => {
  await ApiAuth();
  const response = await fetch(
    urlConstants.deleteReleaseEnv + "/" + releaseEnvId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.access_token}`,
      },
    },
  );
  return response;
};

export const GetReleaseSearch = async (text) => {
  await ApiAuth();
  const response = await fetch(
    urlConstants.searchRelease + "/?search=" + text,
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
