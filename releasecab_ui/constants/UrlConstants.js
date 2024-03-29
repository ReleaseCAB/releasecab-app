export const urlConstants = {
  //User
  login: "/api/token-create",
  tokenVerify: "api/token-verify",
  tokenBlacklist: "api/token-blacklist",
  tokenRefresh: "api/token-refresh",
  forgotPassword: "api/password_reset",
  userProfile: "api/users/me",
  userCreate: "api/users/create",
  userUpdate: "api/users/update",
  userValidate: "api/users/validate",
  fetchUsers: "api/users/users",
  fetchUser: "api/users",
  otherUserUpdate: "api/users/update",
  //Tenant
  tenantCreate: "api/tenants/create",
  getMyTenant: "api/tenants/",
  findTenantByInviteCode: "api/tenants/find-by-invite-code",
  findInvitedUserByTenant: "api/tenants/invited-users",
  getTenantConfig: "api/tenants/config",
  createInvitedUser: "api/tenants/invited-users/create",
  deleteInvitedUser: "api/tenants/invited-users/delete",
  //Role
  getRole: "api/users/roles",
  deleteRoles: "api/users/roles/delete",
  createRole: "api/users/roles/create",
  fetchRole: "api/users/roles",
  updateRole: "api/users/roles/update",
  userSearch: "api/users/search",
  //Team
  getTeam: "api/users/teams",
  createTeam: "api/users/teams/create",
  deleteTeam: "api/users/teams/delete",
  fetchTeam: "api/users/teams",
  updateTeam: "api/users/teams/update",
  addUsersToTeam: "api/users/teams/add-users",
  getUserManagedTeams: "api/users/teams/user-managed-teams",
  //Release
  getReleaseTypes: "api/releases/release-types",
  addNewReleaseEnv: "api/releases/release-environments/create",
  getReleaseEnvs: "api/releases/release-environments",
  createRelease: "api/releases/create",
  fetchRelease: "api/releases/release",
  deleteRelease: "api/releases/delete",
  searchRelease: "api/releases/search",
  fetchCalendarRelease: "api/releases/calendar-release",
  updateRelease: "api/releases/update",
  addNewReleaseType: "api/releases/release-types/create",
  deleteReleaseType: "api/releases/release-types/delete",
  getReleaseStages: "api/releases/release-stages",
  createReleaseStages: "api/releases/release-stages/create",
  getReleaseType: "api/releases/release-types",
  updateReleaseType: "api/releases/release-types/update",
  getReleaseEnv: "api/releases/release-environments",
  updateReleaseEnv: "api/releases/release-environments/update",
  deleteReleaseEnv: "api/releases/release-environments/delete",
  getReleaseStage: "api/releases/release-stages",
  deleteReleaseStage: "api/releases/release-stages/delete",
  updateReleaseStage: "api/releases/release-stages/update",
  getReleaseStageConnections: "api/releases/release-stage-connections",
  updateReleaseStageConnection: "api/releases/release-stage-connections/update",
  deleteReleaseStageConnection: "api/releases/release-stage-connections/delete",
  createReleaseStageConnection: "api/releases/release-stage-connections/create",
  getReleaseConfig: "api/releases/release-config/",
  getNextStageConnections:
    "api/releases/release-stage-connections/get-to-stages",
  fetchReleaseStatsForMe: "api/releases/release-stats/me",
  fetchReleaseComments: "api/releases/release-comments",
  createReleaseComments: "api/releases/release-comments/create",
  deleteReleaseComment: "api/releases/release-comments/delete",
  //Blackout
  createBlackout: "api/blackouts/create",
  fetchBlackout: "api/blackouts/blackout",
  updateBlackout: "api/blackouts/update",
  fetchBlackoutCalendar: "api/blackouts/calendar-blackouts",
  deleteBlackout: "api/blackouts/delete",
  //Communication
  fetchCommunications: "api/communications",
  fetchCommunication: "api/communications/communication",
};
