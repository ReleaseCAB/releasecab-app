import {
  BiAddToQueue,
  BiBarChartAlt,
  BiBuoy,
  BiCloud,
  BiGroup,
  BiHome,
  BiMessage,
  BiMessageX,
  BiNetworkChart,
  BiSend,
  BiTable,
  BiUser,
} from "react-icons/bi";

export const navConstants = {
  mainNav: [
    {
      label: "Get Started",
      icon: BiHome,
      url: "/onboarding",
    },
    {
      label: "Dashboard",
      icon: BiBarChartAlt,
      url: "/",
    },
    {
      label: "Inbox",
      icon: BiMessage,
      url: "/inbox/messages",
    },
  ],
  releasesNav: [
    {
      label: "Releases",
      icon: BiSend,
      url: "/release/releases",
    },
  ],
  releasesNavCreate: [
    {
      label: "Create Release",
      icon: BiAddToQueue,
      url: "/release/create-release",
    },
  ],
  blackoutNav: [
    {
      label: "Blackouts",
      icon: BiTable,
      url: "/blackout/blackouts",
    },
  ],
  blackoutNavCreate: [
    {
      label: "Create Blackout",
      icon: BiMessageX,
      url: "/blackout/create-blackout",
    },
  ],
  managerNav: [
    {
      label: "Manage Team",
      icon: BiGroup,
      url: "/manage/manage-team",
    },
  ],
  adminNav: [
    {
      label: "User Management",
      icon: BiUser,
      url: "/user/user-management",
    },
    {
      label: "Release Configuration",
      icon: BiCloud,
      url: "/release-configuration",
    },
    {
      label: "Workflow Designer",
      icon: BiNetworkChart,
      url: "/workflows",
    },
  ],
  bottomNav: [
    {
      label: "Help & Support",
      icon: BiBuoy,
      url: "/help-center",
    },
  ],
};
