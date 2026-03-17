export const COPERA_CONFIG = {
  boardId: "69b9a51cc716a6e2b665522d",

  ticketsTable: {
    ticketsTableId: "69b9a51cc716a6e2b6655231",
    titleColumnId: "69b9a51cc716a6e2b6655234", // Title Column
    detailsColumnId: "69b9a540c716a6e2b6655478", // Text Column
    userColumnId: "69b9a570893316af34ea080d", // Link Column
    statusColumnId: "69b9a59c893316af34ea0a55", // Select Column
    requestTypeColumnId: "69b9a5ca893316af34ea0c29", // Select Column
    requestTypeOptions: [
      {
        label: "General Support",
        optionId: "69b9a5ca893316af34ea0c2b",
      },
      {
        label: "Bug Report",
        optionId: "69b9a5ca893316af34ea0c2c",
      },
      {
        label: "Feature Request",
        optionId: "69b9a5ca893316af34ea0c2d",
      },
      {
        label: "Account & Access",
        optionId: "69b9a5ca893316af34ea0c2e",
      },
      {
        label: "Billing",
        optionId: "69b9a5ca893316af34ea0c2f",
      },
      {
        label: "Onboarding",
        optionId: "69b9a5ca893316af34ea0c30",
      },
    ],
  },
  usersTable: {
    usersTableId: "69b9a54d893316af34ea065e",
    nameColumnId: "69b9a54d893316af34ea0661", // Name Column
    identifierColumnId: "69b9a5fe893316af34ea0e8a", // Email Column
    passwordColumnId: "69b9a605c716a6e2b6655e78", // Password Column
    roleColumnId: "69b9a61c893316af34ea109a", // Role Column
    roleOptions: {
      admin: "69b9a61c893316af34ea109c", // Admin Role
      user: "69b9a61c893316af34ea109d", // User Role
    },
  },
};
