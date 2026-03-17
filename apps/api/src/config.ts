export const COPERA_CONFIG = {
  boardId: "6978de1a2d60e272dda083a1",

  ticketsTable: {
    ticketsTableId: "6978de1b2d60e272dda083a5",
    titleColumnId: "6978de1b2d60e272dda083a8", // Title Column
    detailsColumnId: "6978e12d2d60e272dda087f3", // Text Column
    userColumnId: "697904709bf113cc7f71838f", // Link Column
    statusColumnId: "6979060a9bf113cc7f71873f", // Select Column
    requestTypeColumnId: "699e570fddbbc6d6f0e7515a", // Select Column
    requestTypeOptions: [
      {
        label: "General Support",
        optionId: "699e570fddbbc6d6f0e7515c",
      },
      {
        label: "Bug Report",
        optionId: "699e570fddbbc6d6f0e7515d",
      },
      {
        label: "Feature Request",
        optionId: "699e570fddbbc6d6f0e7515e",
      },
      {
        label: "Account & Access",
        optionId: "699e570fddbbc6d6f0e7515f",
      },
      {
        label: "Billing",
        optionId: "699e570fddbbc6d6f0e75160",
      },
      {
        label: "Onboarding",
        optionId: "699e570fddbbc6d6f0e75161",
      },
    ],
  },
  usersTable: {
    usersTableId: "6978de2a2d60e272dda0841a",
    nameColumnId: "6978de2a2d60e272dda0841d",
    identifierColumnId: "6978df202d60e272dda085c9",
    passwordColumnId: "6978df272d60e272dda085d1",
    roleColumnId: "699e6d7bbd5acef2202344bf",
    roleOptions: {
      admin: "699e6d7cbd5acef2202344c1",
      user: "699e6d7cbd5acef2202344c2",
    },
  },
};
